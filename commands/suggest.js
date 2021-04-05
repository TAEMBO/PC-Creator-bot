module.exports = {
	run: async (client, message, args) => {
		if (message.channel.id !== client.config.mainServer.channels.suggestions) return message.channel.send(`This command only works in <#${client.config.mainServer.channels.suggestions}>`);
		await message.delete();
		if (!args[1]) return message.reply('You need to suggest something.').then(x => setTimeout(() => x.delete(), 6000));
		if (args[1].length > 2048) return message.reply('Your suggestion must be less than or equal to 2048 characters in length.').then(x => setTimeout(() => x.delete(), 6000));
		const embed = new client.embed()
			.setAuthor(`${message.member.displayName} (${message.author.id})`, message.author.avatarURL({ format: 'png', size: 128 }))
			.setTitle(`Suggestion:`)
			.setDescription(args.slice(1).join(' '))
			.setTimestamp()
			.setColor(client.embedColor)
		const suggestion = await message.channel.send(embed);
		await suggestion.react('✅');
		await suggestion.react('❌');
	},
	name: 'suggest',
	description: 'Create a suggestion. Only works in <#572541644755435520>',
	category: 'PC Creator',
	alias: ['suggestion'],
	usage: ['suggestion']
};