const Discord = require("discord.js");
const client = new Discord.Client({disableEveryone: true});
const modmailClient = new Discord.Client({ disableEveryone: true });
const fs = require('fs');
const path = require('path');
try {
	client.config = require("./config-test.json");
	console.log('Using ./config-test.json');
} catch (error) {
	client.config = require("./config.json");
	console.log('Using ./config.json');
}
client.tokens = require("./tokens.json");
client.prefix = client.config.prefix;
client.on("ready", async () => {
	setInterval(async () => {
		await client.user.setActivity(",help", {
			type: "LISTENING", 
		});
	}, 30000);
	console.log(`Bot active as ${client.user.tag} with prefix ${client.prefix}`);
});
modmailClient.on("ready", async () => {
	setInterval(async () => {
		await modmailClient.user.setActivity("Direct Messages", {
			type: "LISTENING",
		});
	}, 30000);
	console.log(`Modmail Bot active as ${modmailClient.user.tag}`);
});

// global properties
Object.assign(client, {
	embed: Discord.MessageEmbed,
	messageCollector: Discord.MessageCollector,
	collection: Discord.Collection,
	cpulist: {
		INTEL: JSON.parse(fs.readFileSync(__dirname + '\\cpulist-INTEL.json')),
		AMD: JSON.parse(fs.readFileSync(__dirname + '\\cpulist-AMD.json')),
	},
	memberCount_LastGuildFetchTimestamp: 0,
	helpDefaultOptions: {
		insertEmpty: false,
		parts: ['name', 'usage', 'description', 'alias']
	},
	embedColor: 3971825,
	starLimit: 3,
	selfStarAllowed: false
}, require('./tokens.json'));

// meme approval queue
client.memeQueue = new client.collection();

// cooldowns
client.cooldowns = new client.collection();

// database
const database = require('./database.js');

// tic tac toe statistics database
client.tictactoeDb = new database('./ttt.json', 'array'); /* players, winner, draw, startTime, endTime */
Object.assign(client.tictactoeDb, {
	// global stats
	getTotalGames() {
		const amount = this._content.length;
		return amount;
	},
	getRecentGames(amount) {
		const games = this._content.sort((a, b) => b.startTime - a.startTime).slice(0, amount - 1);
		return games;
	},
	getAllPlayers() {
		const players = {};
		this._content.forEach(game => {
			game.players.forEach(player => {
				if (!players[player]) players[player] = { wins: 0, losses: 0, draws: 0, total: 0 };
				players[player].total++;
				if (game.draw) return players[player].draws++;
				if (player === game.winner) {
					return players[player].wins++;
				} else {
					return players[player].losses++;
				}
			});
		});
		return players;
	},
	getBestPlayers(amount) {
		const players = Object.entries(this.getAllPlayers()).filter(x => x[1].total >= 10).sort((a, b) => b[1].wins / b[1].total - a[1].wins / a[1].total).slice(0, amount - 1)
		return players;
	},
	getMostActivePlayers(amount) {
		const players = Object.entries(this.getAllPlayers()).sort((a, b) => b[1].total - a[1].total).slice(0, amount - 1)
		return players;
	},
	// player stats
	getPlayerGames(player) {
		const games = this._content.filter(x => x.players.includes(player));
		return games;
	},
	getPlayerRecentGames(player, amount) {
		const games = this._content.filter(x => x.players.includes(player)).sort((a, b) => b.startTime - a.startTime).slice(0, amount - 1);
		return games;
	},
	calcWinPercentage(player) {
		return ((player.wins / player.total) * 100).toFixed(2) + '%';
	}
});
client.tictactoeDb.initLoad().intervalSave();

// 1 game per channel
client.games = new Discord.Collection();

