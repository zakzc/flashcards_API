// Library import
const express = require("express");
const router = express.Router();

const DUMMY_USER_LIST = [
  {
    userId: 123,
    userStacks: [1, 3],
    firstName: "John",
    lastName: "Steinbeck",
  },
  {
    userId: 482,
    userStacks: [2],
    firstName: "Ernest",
    lastName: "Hemingway",
  },
];

router.get("/userData/:user", (req, res, next) => {
  const userId = req.params.userData;
  console.log("GET request in Card management for user:", userId);
  const returnUserData = DUMMY_USER_LIST.find((u) => {
    return u.createdBy === userId;
  });
  console.log(returnUserData);
  //! later integrate error messages
  res.json(returnUserData);
});

module.exports = router;
