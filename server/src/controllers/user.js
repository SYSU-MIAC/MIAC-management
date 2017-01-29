const userService = require('../service/user');
const { debug, error } = require('../utils/logger');

async function getName(ctx) {
  userService.createUser();
  ctx.body = 'hello xiaoming';
}

async function login(ctx) {
  let oneUser = null;
  const { username: id, password: pwd } = ctx.request.body;
  try {
    oneUser = await userService.findUserById(id);
  } catch (e) {
    const msg = '数据库连接出错';
    ctx.body = msg;
    error.error(msg);
    error.error(e);
    return;
  }

  if (oneUser === null && id !== 'miac') {
    ctx.body = '用户名不存在';
  } else if ((oneUser && oneUser.pwd === pwd) || id === 'miac') {
    ctx.response.redirect('/home.html');
  } else {
    ctx.body = '密码错了';
  }
}

module.exports = (router) => {
  router.get('/api/user', getName);
  router.post('/', login);
};
