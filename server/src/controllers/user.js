const userService = require('../service/user');
const crypto = require('crypto');
const { debug, error } = require('../utils/logger');
const { pick } = require('../utils/pickProp');

function getMD5(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

async function getName(ctx) {
  userService.createUser();
  ctx.body = 'hello xiaoming';
}

async function addLoginSession(ctx) {
  // TODO
}

async function removeLoginSession(ctx) {
  // TODO
}

async function login(ctx) {
  await removeLoginSession(ctx);
  if (!isValidReq(ctx.request.body)) return;

  const { username: id, password } = ctx.request.body;
  let oneUser = null;
  try {
    oneUser = await userService.findUserById(id);
  } catch (e) {
    const msg = 'Database Query Error';
    ctx.body = msg;
    error.error(msg);
    error.error(e);
    return;
  }
  if (oneUser === null) {
    ctx.body = 'Username not found';
  } else if (oneUser.password === getMD5(password)) {
    await addLoginSession(ctx);
    ctx.response.redirect('/home.html');
  } else {
    ctx.body = 'Wrong password';
  }

  function isValidReq(body) {
    function isEmpty(propName) {
      return !Reflect.hasOwnProperty.call(body, propName) || body[propName] === '';
    }
    if (isEmpty('username')) {
      ctx.body = 'Bad Request: Username should not be empty';
    } else if (isEmpty('password')) {
      ctx.body = 'Bad Request: Password should not be empty';
    }
    return true;
  }
}

const fields = [
  'username',
  'password',
  'nickname',
  'github',
  'email',
];
async function register(ctx) {
  const newUser = pick(ctx.request.body, ...fields);

  if (!await isValidUser(newUser)) return;

  try {
    await userService.createUser(newUser);
  } catch (e) {
    return handleRegisterError(e);
  }
  await addLoginSession(ctx);
  ctx.response.redirect('/home.html');

  async function isValidUser(newUser) {
    // TODO

    // 合法:
    newUser.permission = newUser.permission || 0;
    newUser.id = newUser.username;
    newUser.password = getMD5(newUser.password);
    delete newUser.username;
    return true;
  }

  async function handleRegisterError(e) {
    if (e.name === 'ValidationError') {
      if (process.env.NODE_ENV === 'production') {
        ctx.body = 'Bad Request';
      } else {
        ctx.body = JSON.stringify(e.errors);
      }
    } else {
      const msg = 'Database Insertion Error';
      ctx.body = msg;
      error.error(msg);
      error.error(e);
    }
  }
}

async function logout(ctx) {
  await removeLoginSession(ctx);
  ctx.response.redirect('/index.html');
}

module.exports = (router) => {
  router.get('/api/user', getName);
  router.post('/', login);  // deprecated
  router.post('/login', login);
  router.post('/register', register);
  router.post('/logout', logout);
};
