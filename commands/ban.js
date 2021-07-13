module.exports = {
	run: (client, message, args) => {
		client.punish(client, message, args, 'ban');
	},
	name: 'ban',
	description: 'Ban a member.',
	usage: ['user mention or id', '?time', '?reason'],
	category: 'Moderation'
};