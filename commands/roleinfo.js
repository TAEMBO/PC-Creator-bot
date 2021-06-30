module.exports = {
	run: (client, message, args) => {
		const role = message.guild.roles.cache.find(x => x.name.toLowerCase().startsWith(args.slice(1).join(' ')) || x.id === args[1] || x.id === message.mentions.roles?.first()?.id);
		if (!role) return message.channel.send('Role not found.');
		const embed = new client.embed()
			.setTitle('Role Info: ' + role.name)
			.addField('Id', role.id)
			.addField('Created', client.formatTime(Date.now() - role.createdTimestamp, 2, { longNames: true, commas: true }) + ' ago')
			.addField('Misc', `Hoist \`${role.hoist}\`\nMentionable \`${role.mentionable}\`\nPosition \`${role.position}\` from bottom`)
			.setColor(role.color || '#dddddd')
		message.channel.send(embed);
	},
	name: 'roleinfo',
	description: 'Information about a role.',
	usage: ['role name / id / mention']
}