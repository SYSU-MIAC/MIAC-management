const ObjectId = require('mongoose').Schema.Types.ObjectId;

const schema = {
  hwId: {
    type: ObjectId,
    ref: 'homework',
    required: true,
  },
  author: {
    type: ObjectId,
    ref: 'user',
    required: true,
  },
  createdTime: {
    type: Date,
    default: Date.now,
  },
  updatedTime: {
    type: Date,
    default: null,
  },
  fileId: {
    type: ObjectId,
    ref: 'File',
    required: true,
  },
  comments: {
    type: [{
      type: ObjectId,
      ref: 'comment',
      required: true,
    }],
    default: [],
  },
  feedbacks: {
    type: [{
      type: ObjectId,
      ref: 'comment',
      required: true,
    }],
    default: [],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
};

module.exports = { default: schema };
