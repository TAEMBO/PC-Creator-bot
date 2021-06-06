module.exports = async (client, member) => {
	const mutedRoleID = client.config.mainServer.roles.muted;
	if (!mutedRoleID) return { success: false, text: '"Muted" role does not exist. Check \`config.json\`' };
	const roleRemoveResult = await member.roles.remove(mutedRoleID).then(() => 200).catch(() => 400);
	if (roleRemoveResult === 200) {
		client.mutes.removeData(member.user.id).forceSave();
		member.send(`You were unmuted in ${member.guild.name}.`).catch(() => { });
		return { success: true, text: `Successfully unmuted ${member.user.tag} (${member.user.id})` };
	} else {
		return { success: false, text: 'Unmute was unsuccessful.' };
	}
};