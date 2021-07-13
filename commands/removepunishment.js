module.exports = {
	run: (client, message, args) => {
		client.unPunish(client, message, args, 'ban');
	},
	name: 'removepunishment',
	description: 'Remove an active punishment from a user, or an entry from their punishment history.',
	usage: ['case id', '?reason'],
	alias: ['unban', 'unmute', 'unwarn'],
	category: 'Moderation'
};