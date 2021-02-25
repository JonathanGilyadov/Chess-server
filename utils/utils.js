const decider = () => Math.random() < 0.5;

const colorDecider = () => {
	const color = decider ? 'white' : 'black';

	return color;
};

const IDGen = () => {
	return '_' + Math.random().toString(36).substr(2, 9);
};

module.exports = { colorDecider, IDGen };
