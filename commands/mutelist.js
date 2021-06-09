module.exports = {
	run: async (client, message, args) => {
		if (!client.hasModPerms(client, message.member)) return message.channel.send(`You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command`);
		if (args[1]) {
			const member = message.mentions.members?.first() || (await client.getMember(message.guild, args[1]).catch(() => undefined));
			if (!member) return message.channel.send('You failed to mention a member.');
			const mute = client.mutes._content[member.user.id];
			const embed = new client.embed()
				.setTitle('Muted User')
				.setColor(client.embedColor)
				.addField('User', `${member.toString()} ${member.user.tag} (${member.user.id})`)
				.addField('Time left', typeof mute.time === 'number' ? client.formatTime(mute.time - Date.now(), 2, { longNames: true, commas: true }) : 'Forever')
				.addField('Reason', mute.reason)
			return message.channel.send(embed);
		}
		const embed = new client.embed()
			.setTitle('Muted Users (only ones muted with `' + client.prefix + 'mute`)')
			.setColor(client.embedColor)
		if (Object.keys(client.mutes._content).length === 0) {
			embed.setDescription('Nobody is currently muted.')
			return message.channel.send(embed);
		}
		const tableData = Object.entries(client.mutes._content).map(x => {
			return [
				x[0],
				typeof x[1].time === 'number' ? client.formatTime(x[1].time - Date.now()) : 'Forever',
				x[1].reason.length > 18 ? x[1].reason.slice(0, 15) + '...' : x[1].reason
			]
		}).sort((a, b) => a[0] > b[0]);
		const tableText = client.createTable(['User', 'Time left', 'Reason'], tableData, {
			columnAlign: ['left', 'middle', 'left'],
			columnSeparator: ['|', '|', '|']
		}, client);
		embed.setDescription(`\`\`\`\n${tableText}\n\`\`\``);
		message.channel.send(embed);
	},
	name: 'mutelist',
	category: 'Moderation',
	description: 'Information about muted users.',
	usage: ['?userID / mention']
};