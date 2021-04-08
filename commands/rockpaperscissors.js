module.exports = {
	run: async (client, message, args) => {
		if (client.rpsGames.has(message.channel.id)) {
			return message.channel.send(`There is already an ongoing game in this channel created by ${client.rpsGames.get(message.channel.id)}`);
		}
		const players = [message.member];
		await message.channel.send(`Who wants to play Rock Paper Scissors with ${message.member.toString()}? Respond with "me". (60s)`);
		client.rpsGames.set(message.channel.id, message.author.tag);
		const opponentMessages = await message.channel.awaitMessages(x => x.content.toLowerCase().startsWith('me'), { max: 1, time: 60000, errors: ['time'] }).catch(() => message.channel.send('Haha no one wants to play with you, lonely goblin.'));
		players[1] = opponentMessages.first()?.member;
		if (!players[1]) return message.channel.send('Something went wrong! You have no opponent.');
		await message.channel.send('You have 10 seconds to choose what you want to play. Respond with the full word, but do not send your message yet. The valid options are: Rock, Paper, and Scissors.');
		await new Promise((res, rej) => {
			setTimeout(() => {
				res();
			}, 10000);
		});
		await message.channel.send('10 seconds have passed. **Send your message NOW!** You have 2 seconds to send your message.');
		const plays = ['scissors', 'paper', 'rock'];
		let timeError = false;
		let homePlay = message.channel.awaitMessages(x => x.author.id === players[0].user.id, { max: 1, time: 2000, errors: ['time']}).catch((err) => {
			message.channel.send(`${players[0].toString()} failed to play their move in time.`);
			timeError = true;
			return '';
		});
		let guestPlay = message.channel.awaitMessages(x => x.author.id === players[1].user.id, { max: 1, time: 2000, errors: ['time'] }).catch((err) => {
			message.channel.send(`${players[1].toString()} failed to play their move in time.`);
			timeError = true;
			return '';
		});
		const resolvedPlays = await Promise.all([homePlay, guestPlay]);
		if (timeError) {
			client.rpsGames.delete(message.channel.id);
			return;
		}
		homePlay = resolvedPlays[0];
		guestPlay = resolvedPlays[1];
		homePlay = plays.indexOf(homePlay.first()?.content.toLowerCase().split(' ')[0]);
		guestPlay = plays.indexOf(guestPlay.first()?.content.toLowerCase().split(' ')[0]);
		if (homePlay < 0 || guestPlay < 0) {
			client.rpsGames.delete(message.channel.id);
			return message.channel.send('One player failed to play a valid option.');
		}
		let winnerIndex;
		if (homePlay + 1 === guestPlay) winnerIndex = 0;
		if (guestPlay + 1 === homePlay) winnerIndex = 1;
		if (homePlay === 0 && guestPlay === 2) winnerIndex = 1;
		if (homePlay === 2 && guestPlay === 0) winnerIndex = 0;

		const homeEmojis = ['v', 'raised_hand', 'right_facing_fist'].map(x => ':' + x + ':');
		const guestEmojis = ['v', 'raised_back_of_hand', 'left_facing_fist'].map(x => ':' + x + ':');
		const arrows = ['arrow_right', 'arrow_left'].map(x => ':' + x + ':');
		if (winnerIndex !== undefined) {
			message.channel.send(`${homeEmojis[homePlay]} ${arrows[winnerIndex]} ${guestEmojis[guestPlay]}\n${players[winnerIndex].toString()} wins!`);
		} else {
			message.channel.send(`${homeEmojis[homePlay]} :left_right_arrow: ${guestEmojis[guestPlay]}\nIts a draw!`);
		}
		client.rpsGames.delete(message.channel.id);
	},
	name: 'rockpaperscissors',
	description: 'Play rock paper scissors against another person',
	alias: ['rps']
};