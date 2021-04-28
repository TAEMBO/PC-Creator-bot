module.exports = {
	run: async (client, message, args) => {
		const db = client.tictactoeDb;
		// remove from cooldown
		const emptyCooldown = () => {
			client.cooldowns.get(message.author.id).set('tictactoe', Date.now() + 8000);
		};

		// leaderboards
		if (args[1] === 'leaderboard' || args[1] === 'lb') {
			emptyCooldown();
			const embed = new client.embed()
				.setTitle('__Tic Tac Toe Statistics__')
				.setDescription(`A total of ${db.getTotalGames()} games have been played.`)
				.setFooter(`Do "${client.prefix}ttt stats [username]" for player stats.`)
				.setColor(client.embedColor)
			await message.channel.send(embed);
			await message.channel.send(`Recent Games\n\`\`\`\n${client.createTable(['Home', 'Guest', 'Time Ago'], db.getRecentGames(6).map(x => [...x.players, client.formatTime(Date.now() - x.startTime)]), { columnAlign: ['left', 'right', 'middle'], columnSeparator: ['-', '|'] }, client)}\n\`\`\`\nBest Players (>10 games played)\n\`\`\`\n${client.createTable(['Player', 'Win Percentage'], db.getBestPlayers(6).map(x => [x[0], db.calcWinPercentage(x[1])]), { columnAlign: ['left', 'middle'], columnSeparator: [''] }, client)}\n\`\`\`\nMost Active Players\n\`\`\`\n${client.createTable(['Player', 'Total Games'], db.getMostActivePlayers(6).map(x => [x[0], x[1].total.toString()]), { columnAlign: ['left', 'middle'], columnSeparator: [''] }, client)}\n\`\`\``);
			return;
		} else if (args[1] === 'stats') {
			emptyCooldown();
			const allPlayers = db.getAllPlayers();
			let playerStats;
			let username;
			if (message.mentions.members.first()) {
				playerStats = allPlayers[message.mentions.members.first()?.user.tag];
				username = message.mentions.members.first()?.user.tag
			} else if (args[2]) {
				playerStats = allPlayers[args[2]];
				username = args[2];
				if (!playerStats) {
					const member = await message.guild.members.fetch(args[2]);
					playerStats = allPlayers[member.user.tag];
					username = member.user.tag;
				}
			} else {
				playerStats = allPlayers[message.author.tag];
				username = message.author.tag;
			}
			if (!playerStats) return message.channel.send('User not found.');
			const embed = new client.embed()
				.setTitle(`__Tic Tac Toe Statistics: ${username}__`)
				.setDescription(`This user has played a total of ${playerStats.total} games.\n${playerStats.wins} of those were wins.\n${playerStats.losses} of those were losses.\n${playerStats.draws} of those were draws.\nThis user has a win percentage of \`${db.calcWinPercentage(playerStats)}\``)
				.setColor(client.embedColor)
			return message.channel.send(embed);
		}
		if (client.games.has(message.channel.id)) {
			return message.channel.send(`There is already an ongoing game in this channel created by ${client.games.get(message.channel.id)}`);
		}
		// request opponent
		let request = `Who wants to play Tic Tac Toe with ${message.member.toString()}? First person to respond with "me" will be elected Opponent. (60s)`;
		let challenge = false;
		// if they challenged someone
		if (message.mentions.members.first()) {
			request = `Does ${message.mentions.members.first().toString()} want to play Tic Tac Toe with ${message.member.toString()}? Respond with y/n to decide if you want to be elected Opponent. (60s)`;
			challenge = true;
		}
		message.channel.send(request).then(a => {
			client.games.set(message.channel.id, message.author.tag);
			// wait until someone wants to be the opponent
			message.channel.awaitMessages(x => {
				if (challenge) {
					return ['y', 'n'].some(y => x.content.toLowerCase().startsWith(y)) && x.author.id === message.mentions.members.first().user.id;
				} else {
					return x.content.toLowerCase().startsWith('me');
				}
			}, { max: 1, time: 60000, errors: ['time']}).then(async b => {
				if (challenge) {
					if (b.first()?.content.toLowerCase().startsWith('n')) throw undefined;
				}
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
					startTime: Date.now(),
					get singleplayer() {
						return this.participants[0].user.id === this.participants[1].user.id;
					},
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
						message.channel.send(`${game.boardState()}\n${game.participants[game.turn].toString()} (\`${game.markers[game.turn]}\`) Won the game!${game.singleplayer ? ' Singleplayer games are not counted in Tic Tac Toe Statistics.' : ' TIP: You can view Tic Tac Toe statistics with `' + client.prefix + 'ttt leaderboard`'}`);
						if (game.singleplayer) return;
						db.addData({ players: game.participants.map(x => x.user.tag), winner: game.participants[game.turn].user.tag, startTime: game.startTime, endTime: Date.now() });
						return;
					},
					draw: () => {
						game.ended = true;
						message.channel.send(game.boardState() + '\nIt\'s a draw! Neither player won the game. TIP: You can view Tic Tac Toe statistics with `' + client.prefix + 'ttt leaderboard`');
						if (game.singleplayer) return;
						db.addData({ players: game.participants.map(x => x.user.tag), draw: true, startTime: game.startTime, endTime: Date.now() });
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
						return 'Current board state:\n```\n' + boardText.join('\n') + '\n```';
					}
				};
				// send info about how to play the game
				await message.channel.send(`The origin point of the board is in the bottom left (0,0). The top right is (2,2). Syntax for placing your marker is \`[X position],[Y position]\`. 3 fouls and you're out. You can type \`${client.prefix}end\` to surrender on your own turn or \`${client.prefix}draw\` to suggest a draw to your opponent.\n${game.participants[0].toString()} is \`${game.markers[0]}\`\n${game.participants[1].toString()} is \`${game.markers[1]}\`\n\`${game.markers[0]}\` starts!`);
				// cycle function is executed on every turn
				const cycle = () => { return new Promise(async (res, rej) => {
					// result is what .then() returns. ask the player where they want to place their marker
					const result = await message.channel.send(game.boardState() + `\n${game.participants[game.turn].toString()}, Where do you want to place your \`${game.markers[game.turn]}\`? (60s)`).then(async c => {
						// returns what .then() returns. waits for the player to send coordinates. message must contain comma
						return await message.channel.awaitMessages(d => d.author.id === game.participants[game.turn].user.id && d.content.includes(',') && d.content.indexOf(',') <= 1, { max: 1, time: 60000, errors: ['time'] }).then(async e => {
							// ,end
							if (e.first()?.content.startsWith(client.prefix + 'end')) {
								await message.channel.send(`${game.participants[game.turn].toString()} (\`${game.markers[game.turn]}\`) wants to surrender!`);
								game.changeTurn();
								game.victoryAction();
								return res();
							// ,draw
							} else if (e.first()?.content.startsWith(client.prefix + 'draw')) {
								await message.channel.send(`${game.participants[game.nextTurn].toString()} (\`${game.markers[game.nextTurn]}\`), do you want to end the game in a draw? Respond with y/n. (60s)`);
								const opponentResponses = await message.channel.awaitMessages(x => x.author.id === game.participants[game.nextTurn].user.id && ['y', 'n'].some(y => x.content.toLowerCase().startsWith(y)), { max: 1, time: 60000, errors: ['time']}).catch(() => message.channel.send('Game does not end.'));
								
								if (opponentResponses.first()) {
									if (opponentResponses.first().content.toLowerCase().startsWith('y'))
									game.draw();
									res();
									return false;
								} else {
									res();
									return false;
								}
							}
							// coords is the first message of the collection, split into 2 at the comma and mapped into integers
							const coordinates = e.first()?.content.split(',').map(f => parseInt(f));
							// if for some reason the message wasnt coordinates, foul
							if (coordinates.length !== 2 || coordinates.some(x => isNaN(x))) {
								res(game.userError(0));
								return false;
							}
							// return coords
							return coordinates;
						}).catch(err => {
							// player failed to send coordinates in time, foul
							res(game.userError(1));
							return false;
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
							game.draw();
							return res();
						}
					} else return res(game.userError(3));
					return res(game.changeTurn());
				})};
				while (!game.ended) {
					await cycle();
				}
				setTimeout(() => {
					message.channel.send('Game has ended.');
					client.games.delete(message.channel.id);

				}, 1000);
			}).catch(err => {
				// no one responded "me"
				message.channel.send('Haha no one wants to play with you, lonely goblin.'),
				client.games.delete(message.channel.id);
				console.log(err);
			});
		});
	},
	name: 'tictactoe',
	description: 'Play the famous tic tac toe or noughts and crosses or Xs and Os game with a partner. Add leaderboard to the end to see statistics.',
	alias: ['ttt', 'noughtsandcrosses', 'n&c'],
	cooldown: 35
};