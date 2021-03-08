module.exports = {
	run: (client, message, args) => {
		// leaderboards
		if (args[1] === 'leaderboard') {
			
		}
		// request opponent
		let request = `Who wants to play Tic Tac Toe with ${message.member.toString()}? First person to respond with "me" will be elected Opponent. (60s)`;
		let answer = 'me';
		let challenge = false;
		// if they challenged someone
		if (message.mentions.members.first()) {
			request = `Does ${message.mentions.members.first().toString()} want to play Tic Tac Toe with ${message.member.toString()}? Respond with "y" to be elected Opponent. (60s)`;
			answer = 'y';
			challenge = true;
		}
		message.channel.send(request).then(a => {
			// wait until someone wants to be the opponent
			message.channel.awaitMessages(x => x.content.toLowerCase().startsWith(answer) && (challenge ? x.author.id === message.mentions.members.first().user.id : true), { max: 1, time: 60000, errors: ['time']}).then(async b => {
				// opponent is the first value of the collection returned by the collector (guildMember)
				const opponent = b.first()?.member;
				// if for some reason there is no opponent, end the game
				if (!opponent) return message.channel.send('Something went wrong! You have no opponent.');
				// game object contains all data about the game
				const game = {
					id: Math.round(Math.random() * 100000).toString(16),
					board: [ /* X */
						[null, null, null], /* Y */
						[null, null, null],
						[null, null, null]
					],
					ended: false,
					turn: 0,
					nextTurn: 1,
					participants: [message.member, opponent],
					errors: [0, 0],
					markers: ['X', 'O'],
					userError: (index) => {
						game.errors[game.turn]++;
						const fouls = [
							'You failed to respond with coordinates.',
							'You failed to respond with coordinates in time.',
							'Illegal move. Outside board bounds.',
							'Illegal move. Position taken.'
						];
						const fatal = game.errors[game.turn] >= 3;
						const consequence = fatal ? 'You lose...' : 'Opponent\'s turn...';
						message.channel.send(`${game.participants[game.turn].toString()} (\`${game.markers[game.turn]}\`) ${fouls[index]} ${consequence}`);
						const returnText = fatal ? 'surrender' : 'illegal';
						game.changeTurn();
						if (fatal) {
							game.victoryAction();
						}
						return returnText;
					},
					changeTurn: () => {
						const temp = game.nextTurn;
						game.nextTurn = game.turn;
						game.turn = temp;
						return;
					},
					victoryAction: () => {
						game.ended = true;
						message.channel.send(`${game.participants[game.turn].toString()} (\`${game.markers[game.turn]}\`) Won the game!`);
						return;
					},
					boardState: () => {
						const markers = [];
						game.board.forEach((column, x) => {
							game.board[x].forEach((marker, y) => {
								markers.push(marker ? marker : ' ');
							});
						});
						let boardText = [
							` ${markers[2]} ┃ ${markers[5]} ┃ ${markers[8]}`,
							'━━━╋━━━╋━━━',
							` ${markers[1]} ┃ ${markers[4]} ┃ ${markers[7]}`,
							'━━━╋━━━╋━━━',
							` ${markers[0]} ┃ ${markers[3]} ┃ ${markers[6]}`
						];
						return '```\n' + boardText.join('\n') + '\n```';
					}
				};
				// init in db
				// send info about how to play the game
				await message.channel.send(`The origin point of the board is in the bottom left (0,0). The top right is (2,2). Syntax for placing your marker is \`[X position],[Y position]\`. 3 fouls and you're out.\n${game.participants[0].toString()} is \`${game.markers[0]}\`\n${game.participants[1].toString()} is \`${game.markers[1]}\`\n\`${game.markers[0]}\` starts!`);
				// cycle function is executed on every turn
				const cycle = () => { return new Promise(async (res, rej) => {
					// result is what .then() returns. ask the player where they want to place their marker
					const result = await message.channel.send('Current board state:\n' + game.boardState() + `\n${game.participants[game.turn].toString()}, Where do you want to place your \`${game.markers[game.turn]}\`? (60s)`).then(async c => {
						// returns what .then() returns. waits for the player to send coordinates. message must contain comma
						return await message.channel.awaitMessages(d => d.author.id === game.participants[game.turn].user.id && d.content.includes(','), { max: 1, time: 60000, errors: ['time'] }).then(e => {
							// coords is the first message of the collection, split into 2 at the comma and mapped into integers
							const coordinates = e.first()?.content.split(',').map(f => parseInt(f));
							// if for some reason the message wasnt coordinates, foul
							if (coordinates.length !== 2 || coordinates.some(x => isNaN(x))) {
								return res(game.userError(0));
							}
							// return coords
							return coordinates;
						}).catch(err => {
							// player failed to send coordinates in time, foul
							return res(game.userError(1));
						});
					});
					if (!result) return;
					if (result[0] > 2 || result[0] < 0 || result[1] > 2 || result[1] < 0) return res(game.userError(2));
					const MarkerAtCoords = game.board[result[0]][result[1]];
					if (!MarkerAtCoords) {
						const playerMarker = game.markers[game.turn];
						game.board[result[0]][result[1]] = playerMarker;
						// if move won, victory to current turn
						// rows
						for (let i = 0; i < 3; i++) {
							if (
								game.board[0][i] === game.board[1][i]
								&& game.board[1][i] === game.board[2][i]
								&& game.board[0][i] === game.markers[game.turn]
							) {
								return res(game.victoryAction());
							}
						}
						// columns
						if (game.board.some(column => 
							column[0] === column[1]
							&& column[1] === column[2]
							&& column[0] === game.markers[game.turn]
						)) return res(game.victoryAction());
						// diagonally
						if (
							(
								game.board[0][0] === game.board[1][1]
								&& game.board[1][1] === game.board[2][2]
								&& game.board[0][0] === game.markers[game.turn]
							)
							|| (
								game.board[0][2] === game.board[1][1]
								&& game.board[1][1] === game.board[2][0]
								&& game.board[0][2] === game.markers[game.turn]
							)
						) return res(game.victoryAction());
						// draw, if none of the spots are null, aka there is a marker in every spot
						if (!game.board.some(x => x.includes(null))) {
							game.ended = true;
							await message.channel.send('It\'s a draw! Neither player won the game.');
							return res();
						}
					} else return res(game.userError(3));
					return res(game.changeTurn());
				})};
				while (!game.ended) {
					await cycle();
				}
				setTimeout(() => message.channel.send('Game has ended.'), 1000);
			}).catch(err => {
				// no one responded "me"
				message.channel.send('Haha no one wants to play with you, lonely goblin.'),
				console.log(err);
			});
		});
	},
	name: 'tictactoe',
	description: 'Play the famous tic tac toe or noughts and crosses or Xs and Os game with a partner',
	alias: ['ttt', 'noughtsandcrosses', 'n&c'],
	cooldown: 60
};