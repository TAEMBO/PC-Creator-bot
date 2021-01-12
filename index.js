const Discord = require("discord.js");
const client = new Discord.Client({disableEveryone: true});
const fs = require('fs');
const config = require("./config.json");
const prefix = ',';
client.on("ready", () => {
	client.user.setActivity(",help", {
		type: "LISTENING", 
	});
});

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
	if (newState.channelID) {
		newState.member.roles.add(memberRole);
	} else if (oldState.channelID && !newState.channelID) {
		newState.member.roles.remove(memberRole);
	}
});

client.on("message", (message) => {
	const args = message.content.split(' ');
	
	if (!message.guild) return;
	if (!message.content.startsWith(prefix)) return;
	const command = client.commands.get(args[0].slice(prefix.length));
	if (command) {
		try {
			command.run(client, message, args);
		} catch (error) {
			console.log(`An error occured while running command "${command.name}"`, error, error.stack);
			message.channel.send('An error occured while executing that command.');
		}
	}
	if (message.content.startsWith(prefix + "no")) {
        const member = message.mentions.members.first();
        if (!member) return
            let testRole = message.guild.roles.cache.find(role => role.id == "775736993018806322")
            member.roles.remove(testRole)
            message.channel.send("Role removed (PRO PLAYER)")
	}
	if (message.content.startsWith(prefix + "noo")) {
        const member = message.mentions.members.first();
        if (!member) return
            let testRole = message.guild.roles.cache.find(role => role.id == "775736993018806322")
            member.roles.add(testRole)
            message.channel.send("Role added (PRO PLAYER)")
	}
	if (message.content.startsWith(prefix + "nooo")) {
		message.delete();
        const member = message.mentions.members.first();
        if (!member) return
            let testRole = message.guild.roles.cache.find(role => role.id == "634438185363046440")
            member.roles.add(testRole)
            message.channel.send("User Muted")
	}
	if (message.content.startsWith(prefix + "noooo")) {
		message.delete();
        const member = message.mentions.members.first();
        if (!member) return
            let testRole = message.guild.roles.cache.find(role => role.id == "634438185363046440")
            member.roles.add(testRole)
            message.channel.send("User Unmuted")
	}
});
client.login(config.token);