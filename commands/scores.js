module.exports = {
	run: async (client, message, args) => {
		if (!args[1]) {
			let timedOut = false;
			await message.channel.send('Which component\'s chart would you like to view? Respond with "CPU", "GPU" or "RAM" (20s)').then(async w => {
				const filter = y => ['cpu', 'gpu', 'ram'].includes(y.content.toLowerCase()) && y.author.id === message.author.id;
				const x = await w.channel.awaitMessages({ filter, time: 20000, max: 1, errors: ['time']}).catch(z => {
					timedOut = true;
					return message.channel.send('You failed to specify the component.');
				});
				args[1] = x.content || x.first().content || '';
			});
			if (timedOut) return;
		}
		args[1] = args[1].replace(/"/g, '')
		if (args[1].toUpperCase() === 'CPU') {
			message.channel.send('https://media.discordapp.net/attachments/838857610358292532/931919636461654046/CPU-Scores_Super_Dark_Mode_3.jpg');
		} else if (args[1].toUpperCase() === 'GPU') {
			message.channel.send('https://media.discordapp.net/attachments/838857610358292532/931919674134904982/GPU_Scores_Super_Dark_Mode_5.jpg');
		} else if (args[1].toUpperCase() === 'RAM') {
			message.channel.send('https://media.discordapp.net/attachments/838857610358292532/931919651070423100/RAM_scores_Super_Dark_Mode_4.jpg');
		} else if (args[1].toUpperCase() === 'ALL') {
			message.channel.send('https://media.discordapp.net/attachments/838857610358292532/931919636461654046/CPU-Scores_Super_Dark_Mode_3.jpg\nhttps://media.discordapp.net/attachments/838857610358292532/931919674134904982/GPU_Scores_Super_Dark_Mode_5.jpg\nhttps://media.discordapp.net/attachments/838857610358292532/931919651070423100/RAM_scores_Super_Dark_Mode_4.jpg');
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