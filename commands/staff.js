module.exports = {
    run: async (client, message, args) => {
		if (message.guild.id !== client.config.mainServer.id) return message.channel.send(`\`${client.prefix}staff\` doesn't work in this server.`);
		const staff = new Map(Object.entries({
			administrator: message.guild.roles.cache.get(client.config.mainServer.roles.administrator),
			moderator: message.guild.roles.cache.get(client.config.mainServer.roles.moderator)
		}));
		let desc = '';
		staff.forEach((role, key) => {
			const members = role.members.filter(x => {
				// a boolean, that is true if all array elements are truthy
				/* const others = [
					// if role is moderator and user also has admin, dont include user under moderator
					key === 'moderator' ? !x.roles.cache.has(client.config.mainServer.roles.administrator) : true,
				].every(x => !!x === true); */
			});
			if (members.size > 0) desc += '**' + role.toString() + '**\n' + members.map(x => x.toString()).join('\n') + '\n\n';
			if (key === 'moderator') desc += `If you want to report someone or need any other moderation help, feel free to message anyone of these people.\n\n`;
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