// userLevels
client.userLevels = new database('./userLevels.json', 'object');
Object.assign(client.userLevels, {
	_requirements: {
		age: 1000 * 60 * 60 * 24 * 30 * 2,
		messages: 1000
	},
	incrementUser(userid) {
		const amount = this._content[userid];
		if (amount) this._content[userid]++;
		else this._content[userid] = 1;
		return this;
	},
	getUser(userid) {
		return this._content[userid] || 0;
	},
	hasUser(userid) {
		return !!this._content[userid];
	},
	getEligible(userid) {
		const amount = this.getUser(userid) || 0;
		return amount >= this._requirements.messages;
	},
});
client.userLevels.initLoad().intervalSave(300000);

// specs
client.specsDb = new database('./specs.json', 'object');
Object.assign(client.specsDb, {
	editSpecs(id, component, newValue) {
		const allComponents = Object.keys(this._content[id]);
		const index = allComponents.map(x => x.toLowerCase().replace(/ /g, '-')).indexOf(component.toLowerCase().replace(/ /g, '-'));
		this._content[id][allComponents[index]] = newValue;
		return this;
	},
	addSpec(id, component, value) {
		this._content[id][component] = value;
		return this;
	},
	deleteSpec(id, component) {
		const allComponents = Object.keys(this._content[id]);
		const index = allComponents.map(x => x.toLowerCase().replace(/ /g, '-')).indexOf(component.toLowerCase().replace(/ /g, '-'));
		delete this._content[id][allComponents[index]];
		if (Object.keys(this._content[id]).length === 0) this.deleteData(id);
		return this;
	},
	deleteData(id) {
		delete this._content[id];
		return this;
	},
	getUser(id) {
		const user = this._content[id];
		return user;
	},
	hasUser(id) {
		const user = this._content[id];
		return !!user;
	},
	hasSpec(id, component) {
		const allComponents = Object.keys(this._content[id]);
		const index = allComponents.map(x => x.toLowerCase().replace(/ /g, '-')).indexOf(component.toLowerCase().replace(/ /g, '-'));
		return index >= 0;
	}

});
client.specsDb.initLoad().intervalSave(120000);

// dm forward blacklist
client.dmForwardBlacklist = new database('./dmforwardblacklist.json', 'array');
client.dmForwardBlacklist.initLoad().intervalSave(180000);

// command handler
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
client.commands.get('ping').spammers = new client.collection();

// load functions
const functionFiles = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
for (const file of functionFiles) {
	const func = require(`./functions/${file}`);
	client[file.slice(0, -3)] = func;
}

// assign page number to commands
const categories = {};
while (client.commands.some(command => !command.hidden && !command.page)) {
	const command = client.commands.find(command => !command.hidden && !command.page);
	if (!command.category) command.category = 'Misc';
	if (!categories[command.category]) categories[command.category] = { text: '', currentPage: 1}
	const commandInfo = client.commandInfo(client, command, client.helpDefaultOptions);
	if (categories[command.category].text.length + commandInfo.length > 1024) {
		categories[command.category].text = commandInfo;
		categories[command.category].currentPage++;
	} else {
		categories[command.category].text += commandInfo;
	}
	command.page = categories[command.category].currentPage;
}
delete categories;

// create pages without contents
client.commands.pages = [];
client.commands.filter(command => !command.hidden).forEach(command => {
	if (!client.commands.pages.some(x => x.category === command.category && x.page === command.page)) {
		client.commands.pages.push({
			name: `${command.category} - Page ${command.page}/${Math.max(...client.commands.filter(x => x.category === command.category).map(x => x.page))}`,
			category: command.category,
			page: command.page
		});
	}
});
client.commands.pages.sort((a, b) => {
	if (a.name < b.name) {
		return -1;
	} else if (a.name > b.name) {
		return 1;
	} else {
		return 0;
	}
}).sort((a, b) => {
	if (a.category.toLowerCase() === 'pc creator' && b.category.toLowerCase() !== 'pc creator') {
		return -1;
	} else {
		return 1;
	}
});

