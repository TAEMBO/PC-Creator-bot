module.exports = {
	run: async (client, message, args) => {
		if (!message.member.roles.cache.has(client.config.moderatorRole)) return message.channel.send(`You need the **${message.guild.roles.cache.get(client.config.moderatorRole).name}** role to use this command`);
		let member;
		let timedOut = false;
		if (args[1]) member = message.mentions.members?.first() || (await message.guild.members.fetch(args[1]).catch(() => undefined));
		if (!member) {
			await message.channel.send('Which member would you like to add this role to? Reply with a mention or a user ID.').then(async x => {
				await message.channel.awaitMessages(y => y.author.id === message.author.id, { time: 15000, errors: ['time', 'maxProcessed'], maxProcessed: 1}).then(async z => {
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
		const role = message.guild.roles.cache.find(role => role.id === client.config.proplayerRole);
		if (!role) message.channel.send('Indicated role does not exist');
		if (member.roles.cache.has(role.id)) return message.channel.send(`Cannot add role **${role.name}** to **${member.user.tag}** because they already have it.`);
		member.roles.add(role, `Command done by @${message.author.tag} (${message.author.id})`).then(() => {
			message.channel.send(`Added role **${role.name}** to **${member.user.tag}**`);
		}).catch(() => {
			message.channel.send('Failed.')
		});
	},
	name: 'proplayerroleadd',
	usage: ['Mention / User ID'],
	alias: ['ppra'],
	description: 'Add the Pro Player role to someone',
	category: 'Moderation'
};