module.exports = (client, commandName, member) => {
	if (commandName !== 'ping') return { code: false };
	const spammers = client.commands.get('ping').spammers;
	const userID = member.user.id;
	// if user is currently spamming
	if (spammers.has(userID)) {
		const spammer = spammers.get(userID);
		// if over 10 seconds have passed since the first ,ping
		if (spammer.startTime > Date.now() - 10000) {
			// theyre no longer spamming
			spammers.delete(userID);
			return { code: false }; // not considered spamming
		} else {
			// less than 10 seconds have passed since the first ,ping
			spammer.uses++; // they did ,ping so add 1 use
			// if theyve done ,ping 5 times
			if (spammer.uses === 5) {
				return { code: true, msg: ':b: Stop spamming me!' }; // considered spamming, scold
			} else if (spammer.uses > 5) { // if theyve done ,ping already over 5 times
				return { code: true, msg: false }; // considered spamming, ignore
			} else { // theyve done ,ping less than 5 times
				return { code: false }; // not spamming
			}
		}
	} else {
		// user is not currently spamming, start their spamming
		spammers.set(userID, { startTime: Date.now(), uses: 1 });
		return { code: false }; // not considered spamming
	}
};