// Library import
const express = require("express");
const router = express.Router();
// model imports
const HttpError = require("../models/http_error");
// controller imports
const userControl = require("../controllers/userControl");

router.get("/:user", userControl.getUserById);

module.exports = router;
