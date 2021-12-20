module.exports = {
	run: (client, message, args) => {
		const timeNames = require('../timeNames.js'); // array of { name, length }
		const embed = new client.embed()
			.setTitle('Time Names')
			.setDescription(`Time names are a way to express an amount of time, eg. 1 hour. Supported time names include: ${timeNames.map(x => x.name).join(', ')}.\nThe syntax for expressing time is \`[amount][time unit]\`. Multiple expressions can be chained together with spaces. Month and minute both start with the same character, so \`m\` means minute and \`mo\` means month. When writing out the full word, eg. \`second\`, the time unit must not be in plural.`)
			.addField('Examples', '\`1year\` means the average length of a year.\n\`1m 15s\` means 1 minute and 15 seconds.\n\`1mo 2week\` means 1 month and 2 weeks. A month is 30 days long. A week is 7 days long.\n\`23h 59m 59s\` is 1 second shorter than a day.')
			.setColor(client.embedColor)
		message.channel.send({embeds: [embed]});
	},
	name: 'timenames',
	description: 'Explains time names used in moderation commands.',
	category: 'Moderation'
};