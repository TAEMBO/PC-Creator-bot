module.exports = {
	run: async (client, message, args) => {
		if (message.channel.id !== client.config.mainServer.channels.suggestions) {
			client.cooldowns.get(message.author.id)?.set('suggest', 0);
			return message.channel.send(`This command only works in <#${client.config.mainServer.channels.suggestions}>`);
		}
		await message.delete();
		if (!args[1]) {
			return message.reply('You need to suggest something.').then(x => setTimeout(() => x.delete(), 6000));
		}
		if (args[1].length > 2048) {
			return message.reply('Your suggestion must be less than or equal to 2048 characters in length.').then(x => setTimeout(() => x.delete(), 6000));
		}
		const embed = new client.embed()
			.setAuthor(`${message.member.displayName} (${message.author.id})`, message.author.avatarURL({ format: 'png', size: 128 }))
			.setTitle(`Suggestion:`)
			.setDescription(message.content.slice(message.content.indexOf(' ') + 1))
			.setTimestamp()
			.setColor('269CD0')
		if (message.attachments?.first()?.width && ['png', 'jpeg', 'jpg', 'gif'].some(x => message.attachments.first().name.endsWith(x))) {
			embed
				.attachFiles([message.attachments.first() ])
				.setImage('attachment://' + message.attachments.first().name);
		}
		const suggestion = await message.channel.send({ embed });
		await suggestion.react('✅');
		await suggestion.react('❌');
	},
	name: 'suggest',
	description: `Create a suggestion. Only works in <#912591798436761631>. If an image is attached, it will be included in the suggestion.`,
	alias: ['suggestion'],
	usage: ['suggestion'],
	cooldown: 10800
};