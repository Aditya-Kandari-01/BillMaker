const express = require("express");

const customerRouter = express.Router();

const {
  newCustomerDataController,
  checkCustomerController,
  getAllCustomersController,
  searchCustomerController,bulkCustomerUploadController
} = require("../controllers/customerController");

/**
 * @route POST /
 * @description Create new customer
 */
customerRouter.post("/", newCustomerDataController);

/**
 * @route GET /check
 * @description Check if customer exists by (customerName + customerGstNumber)
 * @query customerName, customerGstNumber
 */
customerRouter.get("/check", checkCustomerController);

/**
 * @route GET /
 * @description Get all customers (for dropdown / datalist)
 */
customerRouter.get("/", getAllCustomersController);

/**
 * @route GET /search
 * @description Search customers (name/company/code)
 */
customerRouter.get("/search", searchCustomerController);

/**
 * @route POST /bulk
 * @description To upload multiple customers at once
 */
customerRouter.post("/bulk", bulkCustomerUploadController);


module.exports = customerRouter;