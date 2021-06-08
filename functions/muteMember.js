module.exports = async (client, member, options) => {
	let { time, reason } = options;
	const mutedRoleID = client.config.mainServer.roles.muted;
	if (!mutedRoleID) return { success: false, text: '"Muted" role does not exist. Check \`config.json\`' };
	reason = reason || 'unspecified';
	const roleAddResult = await member.roles.add(mutedRoleID, 'Mute reason: ' + reason).then(() => 200).catch(() => 400);
	if (roleAddResult === 200) {
		if (time) {
			client.mutes.addData(member.user.id, { time: Date.now() + time, reason }).forceSave();
			member.send(`You were muted in ${member.guild.name} for ${client.formatTime(time, 2, { longNames: true })} for reason \`${reason}\``).catch(() => { });
			return { success: true, text: `Successfully muted ${member.user.tag} (${member.user.id}) for ${client.formatTime(time, 2, { longNames: true, commas: true })} (${time}ms) for reason \`${reason}\`.` };
		} else {
			client.mutes.addData(member.user.id, { time: 'inf', reason }).forceSave();
			member.send(`You were muted in ${member.guild.name} forever for reason \`${reason}\``).catch(() => { });
			return { success: true, text: `Successfully muted ${member.user.tag} (${member.user.id}) forever for reason \`${reason || 'unspecified'}\`.` };
		}
	} else {
		return { success: false, text: 'Mute was unsuccessful.' };
	}
};