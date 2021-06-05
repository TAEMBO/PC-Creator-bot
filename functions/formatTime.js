module.exports = (integer, accuracy = 1, options = {}) => {
	const timeNames = require('./../timeNames.js');
	let achievedAccuracy = 0;
	let text = '';
	const { longNames, commas } = options;
	for (timeName of timeNames) {
		if (achievedAccuracy < accuracy) {
			const fullTimelengths = Math.floor(integer / timeName.length);
			if (fullTimelengths === 0) continue;
			achievedAccuracy++;
			text += fullTimelengths + (longNames ? (' ' + timeName.name + (fullTimelengths === 1 ? '' : 's')) : timeName.name.slice(0, timeName.name === 'month' ? 2 : 1)) + (commas ? ', ' : ' ');
			integer -= fullTimelengths * timeName.length;
		} else {
			break;
		}
	}
	if (text.length === 0) text = integer + (longNames ? ' milliseconds' : 'ms') + (commas ? ', ' : '');
	if (commas) {
		text = text.slice(0, -2);
		if (longNames) {
			text = text.split('');
			text[text.lastIndexOf(',')] = ' and';
			text = text.join('');
		}
	}
	return text.trim();
};