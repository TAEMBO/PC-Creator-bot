module.exports = async (e, client) => {
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

		if (upvotes / downvotes >= 18) { // breakthrough, 18
			return changeProperties('#0000d8', 'Breakthrough Suggestion:');
		}
		if (upvotes / downvotes >= 12) { // fantastic, 12
			return changeProperties('#1433f8', 'Fantastic Suggestion:');
		}
		if (upvotes / downvotes >= 6) { // good, 6
			return changeProperties('#2b75ff', 'Good Suggestion:');
		}
		if (upvotes / downvotes <= 2 / 7) { // bad, 2/7
			return changeProperties('#514e39', 'Suggestion:');
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