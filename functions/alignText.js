module.exports = (text, length, alignment, emptyChar = ' ') => {
	if (alignment === 'right') {
		text = emptyChar.repeat(length - text.length) + text;
	} else if (alignment === 'middle') {
		const emptyCharsPerSide = (length - text.length) / 2;
		text = emptyChar.repeat(Math.floor(emptyCharsPerSide)) + text + emptyChar.repeat(Math.floor(emptyCharsPerSide));
	} else {
		text = text + emptyChar.repeat(length - text.length);
	}
	return text;
};