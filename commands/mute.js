module.exports = {
	run: async (client, message, args) => {
		if (!client.hasModPerms(client, message.member)) return message.channel.send(`You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command`);
		let member;
		let timedOut = false;
		if (args[1]) member = message.mentions.members?.first() || (await client.getMember(message.guild, args.slice(1).join(' ')).catch(() => undefined));
		if (!member) {
			await message.channel.send('Which member would you like to mute? Reply with a mention or a user ID.').then(async x => {
				await message.channel.awaitMessages(y => y.author.id === message.author.id, { time: 15000, errors: ['time', 'maxProcessed'], maxProcessed: 1 }).then(async z => {
					member = z.first().mentions.members?.first() || (await message.guild.members.fetch(z.first().content).catch(() => undefined));
				}).catch(async () => {
					await message.channel.send('Command cancelled after 15 seconds of inactivity.');
					timedOut = true;
				});
			});
		}
		if (!member && !timedOut) {
			return message.channel.send('You failed to mention a member.');
		} else if (!member && timedOut) return;
		const role = message.guild.roles.cache.find(role => role.id === client.config.mainServer.roles.muted);
		if (!role) return message.channel.send('Indicated role does not exist');
		if (member.roles.cache.has(role.id)) return message.channel.send(`Cannot mute ${member.user.tag} because they are already muted.`);
		member.roles.add(role, `Mute command done by @${message.author.tag} (${message.author.id})`).then(() => {
			message.channel.send(`Muted ${member.user.tag}`);
		}).catch(() => {
			message.channel.send('Failed.')
		});
	},
	name: 'mute',
	usage: ['Mention / User ID'],
	description: 'Add a mute to someone',
	category: 'Moderation'
};