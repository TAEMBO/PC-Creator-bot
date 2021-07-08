module.exports = async (e, client) => {
	if (e.d.guild_id !== client.config.mainServer.id) return;
	async function suggestions() {
		if (e.d.channel_id !== client.config.mainServer.channels.suggestions) return;
		const channel = client.channels.resolve(e.d.channel_id);
		const message = await channel.messages.fetch(e.d.message_id);
		const reaction = message.reactions.resolve(e.d.emoji.id || e.d.emoji.name);

		// wrong emoji
		if (e.t === 'MESSAGE_REACTION_ADD' && !['✅', '❌'].includes(e.d.emoji.name)) {
			return reaction.remove();
		}

		// self voted
		const at = (arr, num) => num < 0 ? arr[arr.length + num] : arr[num]; // credit to Lebster#0617 on the coding den discord server
		if (e.t === 'MESSAGE_REACTION_ADD' && e.d.user_id === at(message.embeds[0].author.name.split('('), -1).slice(0, -1)) {
			return reaction.users.remove(e.d.user_id).then(() => {
				channel.send(`<@${e.d.user_id}> You\'re not allowed to vote on your own suggestion!`).then(x => setTimeout(() => x.delete(), 6000));
			});
		}

		// suggestion embed color
		let upvotes = message.reactions.resolve('✅');
		let downvotes = message.reactions.resolve('❌');

		upvotes = upvotes?.count;
		downvotes = downvotes?.count;

		if (typeof upvotes !== 'number' || typeof downvotes !== 'number' || isNaN(upvotes) || isNaN(downvotes)) return;
		const embed = message.embeds[0];

		function changeProperties(newColor, newTitle) {
			if (embed.hexColor === newColor.toLowerCase() && embed.title === newTitle) return;
			embed.setColor(newColor);
			embed.setTitle(newTitle);
			return message.edit(embed);
		}

		if (upvotes / downvotes >= 15.1) { // breakthrough, 15.1
			return changeProperties('#f1c40f', 'Breakthrough Suggestion:');
		}
		if (upvotes / downvotes >= 10.1) { // fantastic, 10.1
			return changeProperties('#00e100', 'Fantastic Suggestion:');
		}
		if (upvotes / downvotes >= 5.1) { // good, 5.1
			return changeProperties('#1aefd3', 'Good Suggestion:');
		}
		if (upvotes / downvotes <= 1 / 3) { // bad, 1/3
			return changeProperties('#514e39', 'Controversial Suggestion:');
		}
		// normal
		return changeProperties('#3C9AF1', 'Suggestion:');
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
};