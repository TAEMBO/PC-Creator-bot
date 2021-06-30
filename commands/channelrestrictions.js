module.exports = {
	run: (client, message, args) => {
		// the permission code
		if (!client.hasModPerms(client, message.member)) return message.channel.send(`You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command`);

		// permission code location 1; peasants cant use this command at all
		
		if (args[1]) {
			if (args[1] === 'categorynames') {
				const embed = new client.embed()
				.setTitle('Acceptable command category names')
				.setDescription(client.categoryNames.join(', '))
				.setColor(client.embedColor)
				return message.channel.send(embed);
			} else {
				if (!message.mentions.channels.first()) return message.channel.send('You must mention a channel.');
				const channelId = message.mentions.channels.first().id;
				if (args[2]) {

					// permission code location 2; peasants can view active restrictions and acceptable category names, but cannot modify anything

					if (!client.categoryNames.some(x => args.slice(2).join(' ').toLowerCase() === x.toLowerCase())) return message.channel.send('You must enter an acceptable category name.');
					
					if (client.channelRestrictions._content[channelId]?.some(x => x.toLowerCase() === args.slice(2).join(' ').toLowerCase())) {
						const removed = client.channelRestrictions._content[channelId].splice(client.channelRestrictions._content[channelId].map(x => x.toLowerCase()).indexOf(args.slice(2).join(' ').toLowerCase()), 1)[0];
						if (client.channelRestrictions._content[channelId].length === 0) delete client.channelRestrictions._content[channelId];
						client.channelRestrictions.forceSave();
						return message.channel.send(`Successfully removed restriction of ${removed} commands in <#${channelId}>`);
					} else {
						const added = client.categoryNames.find(x => x.toLowerCase() === args.slice(2).join(' ').toLowerCase());
						if (client.channelRestrictions._content[channelId]) client.channelRestrictions._content[channelId].push(added);
						else client.channelRestrictions._content[channelId] = [added];
						client.channelRestrictions.forceSave();
						return message.channel.send(`Successfully added restriction of ${added} commands in <#${channelId}>`);
					}
				} else {
					const embed = new client.embed()
						.setTitle('Active channel restrictions')
						.setDescription(`<#${channelId}>\n\`\`\`\n` + (client.channelRestrictions._content[channelId] ? client.channelRestrictions._content[channelId].map(x => `    ❌ ${x}`).join('\n') : 'No active restrictions') + '\n\`\`\`')
						.setColor(client.embedColor)
					return message.channel.send(embed);
				}
			}
		} else {
			const embed = new client.embed()
				.setTitle('Active channel restrictions')
				.setDescription(Object.entries(client.channelRestrictions._content).map(restrictions => `<#${restrictions[0]}>\n\`\`\`\n` + restrictions[1].map(x => `    ❌ ${x}`).join('\n') + '\n\`\`\`'))
				.setColor(client.embedColor)
			if (embed.description.length === 0) embed.setDescription('None');
			message.channel.send(embed);
		}
	},
	name: 'channelrestrictions',
	alias: ['cr'],
	description: 'Toggle or view restrictions of entire categories of commands from being used in a text channel. Restrictions are overridden by moderators and members who have the Level 3 role. Only moderators are allowed to edit channel restrictions.\n\nUsage:\nDon\'t add anything for a complete list of active restrictions.\nAdd a channel mention to view active restrictions for that channel.\nAdd "categorynames" to view a list of acceptable category names.\nAdd a channel mention and category name to toggle the restriction of that category in that channel.',
	shortDescription: 'Toggle channel-specific command usage restrictions.',
	usage: ['?channel mention / "categorynames"', '?category name'],
	category: 'Moderation'
};