const Router = require('koa-router');
const compose = require('koa-compose');
const userCtrl = require('./user');

const router = new Router();

userCtrl(router);

module.exports = () => compose([
  router.routes(),
  router.allowedMethods(),
]);
