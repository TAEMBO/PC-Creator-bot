module.exports = {
	run: (client, message, args) => {
		if (!message.member.roles.cache.has(client.config.mainServer.roles.moderator) && !message.member.roles.cache.has(client.config.mainServer.roles.administrator)) return message.channel.send('You can\'t do that.');
		if (!args[1]) return message.channel.send('You need to add a user or user ID.');
		const userid = message.mentions.users.first()?.id || args[1];
		client.dmForwardBlacklist.addData(userid);
		message.channel.send('Successfully blocked user ' + userid);
	},
	name: 'dmforwardblock',
	alias: ['dmforwardblacklist'],
	usage: ['userID or mention'],
	description: 'End subscription of forwarded DM messages by this user.',
	category: 'Moderation'
};