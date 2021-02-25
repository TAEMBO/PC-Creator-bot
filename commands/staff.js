module.exports = {
    run: (client, message, args) => {
        message.channel.send({embed: {
			"title": "__Staff members__",
			"description": "**<@&632674518317531137>**\n<@387088097374109698>\n\n**<@&589435378147262464>**\n<@506033590656696332>\n<@615761944154210305>\n<@478922521601638400>\n\n**<@&697002610892341298>**\n<@438760488965242883>\n\nIf you want to report someone or need any other moderation help, feel free to message anyone of these people.\n\n**<@&697728131003580537>**\n<@731186471461060641>\n<@776552252609396736>\nIf you have a question with the game, you are open to ping or message a helper to receive help.",
			"color": 3971825}});
    },
	name: 'staff',
	description: 'Shows all the current staff members'
};