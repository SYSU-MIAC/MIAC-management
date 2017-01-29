const db = require('../models');

const user = db.user;


async function createUser() {
  return user.create({
    name: 'xiaoming',
  });
}

async function findUserById(id) {
  return user.findOne({ id });
}

module.exports = {
  createUser,
  findUserById,
};
