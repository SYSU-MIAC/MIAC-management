const Router = require('koa-router');
const crypto = require('crypto');
const _ = require('lodash');
const {
  sendData,
  handleError,
  recordAction,
  isValidObjectId,
} = require('../utils');
const { debug, error } = require('../utils/logger');
const userService = require('../service/user');
const authService = require('../service/authorization');

const userRtr = new Router({
  prefix: '/user',
});

userRtr.post('/', authService.requireAdmin, createOneUser);
userRtr.get('/login', login);
userRtr.get('/logout', authService.requireLogin, logout);
userRtr.param('_id', parseUser);
userRtr.get('/:_id', getOneUser);
userRtr.put('/:_id', authService.requireLogin, updateOneUser);

function getMD5(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

async function addLoginSession(ctx, user) {
  ctx.session.user = user;
}

async function removeLoginSession(ctx) {
  ctx.session.user = { permission: 0 };
}

async function parseUser(_id, ctx, next) {
  if (!isValidObjectId(_id)) {
    return sendData(ctx, {}, 'INVALID_VALUE', 'Invalid user id', 400);
  }
  let user = null;
  try {
    user = await userService.getOne(_id);
  } catch (e) {
    return handleError(ctx, e, 'DATABASE_QUERY_ERROR');
  }
  if (user === null) {
    return sendData(ctx, {}, 'NOT_FOUND', 'User not found', 404);
  }
  ctx.paramsData.user = user._doc;
  await next();
}

const userAvailableProps = [
  'username',
  'nickname',
  'email',
  'github',
  'permission',
  'homeworks',
];
async function getOneUser(ctx) {
  const dataToSend = _.pick(ctx.paramsData.user, userAvailableProps);
  recordAction(ctx, `查询用户 ${ctx.paramsData.user.username}`);
  return sendData(ctx, dataToSend, 'OK', 'Got user information successfully');
}

async function login(ctx) {
  await removeLoginSession(ctx);
  if (!isValidReq(ctx.query)) return;

  const { username, password } = ctx.query;
  let user = null;
  try {
    user = await userService.getOneByUsername(username);
  } catch (e) {
    return handleError(ctx, e, 'DATABASE_QUERY_ERROR');
  }

  if (user === null) {
    return sendData(ctx, {}, 'USER_NOT_FOUND', 'User not found', 404);
  } else if (user.password === getMD5(password)) {
    await addLoginSession(ctx, user);
    recordAction(ctx, '登录');
    return sendData(ctx, {}, 'OK', 'Logged in successfully');
  } else {
    return sendData(ctx, {}, 'WRONG_PASSWORD', 'Wrong password', 400);
  }

  function isValidReq(body) {
    // TODO
    return true;
  }
}

async function isValidNewUser(ctx, user) {
  // TODO
  return true;
}

async function handleCreateOrUpdateError(ctx, e) {
  if (e.name === 'ValidationError') {
    // TODO
    return sendData(ctx, e, 'INVALID_VALUE', 'Invalid field value', 400);
  }
  return handleError(ctx, e, 'DATABASE_UPDATE_ERROR');
}

const fieldsOnCreateUser = [
  'username',
  'password',
  'nickname',
  'github',
  'email',
];
async function createOneUser(ctx) {
  const newUser = _.pick(ctx.request.body, fieldsOnCreateUser);

  if (!await isValidNewUser(ctx, newUser)) return;

  refactorUser(newUser);
  let _doc = null;
  try {
    _doc = await userService.createOne(newUser);
  } catch (e) {
    return handleCreateOrUpdateError(ctx, e);
  }
  const { _id, username } = _doc;
  recordAction(ctx, `注册用户 ${username} (_id = ${_id})`);
  return sendData(ctx, { _id }, 'OK', 'Registered successfully');

  function refactorUser(user) {
    user.permission = 1;
    user.password = getMD5(user.password);
  }
}

async function logout(ctx) {
  recordAction(ctx, '登出');
  await removeLoginSession(ctx);
  return sendData(ctx, {}, 'OK', 'Logged out successfully');
}

const fieldsOnUpdateUser = [
  'password',
  'nickname',
  'github',
  'email',
];
async function updateOneUser(ctx) {
  const newUser = _.pick(ctx.request.body, fieldsOnUpdateUser);

  if (!await isValidNewUser(ctx, newUser)) return;

  if (newUser.hasOwnProperty('password')) {
    newUser.password = getMD5(newUser.password);
  }
  const { _id, username } = ctx.paramsData.user;

  if (String(_id) !== String(ctx.session.user._id)) {
    return sendData(ctx, {}, 'NO_PERMISSION', `You are not ${username}`, 403);
  }

  let result = null;
  try {
    result = await userService.updateOne(_id, newUser);
  } catch (e) {
    return handleCreateOrUpdateError(ctx, e);
  }

  if (result.n !== 1) {
    return sendData(ctx, {}, 'UPDATE_FAILURE', 'Failed to update the user', 500);
  } else if (result.nModified !== 1) {
    return sendData(ctx, {}, 'NOT_MODIFIED', 'User not modified', 200);
  }
  recordAction(ctx, '更新用户信息');
  return sendData(ctx, {}, 'OK', 'Updated the user successfully');
}

module.exports = (router) => {
  router.use(userRtr.routes());
  router.use(userRtr.allowedMethods());
};
