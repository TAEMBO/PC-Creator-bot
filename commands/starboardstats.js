module.exports = {
	run: async (client, message, args) => {
		const embed = new client.embed()
			.setTitle('__Starboard Statistics__')
			.setColor(client.embedColor)
		const bestMessages = await Promise.all(Object.entries(client.starboard._content).filter(x => x[1].e).sort((a, b) => b[1].c - a[1].c).slice(0, 5).map(async x => {
			console.log(x);
			const starboardMessage = await client.channels.resolve(client.config.mainServer.channels.starboard).messages.resolve(x[1].e)?.fetch();
			if (!starboardMessage) return undefined;
			const description = starboardMessage.embeds[0].description || '';
			return `**${x.c}** :star: [Jump to Starboard](${starboardMessage.url}) ${description ? '|' : ''} ${description.length > 20 ? description.slice(18).trim() + '...' : description}`;
		}));
		embed.addField('Most Starred Messages', bestMessages.join('\n'));

		const starboardValues = Object.values(client.starboard._content);
		embed.setDescription(`Statistics from <#${client.config.mainServer.channels.starboard}>\nA total of **${starboardValues.reduce((a, b) => a.c + b.c, 0)}** :star: reactions have been added.`);
		const allUsers = Array.from(new Set(starboardValues.map(x => x.a)));
		console.log('allusers', allUsers);
		const bestUsers = allUsers.map(x => [x, starboardValues.filter(y => y.a === x && y.c).reduce((a, b) => a.c + b.c, 0)]);
		console.log(bestUsers);
		const bestUsersText = bestUsers.filter(x => typeof x[1] === 'number' && !isNaN(x[1])).sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => `<@${x[0]}> | **${x[1]}** :star:`);
		embed.addField('Most Starred Users', bestUsersText.join('\n'));
		messages.channel.send(embed);
	},
	name: 'starboardstats',
	description: '[BETA] See statistics from starboard',
	alias: ['sbs'],
	cooldown: 30
};