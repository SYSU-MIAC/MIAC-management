const ObjectId = require('mongoose').Schema.Types.ObjectId;

const schema = {
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  beginTime: {
    type: Date,
    default: null,
  },
  endTime: {
    type: Date,
    default: null,
  },
  comments: {
    type: [{
      type: ObjectId,
      ref: 'comment',
      required: true,
    }],
    default: [],
  },
  attachments: {
    type: [{
      type: ObjectId,
      ref: 'File',
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
