module.exports = async (client, message, args, type) => {
	if (message.guild.id !== client.config.mainServer.id) return message.channel.send('this command doesnt work in this server');
	if (!client.hasModPerms(client, message.member)) return message.channel.send(`You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command.`);
	let member;
	if (args[1]) member = message.mentions.members?.first() || (await client.getMember(message.guild, args[1]).catch(() => undefined));
	if (!member) {
		await message.channel.send(`Which member would you like to ${type}? Reply with a mention or a user ID. (30s)`).then(async x => {
			member = await message.channel.awaitMessages(y => y.author.id === message.author.id, { time: 30000, errors: ['time'], max: 1 }).then(async z => {
				return z.first().mentions.members?.first() || (await message.guild.members.fetch(z.first().content).catch(() => undefined));
			}).catch(async () => {
				message.channel.send('Command cancelled after 30 seconds of inactivity.');
				return 'timedout';
			});
		});
	}
	if (member === 'timedout') return;
	else if (!member) return message.channel.send('You failed to mention a member.');
	let time;
	let reason;
	if (args[2]) {
		// if the first character of args 2 is a number, args 2 is the time. otherwise its the reason
		time = (args[2][0].match(/[0-9]/) && !['softban', 'kick', 'warn'].includes(type)) ? args[2] : undefined;
		// if time is in args 2, reason starts at args 3. if no time was provided, reason starts at args 2
		reason = args.slice(time ? 3 : 2).join(' ');
	} else {
		if (!['softban', 'kick', 'warn'].includes(type)) {
			await message.channel.send(`How long do you want to ${type} this user for? Reply with a time name, or "forever" to ${type} this user forever. (30s)`);
			time = await message.channel.awaitMessages(x => x.author.id === message.author.id, { time: 30000, errors: ['time'], max: 1 }).then(collected => collected.first()?.content.toLowerCase() === 'forever' ? 'inf' : collected.first()?.content).catch(() => 0);
			if (time === 0) return message.channel.send('Invalid time.');
		}
		await message.channel.send(`Reply with a reason for this ${type}. Reply "-" to leave the reason unspecified. (30s)`);
		reason = await message.channel.awaitMessages(x => x.author.id === message.author.id, { time: 30000, errors: ['time'], max: 1 }).then(collected => collected.first()?.content === '-' ? undefined : collected.first()?.content).catch(() => 0);
		if (reason === 0) return message.channel.send('Invalid reason.');
	}
	const punishmentResult = await client.punishments.addPunishment(type, member, { time, reason }, message.author.id);
	message.channel.send(punishmentResult);
};