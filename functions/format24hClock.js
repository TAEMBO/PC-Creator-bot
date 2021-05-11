module.exports = (timestamp, includeSeconds = false) => {
	if (!(timestamp instanceof Date)) timestamp = new Date(timestamp);
	let text = '';
	text += ('0' + timestamp.getUTCHours()).slice(-2) + ':';
	text += ('0' + timestamp.getUTCMinutes()).slice(-2);
	if (includeSeconds) {
		text += '.' + ('0' + timestamp.getUTCSeconds()).slice(-2)
	}
	return text;
};