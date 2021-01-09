module.exports = {
    run: (client, message, args) => {
        message.channel.send({embed: {
			"title": "__Commands__",
			"description": "\n``,ping`` - Shows amount of time it takes for the bot to respond\n``,staff`` - Shows all the current staff members\n``,virus`` - Provides help with viruses task\n``,socket`` - Provides help with motherboard and CPU socket\n``,games`` - Provides help with game installation\n``,items`` - Provides a picture of each type of item\n``,scores cpu`` - Provides a picture of the CPU spreadsheet\n``,scores ram`` - Provides a picture of the RAM spreadsheet\n``,scores gpu`` - Provides a picture of the GPU spreadsheet\n``,drive`` - Provides a picture of each type of storage drive\n``,aio`` - Provides a picture of what a watercooler looks like\n``,macos`` - Tells you what parts are needed to make a working PC with MacOS\n``,gaming`` - Provides a picture of how to make a PC's purpose for gaming\n``,record`` - Shows the current World Record PC in the game\n``,main`` - provides a picture of where every section of the game is\n``,overclocking`` - explains how to overclock a component",
			"color": 3971825}});
    },
    name: 'help'
};