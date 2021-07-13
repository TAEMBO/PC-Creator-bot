module.exports = {
	run: (client, message, args) => {
		client.punish(client, message, args, 'kick');
	},
	name: 'kick',
	description: 'Kick a member.',
	usage: ['user mention or id', '?reason'],
	category: 'Moderation'
};