const koaMulter = require('koa-multer');
const _ = require('lodash');
const { sendData } = require('.');

const funcs = ['any', 'array', 'fields', 'none', 'single'];

function multer(...args) {
  const upload = koaMulter(...args);
  for (const oneFunc of funcs) {
    wrapErrHandler(upload, oneFunc);
  }
  return upload;
}

function wrapErrHandler(upload, oneFunc) {
  const uploadFunc = upload[oneFunc];
  upload[oneFunc] = (...args) => async (ctx, next) => {
    try {
      await uploadFunc.call(upload, ...args)(ctx, () => {});
    } catch (e) {
      return sendData(ctx, {}, 'BAD_REQUEST', e.message, 400);
    }
    Object.assign(ctx.request, _.pick(ctx.req, ['body', 'file', 'files']));
    return next();
  };
}

module.exports = multer;
