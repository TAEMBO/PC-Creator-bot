module.exports = {
	run: (client, message, args) => {
		const role = message.guild.roles.cache.find(x => x.name.toLowerCase().startsWith(args.slice(1).join(' ')) || x.id === args[1] || x.id === message.mentions.roles?.first()?.id);
		if (!role) return message.channel.send('Role not found.');
		const keyPermissions = ['ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'VIEW_AUDIT_LOG', 'MANAGE_MESSAGES', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'MANAGE_ROLES'];
		const permissions = role.permissions.toArray();
		const embed = new client.embed()
			.setTitle('Role Info: ' + role.name)
			.addField(':small_blue_diamond: Id', role.id)
			.addField(':small_blue_diamond: Color', `\`${role.hexColor}\``)
			.addField(':small_blue_diamond: Creation Date', `${role.createdAt.getUTCFullYear()}-${('0' + (role.createdAt.getUTCMonth() + 1)).slice(-2)}-${('0' + role.createdAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - role.createdTimestamp, 1, { longNames: true })} ago`)
			.addField(':small_blue_diamond: Misc', `Hoist: \`${role.hoist}\`\nMentionable: \`${role.mentionable}\`\nPosition: \`${role.position}\` from bottom\nMembers: at least \`${role.members.size}\``)
			.addField(':small_blue_diamond: Key Permissions', (permissions.includes('ADMINISTRATOR') ? ['ADMINISTRATOR'] : permissions.filter(x => keyPermissions.includes(x))).map(x => {
				return x.split('_').map((y, i) => i === 0 ? y[0] + y.slice(1).toLowerCase() : y.toLowerCase()).join(' ')
			}).join(', ') || 'None')
			.setColor(role.color || '#fefefe')
		message.channel.send(embed);
	},
	name: 'roleinfo',
	alias: ['role'],
	description: 'Information about a role.',
	usage: ['role name / id / mention']
}