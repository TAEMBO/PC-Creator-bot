const util = require('util');
const removeUsername = (text) => {
	let matchesLeft = true;
	const array = text.split('\\');
	while (matchesLeft) {
		let usersIndex = array.indexOf('Users');
		if (usersIndex < 1) matchesLeft = false;
		else {
			let usernameIndex = usersIndex + 1;
			if (array[usernameIndex].length === 0) usernameIndex += 1;
			array[usernameIndex] = '#'.repeat(array[usernameIndex].length);
			array[usersIndex] = 'Us\u200bers';
		}
	}
	return array.join('\\');
};
module.exports = {
	run: async (client, message, args) => {
		if (!client.config.eval.allowed) return message.channel.send('Eval is disabled.');
		if (!client.config.eval.whitelist.includes(message.author.id)) return message.channel.send('You\'re not allowed to use eval');
		const code = message.content.slice(client.prefix.length + args[0].length + 1);
		let output = 'error';
		let error = false;
		try {
			output = await eval(code);
		} catch (err) {
			error = true;
			const embed = new client.embed()
				.setTitle('__Eval__')
				.addField('Input', `\`\`\`js\n${code.slice(0, 1010)}\n\`\`\``)
				.addField('Output', `\`\`\`\n${err}\n\`\`\``)
				.setColor('ff0000');
			message.channel.send(embed).then(errorEmbedMessage => {
				const messagecollector = new client.messageCollector(message.channel, x => x.content === 'stack' && x.author.id === message.author.id, { max: 1, time: 60000 });
				messagecollector.on('collect', collected => {
					collected.channel.send(`\`\`\`\n${removeUsername(err.stack)}\n\`\`\``);
				});
			});
		}
		if (error) return;
		if (typeof output === 'object') {
			output = 'js\n' + util.formatWithOptions({ depth: 1 }, '%O', output);
		} else {
			output = '\n' + String(output);
		}
		const regexp = new RegExp(client.token, 'g');
		output = output.replace(regexp, 'TOKEN_LEAK');
		const embed = new client.embed()
			.setTitle('__Eval__')
			.addField('Input', `\`\`\`js\n${code.slice(0, 1010)}\n\`\`\``)
			.addField('Output', `\`\`\`${removeUsername(output).slice(0, 1016)}\n\`\`\``)
			.setColor(3971825);
		message.channel.send(embed);
	},
	name: 'eval',
	description: 'Run code for debugging purposes'
};