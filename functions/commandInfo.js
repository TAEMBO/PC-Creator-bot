module.exports = (client, command, options = { insertNewline: false, parts: [], titles: [] }) => {
	let text = ':small_blue_diamond: ';
	if (!options.titles) options.titles = [];
	function e() {
		text += '\n';
		if (options.insertNewline) {
			text += '\n';
		}
		return;
	}
	if (options.parts.includes('name') && command.name) {
		if (options.titles.includes('name') && options.titles.includes('usage')) {
			text += 'Name & Usage: ';
		} else if (options.titles.includes('name')) {
			text += 'Name: ';
		}
		text += '`' + client.prefix + command.name;
		if (options.parts.includes('usage') && command.usage) {
			text += ' [' + command.usage.join('] [') + ']';
		}
		text += '`';
		e();
	} else if (options.parts.includes('usage') && command.usage) {
		if (options.titles.includes('usage')) text += 'Usage: ';
		text += '`[' + command.usage.join('] [') + ']`';
		e();
	}
	if (options.parts.includes('description') && command.description) {
		if (options.titles.includes('description')) text += 'Description: ';
		text += command.description;
		e();
	}
	if (options.parts.includes('shortDescription')) {
		if (command.shortDescription) {
			if (options.titles.includes('shortDescription')) text += 'Shorter description: ';
			text += command.shortDescription;
			e();
		} else if (!options.titles.includes('shortDescription') && command.description) {
			text += command.description;
			e();
		}
	}
	if (options.parts.includes('alias') && command.alias) {
		if (options.titles.includes('alias')) text += 'Aliases: ';
		text += command.alias.map(x => '`' + x + '`').join(', ');
		e();
	}
	if (options.parts.includes('category') && command.category) {
		if (options.titles.includes('category')) text += 'Category: ';
		text += command.category;
		e();
	}
	if (options.parts.includes('autores') && command.autores) {
		if (options.titles.includes('autores')) text += 'AutoResponse:tm: Requirements: ';
		text += '`[' + command.autores.join('] [') + ']`';
		e();
	}
	if (options.parts.includes('cooldown') && command.cooldown) {
		if (options.titles.includes('cooldown')) text += 'Cooldown: ';
		text += client.formatTime(command.cooldown * 1000, 1, { longNames: true });
		e();
	}
	e();
	return text;
};