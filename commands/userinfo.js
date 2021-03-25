module.exports = {
	run: async (client, message, args) => {
		const member = args[1] ? message.mentions.members?.first() || (await client.getMember(message.guild, args[1]).catch(() => {})) : message.member;
		if (!member) return message.channel.send('You failed to mention a user from this server.');
		const embed = new client.embed()
			.setTitle(`User info: ${member.user.tag}`)
			.addField(':small_blue_diamond: Account Creation Date', `${member.user.createdAt.getUTCFullYear()}-${('0' + (member.user.createdAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.user.createdAt.getUTCDate()).slice(-2)} (YYYY-MM-DD)`)
			.addField(':small_blue_diamond: Join Date', `${member.joinedAt.getUTCFullYear()}-${('0' + (member.joinedAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.joinedAt.getUTCDate()).slice(-2)} (YYYY-MM-DD)`)
			.addField(':small_blue_diamond: ID, Nickname, and Mention', `ID: ${member.user.id}\nNickname: ${member.nickname ? member.nickname : 'None'}\nMention: ${member.toString()}`)
			.addField(':small_blue_diamond: Roles', member.roles.cache.size > 1 ? member.roles.cache.filter(x => x.id !== message.guild.roles.everyone.id).sort((a, b) => b.position - a.position).map(x => x.name).join('\n').slice(0, 1024) : 'None')
			.setColor(member.displayColor || '#fefefe')
			.setThumbnail(member.user.avatarURL({ format: 'png', dynamic: true, size: 2048}))
		message.channel.send(embed);
	},
	name: 'userinfo',
	usage: ['Mention / User ID'],
	alias: ['memberinfo', 'user', 'whois'],
	description: 'Info about a Discord member',
	cooldown: 15
};