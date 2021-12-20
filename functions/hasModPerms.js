module.exports = (client, guildMember) => {
	return guildMember.roles.cache.has(client.config.mainServer.roles.moderator)
};