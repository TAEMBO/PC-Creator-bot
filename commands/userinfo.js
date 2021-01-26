module.exports = {
	run: async (client, message, args) => {
		const member = message.mentions.members?.first() || (await message.guild.members.fetch(args[1]).catch(() => undefined));
		if (!member) return message.channel.send('You failed to mention a user from this server.');
		const embed = new client.embed()
			.setTitle(`Userinfo: ${member.user.tag}`)
			.addField(':small_blue_diamond: Account Creation Date', `${member.user.createdAt.getUTCFullYear()}-${('0' + (member.user.createdAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.user.createdAt.getUTCDate()).slice(-2)} (YYYY-MM-DD)`)
			.addField(':small_blue_diamond: Join Date', `${member.joinedAt.getUTCFullYear()}-${('0' + (member.joinedAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.joinedAt.getUTCDate()).slice(-2)} (YYYY-MM-DD)`)
			.addField(':small_blue_diamond: ID, Nickname and Tag', `ID: ${member.user.id}\nNickname: ${member.nickname ? member.nickname : 'None'}\nTag: ${member.user.tag}`)
			.setColor(3971825)
			.setThumbnail(member.user.avatarURL({ format: 'png', dynamic: true, size: 2048}))
		message.channel.send(embed);
	},
	name: 'userinfo',
	usage: ['Mention / User ID'],
	alias: ['memberinfo'],
	description: 'Info about a Discord member',
};