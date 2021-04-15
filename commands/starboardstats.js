module.exports = {
	run: (client, message, args) => {
		const embed = new client.embed()
			.setTitle('__Starboard Statistics__')
			.setDescription(`Statistics from <#${client.config.mainServer.channels.starboard}>`)
			.setColor(client.embedColor)
		const bestMessages = Object.entries(client.starboard._content).filter(x => x[1].c >= 3).sort((a, b) => b[1].c - a[1].c).slice(0, 5).map(async x => {
			const starboardMessage = await client.channels.resolve(client.config.mainServer.channels.starboard).messages.resolve(x[1].e).fetch();
			const description = starboardMessage.embeds[0].description || '';
			`**${x.c}** :star: [Jump to Starboard](${starboardMessage.url}) ${description ? '|' : ''} ${description.length > 20 ? description.slice(18).trim() + '...' : description}`
		});
		embed.addField('Most Starred Messages', bestMessages.join('\n'));

		const starboardValues = Object.values(client.starboard._content);
		const allUsers = Array.from(new Set(starboardValues.map(x => x.a)));
		const bestUsers = allUsers.map(x => [x, starboardValues.filter(y => y.a === x).reduce((a, b) => a.c + b.c)]).sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => `<@${x[0]}> | **${x[1]}** :star:`);
		const bestUsers = allUsers.map(x => `<@${x}> | **${starboardValues.filter(y => y.a === x).reduce((a, b) => a.c + b.c)}** :star:`);
		embed.addField('Most Starred Users', bestUsers.join('\n'));
		messages.channel.send(embed);
	},
	name: 'starboardstats',
	description: '[BETA] See statistics from starboard',
	alias: ['sbs'],
	cooldown: 30
};