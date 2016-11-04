const Router = require('koa-router');
const compose = require('koa-compose');
const serve = require('koa-static');
const path = require('path');
const userCtrl = require('./user');

const router = new Router();

userCtrl(router);

module.exports = () => compose([
  serve(path.join(__dirname, '..', '..', '..', 'public')),
  router.routes(),
  router.allowedMethods(),
]);
