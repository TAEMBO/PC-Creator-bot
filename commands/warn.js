module.exports = {
	run: (client, message, args) => {
		client.punish(client, message, args, 'warn');
	},
	name: 'warn',
	description: 'Add a warning to a member.',
	usage: ['user mention or id', '?reason'],
	category: 'Moderation'
};