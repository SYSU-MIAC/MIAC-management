const schema = {
  title: {
    type: String,
    unique: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
};

module.exports = { default: schema };
