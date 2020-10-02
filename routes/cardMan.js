// Library import
const express = require("express");
const router = express.Router();

const DUMMY_VALUE = [
  {
    id: 1,
    stackName: "test stack",
    createdBy: "Steinbeck",
    cards: { front: "front of the card", back: "back of the same card" },
  },
  {
    id: 2,
    stackName: "2nd stack",
    createdBy: "Hemingway",
    cards: { front: "for whom the bells toll", back: "they toll for you" },
  },
  {
    id: 1,
    stackName: "Another test",
    createdBy: "Steinbeck",
    cards: { front: "wines", back: "of wrath" },
  },
];

router.get("/user/:user", (req, res, next) => {
  const userId = req.params.user;
  console.log("GET request in Card management for stack:", stackId);
  const returnUserData = DUMMY_VALUE.find((u) => {
    return u.createdBy === userId;
  });
  console.log(returnUserData);
  //! later integrate error messages
  res.json({ returnData });
});

router.get("/:No", (req, res, next) => {
  const stackId = req.params.No;
  console.log("GET request in Card management for stack:", stackId);
  const returnStack = DUMMY_VALUE[stackId];
  console.log(returnStack);
  //! later integrate error messages
  res.json({ returnStack });
});

module.exports = router;
