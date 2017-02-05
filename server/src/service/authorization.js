const { sendData } = require('../utils');

exports = module.exports = {
  requireLogin,
};

async function requireLogin(ctx, next) {
  if (ctx.session.user.permission === 0) {
    return sendData(ctx, {}, 'NOT_AUTHORIZED', 'Please log in first', 401);
  }
  await next();
}
