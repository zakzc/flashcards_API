// Library import
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
// model imports
// const HttpError = require("../models/http_error");
// controller imports
const cardControl = require("../controllers/cardControl");

router.get("/:No", cardControl.getStackByID);

router.post(
  "/add",
  [
    check("stackName").not().isEmpty(),
    check("createdBy").not().isEmpty(),
    check("cards").isLength({ min: 2 }),
  ],
  cardControl.addStack
);

router.patch("/:No", cardControl.updateStack);

router.delete("/:No", cardControl.deleteStack);

module.exports = router;
