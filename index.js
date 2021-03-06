const Discord = require("discord.js");
const client = new Discord.Client({ disableEveryone: true, partials: ['MESSAGE', 'REACTION'] });
const modmailClient = new Discord.Client({ disableEveryone: true });
const fs = require('fs');
const guildInvites = new Map();
const path = require('path');
const database = require('./database.js');
try {
	client.config = require("./config-test.json");
	console.log('Using ./config-test.json');
} catch (error) {
	client.config = require("./config.json");
	console.log('Using ./config.json');
}
client.prefix = client.config.prefix;

/*client.on('inviteCreate', async invite => {
    guildInvites.set(member.client.config.mainServer.id);
    });*/
client.on("ready", async () => {
	setInterval(async () => {
		await client.user.setActivity(",help", {
			type: "LISTENING", 
		});
	}, 30000);
	console.log(`Bot active as ${client.user.tag} with prefix ${client.prefix}`);
	console.log(guildInvites.set);
});
modmailClient.on("ready", async () => {
	setInterval(async () => {
		await modmailClient.user.setActivity("only moderation uses, do not message ModMail for any other reason.", {
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
		parts: ['name', 'usage', 'shortDescription', 'alias'],
		titles: ['alias']
	},
	embedColor: 3971825,
	starLimit: 3,
	selfStarAllowed: false
});
Object.assign(client.config, require('./tokens.json'));

// meme approval queue
client.memeQueue = new client.collection();

// cooldowns
client.cooldowns = new client.collection();

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
	_requirements: client.config.mainServer.roles.levels,
	_milestone() {
		const milestones = [10, 100, 1000, 696969, 800000, 1000000]; // always keep the previously achived milestone in the array so the progress is correct. here you can stack as many future milestones as youd like
		const total = Object.values(this._content || {}).reduce((a, b) => a + b, 0);
		const next = milestones.find(x => x >= total) || undefined;
		const previous = milestones[milestones.indexOf(next) - 1] || 0;
		return {
			next,
			previous,
			progress: (total - previous) / (next - previous)
		}
	},
	incrementUser(userid) {
		const amount = this._content[userid];
		if (amount) this._content[userid]++;
		else this._content[userid] = 1;
		// milestone
		if (this._milestone() && Object.values(this._content).reduce((a, b) => a + b, 0) === this._milestone().next) {
			const channel = client.channels.resolve('744401969241653298'); // #server-updates
			if (!channel) return console.log('tried to send milestone announcement but channel wasnt found');;
			channel.send(`:tada: Milestone reached! **${this._milestone.toLocaleString('en-US')}** messages have been sent in this server and recorded by Level Roles. :tada:`);
		}
		return this;
	},
	getUser(userid) {
		return this._content[userid] || 0;
	},
	hasUser(userid) {
		return !!this._content[userid];
	},
	getEligible(guildMember) {
		const age = (Date.now() - guildMember.joinedTimestamp) / 1000 / 60 / 60 / 24;
		const messages = this.getUser(guildMember.user.id);
		const roles = Object.entries(this._requirements).map((x, key) => {
			return {
				role: {
					level: key,
					id: x[1].id,
					has: guildMember.roles.cache.has(x[1].id)
				},
				requirements: {
					age: x[1].age,
					messages: x[1].messages
				},
				eligible: (age >= x[1].age) && (messages >= x[1].messages),
			}
		});
		return { age, messages, roles };
	},
});
client.userLevels.initLoad().intervalSave(3000).disableSaveNotifs();

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
client.dmForwardBlacklist.initLoad();

// punishments
client.punishments = new database('./punishments.json', 'array');
Object.assign(client.punishments, {
	createId() {
		return Math.max(...client.punishments._content.map(x => x.id), 0) + 1;
	},
	async addPunishment(type = '', member, options = {}, moderator) {
		const now = Date.now();
		const { time, reason } = options;
		const timeInMillis = time ? client.parseTime(time) : undefined;
		switch (type) {
			case 'ban':
				const banData = { type, id: this.createId(), member: member.user.id, moderator, time: now };
				const dm = await member.send(`You\'ve been banned from ${member.guild.name} ${timeInMillis ? `for ${client.formatTime(timeInMillis, 4, { longNames: true, commas: true })} (${timeInMillis}ms)` : 'forever'} for reason \`${reason || 'unspecified'}\` (Case #${banData.id})`);
				const banResult = await member.ban({ reason: `${reason || 'unspecified'} | Case #${banData.id}` }).catch(err => err.message);
				if (typeof banResult === 'string') {
					dm.delete();
					return 'Ban was unsuccessful: ' + banResult;
				} else {
					if (timeInMillis) {
						banData.endTime = now + timeInMillis;
						banData.duration = timeInMillis;
					}
					if (reason) banData.reason = reason;
					client.makeModlogEntry(banData, client);
					this.addData(banData);
					this.forceSave();
					return `Case #${banData.id}: Successfully banned ${member.user.tag} (${member.user.id}) ${timeInMillis ? `for ${client.formatTime(timeInMillis, 4, { longNames: true, commas: true })} (${timeInMillis}ms)` : 'forever'} for reason \`${reason || 'unspecified'}\``;
				}
			case 'softban':
				const guild = member.guild;
				const softbanData = { type, id: this.createId(), member: member.user.id, moderator, time: now };
				const softbanResult = await member.ban({ days: 7, reason: `${reason || 'unspecified'} | Case #${softbanData.id}` }).catch(err => err.message);
				if (typeof softbanResult === 'string') {
					return 'Softban (ban) was unsuccessful: ' + softbanResult;
				} else {
					const unbanResult = guild.members.unban(softbanData.member, `${reason || 'unspecified'} | Case #${softbanData.id}`).catch(err => err.message);
					if (typeof unbanResult === 'string') {
						return 'Softban (unban) was unsuccessful: ' + unbanResult;
					} else {
						if (reason) softbanData.reason = reason;
						client.makeModlogEntry(softbanData, client);
						this.addData(softbanData);
						this.forceSave();
						return `Case #${softbanData.id}: Successfully softbanned ${member.user.tag} (${member.user.id}) for reason \`${reason || 'unspecified'}\``;
					}
				}
			case 'kick':
				const kickData = { type, id: this.createId(), member: member.user.id, moderator, time: now };
				const kickResult = await member.kick(`${reason || 'unspecified'} | Case #${kickData.id}`).catch(err => err.message);
				if (typeof kickResult === 'string') {
					return 'Kick was unsuccessful: ' + kickResult;
				} else {
					if (reason) kickData.reason = reason;
					client.makeModlogEntry(kickData, client);
					this.addData(kickData);
					this.forceSave();
					return `Case #${kickData.id}: Successfully kicked ${member.user.tag} (${member.user.id}) for reason \`${reason || 'unspecified'}\``;
				}
			case 'mute':
				if (member.roles.cache.has(client.config.mainServer.roles.muted)) return `Mute was unsuccessful: User already has the **${member.guild.roles.cache.get(client.config.mainServer.roles.muted).name}** role.`
				const muteData = { type, id: this.createId(), member: member.user.id, moderator, time: now };
				const muteResult = await member.roles.add(client.config.mainServer.roles.muted, `${reason || 'unspecified'} | Case #${muteData.id}`).catch(err => err.message);
				if (typeof muteResult === 'string') {
					return 'Mute was unsuccessful: ' + muteResult;
				} else {
					if (timeInMillis) {
						muteData.endTime = now + timeInMillis;
						muteData.duration = timeInMillis;
					}
					if (reason) muteData.reason = reason;
					client.makeModlogEntry(muteData, client);
					this.addData(muteData);
					this.forceSave();
					member.send(`You\'ve been muted in ${member.guild.name} ${timeInMillis ? `for ${client.formatTime(timeInMillis, 4, { longNames: true, commas: true })} (${timeInMillis}ms)` : 'forever'} for reason \`${reason || 'unspecified'}\` (Case #${muteData.id})`);
					return `Case #${muteData.id}: Successfully muted ${member.user.tag} (${member.user.id}) ${timeInMillis ? `for ${client.formatTime(timeInMillis, 4, { longNames: true, commas: true })} (${timeInMillis}ms)` : 'forever'} for reason \`${reason || 'unspecified'}\``;
				}
			case 'warn':
				const warnData = { type, id: this.createId(), member: member.user.id, moderator, time: now };
				const warnResult = await member.send(`You\'ve been warned in ${member.guild.name} for reason \`${reason || 'unspecified'}\` (Case #${warnData.id})`).catch(err => err.message);
				if (typeof warnResult === 'string') {
					return 'Warn was unsuccessful: ' + warnResult;
				} else {
					if (reason) warnData.reason = reason;
					client.makeModlogEntry(warnData, client);
					this.addData(warnData);
					this.forceSave();
					return `Case #${warnData.id}: Successfully warned ${member.user.tag} (${member.user.id}) for reason \`${reason || 'unspecified'}\``;
				}
		}
	},
	async removePunishment(caseId, moderator, reason) {
		const now = Date.now();
		const punishment = this._content.find(x => x.id === caseId);
		const id = this.createId();
		if (!punishment) return 'Punishment not found.';
		if (['ban', 'mute'].includes(punishment.type)) {
			const guild = client.guilds.cache.get(client.config.mainServer.id);
			let removePunishmentResult;
			if (punishment.type === 'ban') {
				// unban
				removePunishmentResult = await guild.members.unban(punishment.member, `${reason || 'unspecified'} | Case #${id}`).catch(err => err.message); // unbanning returns a user
			} else if (punishment.type === 'mute') {
				// remove role
				removePunishmentResult = await (await guild.members.fetch(punishment.member)).roles.remove(client.config.mainServer.roles.muted, `${reason || 'unspecified'} | Case #${id}`).catch(err => err.message);
				if (typeof removePunishmentResult !== 'string') {
					removePunishmentResult.send(`You\'ve been unmuted in ${removePunishmentResult.guild.name}.`);
					removePunishmentResult = removePunishmentResult.user; // removing a role returns a guildmember
				}
			}
			if (typeof removePunishmentResult === 'string') return `Un${punishment.type} wass unsuccessful: ${removePunishmentResult}`;
			else {
				const removePunishmentData = { type: `un${punishment.type}`, id, cancels: punishment.id, member: punishment.member, reason, moderator, time: now };
				client.makeModlogEntry(removePunishmentData, client);
				this._content[this._content.findIndex(x => x.id === punishment.id)].expired = true;
				this.addData(removePunishmentData).forceSave();
				return `Successfully ${punishment.type === 'ban' ? 'unbanned' : 'unmuted'} ${removePunishmentResult.tag} (${removePunishmentResult.id}) for reason \`${reason || 'unspecified'}\``;
			}
		} else {
			try {
				const removePunishmentData = { type: 'removeOtherPunishment', id, cancels: punishment.id, member: punishment.member, reason, moderator, time: now };
				client.makeModlogEntry(removePunishmentData, client);
				this._content[this._content.findIndex(x => x.id === punishment.id)].expired = true;
				this.addData(removePunishmentData).forceSave();
				return `Successfully removed Case #${punishment.id} (type: ${punishment.type}, user: ${punishment.member}).`;
			} catch (error) {
				return `${punishment.type[0].toUpperCase() + punishment.type.slice(1)} removal was unsuccessful: ${error.message}`;
			}
		}
	}
});
client.punishments.initLoad();

// channel restrictions
client.channelRestrictions = new database('./channelRestrictions.json', 'object');
client.channelRestrictions.initLoad();

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
client.categoryNames = Object.keys(categories);
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
				embedMessage.edit({
					content: `**${dbEntry.c}** :star: ${embedMessage.content.slice(embedMessage.content.indexOf('|'))}`,
					embed: embedMessage.embeds[0]
				});
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

				embedMessage.edit({
					content: `**${dbEntry.c}** :star: ${embedMessage.content.slice(embedMessage.content.indexOf('|'))}`,
					embed: embedMessage.embeds[0]
				});
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
		
		// attachments
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
			if (['png', 'jpg', 'webp', 'gif', 'jpeg'].some(x => attachment.url?.endsWith(x)) && !imageSet) {
				embed.setImage(data.message.attachments.first().url);
				imageSet = true;
			} else if (attachment.url) {
				let type = 'File';
				if (['png', 'jpg', 'webp', 'jpeg'].some(x => attachment.url?.endsWith(x))) type = 'Image';
				if (['mp4', 'mov', 'webm'].some(x => attachment.url?.endsWith(x))) type = 'Video';
				if (attachment.url?.endsWith('gif')) type = 'Gif';
				description.push(`[Embed] ${type}: [${attachment.name}](${attachment.url})`);
			}
		});

		// trim content if oversized
		const descPreview = description.join('\n').trim();
		if (descPreview.length > 2048) {
			const diff = descPreview.length - 2048;
			description[0] = description[0].slice(0, description[0].length - Math.max(3, diff)) + '...';
		}
		embed.setDescription(description.join('\n').trim());

		// get channel, send, react
		return client.channels.resolve(client.config.mainServer.channels.starboard).send(`**${data.count}** :star: | ${data.message.channel.toString()}`, embed).then(async x => {
			x.react('⭐');
			return x;
		});
	},
});
client.starboard.initLoad().intervalSave(60000);
client.on('messageDelete', async message => {
	if (message.partial) return;
	const dbEntry = client.starboard._content[message.id];
	if (!dbEntry) return;
	(await client.channels.resolve(client.config.mainServer.channels.starboard).messages.fetch(dbEntry.e)).delete();
});

