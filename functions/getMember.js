module.exports = (guild, query) => new Promise(async (res, rej) => {
	let member;
	if (query.split(' ')[0].match(/[a-z]|[A-Z]/g)?.length > 0) {
		member = (await guild.members.fetch({ query: query, limit: 1, time: 10000 }).catch(() => rej()))?.first();
		if (!member) rej();
	} else {
		member = await guild.members.fetch(query.split(' ')[0]).catch(() => rej());
		if (!member) rej();
	}
	res(member);
});