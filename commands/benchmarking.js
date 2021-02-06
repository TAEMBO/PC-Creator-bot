module.exports = {
	run: (client, message, args) => {
		message.channel.send({ content: 'Benchmarking is a way to measure a component\'s, or a pc\'s maximum performance. In PC Creator, this is done with Geekbench on the PC, which gives you a number, which is called the benchmark. A chart of benchmarking values for components is available via `,scores`', files: ["https://media.discordapp.net/attachments/571031705109135361/805448286332911636/image0.png"] });
	},
	name: 'benchmarking',
	alias: ['benchmark', 'bm'],
	description: 'Info about benchmarking',
	category: 'PC Creator',
	autores: ['what/how', 'benchmark'],
	cooldown: 5000
};