const userService = require('../service/user');

async function getName(ctx) {
  userService.createUser();
  ctx.body = 'hello xiaoming';
}

module.exports = (router) => {
  router.get('/api/user', getName);
};
