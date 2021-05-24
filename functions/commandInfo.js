module.exports = (client, command, options = { insertEmpty: false, parts: [] }) => {
	let text = ':small_blue_diamond: ';
	function e() {
		text += '\n';
		if (options.insertEmpty) {
			text += '\n';
		}
		return;
	}
	if (options.parts.includes('name') && command.name) {
		text += '`' + client.prefix + command.name;
		if (options.parts.includes('usage') && command.usage) {
			text += ' [' + command.usage.join('] [') + ']';
		}
		text += '`';
		e();
	} else if (options.parts.includes('usage') && command.usage) {
		text += 'Usage: `[' + command.usage.join('] [') + ']`';
		e();
	}
	if (options.parts.includes('description') && command.description) {
		text += command.description;
		e();
	}
	if (options.parts.includes('alias') && command.alias) {
		text += 'Aliases: ' + command.alias.map(x => '`' + x + '`').join(', ');
		e();
	}
	if (options.parts.includes('category') && command.category) {
		text += 'Category: ' + command.category;
		e();
	}
	if (options.parts.includes('autores') && command.autores) {
		text += 'AutoResponse:tm: Requirements: `[' + command.autores.join('] [') + ']`';
		e();
	}
	e();
	return text;
};