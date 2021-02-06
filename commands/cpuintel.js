const childProcess = require('child_process');
module.exports = {
	run: async (client, message, args) => {
		if (!args[1]) return message.channel.send('You need to search for a specific CPU.');
		let processor;
		let error = false;
		await (new Promise((res, rej) => {
			const cmdArgs = ['pcpp.py', '1', 'processor', 'intel', ...args.slice(1)];
			console.log(cmdArgs);
			const scraper = childProcess.spawn('python', cmdArgs);
			scraper.stdout.on('data', data => {
				processor = JSON.parse(data.toString())[0];
				res();
			});
			scraper.on('exit', code => {
				console.log('code', code);
				if (code !== 0) {
					message.channel.send('Failed.');
					rej();
				}
				res();
			});
		})).catch(err => {
			error = true;
			return message.channel.send('No results.')
		});
		if (error) return;
		console.log(processor.specs);
		const embed = new client.embed()
			.setTitle(processor.name)
			.addField('Price USD', processor.price, true)
			.addField('Core Count', processor.specs['Core Count'][0], true)
			.addField('Hyperthreading', processor.specs['Simultaneous Multithreading'][0].split(':')[0], true)
			.addField('Base Clock', processor.specs['Core Clock'][0], true)
			.addField('Boost Clock', processor.specs['Boost Clock'][0], true)
			.addField('TDP', processor.specs.TDP[0], true)
			.addField('Socket', processor.specs.Socket[0], true)
			.addField('iGPU', processor.specs['Integrated Graphics'][0], true)
			.addField('ECC Support', processor.specs['ECC Support'][0], true)
			.addField('Lithography', parseInt(processor.specs['Lithography'][0]) > 10 ? processor.specs['Lithography'][0] + ' <:LOL:720879922008031246>' : processor.specs['Lithography'][0], true)
			.setThumbnail(processor.image)
		message.channel.send(embed);

	},
	name: 'cpuintel',
	description: 'Info about Intel CPUs',
	usage: ['search query'],
	cooldown: 10000
};