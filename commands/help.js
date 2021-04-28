function helpPage(pageNumber, client, message, args, toEdit = false) {
	let pageIndex = pageNumber || 0;
	const pageInfo = client.commands.pages[pageIndex];
	let text = '';
	client.commands.filter(command => !command.hidden && command.category === pageInfo.category && command.page === pageInfo.page).forEach(command => {
		text += client.commandInfo(client, command, client.helpDefaultOptions);
	});
	const embed = new client.embed()
		.setTitle(`__Commands: ${pageInfo.name}__`)
		.setColor(3971825)
		.setDescription(text);
	if (toEdit) {
		return embed;
	} else {
		message.channel.send(embed)
			// add reactions to go forward or backward pages
			.then(async botMessage => {
				let endTimestamp = Date.now() + 45000;
				const collector = botMessage.createReactionCollector((reaction, user) => ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 240000 });
				collector.on('collect', async (reaction, user) => {
					endTimestamp = Date.now() + 45000;
					if (reaction.emoji.name === '◀️') {
						if (pageIndex - 1 < 0) pageIndex = client.commands.pages.length;
						pageIndex--;
					} else if (reaction.emoji.name === '▶️') {
						if (pageIndex + 1 >= client.commands.pages.length) pageIndex = -1;
						pageIndex++;
					}
					await Promise.all([botMessage.edit(helpPage(pageIndex, client, message, args, true)), botMessage.reactions.removeAll()]);
					await botMessage.react('◀️');
					await botMessage.react('▶️');
				});
				async function onEnd() {
					await botMessage.edit('_Removed to save space._');
					await botMessage.suppressEmbeds();
					await botMessage.reactions.removeAll();
				};
				const interval = setInterval(() => {
					if (Date.now() > endTimestamp) {
						collector.stop();
						onEnd();
					}
				}, 5000);
				collector.on('end', async () => {
					onEnd();
					clearInterval(interval);
				});
				await botMessage.react('◀️');
				await botMessage.react('▶️');
				
			});
	}
	
}

module.exports = {
    run: (client, message, args) => {
		// if they ask for a specific page (number)
		if (parseInt(args[1])) {
			console.log(client.commands.pages[parseInt(args[1]) - 1]);
			if (!client.commands.pages[parseInt(args[1]) - 1]) return message.channel.send('That page doesnt exist');
			return helpPage(parseInt(args[1]) - 1, client, message, args);
		}
		// category (name)
		if (client.commands.pages.some(x => x.category.toLowerCase() === args.slice(1).join(' ').toLowerCase())) {
			return helpPage(client.commands.pages.map(x => x.category.toLowerCase()).indexOf(args.slice(1).join(' ').toLowerCase()), client, message, args);
		}
		// or command (name)
		const command = client.commands.find(x => x.name === args[1] || x.alias?.includes(args[1]));
		if (command) {
			const embed = new client.embed()
				.setTitle(`__Commands: ${command.name}__`)
				.setDescription(client.commandInfo(client, command, { insertEmpty: true, parts: ['name', 'usage', 'description', 'alias', 'category', 'autores'] }))
				.setColor(3971825)
			return message.channel.send(embed);
		} 
		// if run() still hasnt been returned, send category 0 page 1
		return helpPage(undefined, client, message, args);
    },
	name: 'help',
	description: 'Info about commands and their usage',
	usage: ['Command / Category / Page']
};
