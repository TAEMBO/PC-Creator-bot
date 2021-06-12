module.exports = async (message, client) => {
	if (message.content.toLowerCase().includes("titanus") && Math.random() < 3 / 7) {
		message.channel.send("Ass-sus tit anus <:hahaha6:740166145167982623>");
	}
	if (message.content.includes("userbenchmark.com")) {
		message.reply(":b:ingus y u use userbenchmark");
	}
	if (message.content.toLowerCase().includes("uwu")) {
		message.reply("You received an honorary ban!");
	}
	if (message.author.id === '155149108183695360' /* dyno */ && ['was muted', 'was banned', 'has been warned', 'was softbanned'].some(x => message.embeds[0]?.description?.includes(x))) {
		message.channel.send(':partying_face: :tada:');
	}
	if (client.config.enableAutoResponse && client.userLevels.getUser(message.author.id) < 1000) {
		let msg = message.content.toLowerCase().replace(/'|´|"/g, '');
		const questionWords = ['how', 'what', 'where', 'why', 'can'];
		let trigger;
		if (
			!((
				questionWords.some(x => {
					if (
						(
							(msg).startsWith(x + ' ') // question word has to be the full word, eliminates "whatever"
							|| (msg).startsWith(x + 's ') // question word can also be "question word + is", eg "what's"
						)
						&& !(msg).startsWith(x + ' if ') // question word cant be used a suggestion, eliminates "what if ..."
					) {
						trigger = x;
						return true;
					} else return false;
				})
				|| msg.startsWith('is')
				|| msg.includes('help')
			)
				&& !message.author.bot)
		) return;
		let match;
		if (msg.length > 70) return;
		client.commands.forEach(command => {
			if (!command.autores) return;
			if (command.autores.every(keyword => {
				if (keyword.includes('/')) {
					const keywordsSplit = keyword.split('/');
					if (keywordsSplit.some(x => msg.includes(x))) return true;
					else return false;
				} else {
					return msg.includes(keyword)
				}
			})) match = command;
		});
		if (match) {
			if (client.userLevels.getUser(message.author.id) > 50) {
				await message.channel.send(`AutoResponse™ was summoned. Would \`${client.prefix}${match.name}\` help?`);
			} else {
				await message.channel.send(`AutoResponse™ was summoned. Running command \`${client.prefix}${match.name}\`...`);
				try {
					match.run(client, Object.assign(message, { content: `${client.prefix}${match.name}` }), [match.name]);
					match.uses ? match.uses++ : match.uses = 1;
				} catch (error) {
					return console.log(`An error occured while running command "${match.name}"`, error, error.stack);
				}
			}
		}
	}
};