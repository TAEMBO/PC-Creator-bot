module.exports = {
	run: async (client, message, args) => {
		const member = args[1] ? message.mentions.members?.first() || (await client.getMember(message.guild, args[1]).catch(() => { })) : message.member;
		if (!member) return message.channel.send('You failed to mention a user from this server.');
		const age = member.joinedTimestamp < Date.now() - client.userLevels._requirements.age;
		const messages = client.userLevels.getEligible(member.user.id);
		const role = message.guild.roles.cache.get(client.config.mainServer.roles.levelOne);
		if (age && messages) {
			if (member.roles.cache.has(role.id)) return message.channel.send(`${member.user.id === message.author.id ? 'You' : 'They'} already have the **${role.name}** role.`);
			await message.channel.send(`${member.user.id === message.author.id ? 'You' : 'They'}\'re eligible for access to the **${role.name}** role.`);
			if (message.author.id === member.user.id) {
				await member.roles.add(role.id);
				message.channel.send(`You\'ve received the **${role.name}** role. You can now access <#${client.config.mainServer.channels.betterGeneral}>`);
			}
		} else {
			message.channel.send(`${member.user.id === message.author.id ? 'You' : 'They'}\'re not eligible for access to the **${role.name}** role. Progress:\n${messages ? ':white_check_mark:' : ':x:'} ${client.userLevels.getUser(member.user.id)}/${client.userLevels._requirements.messages} messages\n${age ? ':white_check_mark:' : ':x:'} ${Math.floor((Date.now() - member.joinedTimestamp) / 1000 / 60 / 60 / 24)}d/${Math.floor(client.userLevels._requirements.age / 1000 / 60 / 60 / 24)}d time on server.`);
		}
	},
	name: 'applyforbetterchat',
	description: 'Check your eligibility for access to the Level 1 role.',
	alias: ['afbc'],
	category: 'Moderation'
};