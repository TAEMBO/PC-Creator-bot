module.exports = {
	run: (client, message, args) => {
		let words = args.slice(1);
		const vowels = 'aeiouy';
		const punctuation = '"\'`´.,;:?!()';
		if (words.every(x => x.toLowerCase().split('').filter(x => !punctuation.includes(x)).join('').endsWith('ay'))) {
			// this is already piglatin
			words = words.map(word => {
				// i wont bother commenting this code its such a joke
				if (punctuation.includes(word[word.length - 1])) {
					if (word.slice(0, word.length - 1).endsWith('way')) {
						return word.slice(0, -4) + word[word.length - 1];
					} else {
						const nonay = word.slice(0, -3);
						return nonay[nonay.length - 1] + nonay.slice(0, nonay.length - 1) + word[word.length - 1];
					}
				} else {
					if (word.endsWith('way')) {
						return word.slice(0, -3);
					} else {
						const nonay = word.slice(0, -2);
						return nonay[nonay.length - 1] + nonay.slice(0, nonay.length - 1);
					}
				}
			});
			if (words.join(' ').length === 0) return message.channel.send('Sorry, I can\'t translate your text because the result would be nothing.');
			return message.channel.send(words.join(' '));
		}
		words = words.map(word => {
			// if word begins with a vowel
			if (vowels.includes(word[0].toLowerCase())) {
				// if word ends in a punctuation
				if (punctuation.includes(word[word.length - 1])) {
					// do the thing and put punctuation and the end
					return word.slice(0, -1) + 'way' + word[word.length - 1];
				}
				// if word begins with vowel, add way to the end
				return word + 'way';
			} else {
				let text;
				// foreach to find first vowel
				word.split('').forEach((char, i) => {
					// if this char is a vowel and the word hasnt been translated yet
					if (vowels.includes(char.toLowerCase()) && !text) {
						// check for punctuation at the end
						if (punctuation.includes(word[word.length - 1])) {
							// the thing + punctuation
							text = word.slice(i, -1) + word.slice(0, i) + 'ay' + word[word.length - 1];
						} else text = word.slice(i) + word.slice(0, i) + 'ay'; // chars after vowel (including vowel) + chars before vowel + ay
					}
				})
				// return finished word
				return text;
			}
		});
		if (words.join(' ').length === 0) return message.channel.send('Sorry, I can\'t translate your text because the result would be nothing.');
		message.channel.send(words.join(' ').toLowerCase());
	},
	name: 'piglatin',
	description: 'Translates text into Pig Latin or Pig Latin to english if the text is already in Pig Latin. Pig Latin to english sucks because the bot is stupid.',
	shortDescription: 'Translates Pig Latin.',
	usage: ['text'],
	category: 'Fun'
};