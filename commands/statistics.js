module.exports = {
	run: (client, message, args) => {
		const colunms = ['Command Name', 'Count'];
		const includedCommands = client.commands.filter(x => x.uses).sort((a, b) => b.uses - a.uses);
		if (includedCommands.size === 0) return message.channel.send('No commands have been used yet.'); 
		const nameLength = Math.max(...includedCommands.map(x => x.name.length), colunms[0].length) + 2;
		const amountLength = Math.max(...includedCommands.map(x => x.uses.toString().length), colunms[1].length) + 1;
		const rows = [`${colunms[0] + ' '.repeat(nameLength - colunms[0].length)}|${' '.repeat(amountLength - colunms[1].length) + colunms[1]}\n`, '-'.repeat(nameLength) + '-'.repeat(amountLength) + '\n'];
		includedCommands.forEach(command => {
			const name = command.name;
			const count = command.uses.toString();
			rows.push(`${name + '.'.repeat(nameLength - name.length)}${'.'.repeat(amountLength - count.length) + count}\n`);
		});
		const embed = new client.embed()
			.setTitle('Statistics: Command Usage')
			.setDescription('List of commands that have been used in this session, ordered by amount of uses. Table contains command name and amount of uses.')
			.setColor(3971825)
		if (rows.join('').length > 2048) {
			let fieldValue = '';
			rows.forEach(row => {
				if (fieldValue.length + row.length > 1024) {
					embed.addField('\u200b', '```\n' + fieldValue + '```');
					fieldValue = row;
				} else {
					fieldValue += row
				}
			});
			embed.addField('\u200b', '```\n' + fieldValue + '```');
		} else {
			embed.addField('\u200b', '```\n' + rows.join('') + '```');
		}
		message.channel.send(embed);
	},
	name: 'statistics',
	description: 'See a list of commands ordered by usage',
	alias: ['stats', 'cmdusage']
};