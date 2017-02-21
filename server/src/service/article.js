const db = require('../models');
const commentService = require('./comment');

const article = db.article;

async function getOne(_id) {
  return article
    .findOne({ _id, deleted: false })
    .populate('comments')
    .exec();
}

async function createOne(newArticle) {
  Object.assign(newArticle, { createdTime: new Date() });
  const { _doc } = await article.create(newArticle);
  return _doc;
}

async function deleteOne(_id) {
  const { _doc } = article.findOneAndUpdate(
    { _id, deleted: false },
    { $set: { deleted: true } },
    { runValidators: true }
  ).exec();
  return _doc;
}

async function updateOne(_id, newArticle) {
  Object.assign(newArticle, { updatedTime: new Date() });
  return article.update(
    { _id, deleted: false },
    { $set: newArticle },
    { runValidators: true }
  ).exec();
}

async function createOneComment(newComment) {
  return commentService.createOne(newComment);
}

module.exports = {
  getOne,
  createOne,
  deleteOne,
  updateOne,
  createOneComment,
};
