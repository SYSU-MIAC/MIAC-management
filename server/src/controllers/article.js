const Router = require('koa-router');
const _ = require('lodash');
const {
  sendData,
  handleError,
  recordAction,
  isValidObjectId,
} = require('../utils');
const { debug, error } = require('../utils/logger');
const articleService = require('../service/article');
const authService = require('../service/authorization');

const articleRtr = new Router({
  prefix: '/article',
});

articleRtr.post('/', authService.requireLogin, createOneArticle);
articleRtr.param('_id', parseArticle);
articleRtr.delete('/:_id', authService.requireLogin, deleteOneArticle);
articleRtr.get('/:_id', getOneArticle);
articleRtr.put('/:_id', authService.requireLogin, updateOneArticle);
articleRtr.post('/:_id/comment', authService.requireLogin, commentOnArticle);

async function parseArticle(_id, ctx, next) {
  let article = null;
  if (!isValidObjectId(_id)) {
    return sendData(ctx, {}, 'INVALID_VALUE', 'Invalid article id', 400);
  }
  try {
    article = await articleService.getOne(_id);
  } catch (e) {
    return handleError(ctx, e, 'DATABASE_QUERY_ERROR');
  }
  if (article === null) {
    return sendData(ctx, {}, 'NOT_FOUND', 'Article not found', 404);
  }
  ctx.paramsData.article = article._doc;
  await next();
}

async function isValidNewArticle(ctx, newHw) {
  // TODO
  return true;
}

async function createOneArticle(ctx) {
  const { body } = ctx.request;
  const { user: { _id: author } } = ctx.paramsData;
  if (!await isValidNewArticle(ctx, body)) return;
  Object.assign(body, { author });

  let _doc = null;
  try {
    _doc = await articleService.createOne(body);
  } catch (e) {
    return handleError(ctx, e, 'DATABASE_UPDATE_ERROR');
  }

  const { title } = body;
  const dataToSend = { _id: String(_doc._id), title };
  recordAction(ctx, `发表文章 ${title} (_id = ${_doc._id})`);
  return sendData(ctx, dataToSend, 'OK', `Created article ${title} successfully`);
}

async function deleteOneArticle(ctx) {
  const {
    user: { _id: curUserId, permission },
    article: { _id, title, author },
  } = ctx.paramsData;

  if (String(curUserId) !== String(author) && permission !== 2) {
    return sendData(ctx, {}, 'NO_PERMISSION', "You cannot delete others' article", 403);
  }
  try {
    await articleService.deleteOne(_id);
  } catch (e) {
    return handleError(ctx, e, 'DATABASE_UPDATE_ERROR');
  }

  recordAction(ctx, `删除文章 ${title} (_id = ${_id})`);
  return sendData(ctx, {}, 'OK', `Deleted homework ${title} successfully`);
}

const articleAvailableProps = [
  'title',
  'content',
  'createdTime',
  'updatedTime',
  'author',
  'comments',
];
async function getOneArticle(ctx) {
  const { _id, title } = ctx.paramsData.article;
  const dataToSend = _.pick(ctx.paramsData.article, articleAvailableProps);
  recordAction(ctx, `查询文章 ${title} (_id = ${_id})`);
  return sendData(ctx, dataToSend, 'OK', 'Got article information successfully');
}

async function updateOneArticle(ctx) {
  const { body } = ctx.request;
  const {
    user: { _id: curUserId, permission },
    article: { _id, author, title },
  } = ctx.paramsData;

  if (String(curUserId) !== String(author) && permission !== 2) {
    return sendData(ctx, {}, 'NO_PERMISSION', 'You cannot delete this article', 403);
  }
  if (!await isValidNewArticle(ctx, body)) return;

  let result = null;
  try {
    result = await articleService.updateOne(_id, body);
  } catch (e) {
    return handleError(ctx, e, 'DATABASE_UPDATE_ERROR');
  }

  if (result.n !== 1) {
    return sendData(ctx, {}, 'UPDATE_FAILURE', 'Failed to update the article', 500);
  } else if (result.nModified !== 1) {
    return sendData(ctx, {}, 'NOT_MODIFIED', 'Article not modified', 200);
  }
  const curTitle = body.title || title;
  recordAction(ctx, `更新文章 ${curTitle} (_id = ${_id})`);
  return sendData(ctx, {}, 'OK', `Updated article ${curTitle} successfully`);
}

async function commentOnArticle(ctx) {
  const { content } = ctx.request.body;
  const {
    user: { _id: author },
    article: { _id: ownerId, title },
  } = ctx.paramsData;

  const newComment = {
    author,
    content,
    type: 'article',
    ownerId,
  };

  let _doc = null;
  try {
    _doc = await articleService.createOneComment(newComment);
  } catch (e) {
    return handleError(ctx, e, 'DATABASE_UPDATE_ERROR');
  }

  const { _id } = _doc;
  recordAction(ctx, `评论文章 ${title} (articleId = ${ownerId}, commentId = ${_id})`);
  return sendData(ctx, { _id }, 'OK', `Made comment on article ${title} successfully`);
}

module.exports = (router) => {
  router.use(articleRtr.routes());
  router.use(articleRtr.allowedMethods());
};
