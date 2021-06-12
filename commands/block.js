module.exports = {
	run: (client, message, args) => {
		if (!client.hasModPerms(client, message.member)) return message.channel.send('You can\'t do that.');
		if (!args[1]) return message.channel.send('You need to add a user or user ID.');
		const userid = message.mentions.users.first()?.id || args[1];
		client.dmForwardBlacklist.addData(userid);
		message.channel.send('Successfully blocked user ' + userid);
	},
	name: 'block',
	usage: ['user id / mention'],
	description: 'Block user from sending DMs to the bot or ModMail. Used as a punishment for users who abuse the aforementioned entities.',
	shortDescription: 'Block user from DMing bot.',
	category: 'Moderation'
};