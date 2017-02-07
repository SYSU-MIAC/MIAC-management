const _ = require('lodash');
const { debug, error } = require('./logger');

module.exports = {
  sendData,
  handleError,
  logRequest,
  recordAction,
};

/**
 * @description 服务器没出错，发送正常的回复
 *
 * @param  {Object}    ctx
 * @param  {Object}    data
 * @param  {String}    status        大写英文字母组成的状态
 * @param  {String}    msg           人类看得懂的信息
 * @param  {Number}    [statusCode]  HTTP 状态码, 默认 200
 * @author 陈宇翔
 */
async function sendData(ctx, data, status = 'OK', msg = 'Success', statusCode = 200) {
  let curUser = {};
  if (ctx.session.user.permission) {
    curUser = _.pick(ctx.session.user, ['id']);
  }
  ctx.status = statusCode;
  ctx.body = {
    status,
    msg,
    data,
    curUser,
    time: new Date(),
  };
}

const statusToMsg = {
  DATABASE_QUERY_ERROR: 'Failed to execute query on database',
  DATABASE_MODIFICATION_ERROR: 'Failed to perform insert or update on batabase',
};

/**
 * @description 服务器内部出错
 *
 * @param  {Object}    ctx
 * @param  {Error}     e             Error 对象
 * @param  {String}    [status]      大写英文字母组成的状态, 默认 UNKNOWN_ERROR
 * @param  {String}    [msg]         人类看得懂的信息, 默认 Unknown Error
 * @param  {Number}    [statusCode]  HTTP 状态码, 默认 500
 * @author 陈宇翔
 */
async function handleError(ctx, e, status = 'UNKNOWN_ERROR', msg = '', statusCode = 500) {
  error.error('Internal Server Error :');
  error.error(e);
  if (msg.length === 0) {
    msg = statusToMsg[status] || 'Unknown Error';
  }
  let stack = e.stack;
  if (process.env.NODE_ENV === 'production') {
    stack = undefined;
  }
  ctx.status = statusCode;
  ctx.body = {
    status,
    msg,
    stack,
    time: new Date(),
  };
}

async function logRequest(ctx, next) {
  const start = process.hrtime();
  await next();
  const elapsed = process.hrtime(start);
  const interval = `${(elapsed[0] * 1e3 + elapsed[1] / 1e6).toFixed(3)} ms`;

  const { header: { 'content-length': contentLength }, method, url, ip, status } = ctx;
  const statusText = (ctx.body && ` ${ctx.body.status}`) || '';
  const contentLengthText = (contentLength && ` - ${contentLength}`) || '';
  let func = 'info';
  if (status >= 400 && status < 500) {
    func = 'warn';
  } else if (status >= 500) {
    func = 'error';
  }
  debug[func](`${ip} - ${method} ${decodeURIComponent(url)} - ${interval} - ${status}${statusText}${contentLengthText}`);
}

function recordAction(ctx, actionMsg) {
  const { id } = ctx.session.user;
  debug.info(`用户 ${id} ${actionMsg}`);
}
