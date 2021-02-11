const User = require("../models/userModel");

async function findUser(userEmail) {
  let doesUserExist;
  try {
    doesUserExist = await User.findOne({ userEmail: userEmail });
  } catch (err) {
    const error = new HttpError("Problems on user sign up", 500);
    return next(error);
  }
  // does it already exist?
  if (doesUserExist === false || doesUserExist === undefined) {
    // const error = new HttpError("This user exists already", 422);
    // return next(error);
    return false;
  } else {
    return true;
  }
}

module.exports = findUser;
