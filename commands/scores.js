module.exports = {
	run: async (client, message, args) => {
		if (!args[1]) {
			let timedOut = false;
			await message.channel.send('Which component\'s chart would you like to view? Respond with "CPU", "GPU" or "RAM" (20s)').then(async w => {
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
			message.channel.send('https://cdn.discordapp.com/attachments/571031705109135361/853326007431462912/CPU-Scores_2.jpg');
		} else if (args[1].toUpperCase() === 'GPU') {
			message.channel.send('https://cdn.discordapp.com/attachments/571031705109135361/845681844766769212/GPU_scores.jpg');
		} else if (args[1].toUpperCase() === 'RAM') {
			message.channel.send('https://cdn.discordapp.com/attachments/571031705109135361/853667767622303774/unknown.png');
		} else {
			message.channel.send('You need to add "CPU", "GPU" or "RAM"');
		}
	},
	name: 'scores',
	usage: ['"cpu" / "gpu" / "ram"'],
	alias: ['benchmarks', 'benchmark', 'score'],
	description: 'Provides overclocking spreadsheets of in-game items.',
	category: 'PC Creator',
	autores: ['how/what', 'benchmark/score', 'say/need', 'video/card/gpu/cpu/processor']
};