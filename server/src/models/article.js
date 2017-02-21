const ObjectId = require('mongoose').Schema.Types.ObjectId;

const schema = {
  title: {
    type: String,
    required: true,
  },
  content: {  // content
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
  author: {
    type: ObjectId,
    ref: 'user',
    required: true,
  },
  // username: {  // show in front end
  //   type: String,
  //   required: true,
  // },
  comments: {
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
