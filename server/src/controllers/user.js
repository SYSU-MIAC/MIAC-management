const Router = require('koa-router');
const crypto = require('crypto');
const _ = require('lodash');
const { sendData, handleError, recordAction } = require('../utils');
const { debug, error } = require('../utils/logger');
const userService = require('../service/user');
const authService = require('../service/authorization');

const userRtr = new Router({
  prefix: '/user',
});

userRtr.post('/', createUser);
userRtr.get('/login', login);
userRtr.get('/logout', authService.requireLogin, logout);
userRtr.param('id', parseUser);
userRtr.get('/:id', getUser);
userRtr.put('/:id', authService.requireLogin, updateUser);

function getMD5(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

async function addLoginSession(ctx, user) {
  ctx.session.user = user;
}

async function removeLoginSession(ctx) {
  ctx.session.user = { permission: 0 };
}

async function parseUser(id, ctx, next) {
  // TODO: id 合法性检验
  let user = null;
  try {
    user = await userService.findUserById(id);
  } catch (e) {
    return handleError(ctx, e, 'DATABASE_QUERY_ERROR', 'Failed to execute query on database');
  }
  if (user === null) {
    return sendData(ctx, {}, 'USER_NOT_FOUND', 'User not found', 404);
  }
  ctx.paramsData.user = user;
  await next();
}

const userAvailableProps = [
  'id',
  'nickname',
  'email',
  'github',
  'permission',
];
async function getUser(ctx) {
  const dataToSend = _.pick(ctx.paramsData.user, userAvailableProps);
  recordAction(ctx, `查询用户 ${ctx.paramsData.user.id} 的信息`);
  return sendData(ctx, dataToSend, 'OK', 'Got user information successfully');
}

async function login(ctx) {
  await removeLoginSession(ctx);
  if (!isValidReq(ctx.query)) return;

  const { id, password } = ctx.query;
  let user = null;
  try {
    user = await userService.findUserById(id);
  } catch (e) {
    return handleError(ctx, e, 'DATABASE_QUERY_ERROR', 'Failed to execute query on database');
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
    if (isEmpty('id')) {
      sendData(ctx, {}, 'BAD_REQUEST', 'Id must not be empty', 400);
      return false;
    } else if (isEmpty('password')) {
      sendData(ctx, {}, 'BAD_REQUEST', 'Password must not be empty', 400);
      return false;
    }
    return true;

    function isEmpty(propName) {
      return !Reflect.hasOwnProperty.call(body, propName) || body[propName] === '';
    }
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
  return handleError(ctx, e, 'DATABASE_MODIFICATION_ERROR', 'Failed to perform insert or update on batabase');
}

const fieldsOnCreateUser = [
  'id',
  'password',
  'nickname',
  'github',
  'email',
];
async function createUser(ctx) {
  const newUser = _.pick(ctx.request.body, fieldsOnCreateUser);

  if (!await isValidNewUser(ctx, newUser)) return;

  refactorUser(newUser);
  try {
    await userService.createUser(newUser);
  } catch (e) {
    return handleCreateOrUpdateError(ctx, e);
  }
  await addLoginSession(ctx, await userService.findUserById(newUser.id));
  recordAction(ctx, '注册');
  return sendData(ctx, {}, 'OK', 'Registered successfully');

  function refactorUser(user) {
    user.permission = 1;
    user.password = getMD5(user.password);
  }
}

async function logout(ctx) {
  recordAction(ctx, '登出');
  await removeLoginSession(ctx);
  return sendData(ctx, {});
}

const fieldsOnUpdateUser = [
  'password',
  'nickname',
  'github',
  'headimg',
  'email',
];
async function updateUser(ctx) {
  const newUser = _.pick(ctx.request.body, fieldsOnUpdateUser);

  if (!await isValidNewUser(ctx, newUser)) return;

  if (Reflect.hasOwnProperty.call(newUser, 'password')) {
    newUser.password = getMD5(newUser.password);
  }
  const { id } = ctx.paramsData.user;
  if (id !== ctx.session.user.id) {
    return sendData(ctx, {}, 'NO_PERMISSION', `You are not ${id}`, 400);
  }

  let result = null;
  try {
    result = await userService.updateUser(id, newUser);
  } catch (e) {
    return handleCreateOrUpdateError(ctx, e);
  }

  if (result.n !== 1) {
    return sendData(ctx, {}, 'UPDATE_FAILURE', 'Failed to update the user', 500);
  } else if (result.nModifited !== 1) {
    return sendData(ctx, {}, 'NOT_MODIFIED', 'User not modified', 200);
  }
  recordAction(ctx, '更新用户信息');
  return sendData(ctx, {}, 'OK', 'Updated the user successfully');
}

module.exports = (router) => {
  router.use(userRtr.routes());
  router.use(userRtr.allowedMethods());
};
