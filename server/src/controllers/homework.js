const Router = require('koa-router');
const _ = require('lodash');
const multer = require('../utils/multer');
const {
  sendData,
  handleError,
  recordAction,
  isValidObjectId,
} = require('../utils');
const { debug, error } = require('../utils/logger');
const userService = require('../service/user');
const hwService = require('../service/homework');
const authService = require('../service/authorization');

const hwRtr = new Router({
  prefix: '/hw',
});

const upload = multer({
  limits: {
    fieldNameSize: 100,
    fieldSize: 100,
    fileSize: 10 * 1024 * 1024, // 10 Mib
    fields: 5,
    files: 5,
    parts: 10,
  },
});

hwRtr.post('/',
  authService.requireAdmin,
  upload.array('attachment', 10),
  createOneHomework
);
hwRtr.param('_id', parseHomework);
hwRtr.param('userId', parseCommentedUser);
hwRtr.get('/:_id', getOneHomework);
hwRtr.delete('/:_id', authService.requireAdmin, deleteOneHomework);
hwRtr.post('/:_id',
  authService.requireLogin,
  upload.single('submission'),
  handInOneHomework
);
hwRtr.post('/:_id/comment/:userId', authService.requireAdmin, adminCommentOnOneUser);

async function parseHomework(_id, ctx, next) {
  if (!isValidObjectId(_id)) {
    return sendData(ctx, {}, 'INVALID_VALUE', 'Invalid homework id', 400);
  }
  let homework = null;
  try {
    homework = await hwService.getOne(_id);
  } catch (e) {
    return handleError(ctx, e, 'DATABASE_QUERY_ERROR');
  }
  if (homework === null) {
    return sendData(ctx, {}, 'NOT_FOUND', 'Homework not found', 404);
  }
  ctx.paramsData.homework = homework._doc;
  await next();
}

async function isValidNewHomework(ctx, newHw) {
  // TODO
  return true;
}

async function createOneHomework(ctx, next) {
  const { body, files } = ctx.request;
  if (!await isValidNewHomework(ctx, body)) return;

  let _doc = null;
  try {
    _doc = await hwService.createOne(body, files);
  } catch (e) {
    return handleError(ctx, e, 'DATABASE_UPDATE_ERROR');
  }

  const { title } = body;
  const dataToSend = { _id: String(_doc._id), title };
  recordAction(ctx, `创建作业 ${title} (_id = ${_doc._id})`);
  return sendData(ctx, dataToSend, 'OK', `Created homework ${title} successfully`);
}

const hwAvailableProps = [
  'title',
  'description',
  'beginTime',
  'endTime',
  'comments',
];
async function getOneHomework(ctx) {
  const { _id, title } = ctx.paramsData.homework;
  const dataToSend = _.pick(ctx.paramsData.homework, hwAvailableProps);
  recordAction(ctx, `查询作业 ${title} (_id = ${_id})`);
  return sendData(ctx, dataToSend, 'OK', 'Got homework information successfully');
}


async function deleteOneHomework(ctx) {
  const { _id, title } = ctx.paramsData.homework;
  try {
    await hwService.deleteOne(_id);
  } catch (e) {
    return handleError(ctx, e, 'DATABASE_UPDATE_ERROR');
  }

  recordAction(ctx, `删除作业 ${title} (_id = ${_id})`);
  return sendData(ctx, {}, 'OK', `Deleted homework ${title} successfully`);
}

async function handInOneHomework(ctx) {
  const { _id: author } = ctx.session.user;
  const { homework: { _id: hwId, title } } = ctx.paramsData;

  if (!isAssignedHw(ctx.paramsData.user, hwId)) {
    return sendData(ctx, {}, 'NOT_ASSIGNED', 'You are not assigned this homework', 403);
  }

  // 要提交的东西
  const { file } = ctx.request;
  const newSub = {
    hwId,
    author,
    filename: file.originalname,
  };

  let _doc = null;
  try {
    _doc = await hwService.handInOne(newSub, file);
  } catch (e) {
    return handleError(ctx, e, 'DATABASE_UPDATE_ERROR');
  }

  const { _id } = _doc;
  recordAction(ctx, `提交作业 ${title} (hwId = ${hwId}, subId = ${_id})`);
  return sendData(ctx, { _id }, 'OK', `Submitted homework ${title} successfully`);

  function isAssignedHw(user, hwId) {
    return user.homeworks.some(oneHw => String(oneHw.hwId) === String(hwId));
  }
}

async function parseCommentedUser(userId, ctx, next) {
  if (!isValidObjectId(userId)) {
    return sendData(ctx, {}, 'INVALID_VALUE', 'Invalid user id', 400);
  }
  const { homework: { _id: hwId } } = ctx.paramsData;
  let commentedUser = null;
  try {
    commentedUser = await userService.getOneByIdAndHwId(userId, hwId);
  } catch (e) {
    return handleError(ctx, e, 'DATABASE_QUERY_ERROR');
  }
  debug.debug(commentedUser);
  if (commentedUser === null) {
    return sendData(ctx, {}, 'NOT_ASSIGNED', 'Homework not assigned to commented user', 403);
  }
  ctx.paramsData.commentedUser = commentedUser;
  await next();
}

async function adminCommentOnOneUser(ctx) {
  const { content } = ctx.request.body;
  const {
    homework: { _id: queryedHwId, title },
    commentedUser: { _id: author, username, homeworks },
  } = ctx.paramsData;

  let ownerId = null;
  homeworks.some(({ hwId, subId }) => {
    if (String(hwId) !== String(queryedHwId)) return false;
    ownerId = subId;
    return true;
  });

  const newComment = {
    author,
    content,
    type: 'feedback',
    ownerId,
  };

  let _doc = null;
  try {
    _doc = await hwService.createOneFeedback(newComment);
  } catch (e) {
    return handleError(ctx, e, 'DATABASE_UPDATE_ERROR');
  }

  const { _id } = _doc;
  recordAction(ctx, `反馈用户 ${username} 的作业 ${title} (subId = ${ownerId}, commentId = ${_id})`);
  return sendData(ctx, { _id }, 'OK', `Made feedback on homework ${title} successfully`);
}

module.exports = (router) => {
  router.use(hwRtr.routes());
  router.use(hwRtr.allowedMethods());
};