// starboard functionality
client.starboard = new database('./starboard.json', 'object');
Object.assign(client.starboard, {
	async increment(reaction) {
		let dbEntry = this._content[reaction.message.id];
		if (dbEntry) dbEntry.c++;
		else {
			this.addData(reaction.message.id, { c: 1, a: reaction.message.author.id });
			dbEntry = this._content[reaction.message.id];
		}
		if (dbEntry?.c >= client.starLimit) {
			if (dbEntry.e) {
				const embedMessage = await client.channels.resolve(client.config.mainServer.channels.starboard).messages.fetch(dbEntry.e);
				embedMessage.edit(`**${dbEntry.c}** :star: ${embedMessage.content.slice(embedMessage.content.indexOf('|'))}`);
			} else {
				const embed = await this.sendEmbed({ count: dbEntry.c, message: reaction.message});
				this._content[reaction.message.id].e = embed.id;
			}
		}
	},
	async decrement(reaction) {
		let dbEntry = this._content[reaction.message.id];
		dbEntry.c--;
		if (dbEntry.e) {
			if (dbEntry.c < client.starLimit) {
				(await client.channels.resolve(client.config.mainServer.channels.starboard).messages.fetch(dbEntry.e)).delete();
				dbEntry.e = undefined;
				if (dbEntry.c === 0) {
					delete this._content[reaction.message.id];
				}
			} else {
				const embedMessage = await client.channels.resolve(client.config.mainServer.channels.starboard).messages.fetch(dbEntry.e);
				embedMessage.edit(`**${dbEntry.c}** :star: ${embedMessage.content.slice(embedMessage.content.indexOf('|'))}`);
			}
		}
	},
	sendEmbed(data) {
		let description = [data.message.content, ''];
		const embed = new client.embed()
			.setAuthor(`${data.message.member.displayName} [${data.message.author.tag}]`, data.message.author.avatarURL({ format: 'png', size: 128 }))
			.setTimestamp(data.message.createdTimestamp)
			.setFooter(`MSG:${data.message.id}, USER:${data.message.author.id}`)
			.addField('\u200b', `[Jump to Message](${data.message.url})`)
			.setColor('#ffcc00');
		let imageSet = false;
		data.message.embeds.forEach(x => {
			let text = `\\[[Embed](${x.url})] `;
			if (x.provider || x.author) {
				text += x.provider?.name || x.author.name;
				if (x.title) {
					text += `: ${x.title}`;
				}
			} else {
				text += x.title;
			}
			if (x.image) {
				if (imageSet) {
					
					text += `: [Image](${x.image.url})`;
				} else {
					text += ': Image';
					embed.setImage(x.image.url);
					imageSet = true;
				}
			}
			description.push(text);
		});
		data.message.attachments.forEach(attachment => {
			if (['png', 'jpg', 'webp', 'gif'].some(x => attachment.url?.endsWith(x)) && !imageSet) {
				embed.setImage(data.message.attachments.first().url);
				imageSet = true;
			} else if (attachment.url) {
				let type = 'File';
				if (['png', 'jpg', 'webp'].some(x => attachment.url?.endsWith(x))) type = 'Image';
				if (['mp4', 'mov', 'webm'].some(x => attachment.url?.endsWith(x))) type = 'Video';
				if (attachment.url?.endsWith('gif')) type = 'Gif';
				description.push(`[Embed] ${type}: [${attachment.name}](${attachment.url})`);
			}
		});
		const descPreview = description.join('\n').trim();
		if (descPreview.length > 2048) {
			const diff = descPreview.length - 2048;
			description[0] = description[0].slice(0, description[0].length - Math.max(3, diff)) + '...';
		}
		embed.setDescription(description.join('\n').trim());
		return client.channels.resolve(client.config.mainServer.channels.starboard).send(`**${data.count}** :star: | ${data.message.channel.toString()}`, embed).then(async x => {
			x.react('⭐');
			return x;
		});
	},
});
client.starboard.initLoad().intervalSave(60000);
client.on('messageDelete', async message => {
	const dbEntry = client.starboard._content[message.id];
	if (!dbEntry) return;
	(await client.channels.resolve(client.config.mainServer.channels.starboard).messages.fetch(dbEntry.e)).delete();
});

