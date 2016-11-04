const db = require('../models');

async function createUser() {
  db.user.create({
    name: 'xiaoming',
  });
}

module.exports = {
  createUser,
};
