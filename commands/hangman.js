module.exports = {
	run: async (client, message, args) => {
		if (client.games.has(message.channel.id)) {
			return message.channel.send(`There is already an ongoing game in this channel created by ${client.games.get(message.channel.id)}`);
		}
		client.games.set(message.channel.id, message.author.tag);
		await message.channel.send(`A hangman game has started. ${message.member.toString()}, DM me with the word(s) that you would like your opponents to guess. (60s)`);
		const dmChannel = await message.member.createDM();
		const collectedMessages = await dmChannel.awaitMessages(() => true, { errors: ['time'], max: 1, time: 60000 })
			.catch(error => {
				message.channel.send(`${message.member.toString()} failed to provide a word for me. The hangman game has been cancelled.`);
				client.games.delete(message.channel.id);
			});
		if (!collectedMessages) return;
		const word = collectedMessages.first().content.toLowerCase();
		const guessedWordsIndices = [];
		const guesses = [];
		let fouls = 0;
		let latestActivity = Date.now();
		let hiddenLetters = true;
		function wordUpdate() {
			const hideWordResult = hideWord();
			let winText = '';
			if (!hiddenLetters) {
				winText = `\nThe whole word has been revealed. The hangman game ends. The word was:\n\`\`\`\n${word}\n\`\`\``;
				client.games.delete(message.channel.id);
			}
			message.channel.send(`A part of the word has been revealed. This what the word looks like now:\n\`\`\`\n${hideWordResult}\n\`\`\`` + winText);
		}
		function hideWord() {
			hiddenLetters = false;
			return word.split('').map((x, i) => {
				if (guesses.includes(x) || guessedWordsIndices.includes(i)) return x;
				else if (x === ' ') return ' ';
				else {
					hiddenLetters = true;
					return '_';
				}
			}).join(' ');
		}
		function checkFouls(textGuess) {
			const stages = [
				[
					'      ',
					'      ',
					'      ',
					'      ',
					'╭────╮',
					'╯    ╰'
				],
				[
					'      ',
					'      ',
					'  ┃   ',
					'  ┃   ',
					'╭─┸──╮',
					'╯    ╰'
				],
				[
					'  ┏   ',
					'  ┃   ',
					'  ┃   ',
					'  ┃   ',
					'╭─┸──╮',
					'╯    ╰'
				],
				[
					'  ┏   ',
					'  ┃   ',
					'  ┃   ',
					' ┌┨   ',
					'╭┴┸──╮',
					'╯    ╰'
				],
				[
					'  ┏━┓ ',
					'  ┃   ',
					'  ┃   ',
					' ┌┨   ',
					'╭┴┸──╮',
					'╯    ╰'
				],
				[
					'  ┏━┓ ',
					'  ┃ ⎔ ',
					'  ┃   ',
					' ┌┨   ',
					'╭┴┸──╮',
					'╯    ╰'
				],
				[
					'  ┏━┓ ',
					'  ┃ ⎔ ',
					'  ┃╶╂╴',
					' ┌┨ ^ ',
					'╭┴┸──╮',
					'╯    ╰'
				],
			];
			let loseText = '';
			if (fouls === 7) {
				loseText = `\nThe poor fella got hung. You lost the game. The word was:\n\`\`\`\n${word}\n\`\`\``;
				client.games.delete(message.channel.id);
			}
			message.channel.send(`The word doesn\`t include that ${textGuess ? 'letter' : 'piece of text'}.\nAn incorrect guess leads to the addition of things to the drawing. It now looks like this:\n\`\`\`\n${stages[fouls - 1].join('\n')}\n\`\`\`` + loseText);
		}
		function guessLetter(letter) {
			latestActivity = Date.now();
			if (guesses.includes(letter)) return message.channel.send('That letter has been guessed already.');
			guesses.push(letter);
			if (!word.includes(letter)) {
				fouls++;
				checkFouls();
				return;
			}
			wordUpdate();
		}
		function guessWord(text) {
			latestActivity = Date.now();
			if (!word.includes(text)) {
				fouls++;
				checkFouls(true);
				return;
			}
			const guessedTextStartIndex = word.indexOf(text);
			const guessedTextCharIndices = Array.from(Array(text.length).keys());
			guessedWordsIndices.push(...guessedTextCharIndices.map(x => x + guessedTextStartIndex));
			wordUpdate();
		}
		message.channel.send(`I have received a word from ${message.member.toString()}. Anyone can guess letters or the full word by doing \`guess [letter or word]\`\nThe word is:\n\`\`\`\n${hideWord()}\n\`\`\``);

		const guessCollector = message.channel.createMessageCollector(x => x.content.startsWith('guess'));

		guessCollector.on('collect', guessMessage => {
			const guess = guessMessage.content.slice(6).toLowerCase();
			if (!guess || guess.length === 0) return guessMessage.reply('You\'re using the \`guess\` command wrong. Get good.');
			if (guess.length > 1) {
				guessWord(guess);
			} else {
				guessLetter(guess);
			}
		});

		setInterval(() => {
			if (Date.now() > latestActivity + 60000) {
				guessCollector.stop();
				client.games.delete(message.channel.id);
				message.channel.send('The hangman game has ended due to inactivity.');
			}
		}, 5000);
	},
	name: 'hangman',
	description: 'Play the hangman game with other Discord users',
};