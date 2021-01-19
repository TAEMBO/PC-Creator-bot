module.exports = {
    run: async (client, message, args) => {
        await message.channel.send({embed: {
			"title": "__World Record PC__",
			"description": "This is the current World Record PC achieved by <@717018509628014623>, overclocks are needed to get the highest score.\n**CPU**: 57\n**RAM**: 4160\n**GPU**: 4060 and 24700\n• ZALMVN ZMX55 Thermal Paste is required and needs to cover 100% of the CPU\n• Max overclocking skill is also required\n• 2nd gen 1200w is required\n• 5x Titan RTX cards are required and all need to have only __1x 8 pin power connector__, can be obtained during Halloween update, any cards obtained before the update will not work.\n\nScore achieved: __125,263__",
			"color": 3971825}});
		message.channel.send({files: ["https://cdn.discordapp.com/attachments/571031705109135361/774780434382192660/2.png"]})
    },
	name: 'record',
	description: 'Shows the current World Record PC in the game',
	category: 'PC Creator'
};