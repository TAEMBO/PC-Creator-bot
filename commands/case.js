module.exports = {
	run: (client, message, args) => {
		if (!client.hasModPerms(client, message.member)) return message.channel.send(`You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command`);
		const caseid = parseInt(args[1]);
		if (!caseid) return message.channel.send('Invalid case #.');
		const punishment = client.punishments._content.find(x => x.id === caseid);
		if (!punishment) return message.channel.send('Invalid case #.');
		const cancelledBy = punishment.expired ? client.punishments._content.find(x => x.cancels === punishment.id) : null;
		const embed = new client.embed()
			.setTitle(`${punishment.type[0].toUpperCase() + punishment.type.slice(1)} | Case #${punishment.id}`)
			.addField(':small_blue_diamond: User', `<@${punishment.member}> \`${punishment.member}\``, true)
			.addField(':small_blue_diamond: Moderator', `<@${punishment.moderator}> \`${punishment.moderator}\``, true)
			.addField('\u200b', '\u200b', true)
			.addField(':small_blue_diamond: Reason', punishment.reason || 'unspecified', true)
			.setColor(client.embedColor)
			.setTimestamp(punishment.time)
		if (punishment.duration) {
			embed
				.addField(':small_blue_diamond: Duration', client.formatTime(punishment.duration, 100), true)
				.addField('\u200b', '\u200b', true)
		}
		if (punishment.expired) embed.addField(':small_blue_diamond: Expired', `This case has been overwritten by Case #${cancelledBy.id} for reason \`${cancelledBy.reason}\``)
		message.channel.send(embed);
	},
	name: 'case',
	description: 'Get information about a punishment case.',
	usage: ['case #'],
	category: 'Moderation',
};