const db = require('../models');

const user = db.user;

async function createUser(newUser) {
  return user.create(newUser);
}

async function findUserById(id) {
  return user.findOne({ id }).exec();
}

module.exports = {
  createUser,
  findUserById,
};
