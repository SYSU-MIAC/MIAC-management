const schema = {
  id: {  // login id
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  permission: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  github: {  // Github link
    type: String,
    match: /(?:^$)|(?:^(?:https:\/\/){0,1}github\.com\/\S{1,})/,
    default: '',
  },
  headimg: {  // link of head portrait
    type: String,
    default: '',
  },
  email: {   // E-mail
    type: String,
    match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    required: true,
  },
  hw: {
    type: [{  // Homeworks
      title: String,  // Homework's title
      file: String,  // path to the file
      comment: {  // comments
        text: String,  // comment's content
        author: String,  // who comment
      },
    }],
    default: [],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
};

module.exports = { default: schema };
