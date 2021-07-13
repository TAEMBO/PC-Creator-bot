module.exports = {
	run: (client, message, args) => {
		client.punish(client, message, args, 'softban');
	},
	name: 'softban',
	description: 'Ban a member, delete their messages from the last 7 days and unban them.',
	usage: ['user mention or id', '?reason'],
	category: 'Moderation'
};