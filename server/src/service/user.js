const db = require('../models');

const user = db.user;

async function createOne(newUser) {
  const { _doc } = await user.create(newUser);
  return _doc;
}

async function getOne(_id) {
  return user
    .findOne({ _id, deleted: false })
    .populate('homeworks.hwId homeworks.subId')
    .exec();
}

async function getOneByUsername(username) {
  return user.findOne({ username, deleted: false }).exec();
}

async function getOneByIdAndHwId(_id, hwId) {
  return user.findOne({
    _id,
    'homeworks.hwId': hwId,
    'homeworks.subId': { $exists: true },
    deleted: false,
  }).exec();
}

async function updateOne(_id, newUser) {
  return user.update(
    { _id, deleted: false },
    { $set: newUser },
    { runValidators: true }
  ).exec();
}

module.exports = {
  createOne,
  getOne,
  getOneByUsername,
  getOneByIdAndHwId,
  updateOne,
};
