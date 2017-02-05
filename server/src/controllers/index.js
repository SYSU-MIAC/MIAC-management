const Router = require('koa-router');
const compose = require('koa-compose');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const convert = require('koa-convert');
const session = require('koa-generic-session');
const MongooseStore = require('koa-session-mongoose');

const userCtrl = require('./user');
const { sendData, handleError } = require('../utils');
const config = require('../config');
const db = require('../models');

const apiRtr = new Router({
  prefix: '/api',
});

init(apiRtr);

module.exports = () => compose([
  getBodyParser(),
  convert(getSession()),
  apiRtr.routes(),
  apiRtr.allowedMethods(),
  serve(config.static),
]);

function getBodyParser() {
  return bodyParser({
    jsonLimit: '10mb',
    textLimit: '10mb',
    async onerror(err, ctx) {
      return sendData(ctx, {}, 'BAD_REQUEST', 'Unprocessable Entity Detected', 422);
    },
  });
}

function getSession() {
  return session({
    key: 'miac-session-id',
    store: new MongooseStore({
      collection: 'miacSession',
      connection: db.mongooseConnection,
      expires: 3 * 24 * 60 * 60,  // 3 天
      model: 'miacSession',
    }),
    cookie: {
      signed: false,
    },
    async errorHandler(err, type, ctx) {
      return handleError(ctx, err);
    },
  });
}

function init(router) {
  router.all('/*', setRole);
  userCtrl(router);
}

async function setRole(ctx, next) {
  if (!ctx.session.user) {
    ctx.session.user = { permission: 0 };
  }
  ctx.paramsData = { user: ctx.session.user };
  await next();
}
