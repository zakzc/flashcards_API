// Library import
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
// model imports
// const HttpError = require("../models/http_error");
// controller imports
const cardControl = require("../controllers/cardControl");
const checkAuth = require("../middleware/check_auth");

router.use(checkAuth);

router.get("/:No", cardControl.getStackByID);

// Not implemented
// router.get("/getStacksByUser/:uid", cardControl.getStacksByUser);

router.post(
  "/addNewStack",
  [
    check("stackName").not().isEmpty(),
    check("createdBy").not().isEmpty(),
    check("cards").not().isEmpty(),
  ],
  cardControl.addNewStack
);

router.patch(
  "/:No",
  [
    check("stackName").not().isEmpty(),
    check("createdBy").not().isEmpty(),
    check("cards").not().isEmpty(),
  ],
  cardControl.updateStack
);

router.delete("/:No", cardControl.deleteStack);

module.exports = router;
