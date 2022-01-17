module.exports = {
	run: async (client, message, args) => {
		const member = args[1] ? message.mentions.members?.first() || (await client.getMember(message.guild, args.slice(1).join(' ')).catch(() => undefined)) : message.member;
		if (!member) return message.channel.send('You failed to mention a user from this server.');
		const embed = new client.embed()
			.setTitle(`User info: ${member.user.tag}`)
			.addField(':small_blue_diamond: Account Creation Date', `${member.user.createdAt.getUTCFullYear()}-${('0' + (member.user.createdAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.user.createdAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.user.createdTimestamp, 1, { longNames: true })} ago`)
			.addField(':small_blue_diamond: Join Date', `${member.joinedAt.getUTCFullYear()}-${('0' + (member.joinedAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.joinedAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.joinedTimestamp, 1, { longNames: true })} ago`)
			.addField(':small_blue_diamond: ID, Nickname, and Mention', `ID: ${member.user.id}\nNickname: ${member.nickname ? member.nickname : 'None'}\nMention: ${member.toString()}`)
			.addField(':small_blue_diamond: Roles', member.roles.cache.size > 1 ? member.roles.cache.filter(x => x.id !== message.guild.roles.everyone.id).sort((a, b) => b.position - a.position).map(x => x).join(member.roles.cache.size > 4 ? ' ' : '\n').slice(0, 1024) : 'None')
			.setColor(member.displayColor || '#fefefe')
			.setImage(member.user.avatarURL({ format: 'png', dynamic: true, size: 2048}) || member.user.defaultAvatarURL)
		message.channel.send({embeds: [embed]}).catch((err)=>{message.channel.send({content: 'something went wrong'})});
	},
	name: 'userinfo',
	usage: ['mention / user id / username'],
	alias: ['memberinfo', 'user', 'whois'],
	description: 'Info about a Discord member.',
	cooldown: 15
};