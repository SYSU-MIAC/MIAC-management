const log4js = require('log4js');
const config = require('../config');

log4js.configure(config.log);

const debug = log4js.getLogger('debug');
const error = log4js.getLogger('error');

module.exports = { debug, error };
