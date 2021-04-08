const Discord = require("discord.js");
const client = new Discord.Client({disableEveryone: true});
const fs = require('fs');
const path = require('path');
client.config = require("./config.json");
if (!client.config.token) {
	client.config = require("./config-test.json");
	console.log('Using ./config-test.json');
}
client.prefix = client.config.prefix;
client.on("ready", async () => {
	await client.user.setActivity(",help", {
		type: "LISTENING", 
	});
	await client.guilds.cache.get(client.config.mainServer.id).members.fetch();
	console.log(`Bot active as ${client.user.tag} with prefix ${client.prefix}`);
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
});

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
client.tictactoeGames = new Discord.Collection();

// userLevels
client.userLevels = new database('./userLevels.json', 'object');
Object.assign(client.userLevels, {
	_requirements: {
		age: 1000 * 60 * 60 * 24 * 30 * 3,
		messages: 1200
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
		let description = data.message.content;
		const embed = new client.embed()
			.setAuthor(`${data.message.member.displayName} [${data.message.author.tag}]`, data.message.author.avatarURL({ format: 'png', size: 128 }))
			.setTimestamp(data.message.createdTimestamp)
			.setFooter(`MSG:${data.message.id}, USER:${data.message.author.id}`)
			.setColor('#ffcc00');
		data.message.embeds.forEach(x => {
			description += `\n\n[Embed] ${x.provider ? x.provider.name + ': ' : ''}${x.title}`;
		});
		if (['png', 'jpg', 'webp'].some(x => data.message.attachments.first()?.url?.endsWith(x))) {
			embed.setImage(data.message.attachments.first().url);
		} else if (data.message.attachments.first()?.url) {
			description += '\n\n' + data.message.attachments.first().url;
		}
		embed.setDescription(description.trim());
		return client.channels.resolve(client.config.mainServer.channels.starboard).send(`**${data.count}** :star: | ${data.message.channel.toString()}`, embed).then(async x => {
			x.react('⭐');
			return x;
		});
	},
});
client.starboard.initLoad().intervalSave(60000);
client.on('messageReactionAdd', (reaction, user) => {
	if (reaction.emoji.name !== '⭐' || user.bot) return;
	if ((reaction.message.author.id === user.id || reaction.message.embeds[0]?.footer?.text.includes(user.id)) && Math.random() < 7/7 && !client.selfStarAllowed) {
		console.log(`User starred their own message. starrer: ${user.id}, message sender: ${reaction.message.author.id}, message footer: ${reaction.message.embeds[0]?.footer?.text}`);
		return reaction.message.channel.send(user.toString() + ', You can\'t star your own message.').then(x => setTimeout(() => x.delete(), 20000));
	}
	if (reaction.message.guild.id !== client.config.mainServer.id) return;
	if (reaction.message.channel.id === client.config.mainServer.channels.starboard) {
		if (!reaction.message.embeds[0]) return;
		const footer = reaction.message.embeds[0].footer.text;
		client.starboard.increment({ message: { id: footer.slice(4, footer.indexOf(',')) }});
	} else {
		client.starboard.increment(reaction);
	}
});
client.on('messageReactionRemove', (reaction, user) => {
	if (reaction.emoji.name !== '⭐' || user.bot || ((reaction.message.author.id === user.id || reaction.message.embeds[0]?.footer?.text.includes(user.id)) && !client.selfStarAllowed)) return; // own message or wrong
	if (reaction.message.channel.id === client.config.mainServer.channels.starboard) {
		if (!reaction.message.embeds[0]) return;
		const footer = reaction.message.embeds[0].footer.text;
		client.starboard.decrement({ message: { id: footer.slice(4, footer.indexOf(',')) } });
	} else {
		client.starboard.decrement(reaction);
	}
});
client.on('messageDelete', async message => {
	const dbEntry = client.starboard._content[message.id];
	if (!dbEntry) return;
	(await client.channels.resolve(client.config.mainServer.channels.starboard).messages.fetch(dbEntry.e)).delete();
});

