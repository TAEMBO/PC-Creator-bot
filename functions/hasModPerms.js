module.exports = (client, guildMember) => {
	return client.config.mainServer.staffRoles.map(x => client.config.mainServer.roles[x]).some(x => guildMember.roles.cache.has(x));
};