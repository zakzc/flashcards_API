// model imports
const HttpError = require("../models/http_error");

const debugUserAPI = true;

const DUMMY_USER_LIST = [
  {
    userId: "jStein",
    userStacks: ["s001", "s003"],
    firstName: "John",
    lastName: "Steinbeck",
  },
  {
    userId: "ernHem",
    userStacks: ["s002"],
    firstName: "Ernest",
    lastName: "Hemingway",
  },
];

function getUserById(req, res, next) {
  const userId = req.params.user;
  if (debugUserAPI) {
    console.log("GET request in User api for user:", userId);
  }
  const returnUserData = DUMMY_USER_LIST.find((u) => {
    return u.userId === userId;
  });
  if (!returnUserData) {
    throw new HttpError("no data found on User API", 404);
  } else {
    res.json(returnUserData);
  }
}

exports.getUserById = getUserById;
