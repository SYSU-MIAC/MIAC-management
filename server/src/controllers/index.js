const Router = require('koa-router');
const compose = require('koa-compose');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const userCtrl = require('./user');
const config = require('../config');

const router = new Router();

userCtrl(router);

function getBodyParser() {
  return bodyParser({
    async onerror(err, ctx, next) {
      ctx.throw('Bad Request', 422);
      await next();
    },
  });
}

module.exports = () => compose([
  getBodyParser(),
  router.routes(),
  router.allowedMethods(),
  serve(config.static),
]);
