module.exports = {
    run: (client, message, args) => {
		let commandFile;
		if (args[1]) {
			commandFile = client.commands.find(x => x.name === args[1] || x.alias?.includes(args[1]));
		}
		if (commandFile) {
			const embed = new client.embed()
				.setTitle('__Commands: ' + commandFile.name[0].toUpperCase() + commandFile.name.slice(1) + '__')
				.setColor(3971825)
				.setDescription(`:small_blue_diamond: \`${client.prefix}${commandFile.name}${commandFile.usage ? ' [' + commandFile.usage.join('] [') + ']' : ''}\`${commandFile.description ? '\n\n' + commandFile.description : ''}${commandFile.alias ? '\n\nAliases: ' + commandFile.alias.map(x => '`' + x + '`').join(', ') : ''}\n\nCategory: ${commandFile.category ? commandFile.category : 'Misc'}`);
			message.channel.send(embed)
		} else {
			const embed = new client.embed()
				.setTitle('__Commands__')
				.setColor(3971825);
			let text = { Misc: '' };
			client.commands.filter(x => !x.hidden).forEach(command => {
				let desc = `:small_blue_diamond: \`${client.prefix}${command.name}${command.usage ? ' [' + command.usage.join('] [') + ']' : ''}\`${command.description ? '\n' + command.description : ''}${command.alias ? '\nAliases: ' + command.alias.map(x => '`' + x + '`').join(', ') : ''}`;
				if (command.category) {
					if (!text[command.category]) text[command.category] = '';
					text[command.category] += desc + '\n';
				} else {
					text.Misc += desc + '\n';
				}
			});
			Object.keys(text).sort().forEach(ctgr => {
				embed.addField(ctgr, text[ctgr], true);
			});
			message.channel.send(embed);
		}
    },
	name: 'help',
	description: 'Info about commands and their usage',
	usage: ['Command']
};