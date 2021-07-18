module.exports = (punishment, client, cancels) => {
	if (punishment.type === 'removeOtherPunishment') {
		cancels ||= client.punishments._content.find(x => x.id === punishment.cancels)
		return cancels.type[0].toUpperCase() + cancels.type.slice(1) + ' Removed';
	} else return punishment.type[0].toUpperCase() + punishment.type.slice(1);
}