const Discord = require("discord.js");
const client = new Discord.Client({disableEveryone: true});
const fs = require('fs');
client.config = require("./config-test.json");
client.prefix = ',';
client.on("ready", async () => {
	await client.user.setActivity(",help", {
		type: "LISTENING", 
	});
	console.log(`Bot active as ${client.user.tag}`);
});

client.embed = Discord.MessageEmbed;
client.memberCount_LastGuildFetchTimestamp = 0;

// command handler
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

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