const db = require('../models');
const fileService = require('./file');

const homework = db.homework;
const user = db.user;

async function getOneHomework(title) {
  return homework.find({ title, deleted: false }).exec();
}

async function createOneHomework(newHomework) {
  return homework.create(newHomework);
}

async function deleteOneHomework(title) {
  return homework.update(
    { title, deleted: false },
    { $set: { deleted: true } },
    { runValidators: true }
  ).exec();
}

async function handInOneHomework(ctx) {
  // TODO
}

async function createOneComment() {
  // TODO
}

async function getAllComments() {
  // TODO
}

module.exports = {
  getOneHomework,
  createOneHomework,
  deleteOneHomework,
  handInOneHomework,
  createOneComment,
  getAllComments,
};
