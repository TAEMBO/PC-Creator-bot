module.exports = {
	run: (client, message, args) => {
		let words = args.slice(1);
		const vowels = 'aeiouy';
		const punctuation = '"\'`´.,;:?!()';
		words = words.map(word => {
			if (vowels.includes(word[0].toLowerCase())) {
				if (punctuation.includes(word[word.length - 1])) {
					return word.slice(0, -1) + 'way' + word[word.length - 1];
				}
				return word + 'way';
			} else {
				let text;
				word.split('').forEach((char, i) => {
					if (vowels.includes(char.toLowerCase()) && !text) {
						if (punctuation.includes(word[word.length - 1])) {
							text = word.slice(i, -1) + word.slice(0, i) + 'ay' + word[word.length - 1];
						} else text = word.slice(i) + word.slice(0, i) + 'ay';
					}
				})
				return text;
			}
		});
		message.channel.send(words.join(' ').toLowerCase())
	},
	name: 'piglatin',
	description: 'Translates text into Pig Latin',
	usage: ['text'],
	category: 'Fun'
};