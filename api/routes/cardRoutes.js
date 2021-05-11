// Library import
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const cardControl = require("../controllers/cardControl");
const checkAuth = require("../middleware/check_auth");

// I left this path as open in the API. Anyone can get a stack by its ID.
router.get("/:No", cardControl.getStackByID);

// This function is for test and refactor only. De-habilitated on production.
// router.get("/getAllStacks", cardControl.getAllStacks);

// Flow only goes ahead if the token is identified as correct.
router.use(checkAuth);

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
