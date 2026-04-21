const customerModel = require("../models/customer");

/**
 * @description upload customer data
 */
const newCustomerDataController = async (req, res) => {
  try {
    const data = req.body;

    // Check if BOTH name + GST exist together
    const existingCustomer = await customerModel.findOne({
      customerCompanyName: data.customerCompanyName,
      customerGstNumber: data.customerGstNumber,
    });

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        exists: true,
        message: "Both company name and GST number already exists",
        data: existingCustomer,
      });
    }

    const newCustomer = new customerModel(data);
    const savedCustomer = await newCustomer.save();

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: savedCustomer,
    });
  } catch (error) {
    // ✅ FIX: Tell the frontend exactly which field is duplicated
    if (error.code === 11000) {
      const duplicatedField = Object.keys(error.keyValue || {})[0];
      const duplicatedValue = error.keyValue?.[duplicatedField];

      return res.status(409).json({
        success: false,
        message: `"${duplicatedField}" with value "${duplicatedValue}" already exists. Each customer must have a unique GST number and company name.`,
        field: duplicatedField,
        error: error.keyValue,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error saving customer",
      error: error.message,
    });
  }
};

/**
 * @description bulk upload customers from excel
 */
const bulkCustomerUploadController = async (req, res) => {
  try {
    const customers = req.body;

    if (!Array.isArray(customers) || customers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data provided",
      });
    }

    const validCustomers = [];
    const rejected = [];

    for (let i = 0; i < customers.length; i++) {
      const data = customers[i];

      const companyName = String(data.customerCompanyName || "").trim();
      const gstNumber = String(data.customerGstNumber || "").trim();

      if (!companyName || !gstNumber) {
        rejected.push({
          row: i + 1,
          reason: "companyName and gstNumber are required",
        });
        continue;
      }

      validCustomers.push({
        ...data,
        customerCompanyName: companyName,
        customerGstNumber: gstNumber,
      });
    }

    let insertedCount = 0;
    const duplicates = [];

    if (validCustomers.length > 0) {
      try {
        // ✅ FIX: ordered:false lets MongoDB skip duplicates and continue.
        // But it throws a BulkWriteError — we must catch it here, not in the
        // outer catch, so we can still extract the partial success count.
        const result = await customerModel.insertMany(validCustomers, {
          ordered: false,
        });
        insertedCount = result.length;
      } catch (bulkError) {
        // BulkWriteError — some docs inserted, some were duplicate key errors
        if (bulkError.name === "MongoBulkWriteError" || bulkError.code === 11000) {
          // insertedCount from the driver's result inside the error
          insertedCount = bulkError.result?.insertedCount ?? 0;

          // Collect which GST / company names were duplicates
          const writeErrors = bulkError.writeErrors || bulkError.result?.getWriteErrors?.() || [];
          writeErrors.forEach((we) => {
            const doc = validCustomers[we.index];
            duplicates.push({
              row: we.index + 1,
              customerCompanyName: doc?.customerCompanyName,
              customerGstNumber: doc?.customerGstNumber,
              reason: "Duplicate key — already exists in database",
            });
          });
        } else {
          // Something else went wrong — re-throw so outer catch handles it
          throw bulkError;
        }
      }
    }

    return res.status(200).json({
      success: true,
      insertedCount,
      rejectedCount: rejected.length + duplicates.length,
      rejected,       // skipped before DB (missing fields)
      duplicates,     // skipped by DB (already exists)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Bulk upload failed",
      error: error.message,
    });
  }
};

/**
 * @description Check if customer exists before saving
 */
const checkCustomerController = async (req, res) => {
  try {
    const { customerCompanyName, customerGstNumber } = req.query;

    if (!customerCompanyName || !customerGstNumber) {
      return res.status(400).json({
        success: false,
        message: "Provide both customerCompanyName and customerGstNumber",
      });
    }

    const customer = await customerModel.findOne({
      customerCompanyName,
      customerGstNumber,
    });

    return res.status(200).json({
      success: true,
      exists: !!customer,
      data: customer || null,
      message: customer ? "Customer already exists" : "Customer not found",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking customer",
      error: error.message,
    });
  }
};

/**
 * @description Get all customers (for dropdown / datalist)
 */
const getAllCustomersController = async (req, res) => {
  try {
    const customers = await customerModel
      .find()
      .select(
        "customerName customerCompanyName customerGstNumber customerPhone customerCode customerAddress customerCity customerState customerPincode customerPanNumber"
      )
      .limit(50);

    return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching customers",
      error: error.message,
    });
  }
};

/**
 * @description Search customers by name or code (for consignment sender field)
 */
const searchCustomerController = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const search = escapeRegex(q.trim());

    const customers = await customerModel
      .find({
        $or: [
          { customerCode: { $regex: `^${search}`, $options: "i" } },
          { customerName: { $regex: search, $options: "i" } },
        ],
      })
      .select(
        "customerName customerCompanyName customerGstNumber customerPhone customerCode customerAddress customerCity customerState customerPincode customerPanNumber"
      )
      .sort({ customerName: 1 })
      .limit(10);

    const formatted = customers.map((c) => ({
      _id: c._id,
      label: `${c.customerName} (${c.customerCode})`,
      customerName: c.customerName,
      customerCode: c.customerCode,
      customerCompanyName: c.customerCompanyName,
      customerPhone: c.customerPhone,
      customerAddress: c.customerAddress,
      customerCity: c.customerCity,
      customerState: c.customerState,
      customerPincode: c.customerPincode,
      customerGstNumber: c.customerGstNumber,
      customerPanNumber: c.customerPanNumber,
    }));

    return res.json({ success: true, data: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  newCustomerDataController,
  checkCustomerController,
  getAllCustomersController,
  searchCustomerController,
  bulkCustomerUploadController,
};
