const Router = require('koa-router');
const _ = require('lodash');
const { sendData, handleError, recordAction } = require('../utils');
const { debug, error } = require('../utils/logger');
const articleService = require('../service/article');
const authService = require('../service/authorization');

const articleRtr = new Router({
  prefix: '/article',
});

articleRtr.post('/', authService.requireLogin, createOneArticle);
articleRtr.param('articleId', parseArticle);
articleRtr.delete('/:articleId', authService.requireLogin, deleteOneArticle);
articleRtr.get('/:articleId', getOneArticle);
articleRtr.put('/:articleId', authService.requireLogin, updateOneArticle);
articleRtr.post('/:articleId/comment', authService.requireLogin, commentOnArticle);

async function parseArticle(title, ctx, next) {
  // TODO
  await next();
}

async function createOneArticle(ctx) {
  // TODO
}

async function deleteOneArticle(ctx) {
  // TODO
}

async function getOneArticle(ctx) {
  // TODO
}

async function updateOneArticle(ctx) {
  // TODO
}

async function commentOnArticle(ctx) {
  // TODO
}

module.exports = (router) => {
  router.use(articleRtr.routes());
  router.use(articleRtr.allowedMethods());
};
