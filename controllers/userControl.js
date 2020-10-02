// model imports
const HttpError = require("../models/http_error");

const DUMMY_USER_LIST = [
  {
    userId: "jStein",
    userStacks: [1, 3],
    firstName: "John",
    lastName: "Steinbeck",
  },
  {
    userId: "ernHem",
    userStacks: [2],
    firstName: "Ernest",
    lastName: "Hemingway",
  },
];

function getUserById(req, res, next) {
  const userId = req.params.user;
  console.log("GET request in Card management for user:", userId);
  const returnUserData = DUMMY_USER_LIST.find((u) => {
    return u.userId === userId;
  });
  if (!returnUserData) {
    // res.status(404).json({ message: "user not found" });
    // const error = new Error("no data found on User API");
    // error.code = 404;
    throw new HttpError("no data found on User API", 404);
  } else {
    res.json(returnUserData);
  }
}

exports.getUserById = getUserById;
