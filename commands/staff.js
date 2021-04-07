const BLACKLIST = [
	'321615117550616588', /* boss */
	'467668917696069662', /* samsuper */
	'712261063953088592', /* operator */
	'766571863588601877', /* vik */
	'753323255749672991', /* pcc bot ishs */
	'245418602524704769', /* abby test */
	'251775015169556481', /* andrew */
	'518113580906840088', /* serj */
];
module.exports = {
    run: (client, message, args) => {
		const staff = new Map(Object.entries({
			administrator: message.guild.roles.cache.get(client.config.mainServer.roles.administrator),
			moderator: message.guild.roles.cache.get(client.config.mainServer.roles.moderator),
			trialmoderator: message.guild.roles.cache.get(client.config.mainServer.roles.trialmoderator),
			helper: message.guild.roles.cache.get(client.config.mainServer.roles.helper),
		}));
		let desc = '';
		staff.forEach((role, key) => {
			const members = role.members.filter(x => !BLACKLIST.includes(x.user.id));
			if (members.size > 0) desc += '**' + role.toString() + '**\n' + members.map(x => x.toString()).join('\n') + '\n\n';
			if (key === 'trialmoderator') desc += 'If you want to report someone or need any other moderation help, feel free to message anyone of these people.\n\n';
			if (key === 'helper') desc += 'If you have a question with the game, you are open to ping or message a helper to receive help.\n\n';
		});
		const embed = new client.embed()
			.setTitle('__Staff Members__')
			.setDescription(desc)
			.setColor(3971825)
		message.channel.send(embed);
    },
	name: 'staff',
	description: 'Shows all the current staff members'
};