// suggestions, starboard wrong emoji removal
client.on('raw', async e => {
	if (['MESSAGE_DELETE', 'TYPING_START', 'MESSAGE_CREATE', 'MESSAGE_UPDATE'].includes(e.t)) return;
	if (e.t === 'MESSAGE_REACTION_ADD') {
		if (e.d.channel_id === client.config.mainServer.channels.suggestions) {
			if (!['✅', '❌'].includes(e.d.emoji.name)) {
				const channel = client.channels.resolve(e.d.channel_id);
				const message = await channel.messages.fetch(e.d.message_id);
				const reaction = message.reactions.resolve(e.d.emoji.id || e.d.emoji.name);
				reaction.remove();
			}
		} else if (e.d.channel_id === client.config.mainServer.channels.starboard) {
			if (e.d.emoji.name !== '⭐') {
				const channel = client.channels.resolve(e.d.channel_id);
				const message = await channel.messages.fetch(e.d.message_id);
				const reaction = message.reactions.resolve(e.d.emoji.id || e.d.emoji.name);
				reaction.remove();
			}
		}
	} else if (e.t === 'MESSAGE_REACTION_REMOVE') {

	}
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
        const channel = client.channels.cache.get(client.config.mainServer.channels.dmForwardChannel);
        const pcCreatorServer = client.guilds.cache.get(client.config.mainServer.id);
		if (!channel || !pcCreatorServer) return console.log(`could not find channel ${client.config.mainServer.channels.dmForwardChannel} or guild ${client.config.mainServer.id}`);
        const guildMemberObject = (await pcCreatorServer.members.fetch(message.author.id));
        const memberOfPccs = !!guildMemberObject;
        const embed = new client.embed()
            .setTitle('Forwarded DM Message')
            .setAuthor(message.author.tag + ` (${message.author.id})`, message.author.avatarURL({ format: 'png', dynamic: true, size: 256}))
            .setColor(3971825)
            .addField('Message Content', message.content.length > 1024 ? message.content.slice(1021) + '...' : message.content)
            .addField('User', `<@${message.author.id}>`)
            .addField('Connections', `:small_blue_diamond: Message sender **${memberOfPccs ? 'is' : ' is not'}** on the **${pcCreatorServer.name}** Discord server${memberOfPccs ? `\n:small_blue_diamond: Roles on the PC Creator server: ${guildMemberObject.roles.cache.filter(x => x.id !== pcCreatorServer.roles.everyone.id).map(x => '**' + x.name + '**').join(', ')}` : ''}`)
            .setTimestamp(Date.now());
        channel.send(embed)
        channel.send('<@615761944154210305>');
	}
	if (!message.guild) return;
	if (client.config.mainServer.channels.suggestions === message.channel.id && !message.content.startsWith(client.prefix + 'suggest') && !message.author.bot) {
		message.reply('You\'re only allowed to send suggestions in this channel.').then(x => setTimeout(() => x.delete(), 6000));
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
					const commandCooldownForUser = client.cooldowns.get(message.author.id).get(commandFile.name);
					if (commandCooldownForUser) {
						if (commandCooldownForUser > Date.now()) {
							return message.channel.send(`You need to wait ${Math.ceil((commandCooldownForUser - Date.now()) / 1000)} seconds until you can use this command again.`);
						} else {
							client.cooldowns.get(message.author.id).set(commandFile.name, Date.now() + (commandFile.cooldown * 1000))
						}
					} else {
						client.cooldowns.get(message.author.id).set(commandFile.name, Date.now() + (commandFile.cooldown * 1000))
					}
				} else {
					client.cooldowns.set(message.author.id, new client.collection())
					client.cooldowns.get(message.author.id).set(commandFile.name, Date.now() + (commandFile.cooldown * 1000))
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
		if (message.content.includes("userbenchmark.com")) {
			message.reply(":b:ingus y u use userbenchmark");
		}
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
client.login(client.config.token);
