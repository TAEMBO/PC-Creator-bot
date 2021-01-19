module.exports = {
	run: (client, message, args) => {
		if (!args[1]) return message.channel.send('You need to add "CPU", "GPU" or "RAM"');
		if (args[1].toUpperCase() === 'CPU') {
			message.channel.send({ files: ["https://cdn.discordapp.com/attachments/696448442989543445/778856180260405268/unknown.png"] });
		} else if (args[1].toUpperCase() === 'GPU') {
			message.channel.send({ files: ["https://cdn.discordapp.com/attachments/696448442989543445/778858824260911114/unknown.png"] });
		} else if (args[1].toUpperCase() === 'RAM') {
			message.channel.send({ files: ["https://cdn.discordapp.com/attachments/696448442989543445/778857937429987368/n0YejA7d8Lr9pY6u3s7P0qi0ofdoBNmBeIREDQ04S8lQvsUG5o8i0Xq6x8g5DLCmTdrb6iSF45wo2I3t8BU5dZDXjB6kT47PloVm.png"] });
		} else {
			message.channel.send('You need to add "CPU", "GPU" or "RAM"');
		}
	},
	name: 'scores',
	usage: ['CPU/GPU/RAM'],
	description: 'Provides overclocking spreadsheets of in-game items',
	category: 'PC Creator'
};