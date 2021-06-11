module.exports = {
	run: async (client, message, args) => {
		if (message.channel.id !== client.config.mainServer.channels.suggestions) {
			client.cooldowns.get(message.author.id)?.set('suggest', 0);
			return message.channel.send(`This command only works in <#${client.config.mainServer.channels.suggestions}>`);
		}
		await message.delete();
		console.log('suggest message deleted');
		if (!args[1]) {
			console.log('no args[1] in suggestion');
			return message.reply('You need to suggest something.').then(x => setTimeout(() => x.delete(), 6000));
		}
		if (args[1].length > 2048) {
			console.log('suggestion too long');
			return message.reply('Your suggestion must be less than or equal to 2048 characters in length.').then(x => setTimeout(() => x.delete(), 6000));
		}
		const embed = new client.embed()
			.setAuthor(`${message.member.displayName} (${message.author.id})`, message.author.avatarURL({ format: 'png', size: 128 }))
			.setTitle(`Suggestion:`)
			.setDescription(message.content.slice(message.content.indexOf(' ') + 1))
			.setTimestamp()
			.setColor(client.embedColor)
		console.log('sending suggestion embed', embed);
		const suggestion = await message.channel.send({ embed }).then((sentMessage) => {
			console.log('embed successfully sent');
			return sentMessage;
		}).catch((err) => console.log('embed send failed because', err));
		await suggestion.react('✅');
		await suggestion.react('❌');
	},
	name: 'suggest',
	description: 'Create a suggestion. Only works in <#572541644755435520>',
	category: 'PC Creator',
	alias: ['suggestion'],
	usage: ['suggestion'],
	cooldown: 10800
};