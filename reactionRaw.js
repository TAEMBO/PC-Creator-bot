module.exports = async (e, client) => {
	// this function is ran when a message reaction is added or removed

	// this function handles suggestions and starboard which are only available in the main server, so return if this event didnt originate from the main server
	if (e.reaction.message.guild.id !== client.config.mainServer.id) return;

	async function suggestions() {
		// reactions regarding suggestions only happen in the suggestions channel so return if this event didnt originate from the suggestions channel
		if (e.reaction.message.channel.id !== client.config.mainServer.channels.suggestions) return;

		const reaction = e.reaction;
		const message = reaction.message;
		const channel = message.channel;

		// wrong emoji
		if (e.t === 'message_reaction_add' && !['✅', '❌'].includes(e.reaction.emoji.name)) {
			return reaction.remove();
		}

		const at = (arr, num) => num < 0 ? arr[arr.length + num] : arr[num]; // credit to Lebster#0617 on the coding den discord server
		
		// self voted
		// if a reaction was added by a user whose id is in the embed author name
		if (e.t === 'message_reaction_add' && message.embeds[0]?.author?.name && e.user.id === at(message.embeds[0].author.name.split('('), -1).slice(0, -1)) {
			// remove the users reaction and notify them
			return reaction.users.remove(e.user.id).then(() => {
				channel.send(`<@${e.user.id}> You\'re not allowed to vote on your own suggestion!`).then(x => setTimeout(() => x.delete(), 6000));
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
			return changeProperties('#37BE73', 'Breakthrough Suggestion:');
		}
		if (upvotes / downvotes >= 10.1) { // fantastic, 10.1
			return changeProperties('#EE2A6E', 'Fantastic Suggestion:');
		}
		if (upvotes / downvotes >= 5.1) { // good, 5.1
			return changeProperties('#6A36FB', 'Good Suggestion:');
		}
		if (upvotes / downvotes <= 1 / 3) { // bad, 1/3
			return changeProperties('#4E535E', 'Controversial Suggestion:');
		}
		// normal
		return changeProperties('#269CD0', 'Suggestion:');
	}
	suggestions();

	async function starboard() {
		if (e.t === 'message_reaction_add') {
			const message = e.reaction.message;
			const channel = message.channel;

			// #starboard wrong emoji 
			if (e.reaction.emoji.name !== '⭐' && channel.id === client.config.mainServer.channels.starboard) {
				return e.reaction.remove();
			}

			// #starboard star reactions
			if (e.reaction.emoji.name !== '⭐' || e.user.bot) return;

			// starred own message
			if ((message.author.id === e.user.id || message.embeds[0]?.footer?.text.includes(e.user.id)) && !client.selfStarAllowed) {
				e.reaction.users.remove(e.user.id);
				return message.channel.send(e.user.toString() + ', You can\'t star your own message.').then(x => setTimeout(() => x.delete(), 6000));
			}

			// star increment
			if (channel.id === client.config.mainServer.channels.starboard) {
				if (!message.embeds[0]) return;
				const footer = message.embeds[0].footer.text;
				client.starboard.increment({ message: { id: footer.slice(4, footer.indexOf(',')) } });
			} else {
				client.starboard.increment({ message });
			}
		} else if (e.t === 'message_reaction_remove') {
			const message = e.reaction.message;

			// decrement only if self starring is not allowed and a person (not bot) removed reaction star. otherwise return
			if (e.reaction.emoji.name !== '⭐' || e.user.bot || ((message.author.id === e.user.id || message.embeds[0]?.footer?.text.includes(e.user.id)) && !client.selfStarAllowed)) return;

			// decrement
			if (message.channel.id === client.config.mainServer.channels.starboard) {
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