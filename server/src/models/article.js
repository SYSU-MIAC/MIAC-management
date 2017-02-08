const schema = {
  title: {
    type: String,
    required: true,
  },
  text: {  // content
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userid: {  // who post this article
    type: String,
    required: true,
  },
  username: {  // show in front end
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
};

module.exports = { default: schema };
