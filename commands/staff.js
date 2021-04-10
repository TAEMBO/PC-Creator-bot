module.exports = {
    run: async (client, message, args) => {
		console.log('staff command used');
		const staff = new Map(Object.entries({
			administrator: message.guild.roles.cache.get(client.config.mainServer.roles.administrator),
			moderator: message.guild.roles.cache.get(client.config.mainServer.roles.moderator),
			trialmoderator: message.guild.roles.cache.get(client.config.mainServer.roles.trialmoderator),
			helper: message.guild.roles.cache.get(client.config.mainServer.roles.helper),
		}));
		const guildMembers = await message.guild.members.fetch()
		const nonDevs = guildMembers.filter(x => !x.roles.cache.has(client.config.mainServer.roles.developer));
		let desc = '';
		console.log('guildmembers size', guildMembers.size, 'non devs size', nonDevs.size);
		staff.forEach((role, key) => {
			const members = nonDevs.filter(x => x.roles.cache.has(role.id));
			if (members.size > 0) desc += '**' + role.toString() + '**\n' + members.map(x => x.toString()).join('\n') + '\n\n';
			if (key === 'trialmoderator') desc += 'If you want to report someone or need any other moderation help, feel free to message anyone of these people.\n\n';
			if (key === 'helper') desc += `If you have a question with the game, you are open to ping or message a ${role.toString()} to receive help.\n\n`;
		});
		console.log('desc', desc);
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