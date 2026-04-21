const customerModel = require("../models/customer")
/**
 * @description upload customer data
 */
const newCustomerDataController = async (req, res) => {
  try {
    const data = req.body;

    // 🔹 Check if BOTH name + GST exist together
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

    // 🔹 Save if no conflict
    const newCustomer = new customerModel(data);
    const savedCustomer = await newCustomer.save();

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: savedCustomer,
    });
  } catch (error) {
    // Handle DB unique errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate field detected",
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
 * @description customer data while filling consignment
 */
const checkCustomerController = async (req, res) => {
  try {
    const { customerCompanyName, customerGstNumber } = req.query;

    // 🔹 Require both fields
    if (!customerCompanyName || !customerGstNumber) {
      return res.status(400).json({
        success: false,
        message: "Provide both customerCompanyName and customerGstNumber",
      });
    }

    // 🔹 Check BOTH together
    const customer = await customerModel.findOne({
      customerCompanyName,
      customerGstNumber,
    });

    return res.status(200).json({
      success: true,
      exists: !!customer,
      data: customer || null,
      message: customer
        ? "Customer already exists"
        : "Customer not found",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking customer",
      error: error.message,
    });
  }
};

const getAllCustomersController = async (req, res) => {
  try {
    const customers = await customerModel
      .find()
      .select("customerName customerCompanyName customerGstNumber customerPhone customerCode")
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


module.exports = {
  newCustomerDataController,
  checkCustomerController,
  getAllCustomersController,
};