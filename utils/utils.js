const decider = () => Math.random() < 0.5;

const IDGen = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

module.exports = { decider, IDGen };
