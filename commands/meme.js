const util = require('util');
const fs = require('fs');
module.exports = {
	run: async (client, message, args) => {
		delete require.cache[require.resolve('./../memes.json')];
		const memes = new client.collection(Object.entries(require('./../memes.json')));
		const color = '#00cc99'
		const failed = () => message.channel.send('You failed. The `meme add` process has ended.');
		if (!args[1]) {
			const embed = new client.embed()
				.setTitle('Browse Memes')
				.setColor(color);
			if (memes.size > 0) {
				const memesPerPage = memes.size / 3;
				if (memesPerPage < 1) {
					embed.addField('\u200b', memes.map((x, key) => `\`${key}\` - ${x.name}\n`).join(''), true);
				} else {
					for (let i = 0; i < 3; i++) {
						embed.addField('\u200b', Array.from(memes).slice(Math.ceil(i * memesPerPage), Math.ceil((i + 1) * memesPerPage)).map(x => `\`${x[0]}\` - ${x[1].name}\n`).join(''), true);
					}
				}
			} else embed.setDescription('No memes have been added yet.');
			return message.channel.send(embed);
		} else {
			if (args[1] === 'add') {
				await message.channel.send('Creating your own meme...\nWhat is the name of your meme? (60s)');
				const meme = { adder: `${message.author.tag} (${message.author.id})`, timestamp: Date.now() };

				meme.name = (await message.channel.awaitMessages(x => x.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] }).catch(() => { }))?.first()?.content;
				if (!meme.name) return failed();

				await message.channel.send('Write a description for your meme. (120s)');
				meme.description = (await message.channel.awaitMessages(x => x.author.id === message.author.id, { max: 1, time: 120000, errors: ['time'] }).catch(() => { }))?.first()?.content;
				if (!meme.description) return failed();

				await message.channel.send('Is the creator of this meme a member of the PC Creator Discord server? Answer with y/n. (30s)');
				const onDiscord = (await message.channel.awaitMessages(x => x.author.id === message.author.id, { max: 1, time: 30000, errors: ['time'] }).catch(() => { }))?.first()?.content;
				if (!onDiscord) return failed();

				meme.author = {};
				if (onDiscord.toLowerCase() === 'y') {
					meme.author.onDiscord = true;
					await message.channel.send('What is the user ID of the creator of this meme? (60s)');
					meme.author.name = (await message.channel.awaitMessages(x => x.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] }).catch(() => { }))?.first()?.content;
					if (meme.author.name.startsWith('<')) return failed();
					if (meme.author.name === message.author.id) meme.adder = 'Self';
				} else if (onDiscord.toLowerCase() === 'n') {
					meme.author.onDiscord = false;
					await message.channel.send('Supply a name for the creator of this meme, e.g. their username on the platform that you found this meme on. (90s)');
					meme.author.name = (await message.channel.awaitMessages(x => x.author.id === message.author.id, { max: 1, time: 90000, errors: ['time'] }).catch(() => { }))?.first()?.content;
				} else {
					return failed();
				}
				if (!meme.author.name) return failed();

				await message.channel.send('Send a permanent URL to the meme image. (120s)');
				const urlMessage = (await message.channel.awaitMessages(x => x.author.id === message.author.id, { max: 1, time: 120000, errors: ['time'] }).catch(() => { }))?.first();
				if (urlMessage.content) {
					if (!['jpg', 'png', 'webp', 'gif'].some(x => urlMessage.content.endsWith(x))) {
						return message.channel.send('Your log-headed ass didn\'t notice that that is not an image url. Your mishap has terminated the `meme add` process. Thanks.');
					}
					meme.url = urlMessage.content;
				}
				else meme.url = urlMessage.attachments.first()?.url;
				if (!meme.url) return failed();

				const highestKey = Math.max(...memes.keyArray().map(x => parseInt(x)).filter(x => !isNaN(x)), ...client.memeQueue.keyArray().map(x => parseInt(x)), 0) + 2;
				const allNumbers = Array.from(Array(highestKey).keys()).slice(1);
				[...memes.keyArray().map(x => parseInt(x)).filter(x => !isNaN(x)), ...client.memeQueue.keyArray().map(x => parseInt(x))].forEach(usedKey => {
					allNumbers.splice(allNumbers.indexOf(usedKey), 1);
				});
				const key = allNumbers[0];

				client.memeQueue.set(key.toString(), meme);

				const embed = new client.embed()
					.setTitle('A meme with the following info has been created:')
					.setDescription('```js\n' + util.formatWithOptions({ depth: 1 }, '%O', meme) + '\n```\nInform one of the following people so they can approve your meme:\n' + client.config.eval.whitelist.map(x => '<@' + x + '>').join('\n') + '\nWith the following information: ":clap: meme :clap: review ' + key + '"')
					.setColor(color)
				return message.channel.send(embed);
			} else if (args[1] === 'review') {
				if (!client.config.eval.whitelist.includes(message.author.id)) return message.channel.send('You\'re not allowed to do that.');
				if (args[2]) {
					const meme = client.memeQueue.get(args[2]);

					const approve = () => {
						// add this meme to the collection
						memes.set(args[2], meme);

						// define meme database location
						let dir = __dirname.split('\\');
						dir = dir.slice(0, dir.length - 1).join('\\');
						dir += '\\memes.json';

						// turn collection into JS object
						let memesJson = {};
						memes.forEach((x, key) => {
							memesJson[key] = x;
						});

						// turn object into json
						const json = JSON.stringify(memesJson);

						// rewrite memes.json
						fs.writeFileSync(dir, json);

						// remove this meme from the queue
						client.memeQueue.delete(args[2]);

						// inform user
						message.channel.send(':clap: Meme :clap: Approved!');
						return;
					};

					const decline = () => {
						// remove this meme from the queue
						client.memeQueue.delete(args[2]);

						// inform user
						message.channel.send('The submission has been declined and removed from the queue.');
						return;
					};


					if (!meme) return message.channel.send('That meme doesn\'t exist.');
					if (args[3] && ['y', 'n'].includes(args[3].toLowerCase())) {
						if (args[3].toLowerCase() === 'y') approve()
						else decline();
						return;
					}
					await message.channel.send(':clap: Meme :clap: Review!\nDoes this look good to you? Respond with y/n. Type "cancel" to leave this meme in the queue. (120s)\n```js\n' + util.formatWithOptions({ depth: 1 }, '%O', meme) + '\n```\n' + (Math.random() < (1 / 3) ? '\`(TIP: You can add y/n to the end of the command to approve or decline a meme without seeing it.)\`\n' : '') + meme.url);
					const approval = (await message.channel.awaitMessages(x => x.author.id === message.author.id && ['y', 'n', 'cancel'].some(y => x.content.toLowerCase().startsWith(y)), { max: 1, time: 120000, errors: ['time'] }).catch(() => { }))?.first()?.content;
					if (!approval) return failed();

					if (approval.toLowerCase().startsWith('y'))
						approve();
					else if (approval.toLowerCase().startsWith('n'))
						decline();
					else if (approval.toLowerCase().startsWith('cancel'))
						message.channel.send('The review process has ended and the unapproved meme remains in the queue.');
					else
						failed();
					return;
				} else {
					return message.channel.send('Memes pending review:\n```\n' + (client.memeQueue.size >= 1 ? client.memeQueue.map((meme, key) => `${key}. ${meme.name}`).join('\n') : 'None') + '\n```');
				}
			}
			const query = args.slice(1).join(' ').toLowerCase();
			const meme = memes.get(args[1]) || memes.filter(x => x.name.toLowerCase().includes(query) || x.description.toLowerCase().includes(query)).sort((a, b) => (a.name.length - query.length) - (b.name.length - query.length)).first();
			if (!meme) return message.channel.send('That meme doesn\'t exist.');
			const member = meme.author.onDiscord ? (await client.users.fetch(meme.author.name)) : undefined;
			const embed = new client.embed()
				.setTitle(meme.name)
				.setFooter(meme.description + ' | Added By: ' + (meme.adder || 'Unknown') + (meme.timestamp ? (` | ${client.formatTime(Date.now() - meme.timestamp, 1, { longNames: (!meme.adder || meme.adder === 'Self') })} ago`) : ''))
				.setColor(color)
			if (meme.url && meme.url.startsWith('http')) embed.setImage(meme.url);
			if (member) {
				embed.setAuthor(`By ${member.tag} (${member.id})`, member.displayAvatarURL({ format: 'png', size: 256 }))
			} else {
				embed.setAuthor('By ' + meme.author.name)
			}
			message.channel.send(embed);
		}
	},
	name: 'meme',
	description: 'Works like xkcd, images are given a number and you can view a specific image if you know the number. This command is for memes made by the PCC community',
	usage: ['key/"add"/"review"'],
	alias: ['memes']
};