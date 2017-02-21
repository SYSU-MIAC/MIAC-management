const ObjectId = require('mongoose').Schema.Types.ObjectId;

const schema = {
  author: {
    type: ObjectId,
    ref: 'user',
    required: true,
  },
  content: {
    type: String,
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
  type: {
    type: String,
    required: true,
  },
  ownerId: {
    type: ObjectId,
    refPath: 'type',
    required: true,
  },
  details: {
    type: {
      isFeedback: {
        type: Boolean,
      },
    },
    default: {},
  },
  deleted: {
    type: Boolean,
    default: false,
  },
};

module.exports = { default: schema };
