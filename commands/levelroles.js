module.exports = {
	run: async (client, message, args) => {
		if (message.guild.id !== client.config.mainServer.id) return message.channel.send('This command doesn\'t work in this server.');

		// dailymsgs.json
		const dailyMsgs = require('../dailyMsgs.json');

		// if args[1] is "stats", show stats
		if (args[1] === 'stats') {
			// days since mar 22, 2021 when userlevels was created
			const timeActive = Math.floor((Date.now() - 1616371200000) / 1000 / 60 / 60 / 24);
			// messages sent by each user, unordered array
			const messageCounts = Object.values(client.userLevels._content);
			// amount of users in messageCounts
			const userCount = messageCounts.length;
			// total amount of messages sent
			const messageCountsTotal = messageCounts.reduce((a, b) => a + b, 0);
			// average messages sent by user
			const average = messageCountsTotal / userCount;
			// messages sent by median user
			const median = messageCounts.sort((a, b) => a - b)[Math.round(userCount / 2) - 1];
			// next message count milestone
			const milestone = client.userLevels._milestone();
			
			// days to get average from
			const dataLength = 30;
			// last 30d, sorted by date ascending
			const lastMonth = Object.entries(dailyMsgs).sort((a, b) => {
				const aDate = a[0].split('-').map(x => parseInt(x));
				const bDate = b[0].split('-').map(x => parseInt(x));
				const yearDiff = aDate[2] - bDate[2];
				if (yearDiff) return yearDiff;
				const monthDiff = aDate[1] - bDate[1];
				if (monthDiff) return monthDiff;
				const dayDiff = aDate[0] - bDate[0];
				if (dayDiff) return dayDiff;
				else return 0;
			}).slice(-(dataLength + 1));

			// if data is shorter than 30d (data is available from less than 30 truthy days), take that into account when calculating average
			const actualDataLength = lastMonth.filter(x => x).length - 1;

			// messages today relative to yesterday, daily change in msgs
			const msgsPerDay = lastMonth.slice(1).map((day, i) =>{
				return day[1] - (lastMonth[i][1] || day[1])
			});
			// average msgs per day
			const averageMsgsPerDay = msgsPerDay.reduce((a, b) => a + b, 0) / actualDataLength;

			// acceleration of messages per day
			function accelAverage(data) {
				return data.reduce((a, b) => a + b, 0) / data.length;
			}
			const accelPerHour = ((accelAverage(msgsPerDay.slice(-7)) - accelAverage(msgsPerDay.slice(0, 7))) / (actualDataLength * 24)) /* for some reason */ / 24;
			
			// predict
			let hours = 0;
			let serverHalted = false;
			let predictedMsgsPerHour = averageMsgsPerDay / 24;
			let messagesSent = messageCountsTotal;
			if (milestone.next) {
				while (messagesSent < milestone.next && predictedMsgsPerHour > 0) {
					messagesSent += predictedMsgsPerHour;
					predictedMsgsPerHour += accelPerHour;
					hours++;
				}
				if (messagesSent < milestone.next) serverHalted = true;
			}
			// turn minutes into milliseconds
			const millisecondsToMilestone = hours * 60 * 60 * 1000;

			const embed = new client.embed()
				.setTitle('Level Roles: Stats')
				.setDescription(`Level Roles was created ${timeActive} days ago.\nSince then, a total of ${messageCountsTotal.toLocaleString('en-US')} messages have been sent in this server by ${userCount.toLocaleString('en-US')} users.\nIn the last ${actualDataLength} days, on average, ${averageMsgsPerDay.toLocaleString('en-US', { maximumFractionDigits: 2 })} messages have been sent every day.\nAn average user has sent ${average.toFixed(2)} messages.\n${((messageCounts.filter(x => x >= average).length / userCount) * 100).toFixed(2)}% of users have sent more than or as many messages as an average user.\nThe median user has sent ${median} messages.\nThe top 1% of users have sent ${((messageCounts.sort((a, b) => b - a).slice(0, Math.round(userCount / 100)).reduce((a, b) => a + b, 0) / messageCountsTotal) * 100).toLocaleString('en-US', { maximumFractionDigits: 2 })}% of messages while Level Roles has existed.\nThe next message milestone ${milestone.next ? `is ${milestone.next.toLocaleString('en-US')} messages and the progress from the previous milestone (${milestone.previous.toLocaleString('en-US')}) to the next is ${(milestone.progress * 100).toFixed(2)}%.\nAt the current rate, reaching the next milestone would ${(!serverHalted ? 'take ' : `never happen. The server would grind to a halt in `) + client.formatTime(millisecondsToMilestone, 2, { commas: true, longNames: true })}.` : `doesn\'t exist.`}`)
				.addField('Top Users by Messages Sent', Object.entries(client.userLevels._content).sort((a, b) => b[1] - a[1]).slice(0, 5).map((x, i) => `\`${i + 1}.\` <@${x[0]}>: ${x[1].toLocaleString('en-US')}`).join('\n'))
				.setColor(client.embedColor)
			message.channel.send(embed);
			return;
		} else if (args[1] === 'dailymsgs' || args[1] === 'dmsgs') {
			const data = Object.values(dailyMsgs).map((x, i, a) => x - (a[i - 1] || x)).slice(1).slice(-60);
			const accuracy = 1000;
			const maxValue = Math.ceil(Math.max(...data) / accuracy) * accuracy;

			const textSize = 32;

			const canvas = require('canvas');
			const fs = require('fs');
			const img = canvas.createCanvas(950, 450);
			const ctx = img.getContext('2d');

			const graphOrigin = [10, 50];
			const graphSize = [700, 360];
			const nodeWidth = graphSize[0] / (data.length - 1);
			ctx.fillStyle = '#36393f';
			ctx.fillRect(0, 0, img.width, img.height);

			// grey horizontal lines
			ctx.lineWidth = 3;
			ctx.strokeStyle = '#202225';
			const linescount = maxValue / accuracy;
			for (let i = 0; i <= linescount; i++) {
				ctx.beginPath();
				const y = graphOrigin[1] + (i * (graphSize[1] / linescount));
				ctx.lineTo(graphOrigin[0], y);
				ctx.lineTo(graphOrigin[0] + graphSize[0], y);
				ctx.stroke();
				ctx.closePath();
			}

			// 30d mark
			ctx.setLineDash([8, 16]);
			ctx.beginPath();
			const lastMonthStart = graphOrigin[0] + (nodeWidth * (data.length - 30));
			ctx.lineTo(lastMonthStart, graphOrigin[1]);
			ctx.lineTo(lastMonthStart, graphOrigin[1] + graphSize[1]);
			ctx.stroke();
			ctx.closePath();
			ctx.setLineDash([]);

			// draw points
			ctx.strokeStyle = '#5865F2';
			ctx.fillStyle = '#5865F2';
			ctx.lineWidth = 3;


			function getYCoordinate(value) {
				return ((1 - (value / maxValue)) * graphSize[1]) + graphOrigin[1];
			}

			let lastCoords = [];
			data.forEach((val, i) => {
				ctx.beginPath();
				if (lastCoords) ctx.moveTo(...lastCoords);
				if (val < 0) val = 0;
				const x = i * nodeWidth + graphOrigin[0];
				const y = getYCoordinate(val);
				ctx.lineTo(x, y);
				lastCoords = [x, y];
				ctx.stroke();
				ctx.closePath();

				// ball
				ctx.beginPath();
				ctx.arc(x, y, ctx.lineWidth * 1.2, 0, 2 * Math.PI)
				ctx.closePath();
				ctx.fill();

			});

			// draw text
			ctx.font = '400 ' + textSize + 'px sans-serif';
			ctx.fillStyle = 'white';

			// highest value
			const maxx = graphOrigin[0] + graphSize[0] + textSize;
			const maxy = graphOrigin[1] + (textSize / 3);
			ctx.fillText(maxValue.toLocaleString('en-US'), maxx, maxy);

			// lowest value
			const lowx = graphOrigin[0] + graphSize[0] + textSize;
			const lowy = graphOrigin[1] + graphSize[1] + (textSize / 3);
			ctx.fillText('0 msgs/day', lowx, lowy);

			// 30d
			ctx.fillText('30d ago', lastMonthStart, graphOrigin[1] - (textSize / 3));

			// time ->
			const tx = graphOrigin[0] + (textSize / 2);
			const ty = graphOrigin[1] + graphSize[1] + (textSize);
			ctx.fillText('time ->', tx, ty);

			const attachment = new client.messageattachment(img.toBuffer(), 'dailymsgs.png');
			return message.channel.send('LevelRoles Messages per Day in ' + client.guilds.cache.get(client.config.mainServer.id).name, { files: [attachment] });
		}

		// fetch user or user message sender
		const member = args[1] ? message.mentions.members?.first() || (await client.getMember(message.guild, args[1]).catch(() => { })) : message.member;

		// if no user could be specified, error
		if (!member) return message.channel.send('You failed to mention a user from this server.');

		// information about users progress on level roles
		const eligiblity = await client.userLevels.getEligible(member);

		// index of next role
		const nextRoleKey = eligiblity.roles.map(x => x.role.has).indexOf(false);

		// eligibility information about the next level role
		const nextRoleReq = eligiblity.roles[nextRoleKey];

		// next <Role> in level roles that user is going to get 
		const nextRole = nextRoleReq ? message.guild.roles.cache.get(nextRoleReq.role.id) : undefined;

		// level roles that user has, formatted to "1, 2 and 3"
		let achievedRoles = eligiblity.roles.filter(x => x.role.has).map(x => '**' + message.guild.roles.cache.get(x.role.id).name + '**');
		achievedRoles = achievedRoles.map((x, i) => {
			if (i === achievedRoles.length - 2) return x + ' and ';
			else if (achievedRoles.length === 1 || i === achievedRoles.length - 1) return x;
			else return x + ', ';
		}).join('');
		
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

		if (pronounBool()) {
			const index = Object.entries(client.userLevels._content).sort((a, b) => b[1] - a[1]).map(x => x[0]).indexOf(message.author.id) + 1;
			const suffix = ((index) => {
				const numbers = index.toString().split('').reverse(); // eg. 1850 -> [0, 5, 8, 1]
				if (numbers[1] === '1') { // this is some -teen
					return 'th';
				} else {
					if (numbers[0] === '1') return 'st';
					else if (numbers[0] === '2') return 'nd';
					else if (numbers[0] === '3') return 'rd';
					else return 'th';
				}
			})(index);
			messageContents.push(`You're ${index ? index + suffix : 'last'} in a descending list of all users, ordered by their Level Roles message count.`);
		}

		message.channel.send(messageContents.join('\n')); // compile message and send
	},
	name: 'levelroles',
	usage: ['?user ID / mention / "stats" / "dailymsgs"'],
	description: 'Check your eligibility for level roles or see global stats.',
	alias: ['lrs'],
	category: 'Moderation',
	cooldown: 6
};