function pick(obj, ...props) {
  return Object.assign({}, ...props.map(oneProp => ({ [oneProp]: obj[oneProp] })));
}

module.exports = {
  pick,
};
