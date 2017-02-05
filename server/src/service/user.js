const db = require('../models');

const user = db.user;

async function createUser(newUser) {
  return user.create(newUser);
}

async function findUserById(id) {
  return user.findOne({ id, deleted: false }).exec();
}

async function updateUser(id, newUser) {
  return user.update(
    { id, deleted: false },
    { $set: newUser },
    { runValidators: true }
  ).exec();
}

module.exports = {
  createUser,
  findUserById,
  updateUser,
};
