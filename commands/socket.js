module.exports = {
    run: (client, message, args) => {
        message.channel.send({files: ["https://cdn.discordapp.com/attachments/739308099709567024/744446446899560518/image0.png"]})
		message.channel.send("Motherboard and CPU socket have to be the same. If you try to build a PC with lets say a motherboard that has FM2+ socket along with a cpu that has AM4 socket, it won’t work.")
    },
    name: 'socket'
};