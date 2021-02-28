module.exports = (client, commandName, member) => {
	if (commandName !== 'ping') return { code: false };
	const spammers = client.commands.get('ping').spammers;
	const userID = member.user.id;
	if (spammers.has(userID)) {
		const spammer = spammers.get(userID);
		if (spammer.startTime > Date.now() - 10000) {
			spammers.delete(userID);
			return { code: false };
		} else {
			spammer.uses++;
			if (spammer.uses === 5 && spammer.startTime + 10000 >= Date.now()) {
				return { code: true, msg: ':b: Stop spamming me!' };
			} else if (spammer.startTime + 10000 > Date.now()) {
				return { code: false };
			} else {
				return { code: true, msg: false };
			}
		}
	} else {
		spammers.set(userID, { startTime: Date.now(), uses: 1 });
		return false;
	}
};