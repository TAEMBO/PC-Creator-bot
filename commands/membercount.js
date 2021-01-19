module.exports = {
	run: async (client, message, args) => {
		await message.guild.fetch();
		if (args[1] === 'debug') {
			message.channel.send(`guild was just fetched\nguild name: ${message.guild.name}\nguild membercount: ${message.guild.memberCount}\napprx. member count: ${message.guild.approximateMemberCount}`)
		} else {
			message.channel.send(`**${message.guild.name}** has **${message.guild.memberCount.toLocaleString()}** members.`)
		}
	},
	name: 'membercount'
};