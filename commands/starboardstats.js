module.exports = {
	run: async (client, message, args) => {
		const embed = new client.embed()
			.setTitle('__Starboard Statistics__')
			.setColor(client.embedColor)
		const containsEmbed = Object.entries(client.starboard._content).filter(x => x[1].e);
		const starboardChannel = client.channels.resolve(client.config.mainServer.channels.starboard);
		const promises = containsEmbed.sort((a, b) => b[1].c - a[1].c).slice(0, 5).map(async x => {
			const starboardMessage = await starboardChannel.messages.fetch(x[1].e).catch(err => {
				console.log('STARBOARD: could not find message in #starboard with ID ' + x[1].e);
				return false;
			});
			if (!starboardMessage) {
				delete client.starboard._content[x[0]];
			}
			return `**${x[1].c}** :star: By <@${x[1].a}>: [Jump to Starboard](${starboardMessage.url})`;
		});
		const bestMessages = await Promise.all(promises);
		embed.addField('Most Starred Messages', bestMessages.join('\n'));

		const starboardValues = Object.values(client.starboard._content).filter(x => x.c >= client.starLimit);
		embed.setDescription(`Statistics from <#${client.config.mainServer.channels.starboard}>\nA total of **${starboardValues.map(x => x.c).reduce((a, b) => a + b, 0)}** :star: reactions have been added.`);
		const allUsers = Array.from(new Set(starboardValues.map(x => x.a)));
		const bestUsers = allUsers.map(x => [x, (() => {
			const filtered = starboardValues.filter(y => y.a === x && y.c).map(x => x.c);
			return filtered.reduce((a, b) => a + b, 0);
		})()]);
		const bestUsersText = bestUsers.filter(x => typeof x[1] === 'number' && !isNaN(x[1])).sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => `**${x[1]}** :star: <@${x[0]}>`);
		embed.addField('Most Starred Users', bestUsersText.join('\n'));
		message.channel.send(embed);
	},
	name: 'starboardstats',
	description: 'See statistics from starboard',
	alias: ['sbs'],
	cooldown: 30,
	category: 'Fun'
};