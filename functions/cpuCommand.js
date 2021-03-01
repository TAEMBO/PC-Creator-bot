module.exports = (client, message, args) => {
	if (!args[1]) return message.channel.send('You need to search for a CPU. For help, do `' + client.prefix + args[0] + ' help`');
	const manufacturer = args[0].includes('intel') ? 'INTEL' : args[0].includes('amd') ? 'AMD' : undefined;
	if (!manufacturer) return;
	const color = manufacturer === 'INTEL' ? 2793983 : 13582629;
	if (args[1].toLowerCase() === 'help' && args.length === 2) {
		const embed = client.cpuCommandHelpEmbed(client, client.prefix + args[0].toLowerCase(), color);
		return message.channel.send(embed);
	}
	const search = args.slice(1).join(' ').toLowerCase().split(',');
	let matches = new client.collection();
	let nameSearch = false;
	let filters = [];
	let oneResult = true;
	let multipleResponseAsk = true;
	if (search[search.length - 1].endsWith('-s')) {
		oneResult = false;
		search[search.length - 1] = search[search.length - 1].slice(0, -2).trim();
	} else if (search[search.length - 1].endsWith('-sl')) {
		oneResult = false;
		multipleResponseAsk = false;
		search[search.length - 1] = search[search.length - 1].slice(0, -2).trim();
	}
	let prematureError = false;
	search.forEach((statement, index) => {
		statement = statement.trim();
		if (index === 0 && !['<', '>', '=', '~'].some(x => statement.includes(x))) {
			nameSearch = search[0].replace(/ /g, '-');
		} else {
			const operatorStartIndex = Math.max(statement.indexOf('<'), 0) || Math.max(statement.indexOf('>'), 0) || Math.max(statement.indexOf('='), 0) || Math.max(statement.indexOf('~'), 0);
			let operator = statement.slice(operatorStartIndex, operatorStartIndex + 1);
			if (operator === '=') operator = '===';
			let property = statement.slice(0, operatorStartIndex).trim();
			let value = statement.slice(operatorStartIndex + 1).trim();
			if (property === 'socket') {
				if (['<', '>'].includes(operator)) {
					prematureError = true;
					return message.channel.send(`Invalid operator in \`${statement}\``);
				}
				if (operator === '~') return filters.push(`cpu[1].socket.toLowerCase().startsWith('${value.toLowerCase().slice(0, value.indexOf(/[0-9]/) ? value.indexOf(/[0-9]/) : value.indexOf(' ') ? value.indexOf(' ') : value.length)}')`);
				if (operator === '===') return filters.push(`cpu[1].socket.toLowerCase()==='${value.toLowerCase()}'`);
			}
			if (operator === '~') filters.push('cpu[1].' + property + '>=' + (value * 0.8) + '&&cpu[1].' + property + '<=' + (value * 1.2));
			else filters.push('cpu[1].' + property + operator + value);
		}
	});
	Object.entries(client.cpulist[manufacturer]).forEach(cpu => {
		if (!cpu[1].name) return;
		if (nameSearch) {
			if (cpu[1].name.toLowerCase().replace(/ /g, '-').includes(nameSearch)) {
				matches.set(cpu[0], nameSearch.length / cpu[1].name.length);
			} else {
				matches.set(cpu[0], false);
			}
		} else {
			matches.set(cpu[0], 1);
		}
		if (!filters.every((x, i) => {
			try {
				return eval(x);
			} catch (error) {
				if (!prematureError) {
					prematureError = true;
					let errorSearchFilter;
					if (nameSearch) errorSearchFilter = search[i + 1];
					else errorSearchFilter = search[i];
					message.channel.send(`Invalid property, operator or value in \`${errorSearchFilter.trim()}\``);
				}
				return false;
			}
		})) {
			matches.set(cpu[0], false);
		}
	});
	if (prematureError) return;
	if (matches.filter(x => x).size === 0) return message.channel.send('That query returned `0` results!');
	if (oneResult) {
		const cpu = client.cpulist[manufacturer][matches.filter(x => x).sort((a, b) => b - a).firstKey()];
		message.channel.send(client.cpuEmbed(client, { cpu, manufacturer, color }));
	} else {
		const limit = 200;
		const bestMatches = nameSearch ? matches.filter(x => x).sort((a, b) => b - a).firstKey(limit) : matches.filter(x => x).keyArray().sort().slice(0, limit);
		let text = ['']
		bestMatches.forEach((x, i) => {
			const cpuName = `\`${i + 1}: ${client.cpulist[manufacturer][x].name}\`\n`;
			if (text[text.length - 1].length + cpuName.length <= 1024) text[text.length - 1] += cpuName;
			else text.push(cpuName);
		});
		const embed = new client.embed()
			.setTitle('Choose CPU')
			.setDescription(`Your search returned many CPUs. ${multipleResponseAsk ? 'Respond with the corresponding number to learn more about a specific cpu.' : 'Here is a list of them.'}`)
			.setFooter(matches.filter(x => x).size > limit ? 'Showing ' + limit + ' best matches of ' + matches.filter(x => x).size + ' total matches.' : 'Showing all ' + matches.filter(x => x).size + ' matches.').setColor(color)
		text.forEach((x, i) => {
			embed.addField('Page ' + (i + 1), x, true);
		});
		message.channel.send(embed).then(embedMessage => {
			if (!multipleResponseAsk) return;
			message.channel.awaitMessages(numberMessage => numberMessage.author.id === message.author.id, { max: 1, time: 40000, errors: ['time'] }).then(collected => {
				const index = parseInt(collected.first().content) - 1;
				if (!index) return message.channel.send('Invalid number.');
				const cpu = client.cpulist[manufacturer][bestMatches[index]];
				message.channel.send(client.cpuEmbed(client, {cpu, manufacturer, color}));
			}).catch(err => message.channel.send('You failed to respond with a number.'));
		});
	}
};