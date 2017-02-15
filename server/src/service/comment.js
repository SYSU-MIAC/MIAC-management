const db = require('../models');

const comment = db.comment;
const owner = {
  article: db.article,
  homework: db.homework,
  submission: db.submission,
  feedback: db.submission,
};

async function createOne(newComment) {
  Object.assign(newComment, { createdTime: new Date() });
  const { ownerId, type } = newComment;
  const { _doc } = await comment.create(newComment);

  const commentArr = (type === 'feedback' ? 'feedbacks' : 'comments');
  // 为文章、提交等的评论数组 增加评论的 ObjectId
  const result = await owner[type].update(
    { _id: ownerId },
    { $push: { [commentArr]: _doc._id } },
    { runValidators: true }
  ).exec();
  return _doc;
}

async function deleteOne(_id) {
  // 从 comments 中删除评论
  const { _doc } = await comment.findOneAndUpdate(
    { _id, deleted: false },
    { $set: { deleted: true } },
    { runValidators: true }
  ).exec();
  const { type, ownerId } = _doc;
  // 从文章、提交等的评论数组 删除评论的 ObjectId
  const result = await owner[type].update(
    { _id: ownerId },
    { $pull: { comments: _id } },
    { runValidators: true }
  ).exec();
  return _doc;
}

module.exports = {
  createOne,
  deleteOne,
};
