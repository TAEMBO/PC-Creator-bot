module.exports = {
	run: (client, message, args) => {
		const events = [
			{
				time: 1621543014658,
				url: 'https://canary.discord.com/channels/571031703661969430/571031705109135361/845037393551687690',
				text: '<@321615117550616588> said that PCC2 will most likely be free.'
			},
			{
				time: 1622890819155,
				url: 'https://discord.com/channels/571031703661969430/571031705109135361/850690495343755274',
				text: '<@321615117550616588> said that PCC2 will cost money.'
			},
			{
				time: 1623596897340,
				url: 'https://canary.discord.com/channels/571031703661969430/571031705109135361/853652001899151411',
				text: '<@321615117550616588> estimated the price of PCC2 between 5 and 8 US Dollars ($).'
			},
			{
				time: 1641923410520,
				url: 'https://discord.com/channels/571031703661969430/572536109754744839/930518969436217394',
				text: '<@321615117550616588> announced that PCC2 is available for pre-order.'
			},
			{
				time: 1642011294369,
				url: 'https://discord.com/channels/571031703661969430/571031705109135361/930887581015605309',
				text: '<@615761944154210305> found that **the game costs 7.99 US Dollars ($)**.'
			}
		];
		const embed = new client.embed()
			.setTitle('The Cost of PCC2')
			.setDescription(`Something has been said ${events.length} times about the cost of the sequel to the PC Creator mobile game.`)
			.setColor(client.embedColor)
		events.forEach(e => {
			embed.addField(`On <t:${Math.floor(e.time / 1000)}:d>,`, e.text + `\n[Message](${e.url})`);
		});
		message.channel.send({embeds: [embed]});
	},
	name: 'cost',
	description: 'Is PC Creator 2 going to be free?',
	category: 'PC Creator'
};