module.exports = (integer, accuracy = 1) => {
	const timeNames = [
		{ 
			name: 'year',
			length: 1000 * 60 * 60 * 24 * 30.436875 * 12
		},
		{
			name: 'month',
			length: 1000 * 60 * 60 * 24 * 30
		},
		{
			name: 'day',
			length: 1000 * 60 * 60 * 24
		},
		{
			name: 'hour',
			length: 1000 * 60 * 60
		},
		{
			name: 'minute',
			length: 1000 * 60
		},
		{
			name: 'second',
			length: 1000
		}
	];
	let achievedAccuracy = 0;
	let text = '';
	for (timeName of timeNames) {
		if (achievedAccuracy < accuracy) {
			const fullTimelengths = Math.floor(integer / timeName.length);
			if (fullTimelengths === 0) continue;
			achievedAccuracy++;
			text += fullTimelengths + timeName.name.slice(0, timeName.name === 'month' ? 2 : 1) + ' ';
			integer -= fullTimelengths * timeName.length;
		} else {
			break;
		}
	}
	if (text.length === 0) text = '0s';
	return text.trim();
};