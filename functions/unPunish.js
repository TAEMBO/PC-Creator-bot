// function used by ,unban, ,unmute and ,unwarn
// takes case id, removes it from json
// if its a mute or ban, remove muted role from punishment.member or unban member
module.exports = async (client, message, args, type) => {
	if (!client.hasModPerms(client, message.member)) return message.channel.send(`You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command.`);
	let punishment;
	if (args[1]) punishment = client.punishments._content.find(x => x.id == args[1])
	if (!punishment) {
		await message.channel.send(`Which punishment would you like to remove? Reply with a Case #. (30s)`).then(async x => {
			punishment = await message.channel.awaitMessages(y => y.author.id === message.author.id, { time: 30000, errors: ['time'], max: 1 }).then(async z => {
				return client.punishments._content.find(x => x.id == z.first()?.content);
			}).catch(async () => {
				message.channel.send('Command cancelled after 30 seconds of inactivity.');
				return 'timedout';
			});
		});
	}
	if (punishment === 'timedout') return;
	else if (!punishment) return message.channel.send('You failed to mention a Case #.');
	let reason;
	if (args[2]) {
		reason = args.slice(2).join(' ');
	} else {
		await message.channel.send(`Reply with a reason for this ${punishment.type} removal. Reply "-" to leave the reason unspecified. (30s)`);
		reason = await message.channel.awaitMessages(x => x.author.id === message.author.id, { time: 30000, errors: ['time'], max: 1 }).then(collected => collected.first()?.content === '-' ? undefined : collected.first()?.content).catch(() => 0);
		if (reason === 0) return message.channel.send('Invalid reason.');
	}
	const unpunishResult = await client.punishments.removePunishment(punishment.id, message.author.id, reason);
	message.channel.send(unpunishResult);
};