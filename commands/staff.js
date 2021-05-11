module.exports = {
    run: async (client, message, args) => {
		if (message.guild.id !== client.config.mainServer.id) return message.channel.send(`\`${client.prefix}staff\` doesn't work in this server.`);
		const staff = new Map(Object.entries({
			administrator: message.guild.roles.cache.get(client.config.mainServer.roles.administrator),
			moderator: message.guild.roles.cache.get(client.config.mainServer.roles.moderator),
			trialmoderator: message.guild.roles.cache.get(client.config.mainServer.roles.trialmoderator),
			helper: message.guild.roles.cache.get(client.config.mainServer.roles.helper),
		}));
		let desc = '';
		staff.forEach((role, key) => {
			const members = role.members.filter(x => !x.roles.cache.has(client.config.mainServer.roles.developer));
			if (members.size > 0) desc += '**' + role.toString() + '**\n' + members.map(x => x.toString()).join('\n') + '\n\n';
			if (key === 'trialmoderator') desc += `If you want to report someone or need any other moderation help, feel free to message anyone of these people. <@837407028665254028> (ModMail) can also be used to report someone.\n\n`;
			if (key === 'helper') desc += `If you have a question with the game, you are open to ping or message a ${role.toString()} to receive help.\n\n`;
		});
		const embed = new client.embed()
			.setTitle('__Staff Members__')
			.setDescription(desc)
			.setColor(3971825)
			.setFooter('Some users are not displayed here because their activity on Discord is not moderation-oriented.')
		message.channel.send(embed);
    },
	name: 'staff',
	description: 'Shows all the current staff members',
	cooldown: 10
};