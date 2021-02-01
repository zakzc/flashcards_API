// Library import
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
// controller imports
const userControl = require("../controllers/userControl");
const checkAuth = require("../middleware/check_auth");

// router.get("/", userControl.getUsers);
// router.use(checkAuth);

router.get("/:No", userControl.getUserDataByID);

router.post(
  "/signUp",
  [
    check("userEmail").not().isEmpty(),
    check("password").not().isEmpty(),
    check("firstName").isLength({ min: 2 }),
    check("lastName").isLength({ min: 2 }),
  ],
  userControl.signUp
);

router.post(
  "/logIn",
  [check("userEmail").not().isEmpty(), check("password").not().isEmpty()],
  userControl.logIn
);

module.exports = router;
