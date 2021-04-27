module.exports = {
	run: (client, message, args) => {
		// 20% of the time responds with a ping
		if (Math.random() < 0.2) message.channel.send(message.member.toString() + (Math.random() < 0.2 ? ' is a :b:ingus' : ' is sus!'));
	},
	name: 'sus',
	description: 'GuildMember deserialization with binary tree inversion',
	category: 'Moderation',
	alias: ['amogus'],
	usage: ['go', 'fuck', 'yourself', 'chikkenn']
};