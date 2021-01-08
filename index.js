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
	if (message.content.startsWith(prefix + "games")) {
		message.channel.send("Go to the online shop in the menu, and under the OS section you will find a list of programs. Select the game and buy it. Then go to customer’s PC and turn it on to the desktop, next press the install button, followed by the small backpack icon, you will then see your game there where you can download it.")
	}
	
	if (message.content.startsWith(prefix + "help")) {
		message.channel.send({embed: {
			"title": "__Commands__",
			"description": "\n``,ping`` - Shows amount of time it takes for the bot to respond\n``,staff`` - Shows all the current staff members\n``,virus`` - Provides help with viruses task\n``,socket`` - Provides help with motherboard and CPU socket\n``,games`` - Provides help with game installation\n``,items`` - Provides a picture of each type of item\n``,scores cpu`` - Provides a picture of the CPU spreadsheet\n``,scores ram`` - Provides a picture of the RAM spreadsheet\n``,scores gpu`` - Provides a picture of the GPU spreadsheet\n``,drive`` - Provides a picture of each type of storage drive\n``,aio`` - Provides a picture of what a watercooler looks like\n``,macos`` - Tells you what parts are needed to make a working PC with MacOS\n``,gaming`` - Provides a picture of how to make a PC's purpose for gaming\n``,record`` - Shows the current World Record PC in the game\n``,main`` - provides a picture of where every section of the game is\n``,overclocking`` - explains how to overclock a component",
			"color": 3971825}});
	}
	if (message.content.startsWith(prefix + "socket")) {
		message.channel.send({files: ["https://cdn.discordapp.com/attachments/739308099709567024/744446446899560518/image0.png"]})
		message.channel.send("Motherboard and CPU socket have to be the same. If you try to build a PC with lets say a motherboard that has FM2+ socket along with a cpu that has AM4 socket, it won’t work.")
	}
	if (message.content.startsWith(prefix + "staff")) {
		message.channel.send({embed: {
			"title": "__Staff members__",
			"description": "\n**<@&632674518317531137>**\n<@387088097374109698>\n\n**<@&589435378147262464>**\n<@506033590656696332>\n<@615761944154210305>\n<@478922521601638400>\n\nIf you need help, or want to report bad behavior, feel free to message anyone of these people and they will get back to you asap.",
			"color": 3971825}});
	}
	if (message.content.startsWith(prefix + "record")) {
		message.channel.send({embed: {
			"title": "__World Record PC__",
			"description": "This is the current World Record PC achieved by <@717018509628014623>, overclocks are needed to get the highest score.\n**CPU**: 57\n**RAM**: 4160\n**GPU**: 4060 and 24700\n• ZALMVN ZMX55 Thermal Paste is required and needs to cover 100% of the CPU\n• Max overclocking skill is also required\n• 2nd gen 1200w is required\n• 5x Titan RTX cards are required and all need to have only __1x 8 pin power connector__, can be obtained during Halloween update, any cards obtained before the update will not work.\n\nScore achieved: __125,263__",
			"color": 3971825}});
			message.channel.send({files: ["https://cdn.discordapp.com/attachments/571031705109135361/774780434382192660/2.png"]})
	}
	if (message.content.startsWith(prefix + "virus")) {
		message.channel.send("Go to the online shop in the menu, and under the OS section you will find a list of programs. Select either Eset or Avast (they’re the same) and buy it. Then go to customer’s PC and turn it on to the desktop, next press the install button, followed by the small backpack icon, you will then see your antivirus there where you can download it.")
	}
	if (message.content.startsWith(prefix + "overclocking")) {
		message.channel.send("Overclocking in this game is useful because it gives a higher benchmark score for the item, which is good for tasks that have a requirement such as ``CPU benchmark should be at least > xxxx``. To overclock a component (CPU GPU or RAM), it is **highly** recommended you max out your overclocking skill first, otherise you will get bluescreens very early into overclocking. After you did that, put the item you want to overclock into the pc, press the green play button at the top right, then press the ``BIOS`` button on the right side. go to the section that corresponds to your item type, then enter the correct numbers, hit apply, hope it doesn't bluescreen, then hit reboot. If you don't know what the correct overclocking numbers are for your item, use ``,scores cpu``, ``,scores ram``, or ``,scores gpu`` to find out.")
	}
	if (message.content.startsWith(prefix + "no")) {
        const member = message.mentions.members.first();
        if (!member) return
            let testRole = message.guild.roles.cache.find(role => role.id == "775736993018806322")
            member.roles.remove(testRole)
            message.channel.send("Role removed (PRO PLAYER)")
	}
	if (message.content.startsWith(prefix + "also no")) {
        const member = message.mentions.members.first();
        if (!member) return
            let testRole = message.guild.roles.cache.find(role => role.id == "775736993018806322")
            member.roles.add(testRole)
            message.channel.send("Role added (PRO PLAYER)")
	}
	if (message.content.startsWith(prefix + "still no")) {
		message.delete();
        const member = message.mentions.members.first();
        if (!member) return
            let testRole = message.guild.roles.cache.find(role => role.id == "634438185363046440")
            member.roles.add(testRole)
            message.channel.send("User Muted")
	}
	if (message.content.startsWith(prefix + "also still no")) {
		message.delete();
        const member = message.mentions.members.first();
        if (!member) return
            let testRole = message.guild.roles.cache.find(role => role.id == "634438185363046440")
            member.roles.add(testRole)
            message.channel.send("User Unmuted")
	}
});
client.login(config.token);