module.exports = {
	run: async (client, message, args) => {
		if (!client.hasModPerms(client, message.member)) return message.channel.send(`You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command`);
		let member;
		if (args[1]) member = message.mentions.members?.first() || (await client.getMember(message.guild, args[1]).catch(() => undefined));
		if (!member) {
			await message.channel.send('Which member would you like to unmute? Reply with a mention or a user ID.').then(async x => {
				member = await message.channel.awaitMessages(y => y.author.id === message.author.id, { time: 15000, errors: ['time'], max: 1 }).then(async z => {
					return z.first().mentions.members?.first() || (await message.guild.members.fetch(z.first().content).catch(() => undefined));
				}).catch(async () => {
					message.channel.send('Command cancelled after 15 seconds of inactivity.');
					return 'timedout';
				});
			});
		}
		if (member === 'timedout') return;
		else if (!member) return message.channel.send('You failed to mention a member.');
		const unmuteResult = await client.unmuteMember(client, member);
		message.channel.send(unmuteResult.text);
	},
	name: 'unmute',
	alias: ['removemute'],
	usage: ['mention / user id'],
	description: 'Remove a mute from someone.',
	category: 'Moderation'
};