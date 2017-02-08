const db = require('../models');

const article = db.article;

async function createOneArticle(newArticle) {
  return article.create(newArticle);
}

                              // articleId 是啥
async function deleteOneArticle(articleId) {
  return article.update(
    { articleId, deleted: false },
    { $set: { deleted: true } },
    { runValidators: true }
  ).exec();
}

async function getOneArticle(articleId) {
  return article.find({ articleId, deleted: false }).exec();
}

async function updateOneArticle(articleId, newArticle) {
  Object.assign(newArticle, { date: new Date() });
  return article.update(
    { articleId, deleted: false },
    { $set: newArticle },
    { runValidators: true }
  ).exec();
}

async function commentOnArticle() {
  // TODO
}

module.exports = {
  createOneArticle,
  deleteOneArticle,
  getOneArticle,
  updateOneArticle,
  commentOnArticle,
};
