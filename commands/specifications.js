module.exports = {
	run: async (client, message, args) => {
		if (args[1]) {
			if (args[1].toLowerCase() === 'help') {
				const embed = new client.embed()
					.setTitle(`Help: ${client.prefix}specifications`)
					.setDescription('This command makes it possible to store and view user-generated information about your or someone else\'s computer specs.')
					.setColor(client.embedColor)
					.addField('Adding your own specs', `To add your own specs, you can do \`${client.prefix}specifications add [component]: [name]\`. The component should be a universally known term, such as "CPU", "RAM" or "Video Card". The name should contain the name of the part that you own, and some additional info, for example "AMD Ryzen 5 5600x 6-core 12-thread Socket AM4". Make sure that the capitalization on both, the component and name, is correct. It is important to separate the component and name with a colon \`:\`.`)
					.addField('Viewing specs', `To view your own specs, you can do \`${client.prefix}specifications\`. To view specs of other people, you can do \`${client.prefix}specifications [user]\`. User can be a mention, id or username.`)
					.addField('Editing specs', `To edit your own specs, you can do \`${client.prefix}specifications edit [component]: [new name]\`. Component capitalization doesn't matter. The old name will be overwritten by the new name. You cannot edit the component part, only the name.`)
					.addField('Deleting specs', `To delete all your specs, you can do \`${client.prefix}specifications delete\`. To delete a single component from your specs you can do \`${client.prefix}specifications delete [component]\`. Component capitalization doesn't matter.`)
				message.channel.send({embeds: [embed]});
			} else if (args[1].toLowerCase() === 'add') {
				const endPart = args.slice(2).join(' ');
				const colonIndex = endPart.indexOf(':') >= 0 ? endPart.indexOf(':') : endPart.indexOf(' ');
				if (!endPart) return message.channel.send('You need to add a component.');
				if (endPart.length > 256) return message.channel.send('The component or name is too long.');
				const component = endPart.slice(0, colonIndex).trim();
				if (!component) return message.channel.send('You need to add a colon.');
				const name = endPart.slice(colonIndex + 1).trim();
				if (!name) return message.channel.send('You need to add a name.');
				if (!client.specsDb.hasUser(message.author.id)) client.specsDb.addData(message.author.id, {});
				client.specsDb.addSpec(message.author.id, component, name);
				return message.channel.send(`Successfully added "${component}: ${name}" to your specs.`);
			} else if (args[1].toLowerCase() === 'edit') {
				if (!client.specsDb.hasUser(message.author.id)) return message.channel.send('You haven\'t added any specs.');
				const endPart = args.slice(2).join(' ');
				const colonIndex = endPart.indexOf(':') >= 0 ? endPart.indexOf(':') : endPart.indexOf(' ');
				if (!endPart) return message.channel.send('You need to add a component.');
				if (endPart.length > 256) return message.channel.send('The component or name is too long.');
				const component = endPart.slice(0, colonIndex).trim();
				if (!component) return message.channel.send('You need to add a colon.');
				const name = endPart.slice(colonIndex + 1).trim();
				if (!name) return message.channel.send('You need to add a name.');
				if (!client.specsDb.hasSpec(message.author.id, component)) return message.channel.send('You haven\'t added that spec.');
				client.specsDb.editSpecs(message.author.id, component, name);
				return message.channel.send(`Successfully edited "${component}", new value is "${name}".`);
			} else if (args[1].toLowerCase() === 'delete') {
				if (!client.specsDb.hasUser(message.author.id)) return message.channel.send('You haven\'t added any specs.');
				if (args[2]) {
					const component = args.slice(2).join(' ')
					if (!client.specsDb.hasSpec(message.author.id, args[2])) return message.channel.send('You haven\'t added that spec.');
					client.specsDb.deleteSpec(message.author.id, args[2]);
					return message.channel.send(`Successfully deleted "${args[2]}" from your specs.`);
				} else {
					client.specsDb.deleteData(message.author.id);
					return message.channel.send(`Successfully deleted all your specs.`);
				}
			} else {
				const member = message.mentions.members?.first() || (await client.getMember(message.guild, args[1]).catch(() => {}));
				if (!member) return message.channel.send('You failed to mention a user from this server.');
				if (!client.specsDb.hasUser(member.user.id)) return message.channel.send('They haven\'t added any specs yet.');
				const embed = client.displaySpecs(client, member);
				return message.channel.send({embeds: [embed]});
			}
		} else {
			if (!client.specsDb.hasUser(message.author.id)) return message.channel.send(`You haven\'t added any specs yet. Do \`${client.prefix}specifications help\` to learn more.`);
			const embed = client.displaySpecs(client, message.member);
			message.channel.send({embeds: [embed]});
		}
	},
	name: 'specifications',
	description: 'View computer parts of other people.',
	usage: ['?help / add / edit / delete / user'],
	alias: ['specs'],
	cooldown: 10,
	category: 'Fun'
};