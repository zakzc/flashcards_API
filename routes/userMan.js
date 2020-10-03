// Library import
const express = require("express");
const router = express.Router();
// model imports
// const HttpError = require("../models/http_error");
// controller imports
const userControl = require("../controllers/userControl");

router.get("/:user", userControl.getUserById);

// router.post("/add", userControl.addUser);

router.post("/signUp", userControl.signUp);

router.post("/logIn", userControl.logIn);

module.exports = router;
