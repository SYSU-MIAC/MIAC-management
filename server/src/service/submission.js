const db = require('../models');
const fileService = require('./file');

const submission = db.submission;
const user = db.user;

async function getOne(_id) {
  return submission
    .find({ _id, deleted: false })
    .populate('hwId author comments feedbacks')
    .exec();
}

async function createOne(newSub, file) {
  Object.assign(newSub, { createdTime: new Date() });
  const { _doc } = await submission.create(newSub);
  await user.update(
    { _id: newSub.author, 'homeworks.hwId': newSub.hwId, permission: 1 },
    { $set: { 'homeworks.$.subId': _doc._id } },
    { runValidators: true }
  ).exec();
  return _doc;
}

async function deleteOne(_id) {
  const theSub = await submission.findOneAndUpdate(
    { _id, deleted: false },
    { $set: { deleted: true } },
    { runValidators: true }
  ).exec();
  return user.update(
    { 'homeworks.subId': theSub._id, permission: 1 },
    { $unset: { 'homeworks.$.subId': 1 } },
    { runValidators: true }
  ).exec();
}

async function updateOne(_id, newSub) {
  Object.assign(newSub, { updatedTime: null });
  return submission.update(
    { _id, deleted: false },
    { $set: newSub },
    { runValidators: true }
  ).exec();
}

module.exports = {
  getOne,
  createOne,
  deleteOne,
  updateOne,
};
