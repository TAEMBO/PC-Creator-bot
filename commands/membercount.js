module.exports = {
	run: async (client, message, args) => {
		if (client.memberCount_LastGuildFetchTimestamp < Date.now() - 60000) {
			await message.guild.fetch();
			client.memberCount_LastGuildFetchTimestamp = Date.now();
		}
		message.channel.send(`**${message.guild.name}** has **${message.guild.approximateMemberCount.toLocaleString()}** members.`);
	},
	name: 'membercount',
	description: 'Displays the amount of members on this server'
};