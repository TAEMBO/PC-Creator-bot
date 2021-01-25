const Discord = require("discord.js");
const client = new Discord.Client({disableEveryone: true});
const fs = require('fs');
client.config = require("./config.json");
client.prefix = ',';
client.on("ready", async () => {
	await client.user.setActivity(",help", {
		type: "LISTENING", 
	});
	console.log(`Bot active as ${client.user.tag}`);
});

// global properties
Object.assign(client, {
	embed: Discord.MessageEmbed,
	messageCollector: Discord.MessageCollector,
	memberCount_LastGuildFetchTimestamp: 0,
});

// command handler
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// commandinfo function
client.commandInfo = (command, options = {}) => {
	const { includeCategory, insertEmpty } = options;
	return `:small_blue_diamond: \`${client.prefix}${command.name}${command.usage ? ' [' + command.usage.join('] [') + ']' : ''}\`${command.description ? '\n' + (insertEmpty ? '\n' : '') + command.description : ''}${command.alias ? (insertEmpty ? '\n' : '') + '\nAliases: ' + command.alias.map(x => '`' + x + '`').join(', ') : ''}${includeCategory ? (insertEmpty ? '\n' : '') + '\nCategory: ' + command.category : ''}\n\n`;
};

// assign page number to commands
const categories = {};
while (client.commands.some(command => !command.hidden && !command.page)) {
	const command = client.commands.find(command => !command.hidden && !command.page);
	if (!command.category) command.category = 'Misc';
	if (!categories[command.category]) categories[command.category] = { text: '', currentPage: 1}
	const commandInfo = client.commandInfo(command);
	if (categories[command.category].text.length + commandInfo.length > 1536) {
		categories[command.category].text = commandInfo;
		categories[command.category].currentPage++;
	} else {
		categories[command.category].text += commandInfo;
	}
	command.page = categories[command.category].currentPage;
}
delete categories;

// create pages without contents
client.commands.pages = [];
client.commands.filter(command => !command.hidden).forEach(command => {
	if (!client.commands.pages.some(x => x.category === command.category && x.page === command.page)) {
		client.commands.pages.push({
			name: `${command.category} - Page ${command.page}/${Math.max(...client.commands.filter(x => x.category === command.category).map(x => x.page))}`,
			category: command.category,
			page: command.page
		});
	}
});
client.commands.pages.sort((a, b) => {
	if (a.name < b.name) {
		return -1;
	} else if (a.name > b.name) {
		return 1;
	} else {
		return 0;
	}
}).sort((a, b) => {
	if (a.category.toLowerCase() === 'pc creator' && b.category.toLowerCase() !== 'pc creator') {
		return -1;
	} else {
		return 1;
	}
});

// give access to #voice-chat-text to members when they join vc
client.on('voiceStateUpdate', (oldState, newState) => {
	const memberRole = oldState.guild.roles.cache.get("747630391392731218");
	if (!memberRole) return;
	if (newState.channelID) {
		newState.member.roles.add(memberRole);
	} else if (oldState.channelID && !newState.channelID) {
		newState.member.roles.remove(memberRole);
	}
});

client.on("message", (message) => {
	if (!message.guild || !message.content.startsWith(client.prefix)) return;
	const args = message.content.slice(client.prefix.length).split(' ');
	const commandFile = client.commands.find(x => x.name === args[0] || x.alias?.includes(args[0]));
	if (commandFile) {
		try {
			commandFile.run(client, message, args);
		} catch (error) {
			console.log(`An error occured while running command "${commandFile.name}"`, error, error.stack);
			message.channel.send('An error occured while executing that command.');
		}
	}
});
client.login(client.config.token);