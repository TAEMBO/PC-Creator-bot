module.exports = {
    run: (client, message, args) => {
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
        /*message.channel.send({embed: {
			"title": "__Commands__",
			"description": "\n``,ping`` - \n``,staff`` - \n``,virus`` - \n``,socket`` - \n``,games`` - \n``,items`` - \n``,scores cpu`` - \n``,scores ram`` - Provides a picture of the RAM spreadsheet\n``,scores gpu`` - Provides a picture of the GPU spreadsheet\n``,drive`` - \n``,aio`` - \n``,macos`` - \n``,gaming`` - \n``,record`` - \n``,main`` - \n``,overclocking`` - ",
			"color": 3971825}});*/
    },
	name: 'help',
	description: 'Info about command and their usage'
};