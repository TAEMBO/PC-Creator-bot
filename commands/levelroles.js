module.exports = {
	run: async (client, message, args) => {
		// fetch user or user message sender
		const member = args[1] ? message.mentions.members?.first() || (await client.getMember(message.guild, args[1]).catch(() => { })) : message.member;

		// if no user could be specified, error
		if (!member) return message.channel.send('You failed to mention a user from this server.');

		// information about users progress on level roles
		const eligiblity = await client.userLevels.getEligible(member);
		console.log(eligiblity);

		// index of next role
		const nextRoleKey = eligiblity.roles.map(x => x.role.has).indexOf(false);
		console.log(nextRoleKey);

		// eligibility information about the next level role
		const nextRoleReq = eligiblity.roles[nextRoleKey];
		console.log(nextRoleReq);

		// next <Role> in level roles that user is going to get 
		const nextRole = nextRoleReq ? message.guild.roles.cache.get(nextRoleReq.role.id) : undefined;
		console.log(nextRole?.name);

		// level roles that user has, formatted to "1, 2 and 3"
		let achievedRoles = eligiblity.roles.filter(x => x.role.has).map(x => '**' + message.guild.roles.cache.get(x.role.id).name + '**');
		achievedRoles = achievedRoles.map((x, i) => {
			if (i === achievedRoles.length - 2) return x + ' and ';
			else if (achievedRoles.length === 1 || i === achievedRoles.length - 1) return x;
			else return x + ', ';
		}).join('');
		console.log(achievedRoles);

		
		function progressText(showRequirements = true) { // shows progress, usually to next milestone
			let text = '';
			if (showRequirements) {
				if (eligiblity.messages >= nextRoleReq.requirements.messages) text += ':white_check_mark: ';
				else text += ':x: ';
			} else text += ':gem: ';
			text += eligiblity.messages.toLocaleString('en-US') + (showRequirements ? '/' + nextRoleReq.requirements.messages.toLocaleString('en-US') : '') + ' messages\n';
			if (showRequirements) {
				if (eligiblity.age >= nextRoleReq.requirements.age) text += ':white_check_mark: ';
				else text += ':x: ';
			} else text += ':gem: ';
			text += Math.floor(eligiblity.age).toLocaleString('en-US') + 'd' + (showRequirements ? '/' + nextRoleReq.requirements.age.toLocaleString('en-US') + 'd' : '') + ' time on server.';
			return text;
		}
		
		const pronounBool = (you, they) => { // takes 2 words and chooses which to use based on if user did this command on themself
			if (message.author.id === member.user.id) return you || true;
			else return they || false;
		};
		console.log(pronounBool('you', 'they'));
		
		const messageContents = [];

		if (nextRoleReq) { // if user hasnt yet gotten all the level roles
			messageContents.push(...[ 
				pronounBool('You', 'They') + (achievedRoles.length > 0 ? ' already have the ' + achievedRoles + ' role(s).' : ' don\'t have any level roles yet.'), // show levels roles that user already has, if any
				pronounBool('Your', 'Their') + ' next level role is **' + nextRole.name + '** and here\'s ' + pronounBool('your', 'their') + ' progress:',
				progressText() // show them what their next role is
			]);
			if (nextRoleReq.eligible) { // if theyre eligible for their next role
				messageContents.push(...[
					'',
					pronounBool('You\'re', 'They\'re') + ' eligible for the next level role.', // inform them
				]);
				if (pronounBool()) { // if theyre doing this command themselves,
					setTimeout(() => { // add role
						member.roles.add(nextRole).then(() => message.channel.send('You\'ve received the **' + nextRole.name + '** role.')).catch(() => message.channel.send('Something went wrong while giving you the **' + nextRole.name + '** role.'));
						// and inform user of outcome
					}, 500);
				}
			}
		} else { // they have no next roles. they have all
			messageContents.push(...[
				pronounBool('You', 'They') + ' already have all of the level roles. Here\'s ' + pronounBool('your', 'their') + ' progress:',
				progressText(false) // inform them and show progress with no next milestone
			]);
		}

		message.channel.send(messageContents.join('\n')); // compile message and send




		
		
		
		/*const member = args[1] ? message.mentions.members?.first() || (await client.getMember(message.guild, args[1]).catch(() => { })) : message.member;
		if (!member) return message.channel.send('You failed to mention a user from this server.');
		const age = member.joinedTimestamp < Date.now() - client.userLevels._requirements.age;
		const messages = client.userLevels.getEligible(member.user.id);
		const role = message.guild.roles.cache.get(client.config.mainServer.roles.levelOne);
		if (age && messages) {
			if (member.roles.cache.has(role.id)) return message.channel.send(`${member.user.id === message.author.id ? 'You' : 'They'} already have the **${role.name}** role, but since you asked, heres ${member.user.id === message.author.id ? 'your' : 'their'} progress:\n${messages ? ':white_check_mark:' : ':x:'} ${client.userLevels.getUser(member.user.id)}/${client.userLevels._requirements.messages} messages\n${age ? ':white_check_mark:' : ':x:'} ${Math.floor((Date.now() - member.joinedTimestamp) / 1000 / 60 / 60 / 24)}d/${Math.floor(client.userLevels._requirements.age / 1000 / 60 / 60 / 24)}d time on server.`);
			await message.channel.send(`${member.user.id === message.author.id ? 'You' : 'They'}\'re eligible for access to the **${role.name}** role.${member.user.id === message.author.id ? '' : ` Their progress:\n${messages ? ':white_check_mark: ' : ': x: '} ${client.userLevels.getUser(member.user.id)}/${client.userLevels._requirements.messages} messages\n${age ? ':white_check_mark: ' : ': x:'} ${Math.floor((Date.now() - member.joinedTimestamp) / 1000 / 60 / 60 / 24)}d/${Math.floor(client.userLevels._requirements.age / 1000 / 60 / 60 / 24)}d time on server.`}`);
			if (message.author.id === member.user.id) {
				await member.roles.add(role.id);
				message.channel.send(`You\'ve received the **${role.name}** role. You can now access <#${client.config.mainServer.channels.betterGeneral}>`);
			}
		} else {
			message.channel.send(`${member.user.id === message.author.id ? 'You' : 'They'}\'re not eligible for access to the **${role.name}** role. Progress:\n${messages ? ':white_check_mark:' : ':x:'} ${client.userLevels.getUser(member.user.id)}/${client.userLevels._requirements.messages} messages\n${age ? ':white_check_mark:' : ':x:'} ${Math.floor((Date.now() - member.joinedTimestamp) / 1000 / 60 / 60 / 24)}d/${Math.floor(client.userLevels._requirements.age / 1000 / 60 / 60 / 24)}d time on server.`);
		}*/
	},
	name: 'levelroles',
	description: 'Check your eligibility for level roles.',
	alias: ['lrs'],
	category: 'Moderation'
};