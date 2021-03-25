module.exports = (client, member) => {
	const embed = new client.embed()
		.setAuthor(`${member.displayName} (${member.user.id})`, member.user.avatarURL({ format: 'png', dynamic: true, size: 128 }))
		.setTitle(`Specs`)
		.setDescription(`These are their computer specs. Use \`${client.prefix}specifications help\` to learn more about this command.`)
		.setColor(client.embedColor)
	const specs = client.specsDb.getUser(member.user.id);
	Object.entries(specs).forEach(spec => {
		embed.addField(spec[0], spec[1]);
	});
	return embed;
};