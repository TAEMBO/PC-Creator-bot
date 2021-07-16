function displayCr(channels = [], client) {
	// channels is an array of channel ids
	// returns an embed description
	let description = '';
	if (channels.length > 1) { // if user wants more than 1 channel displayed
		// loop through all channels and map their active restrictions
		channels = channels.map(channelId => [channelId, client.channelRestrictions._content[channelId]]);
		
		channels.forEach(channel => {
			// find identicals
			const identicals = channels.filter(candidateIdentical => {
				return candidateIdentical[1].every(candidateIdenticalRestriction => channel[1].includes(candidateIdenticalRestriction)) && channel[1].every(activeRestriction => candidateIdentical[1].includes(activeRestriction))
			});
			if (identicals.length === 0) return;
			// if there are no identicals, identicals will only contain this 1 channel

			// add channel mentions
			description += identicals.map(x => `<#${x[0]}>`).join(', ');
			// begin restrictions
			description += '\n\`\`\`\n';
			// restrictions
			description += channel[1].map(restriction => `    ❌ ${restriction}`).join('\n')
			// end restrictions
			description += '\n\`\`\`\n';

			// if there are identicals, remove them from the queue
			channels = channels.filter(ch => !identicals.some(x => x[0] === ch[0]));
		})
	} else if (channels.length === 1) {
		// find channel and its restrictions
		const channel = [channels[0], client.channelRestrictions._content[channels[0]]];

		// if channel has no restrictions
		if (!channel[1]) return description;

		// add channel mention
		description += `<#${channel[0]}>`;
		// begin restrictions
		description += '\n\`\`\`\n';
		// restrictions
		description += channel[1].map(restriction => `    ❌ ${restriction}`).join('\n')
		// end restrictions
		description += '\n\`\`\`\n';
	}
	return description;
}
module.exports = {
	run: (client, message, args) => {
		if (args[1]) {
			if (args[1] === 'categorynames') {
				const embed = new client.embed()
					.setTitle('Acceptable command and category names')
					.setDescription(client.categoryNames.join(', '))
					.setFooter('Or any bot command name.')
					.setColor(client.embedColor)
				return message.channel.send(embed);
			} else if (['how', 'why', 'what'].includes(args[1])) {
				const embed = new client.embed()
					.setTitle('Why can I not do bot commands?')
					.addField(':small_blue_diamond: The command you tried to do is restricted in this channel.', 'This is to reduce spam and clutter.')
					.addField(':small_blue_diamond: Try a different channel instead.', '<#748122380383027210> is a channel dedicated to using bot commands.')
					.addField(':small_blue_diamond: This phenomenom is called _channel restrictions._', `Moderators restrict certain categories of commands from being used in different channels. Active restrictions are available for everyone to see with \`${client.prefix}channelrestrictions\``)
					.setColor(client.embedColor)
				return message.channel.send(embed);
		 	} else {

				if (!message.mentions.channels.first()) return message.channel.send('You must mention a channel.');

				const channelId = message.mentions.channels.first().id;

				if (args[2]) {
					if (!client.hasModPerms(client, message.member)) return message.channel.send(`You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command`);

					let restrictionsForThisChannel = client.channelRestrictions._content[channelId];

					const categoryOrCommandName = args.slice(2).join(' ').toLowerCase();

					if (client.categoryNames.some(x => categoryOrCommandName === x.toLowerCase())) {
						// toggle categoryname
						if (restrictionsForThisChannel?.some(x => x.toLowerCase() === categoryOrCommandName)) {
							const removed = restrictionsForThisChannel.splice(restrictionsForThisChannel.map(x => x.toLowerCase()).indexOf(categoryOrCommandName), 1)[0];
							if (restrictionsForThisChannel.length === 0) client.channelRestrictions.removeData(channelId);
							client.channelRestrictions.forceSave();
							return message.channel.send(`Successfully removed restriction of ${removed} commands in <#${channelId}>`);
						} else {
							const added = client.categoryNames.find(x => x.toLowerCase() === categoryOrCommandName);
							if (restrictionsForThisChannel) restrictionsForThisChannel.push(added);
							else client.channelRestrictions._content[channelId] = [added];
							client.channelRestrictions.forceSave();
							return message.channel.send(`Successfully added restriction of ${added} commands in <#${channelId}>`);
						}
					} else if (client.commands.some(x => x.name === categoryOrCommandName)) {
						// categoryOrCommandName is a command

						const stringOfActiveCommandRestrictionsForThisChannel = restrictionsForThisChannel?.find(x => x.startsWith('commands:'));

						const activeCommandRestrictionsForThisChannel = stringOfActiveCommandRestrictionsForThisChannel?.slice(stringOfActiveCommandRestrictionsForThisChannel.indexOf(':') + 1)?.split(',');

						if (activeCommandRestrictionsForThisChannel?.includes(categoryOrCommandName)) {
							// this command is already restricted
							// unrestrict command
							
							const modifiedCommandRestrictions = activeCommandRestrictionsForThisChannel.filter(commandRestriction => commandRestriction !== categoryOrCommandName);
							
							const commandRestrictionsIndex = restrictionsForThisChannel.indexOf(stringOfActiveCommandRestrictionsForThisChannel);
							if (modifiedCommandRestrictions.length === 0) {
								restrictionsForThisChannel.splice(commandRestrictionsIndex, 1);
								if (restrictionsForThisChannel.length === 0) client.channelRestrictions.removeData(channelId);
							} else {
								restrictionsForThisChannel[commandRestrictionsIndex] = 'commands:' + modifiedCommandRestrictions.join(',');
							}

							client.channelRestrictions.forceSave();
							return message.channel.send(`Successfully removed restriction of \`${categoryOrCommandName}\` command in <#${channelId}>`);
						} else {
							// restrict command
							if (!restrictionsForThisChannel) {
								// channel has no active restrictions
								// set channel restrictions to empty array, dont save
								client.channelRestrictions._content[channelId] = [];
							}

							const stringOfActiveCommandRestrictionsForThisChannel = restrictionsForThisChannel?.find(x => x.startsWith('commands:'));

							if (!stringOfActiveCommandRestrictionsForThisChannel) {
								// channel has no active command restrictions
								// push 'commands:{command}' to the array
								client.channelRestrictions._content[channelId].push(`commands:${categoryOrCommandName}`);
							} else {
								// channel has active command restrictions
								// find in array a string that starts with 'commands:' and add command to the end after a comma
								const commandRestrictionsIndex = restrictionsForThisChannel.indexOf(stringOfActiveCommandRestrictionsForThisChannel);
								client.channelRestrictions._content[channelId][commandRestrictionsIndex] += `,${categoryOrCommandName}`;
							}
							// save
							client.channelRestrictions.forceSave();
							return message.channel.send(`Successfully added restriction of \`${categoryOrCommandName}\` command in <#${channelId}>`);
						}
					} else {
						return message.channel.send('You must enter an acceptable category or command name.');
					}
				} else {
					const embed = new client.embed()
						.setTitle('Active channel restrictions')
						.setDescription(displayCr([channelId], client))
						.setColor(client.embedColor)
					if (embed.description.length === 0) embed.setDescription(`<#${channelId}> has no active channel restrictions.`);
					return message.channel.send(embed);
				}
			}
		} else {
			const embed = new client.embed()
				.setTitle('Active channel restrictions')
				.setDescription(displayCr(Object.keys(client.channelRestrictions._content), client))
				.setColor(client.embedColor)
			if (embed.description.length === 0) embed.setDescription('None');
			message.channel.send(embed);
		}
	},
	name: 'channelrestrictions',
	alias: ['cr'],
	description: 'Toggle or view restrictions of entire categories of commands or individual commands from being used in a text channel. Restrictions are overridden by moderators and members who have the Level 3 role. Only moderators are allowed to edit channel restrictions.\n\nUsage:\nDon\'t add anything for a complete list of active restrictions.\nAdd a channel mention to view active restrictions for that channel.\nAdd "categorynames" to view a list of acceptable category names.\nAdd a channel mention and category name to toggle the restriction of that category in that channel.',
	shortDescription: 'Toggle channel-specific command usage restrictions.',
	usage: ['?channel mention / "categorynames" / "how"', '?category name'],
	category: 'Moderation',
	cooldown: 6
};