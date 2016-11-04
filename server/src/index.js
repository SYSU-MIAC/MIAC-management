const Koa = require('koa');
const config = require('./config');
const controller = require('./controllers');
const { debug, error } = require('./utils/logger');

const app = new Koa();

let serverStarted = false;

// emitted whenever a Promise is rejected and no error handler
process.on('unhandledRejection', (reason, p) => {
  error.error(`Catch Rejection : ${reason}\n${p}`);
  if (!serverStarted) {
    // 如果服务器还没完成初始化则直接退出
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  error.error(`Caught exception: ${err.stack}`);
});

async function init() {
  app.use(controller());

  app.on('error', (err, ctx) => {
    error.error(err);
    ctx.response.status = 500;
  });

  app.listen(config.port, () => {
    serverStarted = true;
    debug.info(`server started on port ${config.port}`);
  });
}

init();

module.exports = app;