// repeated messages
client.repeatedMessages = {};

// event loop, for punishments and daily msgs
setInterval(() => {
	const now = Date.now();
	const date = new Date();
	client.punishments._content.filter(x => x.endTime <= now && !x.expired).forEach(async punishment => {
		console.log(`${punishment.member}'s ${punishment.type} should expire now`);
		const unpunishResult = await client.punishments.removePunishment(punishment.id, client.user.id, 'Time\'s up!');
		console.log(unpunishResult);
		//client.unmuteMember(client, (await client.guilds.cache.get(client.config.mainServer.id).members.fetch(x[0])));
	});
	const formattedDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
	const dailyMsgs = require('./dailyMsgs.json');
	if (!dailyMsgs[formattedDate]) {
		dailyMsgs[formattedDate] = Object.values(client.userLevels._content).reduce((a, b) => a + b, 0);
		fs.writeFileSync(__dirname + '/dailyMsgs.json', JSON.stringify(dailyMsgs));
	}
}, 5000);

// suggestions, starboard
client.on('messageReactionAdd', async (reaction, user) => {
	require('./reactionRaw.js')({
		t: 'message_reaction_add',
		reaction: (reaction.partial ? await reaction.fetch() : reaction),
		user
	}, client);

});
client.on('messageReactionRemove', async (reaction, user) => {
	require('./reactionRaw.js')({
		t: 'message_reaction_remove',
		reaction: (reaction.partial ? await reaction.fetch() : reaction),
		user
	}, client);

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

client.on('guildMemberAdd', async member => {
	if (member.partial) return;
    const cachedInvites = guildInvites.get(member.client.guilds.cache.get(member.client.config.mainServer.id));
    const newInvites = await member.guild.fetchInvites();
    guildInvites.set(member.client.config.mainServer.id)
	console.log('hello');
    try {
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);
        const embed = new MessageEmbed()
            .setDescription(`${member.user.tag} is the ${member.guild.memberCount} to join.\nJoined using ${usedInvite.inviter.tag}\nNumber of uses: ${usedInvite.uses}`)
            .setTimestamp()
            .setTitle(`${usedInvite.url}`);
        const welcomeChannel = member.guild.channels.cache.find(channel => channel.id === '572673322891083776');
        if(welcomeChannel) {
            welcomeChannel.send(embed).catch(err => console.log(err));
        }
    }
    catch(err) {
        console.log('error in invite tracking', err);
    }
});

client.on("message", async (message) => {
	if (process.argv[2] === 'dev' && !client.config.eval.whitelist.includes(message.author.id)) return; // bot is being run in dev mode and a non eval whitelisted user sent a message. ignore the message.
	if (message.partial) return;
	if (message.author.bot) return;
    if (message.channel.type === 'dm') require('./dmforward.js')(message, client);
	if (!message.guild) return;
	const suggestCommand = client.commands.get('suggest');
	if (client.config.mainServer.channels.suggestions === message.channel.id && ![suggestCommand.name, ...suggestCommand.alias].some(x => message.content.split(' ')[0] === client.prefix + x) && !message.author.bot) {
		message.reply(`You\'re only allowed to send suggestions in this channel with \`${client.prefix}suggest [suggestion]\`.`).then(x => setTimeout(() => x.delete(), 12000));
		return message.delete();
	}
	const punishableRoleMentions = [
		client.config.mainServer.roles.trialmoderator,
		client.config.mainServer.roles.moderator,
		client.config.mainServer.roles.administrator,
		client.config.mainServer.roles.owner
	];
	if (message.mentions.roles.some(mentionedRole => punishableRoleMentions.includes(mentionedRole.id))) {
		message.channel.awaitMessages(x => client.hasModPerms(client, x.member) && x.content === 'y', { max: 1, time: 60000, errors: ['time']}).then(async () => {
			const muteResult = await client.muteMember(client, message.member, { time: 1000 * 60 * 5, reason: 'pinged staff role with no purpose' });
			message.channel.send(muteResult.text);
		}).catch(() => {});
	}
	if (message.content.startsWith(client.prefix)) {
		const args = message.content.slice(client.prefix.length).replace(/\n/g, ' ').split(' ');
		const commandFile = client.commands.find(x => x.name === args[0] || x.alias?.includes(args[0]));
		if (commandFile) {
			console.log(`Running command "${commandFile.name}"`);

			// channel restrictions
			if (client.channelRestrictions._content[message.channel.id]?.includes(commandFile.category) || client.channelRestrictions._content[message.channel.id]?.some(x => x.includes(commandFile.name))) {
				if (!client.hasModPerms(client, message.member) && !message.member.roles.cache.has(client.config.mainServer.roles.levels.three.id)) return;
			}

			// cooldown
			if (commandFile.cooldown) {
				const member = client.cooldowns.get(message.author.id);
				if (member) {
					if (client.cooldowns.get(message.author.id).get(commandFile.name) > Date.now()) {
						const commandCooldownForUser = client.cooldowns.get(message.author.id).get(commandFile.name);
						const cooldownMention = await message.channel.send(`You need to wait ${Math.ceil((commandCooldownForUser - Date.now()) / 1000)} seconds until you can use this command again.`);
						if (message.channel.id === client.config.mainServer.channels.suggestions) {
							setTimeout(async () => {
								await cooldownMention.delete();
								await message.delete().catch(err => console.log('could not delete ,suggest message (on cooldown) because', err.message));
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

			// do the command
			try {
				commandFile.run(client, message, args);
				commandFile.uses ? commandFile.uses++ : commandFile.uses = 1;
				return;
			} catch (error) {
				console.log(`An error occured while running command "${commandFile.name}"`, error, error.stack);
				return message.channel.send('An error occured while executing that command.');
			}
		}
	} else {
		// repeated messages
		if (message.content.length > 10 && message.guild.id === client.config.mainServer.id) {
			const thisContent = message.content.slice(0, 32);
			if (client.repeatedMessages[message.author.id]) {
				// add this message to the list
				client.repeatedMessages[message.author.id].set(message.createdTimestamp, thisContent);

				// this is the time in which 3 messages have to be sent, in milliseconds
				const threshold = 7000;

				// message mustve been sent after (now - threshold)
				client.repeatedMessages[message.author.id] = client.repeatedMessages[message.author.id].filter((x, i) => i >= Date.now() - threshold)

				// user hasnt sent long messages in the last threshold milliseconds
				if (client.repeatedMessages[message.author.id].size === 0) {
					// delete list
					delete client.repeatedMessages[message.author.id];
				}

				// a spammed message is one that has been sent at least 3 times in the last threshold milliseconds
				const spammedMessage = client.repeatedMessages[message.author.id]?.find(x => {
					return client.repeatedMessages[message.author.id].filter(y => y === x).size >= 3
				})

				// if a spammed message exists;
				if (spammedMessage) {
					// softban
					const softbanResult = await client.punishments.addPunishment('softban', message.member, { reason: 'repeated messages' }, client.user.id);
					// send softban result in last channel an identicl message was sent in
					message.channel.send(softbanResult);

					// and clear their list of long messages
					delete client.repeatedMessages[message.author.id];
				}
			} else {
				client.repeatedMessages[message.author.id] = new client.collection();
				client.repeatedMessages[message.author.id].set(message.createdTimestamp, message.content.slice(0, 32));
			}
		}

		const BLACKLISTED_CHANNELS = [
			'748122380383027210', /* bot-commands */
		];
		// if message was not sent in a blacklisted channel, count towards user level
		if (!BLACKLISTED_CHANNELS.includes(message.channel.id)) client.userLevels.incrementUser(message.author.id);

		require('./autores.js')(message, client);
	}
});
modmailClient.threads = new client.collection();
modmailClient.on('message', message => {
	require('./modmailMessage.js')(message, modmailClient, client);
});

if (client.config.botSwitches.pccb) {
	client.login(client.config.token);
}
if (client.config.botSwitches.modmail) {
	modmailClient.login(client.config.modmailBotToken);
}
