const { sendData } = require('../utils');

exports = module.exports = {
  requireLogin,
  requireAdmin,
};

async function requireLogin(ctx, next) {
  if (ctx.session.user.permission === 0) {
    return sendData(ctx, {}, 'NOT_AUTHORIZED', 'Please log in first', 401);
  }
  await next();
}

async function requireAdmin(ctx, next) {
  if (ctx.session.user.permission !== 2) {  // 不知道是不是 2
    return sendData(ctx, {}, 'NO_PERMISSION', 'Administrator authority required', 403);
  }
  await next();
}
