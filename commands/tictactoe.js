module.exports = {
	run: (client, message, args) => {
		// request opponent
		message.channel.send(`Who wants to play Tic Tac Toe with ${message.member.toString()}? First person to respond with "me" will be elected Opponent.`).then(a => {
			// wait until someone wants to be the opponent
			message.channel.awaitMessages(x => x.content.toLowerCase() === 'me', { max: 1, time: 15000, errors: ['time']}).then(async b => {
				// opponent is the first value of the collection returned by the collector (guildMember)
				const opponent = b.first()?.member;
				// if for some reason there is no opponent, end the game
				if (!opponent) return message.channel.send('Something went wrong! You have no opponent.');
				// game object contains all data about the game
				const game = {
					board: [ /* X */
						[null, null, null], /* Y */
						[null, null, null],
						[null, null, null]
					],
					ended: false,
					turn: 0,
					nextTurn: 1,
					participants: [message.member, opponent],
					markers: ['X', 'O']
				};
				// send info about how to play the game
				await message.channel.send(`The origin point of the board is in the bottom left (0,0). The top right is (2,2). Syntax for placing your marker is \`[X position],[Y position]\`\n${game.participants[0].toString()} is \`${game.markers[0]}\`\n${game.participants[1].toString()} is \`${game.markers[1]}\`\n\`${game.markers[0]}\` starts!`);
				// cycle function is executed on every turn
				const cycle = () => { return new Promise(async (res, rej) => {
					// result is what .then() returns. ask the player where they want to place their marker
					const result = await message.channel.send(`${game.participants[game.turn].toString()}, Where do you want to place your \`${game.markers[game.turn]}\`?`).then(async c => {
						// returns what .then() returns. waits for the player to send coordinates. message must contain comma
						return await message.channel.awaitMessages(d => d.author.id === game.participants[game.turn].user.id && d.content.includes(','), { max: 1, time: 15000, errors: ['time'] }).then(e => {
							// coords is the first message of the collection, split into 2 at the comma and mapped into integers
							const coordinates = e.first()?.content.split(',').map(f => parseInt(f));
							// if for some reason the message wasnt coordinates, other player wins
							if (coordinates.length < 2 || coordinates.some(x => isNaN(x))) {
								message.channel.send(`${game.participants[game.turn].toString()} you failed to respond with coordinates. ${game.participants[game.nextTurn].toString()} wins!`);
								return 'surrender';
							}
							// return coords or surrender
							return coordinates;
						}).catch(err => {
							// player failed to send coordinates in time
							message.channel.send(`You failed to respond with coordinates in time! ${game.participants[game.nextTurn].toString()} wins!`);
							return 'surrender'
						});
					});
					let resValue = true;
					const victoryAction = () => {
						game.ended = true;
						message.channel.send(`${game.participants[game.turn].toString()} (\`${game.markers[game.turn]}\`) Won the game!`);
						return;
					};
					if (result === 'surrender') {
						// victory to nextTurn
						game.turn = game.nextTurn;
						res(victoryAction());
					} else if (result.length === 2) {
						if (result[0] > 2 || result[0] < 0 || result[1] > 2 || result[1] < 0) {
							message.channel.send('Illegal move. Outside board bounds. Opponent\'s turn...');
							resValue = 'illegal';
						}
						const MarkerAtCoords = game.board[result[0]][result[1]];
						if (!MarkerAtCoords) {
							const playerMarker = game.markers[game.turn];
							game.board[result[0]][result[1]] = playerMarker;
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
							message.channel.send('Current board state:\n```\n' + boardText.join('\n') + '\n```');							
							// if move won, victory to current turn
							// rows
							for (let i = 0; i < 3; i++) {
								if (
									game.board[0][i] === game.board[1][i]
									&& game.board[1][i] === game.board[2][i]
									&& game.board[0][i] === game.markers[game.turn]
								) {
									res(victoryAction());
									break;
								}
							}
							// columns
							if (game.board.some(column => 
								column[0] === column[1]
								&& column[1] === column[2]
								&& column[0] === game.markers[game.turn]
							)) res(victoryAction());
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
							) res(victoryAction());
							
						} else {
							message.channel.send('Illegal move. Position taken. Opponent\'s turn...');
							resValue = 'illegal';
						}
						const temp = game.nextTurn;
						game.nextTurn = game.turn;
						game.turn = temp;
					}
					res(resValue);
				})};
				while (!game.ended) {
					await cycle();
				}
				message.channel.send('Game has ended.');
			}).catch(err => {
				// no one responded "me"
				message.channel.send('Haha no one wants to play with you, lonely goblin.')
			});
		});
	},
	name: 'tictactoe',
	description: 'Play the famous tic tac toe or noughts and crosses or Xs and Os game with a partner',
	alias: ['ttt', 'noughtsandcrosses', 'n&c']
};