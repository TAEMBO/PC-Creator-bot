module.exports = {
	run: (client, message, args) => {
		if (!client.hasModPerms(client, message.member)) return message.channel.send('You can\'t do that.');
		if (!args[1]) return message.channel.send('You need to add a user or user ID.');
		const userid = message.mentions.users.first()?.id || args[1];
		client.dmForwardBlacklist.addData(userid);
		message.channel.send('Successfully blocked user ' + userid);
	},
	name: 'block',
	usage: ['userID or mention'],
	description: 'End subscription of forwarded DM messages by this user. Also disables Modmail.',
	category: 'Moderation'
};