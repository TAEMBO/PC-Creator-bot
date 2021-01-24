const { description } = require("./socket");

module.exports = {
	run: (client, message, args) => {
		message.channel.send("https://cdn.discordapp.com/attachments/571031705109135361/797223985347297300/unknown.png");
	},
	name: 'usb',
	description: 'Shows all of the USB types and their names'
};