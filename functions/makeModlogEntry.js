module.exports = (data, client) => {
	const cancels = data.cancels ? client.punishments._content.find(x => x.id === data.cancels) : null;

	// format data into embed
	const embed = new client.embed()
		.setTitle(`${client.formatPunishmentType(data, client, cancels)} | Case #${data.id}`)
		.addField(':small_blue_diamond: User', `<@${data.member}> \`${data.member}\``, true)
		.addField(':small_blue_diamond: Moderator', `<@${data.moderator}> \`${data.moderator}\``, true)
		.addField('\u200b', '\u200b', true)
		.addField(':small_blue_diamond: Reason', `\`${data.reason || 'unspecified'}\``, true)
		.setColor(client.embedColor)
		.setTimestamp(data.time)
	if (data.duration) {
		embed
			.addField(':small_blue_diamond: Duration', client.formatTime(data.duration, 100), true)
			.addField('\u200b', '\u200b', true)
	}
	if (data.cancels) embed.addField(':small_blue_diamond: Overwrites', `This case overwrites Case #${cancels.id} \`${cancels.reason}\``);

	// send embed in modlog channel
	client.channels.cache.get(client.config.mainServer.channels.modlog).send(embed);
};