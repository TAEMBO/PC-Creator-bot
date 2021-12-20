module.exports = async (e, client) => {

	async function starboard() {
		if (e.t === 'message_reaction_add') {
			const message = e.reaction.message;
			const channel = message.channel;

			// #starboard wrong emoji 
			if (e.reaction.emoji.name !== '⭐' && channel.id === client.config.mainServer.channels.starboard) {
				return e.reaction.remove();
			}

			// non star emoji or bot
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