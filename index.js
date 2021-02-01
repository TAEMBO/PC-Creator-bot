const Discord = require("discord.js");
const client = new Discord.Client({disableEveryone: true});
const fs = require('fs');
client.config = require("./config.json");
if (!client.config.token) client.config = require("./config-test.json");
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
client.commandInfo = (command, options = { insertEmpty: false, parts: []}) => {
	let text = ':small_blue_diamond: ';
	function e() {
		text += '\n';
		if (options.insertEmpty) {
			text += '\n';
		}
		return;
	}
	if (options.parts.includes('name') && command.name) {
		text += '`' + client.prefix + command.name;
		if (options.parts.includes('usage') && command.usage) {
			text += ' [' + command.usage.join('] [') + ']';
		}
		text += '`';
		e();
	} else if (options.parts.includes('usage') && command.usage) {
		text += 'Usage: `[' + command.usage.join('] [') + ']`';
		e();
	}
	if (options.parts.includes('description') && command.description) {
		text += command.description;
		e();
	}
	if (options.parts.includes('alias') && command.alias) {
		text += 'Aliases: ' + command.alias.map(x => '`' + x + '`').join(', ');
		e();
	}
	if (options.parts.includes('category') && command.category) {
		text += 'Category: ' + command.category;
		e();
	}
	if (options.parts.includes('autores') && command.autores) {
		text += 'AutoResponse:tm: Requirements: `[' + command.autores.join('] [') + ']`';
		e();
	}
	e();
	return text;
};

// assign page number to commands
const categories = {};
while (client.commands.some(command => !command.hidden && !command.page)) {
	const command = client.commands.find(command => !command.hidden && !command.page);
	if (!command.category) command.category = 'Misc';
	if (!categories[command.category]) categories[command.category] = { text: '', currentPage: 1}
	const commandInfo = client.commandInfo(command);
	if (categories[command.category].text.length + commandInfo.length > 1024) {
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

client.on("message", async (message) => {
	if (message.channel.type === 'dm') {
		const channel = client.channels.cache.get(client.config.dmForwardChannel);
		const pcCreatorServer = client.guilds.cache.get(client.config.pcCreatorServer);
		if (!channel || !pcCreatorServer) console.log(`could not find channel ${client.config.dmForwardChannel} or guild ${client.config.pcCreatorServer}`);
		const guildMemberObject = (await pcCreatorServer.members.fetch(message.author.id));
		const memberOfPccs = !!guildMemberObject;
		const embed = new client.embed()
			.setTitle('Forwarded DM Message')
			.setAuthor(message.author.tag + ` (${message.author.id})`, message.author.avatarURL({ format: 'png', dynamic: true, size: 256}))
			.setColor(3971825)
			.addField('Message Content', message.content.length > 1024 ? message.content.slice(1021) + '...' : message.content)
			.addField('Connections', `:small_blue_diamond: Message sender **${memberOfPccs ? 'is' : ' is not'}** on the PC Creator Discord server${memberOfPccs ? ' as ' + guildMemberObject.toString() : ''}${memberOfPccs ? `\n:small_blue_diamond: Roles on the PC Creator server: ${guildMemberObject.roles.cache.size > 0 ? guildMemberObject.roles.cache.filter(x => x.id !== pcCreatorServer.roles.everyone.id).map(x => '**' + x.name + '**').join(', ') : 'None'}` : ''}`)
			.setTimestamp(Date.now());
		channel.send(embed);
	}
	if (!message.guild) return;
	if (message.content.startsWith(client.prefix)) {
		const args = message.content.slice(client.prefix.length).split(' ');
		const commandFile = client.commands.find(x => x.name === args[0] || x.alias?.includes(args[0]));
		if (commandFile) {
			try {
				return commandFile.run(client, message, args);
			} catch (error) {
				console.log(`An error occured while running command "${commandFile.name}"`, error, error.stack);
				return message.channel.send('An error occured while executing that command.');
			}
		}
	} else {
		if (client.config.enableAutoResponse) {
			let msg = message.content.toLowerCase().replace(/'|´|"/g, '');
			const questionWords = ['how', 'what', 'where', 'when', 'help', 'why', 'is'];
			let trigger;
			if (!questionWords.some(x => {
				if (
					(
						(' ' + msg + ' ').includes(' ' + x + ' ')
						&&
						!(' ' + msg + ' ').includes(' ' + x + ' if ')
					)
					|| (' ' + msg + ' ').includes(' ' + x + 's ')
				) {
					trigger = x;
					return true;
				} else return false;
			}) || message.author.bot) return;
			let match;
			if (msg.length > 96) msg = msg.slice(msg.indexOf(trigger))
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
				await message.channel.send(`AutoResponse™ was summoned. Running command \`${client.prefix}${match.name}\`...`);
				try {
					return match.run(client, Object.assign(message, { content: `${client.prefix}${match.name}` }), [match.name]);
				} catch (error) {
					return console.log(`An error occured while running command "${match.name}"`, error, error.stack);
				}
			}
		}
	}
});
client.login(client.config.token);