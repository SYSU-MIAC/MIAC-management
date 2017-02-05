const db = require('../models');

const user = db.user;

async function createOneUser(newUser) {
  return user.create(newUser);
}

async function getOneUser(id) {
  return user.findOne({ id, deleted: false }).exec();
}

async function updateOneUser(id, newUser) {
  return user.update(
    { id, deleted: false },
    { $set: newUser },
    { runValidators: true }
  ).exec();
}

module.exports = {
  createOneUser,
  getOneUser,
  updateOneUser,
};
