const e = require("discord.js");
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
		message.channel.send({embeds: [embed], components: [new e.MessageActionRow().addComponents(new e.MessageButton().setStyle("SECONDARY").setCustomId("back").setEmoji("⬅️"), new e.MessageButton().setStyle("SECONDARY").setCustomId("forward").setEmoji("➡️"))]})
			// add reactions to go forward or backward pages
			.then(async botMessage => {
				let endTimestamp = Date.now() + 60000;
				const filter = (interaction) => {
					return message.author.id === interaction.user.id;
				};
				const collector = botMessage.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 1000 * 90 });;
				collector.on('collect', async (button) => {
					endTimestamp = Date.now() + 90000;
					if (button.customId === 'back') {
						if (pageIndex - 1 < 0) pageIndex = client.commands.pages.length;
						pageIndex--;
						button.reply({content: "** **"}).then((i)=>{button.deleteReply()})
					} else if (button.customId === 'forward') {
						if (pageIndex + 1 >= client.commands.pages.length) pageIndex = -1;
						pageIndex++;
						button.reply({content: "** **"}).then((i)=>{button.deleteReply()})
					}
					await Promise.all([botMessage.edit({embeds: [helpPage(pageIndex, client, message, args, true)]})]);
				});
				async function onEnd() {
					await botMessage.edit({content: '_Removed to save space._', embeds: [], components: []});
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
				
			});
	}
	
}

module.exports = {
    run: (client, message, args) => {
		// if they ask for a specific page (number)
		if (parseInt(args[1])) {
			if (!client.commands.pages[parseInt(args[1]) - 1]) return message.channel.send('That page number doesn\'t exist.');
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
				.setDescription(client.commandInfo(client, command, { insertNewline: true, parts: ['name', 'usage', 'description', 'shortDescription', 'alias', 'category', 'autores', 'cooldown'], titles: ['name', 'usage', 'shortDescription', 'alias', 'category', 'autores', 'cooldown'] }))
				.setColor(3971825)
			return message.channel.send({embeds: [embed]});
		} 
		// if run() still hasnt been returned, send category 0 page 1
		return helpPage(undefined, client, message, args);
    },
	name: 'help',
	description: 'Info about commands and their usage.',
	usage: ['?command / ?category / ?page']
};