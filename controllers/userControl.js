// package import
const { v4: uuidv4 } = require("uuid");
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

function addUser(req, res, next) {
  console.log(req.body);
  const { userStacks, firstName, lastName } = req.body;
  const newUserCreated = {
    id: uuidv4(),
    userStacks,
    firstName,
    lastName,
  };
  DUMMY_USER_LIST.push(newUserCreated);
  console.log("Received post, added", newUserCreated);
  res.status(201).json({ added: newUserCreated });
}
//TODO don't forget to add, later, the function that adds the
//TODO unique id to the list of stacks owned by users in the users json

exports.getUserById = getUserById;
exports.addUser = addUser;
