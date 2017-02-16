const db = require('../models');
const subService = require('./submission');
const commentService = require('./comment');
const fileService = require('./file');

const homework = db.homework;
const user = db.user;

async function getOne(_id) {
  return homework
    .findOne({ _id, deleted: false })
    .populate('comments attachments')
    .exec();
}

async function createOne(newHw) {
  const { _doc } = await homework.create(newHw);
  // 顺便给每个人布置作业。以后应该会分开
  await user.update(
    { permission: 1 },  // 所有小朋友
    { $push: { homeworks: { hwId: _doc._id } } },
    { multi: true, runValidators: true }
  ).exec();
  return _doc;
}

async function deleteOne(_id) {
  // 从 homeworks 中删除作业
  const { _doc } = await homework.findOneAndUpdate(
    { _id, deleted: false },
    { $set: { deleted: true } },
    { runValidators: true }
  ).exec();

  // 从 users 中删除每个人对该作业的 ObjectId
  let result = await user.update(
    { 'homeworks.hwId': _id, permission: 1 },
    { $pull: { homeworks: { hwId: _id } } },
    { multi: true, runValidators: true }
  ).exec();
  console.debug(result);
  return _doc;
}

async function handInOne(...args) {
  return subService.createOne(...args);
}

async function createOneFeedback(newComment) {
  newComment.details = Object.assign(newComment.details || {}, { isFeedback: true });
  return commentService.createOne(newComment);
}

async function uploadFiles(ctx, files) {
  const filesInfo = files.map(({ originalname, buffer }) => ({
    filename: originalname,
    content: buffer,
  }));
  const result = await fileService.uploadBinaryFiles(ctx, filesInfo);
  return result.map(({ _id }) => _id);
}

async function uploadOneFile(ctx, file) {
  const ids = await uploadFiles(ctx, [file]);
  if (!ids) return false;
  return ids[0];
}

async function downloadOneFile(ctx, fileId) {
  return fileService.downloadOneFile(ctx, fileId);
}

module.exports = {
  getOne,
  createOne,
  deleteOne,
  handInOne,
  createOneFeedback,
  uploadFiles,
  uploadOneFile,
  downloadOneFile,
};
