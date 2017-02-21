const db = require('../models');
const fs = db.fs;
const Readable = require('stream').Readable;
const Promise = require('bluebird');
const { handleError } = require('../utils');
const { debug, error } = require('../utils/logger');

function getReadableStream(content) {
  const readable = new Readable({ read() {} });
  readable.push(content);
  readable.push(null);
  return readable;
}

function handleFileServiceError(ctx, e) {
  if (ctx === null) {
    error.error('File Service Error :');
    error.error(e);
    return;
  }
  return handleError(ctx, e, 'FILE_SERVICE_ERROR', '文件服务错误'), false;
}

async function uploadBinaryFiles(ctx, filesInfo) {
  try {
    return Promise.map(
      filesInfo,
      ({ filename, content }) => fs.writeAsync({ filename }, getReadableStream(content)),
      { concurrency: 3 }
    );
  } catch (e) {
    return handleFileServiceError(ctx, e);
  }
}

async function downloadOneFile(ctx, id) {
  try {
    return fs.readById(id);
  } catch (e) {
    return handleFileServiceError(ctx, e);
  }
}

exports = module.exports = {
  uploadBinaryFiles,
  downloadOneFile,
};
