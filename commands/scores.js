module.exports = {
	run: async (client, message, args) => {
		if (!args[1]) {
			let timedOut = false;
			await message.channel.send('Which component\'s chart would you like to view? Respond with "CPU", "GPU" or "RAM"').then(async w => {
				const x = await w.channel.awaitMessages(y => ['cpu', 'gpu', 'ram'].includes(y.content.toLowerCase()) && y.author.id === message.author.id, { time: 20000, max: 1, errors: ['time']}).catch(z => {
					timedOut = true;
					return message.channel.send('You failed to specify the component.');
				});
				args[1] = x.content || x.first().content || '';
			});
			if (timedOut) return;
		}
		args[1] = args[1].replace(/"/g, '')
		if (args[1].toUpperCase() === 'CPU') {
			message.channel.send('https://cdn.discordapp.com/attachments/658983054534115359/817684936219164672/unknown.png');
		} else if (args[1].toUpperCase() === 'GPU') {
			message.channel.send('https://cdn.discordapp.com/attachments/658983054534115359/817684965134958592/unknown.png');
		} else if (args[1].toUpperCase() === 'RAM') {
			message.channel.send('https://cdn.discordapp.com/attachments/658983054534115359/817685035401347092/n0YejA7d8Lr9pY6u3s7P0qi0ofdoBNmBeIREDQ04S8lQvsUG5o8i0Xq6x8g5DLCmTdrb6iSF45wo2I3t8BU5dZDXjB6kT47PloVm.png');
		} else {
			message.channel.send('You need to add "CPU", "GPU" or "RAM"');
		}
	},
	name: 'scores',
	usage: ['CPU/GPU/RAM'],
	alias: ['benchmarks', 'benchmark', 'score'],
	description: 'Provides overclocking spreadsheets of in-game items',
	category: 'PC Creator',
	autores: ['how/what', 'benchmark/score', 'say/need', 'video/card/gpu/cpu/processor']
};