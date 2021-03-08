module.exports = (columnTitles = [], rowsData = [], options = {}, client) => {
	const rows = [];
	// { columnAlign: [], columnSeparator: [], columnEmptyChar: [] }
	let { columnAlign = [], columnSeparator = [], columnEmptyChar = [] } = options;
	if (columnSeparator.length < 1) columnSeparator.push('|');
	columnSeparator = columnSeparator.map(x => ' ' + x + ' ');
	// column widths
	const columnWidths = columnTitles.map((title, i) => Math.max(title.length, ...rowsData.map(x => x[i].length)));
	// first row
	rows.push(columnTitles.map((title, i) => {
		let text = client.alignText(title, columnWidths[i], columnAlign[i], columnEmptyChar[i]);
		if (columnSeparator[i]) {
			text += ' '.repeat(columnSeparator[i].length);
		}
		return text;
	}).join(''));
	// big line
	rows.push('━'.repeat([...columnWidths, ...(columnSeparator.length > 0 ? columnSeparator.map(x => x.length) : [0])].reduce((a, b) => a + b, 0)));
	// data
	rows.push(rowsData.map(row => row.map((element, i) => {
			return client.alignText(element, columnWidths[i], columnAlign[i], columnEmptyChar[i]) + (i === columnTitles.length - 1 ? '' : columnSeparator[i]);
		}).join('')
	).join('\n'))

	return rows.join('\n');
}
/*
,,eval client.createTable(['Home', 'Guest', 'Time Ago'], [['annihilator#6516', 'example#0001', client.formatTime(168000)], ['taembo#6969', 'exampleExample#0002', client.formatTime(295902584501)], ['taembo#6969', 'example#0001', client.formatTime(2959025845013)]], { columnAlign: ['left', 'right', 'middle'], columnSeparator: ['-', '┃'] }, client);
*/