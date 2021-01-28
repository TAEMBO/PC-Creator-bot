module.exports = {
	run: async (client, message, args) => {
		if (!args[1]) {
			await message.channel.send('Which component\'s chart would you like to view? Respond with "CPU", "GPU" or "RAM"').then(async w => {
				let timedOut = false;
				const x = await w.channel.awaitMessages(y => ['cpu', 'gpu', 'ram'].includes(y.content.toLowerCase()) && y.author.id === message.author.id, { time: 12000, max: 1, errors: ['time']}).catch(z => {
					timedOut = true;
					return message.channel.send('You failed to specify the component.');
				});
				if (timedOut) return;
				args[1] = x.content || x.first().content || '';
			});
		}
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
	alias: ['benchmarks', 'benchmark', 'score'],
	description: 'Provides overclocking spreadsheets of in-game items',
	category: 'PC Creator',
	autores: ['how', 'benchmark', 'OPT-video/card', 'OPT-cpu/processor', 'OPT-task', 'OPT-overclock', 'OPT-score']
};