// suggestions, starboard wrong emoji removal
client.on('raw', async e => {
	if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(e.t)) return;
	if (e.d.guild_id !== client.config.mainServer.id) return;

	async function suggestions() {
		if (e.d.channel_id !== client.config.mainServer.channels.suggestions) return;
		const channel = client.channels.resolve(e.d.channel_id);
		const message = await channel.messages.fetch(e.d.message_id);

		// wrong emoji
		if (e.t === 'MESSAGE_REACTION_ADD' && !['✅', '❌'].includes(e.d.emoji.name)) {
			const reaction = message.reactions.resolve(e.d.emoji.id || e.d.emoji.name);
			return reaction.remove();
		}

		// suggestion embed color
		let upvotes = message.reactions.resolve('✅');
		let downvotes = message.reactions.resolve('❌');
		console.log('SUGGESTION EMBED COLOR\nupvotes', { count: upvotes?.count, name: upvotes?._emoji?.name}, 'downvotes', { count: downvotes?.count, name: downvotes?._emoji?.name}, 'ratio', upvotes?.count / downvotes?.count, 'upvotes - 1 =', upvotes?.count - 1, 'downvotes - 1 =', downvotes?.count - 1);

		upvotes = upvotes?.count - 1;
		downvotes = downvotes?.count - 1;

		if (typeof upvotes !== 'number' || typeof downvotes !== 'number' || isNaN(upvotes) || isNaN(downvotes)) return;
		const embed = message.embeds[0];

		function setColor(newColor) {
			if (embed.hexColor === newColor) return;
			embed.setColor(newColor);
			return message.edit(embed);
		}

		if (upvotes / downvotes >= 18) { /* breakthrough, 18 */
			return setColor('#0420bf');
		}
		if (upvotes / downvotes >= 11.5) { /* fantastic, 11.5 */
			return setColor('#1150cf');
		}
		if (upvotes / downvotes >= 7) { /* good, 7 */
			return setColor('#2f7aeb');
		}
		if (upvotes / downvotes <= 1 / 6) { /* bad, 1/6 */
			return setColor('#355057');
		}
		return setColor('#3C9AF1');
	}
	suggestions();

	async function starboard() {
		if (e.t === 'MESSAGE_REACTION_ADD') {
			const channel = client.channels.resolve(e.d.channel_id);
			const message = await channel.messages.fetch(e.d.message_id);

			// #starboard wrong emoji 
			if (e.d.emoji.name !== '⭐' && e.d.channel_id === client.config.mainServer.channels.starboard) {
				const reaction = message.reactions.resolve(e.d.emoji.id || e.d.emoji.name);
				return reaction.remove();
			}

			// #starboard star reactions
			const user = await client.users.fetch(e.d.user_id);
			if (e.d.emoji.name !== '⭐' || user.bot) return;

			// starred own message
			if ((message.author.id === user.id || message.embeds[0]?.footer?.text.includes(user.id)) && Math.random() < 4 / 7 && !client.selfStarAllowed) {
				return message.channel.send(user.toString() + ', You can\'t star your own message.').then(x => setTimeout(() => x.delete(), 20000));
			}

			// star increment
			if (e.d.channel_id === client.config.mainServer.channels.starboard) {
				if (!message.embeds[0]) return;
				const footer = message.embeds[0].footer.text;
				client.starboard.increment({ message: { id: footer.slice(4, footer.indexOf(',')) } });
			} else {
				client.starboard.increment({ message });
			}
		} else if (e.t === 'MESSAGE_REACTION_REMOVE') {
			const message = await client.channels.cache.get(e.d.channel_id).messages.fetch(e.d.message_id);
			const user = await client.users.fetch(e.d.user_id);

			// decrement if self starring is not allowed and a person (not bot) removed reaction star
			if (e.d.emoji.name !== '⭐' || user.bot || ((message.author.id === user.id || message.embeds[0]?.footer?.text.includes(user.id)) && !client.selfStarAllowed)) return;

			// decrement
			if (e.d.channel_id === client.config.mainServer.channels.starboard) {
				if (!message.embeds[0]) return;
				const footer = message.embeds[0].footer.text;
				client.starboard.decrement({ message: { id: footer.slice(4, footer.indexOf(',')) } });
			} else {
				client.starboard.decrement({ message });
			}
		}
		
	}
	starboard();
});

