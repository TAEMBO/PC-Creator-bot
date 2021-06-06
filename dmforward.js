module.exports = async (message, client) => {
	if (client.dmForwardBlacklist._content.includes(message.author.id) || message.author.bot) return;
	if (client.games.some(x => x === message.author.tag)) return;
	const channel = client.channels.cache.get(client.config.mainServer.channels.dmForwardChannel);
	const pcCreatorServer = client.guilds.cache.get(client.config.mainServer.id);
	const guildMemberObject = (await pcCreatorServer.members.fetch(message.author.id));
	const memberOfPccs = !!guildMemberObject;
	const embed = new client.embed()
		.setTitle('Forwarded DM Message')
		.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.avatarURL({ format: 'png', dynamic: true, size: 256 }))
		.setColor(3971825)
		.addField('Message Content', message.content.length > 1024 ? message.content.slice(1021) + '...' : message.content + '\u200b')
		.setTimestamp(Date.now());
	let messageAttachmentsText = '';
	message.attachments.forEach(attachment => {
		if (!embed.image && ['png', 'jpg', 'webp', 'gif', 'jpeg'].some(x => attachment.name.endsWith(x))) embed.setImage(attachment.url);
		else messageAttachmentsText += `[${attachment.name}](${attachment.url})\n`;
	});
	if (messageAttachmentsText.length > 0) embed.addField('Message Attachments', messageAttachmentsText.trim());
	embed
		.addField('User', `<@${message.author.id}>`)
		.addField('Connections', `:small_blue_diamond: Message sender **${memberOfPccs ? 'is' : ' is not'}** on the **${pcCreatorServer.name}** Discord server${memberOfPccs ? `\n:small_blue_diamond: Roles on the PC Creator server: ${guildMemberObject.roles.cache.filter(x => x.id !== pcCreatorServer.roles.everyone.id).map(x => '**' + x.name + '**').join(', ')}` : ''}`)
	channel.send(embed)
	channel.send(client.config.eval.whitelist.map(x => `<@${x}>`).join(', '));
};