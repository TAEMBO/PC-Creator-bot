const util = require('util');
const fs = require('fs');
module.exports = {
	run: async (client, message, args) => {
		const memes = new client.collection(Object.entries(require('./../memes.json')));
		const color = '#00cc99'
		const failed = () => message.channel.send('You failed.');
		if (!args[1]) {
			const embed = new client.embed()
				.setTitle('Browse Memes')
				.setDescription(memes.map((x, key) => `\`${key}\` - ${x.name}\n`).join(''))
				.setColor(color)
			message.channel.send(embed);
		} else {
			if (args[1] === 'add') {
				await message.channel.send('Creating your own meme...\nWhat is the name of your meme?');
				const meme = {};

				meme.name = (await message.channel.awaitMessages(x => x.author.id === message.author.id, { max: 1, time: 45000, errors: ['time'] }).catch(() => { }))?.first()?.content;
				if (!meme.name) return failed();

				await message.channel.send('Write a description for your meme.');
				meme.description = (await message.channel.awaitMessages(x => x.author.id === message.author.id, { max: 1, time: 120000, errors: ['time'] }).catch(() => { }))?.first()?.content;
				if (!meme.description) return failed();

				await message.channel.send('Is the creator of this meme a member of the PC Creator Discord server? Answer with y/n.');
				const onDiscord = (await message.channel.awaitMessages(x => x.author.id === message.author.id, { max: 1, time: 30000, errors: ['time'] }).catch(() => { }))?.first()?.content;
				if (!onDiscord) return failed();

				meme.author = {};
				if (onDiscord.toLowerCase() === 'y') {
					meme.author.onDiscord = true;
					await message.channel.send('What is the user ID of the creator of this meme?');
					meme.author.name = (await message.channel.awaitMessages(x => x.author.id === message.author.id, { max: 1, time: 45000, errors: ['time'] }).catch(() => { }))?.first()?.content;
				} else if (onDiscord.toLowerCase() === 'n') {
					meme.author.onDiscord = false;
					await message.channel.send('Supply a name for the creator of this meme, e.g. their username on the platform that you found this meme on.');
					meme.author.name = (await message.channel.awaitMessages(x => x.author.id === message.author.id, { max: 1, time: 45000, errors: ['time'] }).catch(() => { }))?.first()?.content;
				} else {
					return failed();
				}
				if (!meme.author.name) return failed();

				await message.channel.send('Send a permanent URL to the meme image.');
				meme.url = (await message.channel.awaitMessages(x => x.author.id === message.author.id, { max: 1, time: 30000, errors: ['time'] }).catch(() => { }))?.first()?.content;
				if (!meme.url) return failed();

				const key = Math.max(...memes.keyArray().map(x => parseInt(x)).filter(x => !isNaN(x)), ...client.memeQueue.keyArray().map(x => parseInt(x))) + 1;

				client.memeQueue.set(key.toString(), meme);

				const embed = new client.embed()
					.setTitle('A meme with the following info has been created:')
					.setDescription('```js\n' + util.formatWithOptions({ depth: 1 }, '%O', meme) + '\n```\nInform one of the following people so they can approve your meme:\n' + client.config.eval.whitelist.map(x => '<@' + x + '>').join('\n') + '\nWith the following information: ' + key)
					.setColor(color)
				return message.channel.send(embed);
			} else if (args[1] === 'review') {
				if (!client.config.eval.whitelist.includes(message.author.id)) return message.channel.send('You\'re not allowed to do that.');
				if (args[2]) {
					const meme = client.memeQueue.get(args[2]);
					if (!meme) return message.channel.send('That meme doesn\'t exist.');
					await message.channel.send('Does this look good to you? Respond with y/n.\n```js\n' + util.formatWithOptions({ depth: 1 }, '%O', meme) + '\n```');
					const approval = (await message.channel.awaitMessages(x => x.author.id === message.author.id, { max: 1, time: 120000, errors: ['time'] }).catch(() => { }))?.first()?.content;
					if (!approval) return failed();
					if (approval.toLowerCase() === 'y') {
						memes.set(args[2], meme);
						let dir = __dirname.split('\\');
						dir = dir.slice(0, dir.length - 1).join('\\');
						dir += '\\memes.json';
						let memesJson = {};
						memes.forEach((x, key) => {
							memesJson[key] = x;
						});
						const json = JSON.stringify(memesJson);
						fs.writeFileSync(dir, json);
						client.memeQueue.delete(args[2]);
						return message.channel.send('Meme approved!');
					} else if (approval.toLowerCase() === 'n') {
						client.memeQueue.delete(args[2]);
						return message.channel.send('The submission has been removed from the queue.');
					} else {
						return failed();
					}
				} else {
					return message.channel.send('Memes pending review:\n```\n' + (client.memeQueue.size >= 1 ? client.memeQueue.map((meme, key) => `${key}. ${meme.name}`).join('\n') : 'None') + '\n```');
				}
			}
			const meme = memes.get(args[1]);
			if (!meme) return message.channel.send('That meme doesn\'t exist.');
			const member = meme.author.onDiscord ? (await client.users.fetch(meme.author.name)) : undefined;
			const embed = new client.embed()
				.setTitle(meme.name)
				.setImage(meme.url)
				.setFooter(meme.description)
				.setColor(color)
			if (member) {
				embed.setAuthor(`By ${member.tag} (${member.id})`, member.displayAvatarURL({ format: 'png', size: 256 }))
			} else {
				embed.setAuthor('By ' + meme.author.name)
			}
			message.channel.send(embed);
		}
	},
	name: 'meme',
	description: 'Works like xkcd, images are given a number and you can view a specific image if you know the number. This command is for memes made by the PCC community'
};