// give access to #voice-chat-text to members when they join vc
client.on('voiceStateUpdate', (oldState, newState) => {
	const memberRole = oldState.guild.roles.cache.get("747630391392731218");
	if (!memberRole) return;
	if (newState.channelID) {
		newState.member.roles.add(memberRole);
	} else if (oldState.channelID && !newState.channelID) {
		newState.member.roles.remove(memberRole);
	}
});

client.on("message", async (message) => {
    if (message.channel.type === 'dm') {
		if (client.dmForwardBlacklist._content.includes(message.author.id)) return;
		if (client.games.some(x => x === message.author.tag)) return;
        const channel = client.channels.cache.get(client.config.mainServer.channels.dmForwardChannel);
        const pcCreatorServer = client.guilds.cache.get(client.config.mainServer.id);
        const guildMemberObject = (await pcCreatorServer.members.fetch(message.author.id));
        const memberOfPccs = !!guildMemberObject;
        const embed = new client.embed()
            .setTitle('Forwarded DM Message')
            .setAuthor(message.author.tag + ` (${message.author.id})`, message.author.avatarURL({ format: 'png', dynamic: true, size: 256}))
            .setColor(3971825)
            .addField('Message Content', message.content.length > 1024 ? message.content.slice(1021) + '...' : message.content + '\u200b')
            .setTimestamp(Date.now());
		let messageAttachmentsText = '';
		message.attachments.forEach(attachment => {
			if (!embed.image && ['png', 'jpg', 'webp', 'gif'].some(x => attachment.name.endsWith(x))) embed.setImage(attachment.url);
			else messageAttachmentsText += `[${attachment.name}](${attachment.url})\n`;
		});
		if (messageAttachmentsText.length > 0) embed.addField('Message Attachments', messageAttachmentsText.trim());
		embed
			.addField('User', `<@${message.author.id}>`)
			.addField('Connections', `:small_blue_diamond: Message sender **${memberOfPccs ? 'is' : ' is not'}** on the **${pcCreatorServer.name}** Discord server${memberOfPccs ? `\n:small_blue_diamond: Roles on the PC Creator server: ${guildMemberObject.roles.cache.filter(x => x.id !== pcCreatorServer.roles.everyone.id).map(x => '**' + x.name + '**').join(', ')}` : ''}`)
        channel.send(embed)
        channel.send(client.config.eval.whitelist.map(x => `<@${x}>`).join(', '));
	}
	if (!message.guild) return;
	const suggestCommand = client.commands.get('suggest');
	if (client.config.mainServer.channels.suggestions === message.channel.id && ![suggestCommand.name, ...suggestCommand.alias].some(x => message.content.split(' ')[0] === client.prefix + x) && !message.author.bot) {
		message.reply(`You\'re only allowed to send suggestions in this channel with \`${client.prefix}suggest [suggestion]\`.`).then(x => setTimeout(() => x.delete(), 6000));
		return message.delete();
	}
	if (message.content.startsWith(client.prefix)) {
		const args = message.content.slice(client.prefix.length).replace(/\n/g, ' ').split(' ');
		const commandFile = client.commands.find(x => x.name === args[0] || x.alias?.includes(args[0]));
		if (commandFile) {
			// cooldown
			if (commandFile.cooldown) {
				const member = client.cooldowns.get(message.author.id);
				if (member) {
					if (client.cooldowns.get(message.author.id).get(commandFile.name) > Date.now()) {
						const cooldownMention = await message.channel.send(`You need to wait ${Math.ceil((commandCooldownForUser - Date.now()) / 1000)} seconds until you can use this command again.`);
						if (message.channel.id === client.config.mainServer.channels.suggestions) {
							setTimeout(async () => {
								await message.delete();
								await cooldownMention.delete();
							}, 20000);
						}
						return;
					} else {
						client.cooldowns.get(message.author.id).set(commandFile.name, Date.now() + (commandFile.cooldown * 1000))
					}
				} else {
					if (!client.config.eval.whitelist.includes(message.author.id)) {
						client.cooldowns.set(message.author.id, new client.collection())
						client.cooldowns.get(message.author.id).set(commandFile.name, Date.now() + (commandFile.cooldown * 1000))
					}
				}
			}

			try {
				commandFile.run(client, message, args);
				commandFile.uses ? commandFile.uses++ : commandFile.uses = 1;
				return 
			} catch (error) {
				console.log(`An error occured while running command "${commandFile.name}"`, error, error.stack);
				return message.channel.send('An error occured while executing that command.');
			}
		}
	} else {
		const BLACKLISTED_CHANNELS = [
			'748122380383027210', /* bot-commands */
		];
		// if message was not sent in a blacklisted channel, count towards user level
		if (!BLACKLISTED_CHANNELS.includes(message.channel.id)) client.userLevels.incrementUser(message.author.id);
		// wildlife reserve area
		if (message.content.toLowerCase().includes("titanus") && Math.random() < 3/7) {
			message.channel.send("Ass-sus tit anus <:hahaha6:740166145167982623>");
		}
		if (message.content.includes("userbenchmark.com")) {
			message.reply(":b:ingus y u use userbenchmark");
		}
		if (message.content.toLowerCase().includes("uwu")) {
			message.reply("You received an honorary ban!");
		}
		if (message.author.id === '155149108183695360' && ['was muted', 'was banned', 'has been warned'].some(x => message.embeds[0]?.description?.includes(x))) {
			message.channel.send(':partying_face: :tada:');
		}
		// do not remove titanus
		if (client.config.enableAutoResponse) {
			let msg = message.content.toLowerCase().replace(/'|´|"/g, '');
			const questionWords = ['how', 'what', 'where', 'why', 'can'];
			let trigger;
			if (
				!((
					questionWords.some(x => {
						if (
							(
								(msg).startsWith(x + ' ') // question word has to be the full word, eliminates "whatever"
								|| (msg).startsWith(x + 's ') // question word can also be "question word + is", eg "what's"
							)
							&& !(msg).startsWith(x + ' if ') // question word cant be used a suggestion, eliminates "what if ..."
						) {
							trigger = x;
							return true;
						} else return false;
					})
					|| msg.startsWith('is')
					|| msg.includes('help')
				)
				&& !message.author.bot)
			) return;
			let match;
			if (msg.length > 96) msg = msg.slice(msg.indexOf(trigger))
			client.commands.forEach(command => {
				if (!command.autores) return;
				if (command.autores.every(keyword => {
					if (keyword.includes('/')) {
						const keywordsSplit = keyword.split('/');
						if (keywordsSplit.some(x => msg.includes(x))) return true;
						else return false;
					} else {
						return msg.includes(keyword)
					}
				})) match = command;
			});
			if (match) {
				await message.channel.send(`AutoResponse™ was summoned. Running command \`${client.prefix}${match.name}\`...`);
				try {
					match.run(client, Object.assign(message, { content: `${client.prefix}${match.name}` }), [match.name]);
					match.uses ? match.uses++ : match.uses = 1;
				} catch (error) {
					return console.log(`An error occured while running command "${match.name}"`, error, error.stack);
				}
			}
		}
	}
});
modmailClient.threads = new client.collection();
modmailClient.on('message', message => {
	if (message.channel.type === 'dm') {
		if (message.author.bot) return;
		if (client.dmForwardBlacklist._content.includes(message.author.id)) return;
		const modmailChannel = modmailClient.channels.cache.get(client.config.mainServer.channels.modmail);
		function summaryTimestamp() {
			return `[${client.format24hClock(Date.now(), true)}]`;
		}
		if (modmailClient.threads.has(message.author.id)) {
			modmailChannel.send(`\`Case ID: ${modmailClient.threads.get(message.author.id).caseId}\` Additional information from ${message.author.toString()} (${message.author.tag}): ${message.content + '\n' + (message.attachments.first()?.url || '')}`);
			modmailClient.threads.get(message.author.id).messages.push(`${summaryTimestamp()} R: ${message.content + (message.attachments.first()?.url ? '[Attachment]' : '')}`); // R = recipient, M = moderator
			return;
		}
		const caseId = (Date.now() + '').slice(0, -5);
		const unimportant = message.content.toLowerCase().startsWith('[unimportant]');
		message.channel.send(`ModMail received! :white_check_mark:\nWait for a reply. If you\'re reporting a user, send additional messages including the user ID of the user you\'re reporting, screenshots and message links. All messages will be forwarded to a moderator.\n\`Case ID: ${caseId}\``);
		modmailClient.threads.set(message.author.id, { messages: [], caseId, startTime: Date.now() });
		modmailChannel.send(`${unimportant ? '' : client.config.mainServer.staffRoles.map(x => '<@&' + client.config.mainServer.roles[x] + '>').join(' ')}\n\`Case ID: ${caseId}\` New ModMail from ${message.author.toString()} (${message.author.tag}). A communication portal has been opened for ${unimportant ? '20' : '10'} minutes.\nRequest extra time with \`et ${caseId}\`\nReply with \`rpl ${caseId} [message]\`\nEnd ModMail with \`end ${caseId} [reason]\`\nModMail Content: ${message.content + '\n' + (message.attachments.first()?.url || '')}`);
		modmailClient.threads.get(message.author.id).messages.push(`${summaryTimestamp()} R: ${message.content + (message.attachments.first()?.url ? '[Attachment]' : '')}`); // R = recipient, M = moderator
		let collectorEndTimestamp = Date.now() + 10*60*1000;
		if (unimportant) collectorEndTimestamp += 10 * 60 * 1000;
		let timeWarning = false;
		const modReplyCollector = modmailChannel.createMessageCollector(() => true);

		modReplyCollector.on('collect', async modReply => {
			if (modReply.content.startsWith('et')) {
				const args = modReply.content.split(' ');
				const replyCaseId = args[1];
				if (!replyCaseId) return modmailChannel.send('You need to add a case id so its clear which ModMail needs extra time');
				if (!replyCaseId === caseId) return; // replied to different convo than this
				collectorEndTimestamp = Date.now() + 10*60*1000;
				modmailChannel.send('Extra time granted. The communication portal will close in 10 minutes.');
				timeWarning = false;
			} else if (modReply.content.startsWith('rpl')) {
				const args = modReply.content.split(' ');
				const replyCaseId = args[1];
				if (!replyCaseId) return modmailChannel.send('You need to add a case id so its clear which ModMail you want to reply to');
				if (!replyCaseId === caseId) return; // replied to different convo than this
				const reply = args.slice(2).join(' ') + '\n' + (modReply.attachments.first()?.url || '');
				message.channel.send(`:warning: Reply from ${modReply.member.roles.highest.name} ${modReply.author.tag}: ${reply}`);
				modmailClient.threads.get(message.author.id).messages.push(`${summaryTimestamp()} M (${modReply.author.username}): ${args.slice(2).join(' ') + (modReply.attachments.first()?.url ? '[Attachment]' : '')}`); // R = recipient, M = moderator
				modmailChannel.send(`\`Case ID: ${caseId}\` Reply forwarded.`);
			} else if (modReply.content.startsWith('end')) {
				const args = modReply.content.split(' ');
				const replyCaseId = args[1];
				if (!replyCaseId) return modmailChannel.send('You need to add a case id so its clear which ModMail session you want to end');
				if (!replyCaseId === caseId) return; // replied to different convo than this
				const reason = args.slice(2).join(' ');
				message.channel.send(`:x: ${modReply.member.roles.highest.name} ${modReply.author.tag} has ended this ModMail session with reason: ${reason}`);
				await modmailChannel.send(`\`Case ID: ${caseId}\` ModMail session has closed.`);
				modmailClient.threads.get(message.author.id).messages.push(`${summaryTimestamp()} M (${modReply.author.username}) Ended session: ${reason}`); // R = recipient, M = moderator
				modReplyCollector.stop();
			}
		});

		const interval = setInterval(() => {
			if (Date.now() > collectorEndTimestamp) {
				modReplyCollector.stop();
				modmailChannel.send(`\`Case ID: ${caseId}\` ModMail session has closed.`);
			} else if (Date.now() + 60*1000 > collectorEndTimestamp && !timeWarning) {
				modmailChannel.send(`\`Case ID: ${caseId}\` Portal closing in 1 minute.`);
				timeWarning = true;
			}
		}, 5000);

		modReplyCollector.on('end', () => {
			clearInterval(interval);
			// send embed in modmail channel compiling everything together
			const embed = new client.embed()
				.setTitle('ModMail Summary')
				.setDescription(`\`Case ID: ${caseId}\`\nR: Recipient: ${message.author.toString()} (${message.author.tag}), M: Moderator - Time Elapsed: ${client.formatTime(Date.now() - modmailClient.threads.get(message.author.id).startTime, 2)} - Times are in UTC\n\`\`\`\n${modmailClient.threads.get(message.author.id).messages.join('\n')}\n\`\`\``)
				.setFooter('Starting Time')
				.setTimestamp(modmailClient.threads.get(message.author.id).startTime)
				.setColor(client.embedColor)
			modmailChannel.send(embed);
			// remove from threads collection
			if (!modmailClient.threads.get(message.author.id).messages.some(x => x.includes('] M ('))) {
				message.channel.send(':x: The ModMail session ended automatically with no response from a moderator. Usually this means that there are no moderators online. Please wait patiently. The moderators will contact you when they come online.');
			}
			modmailClient.threads.delete(message.author.id);
		});

	} else if (message.mentions.members.has(modmailClient.user.id)) {
		const embed = new client.embed()
			.setTitle('ModMail Instructions')
			.addField(':small_blue_diamond: What?', 'ModMail is a bot that makes it easy to contact a server moderator.', true)
			.addField(':small_blue_diamond: Why?', 'ModMail should be used when you want to report a rule breaker on this Discord server.', true)
			.addField(':small_blue_diamond: How?', 'Send me a Direct Message on Discord. Moderators will then solve your problem.', true)
			.addField(':small_blue_diamond: Don\'ts', 'Do not spam ModMail.\nDo not use ModMail unnecessarily.', true)
			.addField(':small_blue_diamond: Small Things', 'If your concern is not urgent, start your ModMail message with "[Unimportant]". This way the moderators know that they don\'t need to rush.', true)
			.setColor(client.embedColor)
		message.channel.send(embed);
	}
});

if (client.config.botSwitches.pccb) {
	client.login(client.tokens.token);
}
if (client.config.botSwitches.modmail) {
	modmailClient.login(client.tokens.modmailBotToken);
}
