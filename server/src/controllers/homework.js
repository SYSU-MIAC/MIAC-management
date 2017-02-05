const Router = require('koa-router');
const _ = require('lodash');
const { sendData, handleError, recordAction } = require('../utils');
const { debug, error } = require('../utils/logger');
const hwService = require('../service/homework');
const authService = require('../service/authorization');

const hwRtr = new Router({
  prefix: '/hw',
});

hwRtr.post('/', authService.requireAdmin, createOneHomework);
hwRtr.param('title', parseHomework);
hwRtr.delete('/:title', authService.requireAdmin, deleteOneHomework);
hwRtr.post('/:title', authService.requireLogin, handInOneHomework);
hwRtr.post('/:title/comment/:userId', authService.requireAdmin, adminCommentOnOneUser);

async function parseHomework(title, ctx, next) {
  // TODO
  await next();
}

async function createOneHomework(ctx) {
  // TODO
}

async function deleteOneHomework(ctx) {
  // TODO
}

async function handInOneHomework(ctx) {
  // TODO
}

async function adminCommentOnOneUser(ctx) {
  // TODO
}

module.exports = (router) => {
  router.use(hwRtr.routes());
  router.use(hwRtr.allowedMethods());
};
