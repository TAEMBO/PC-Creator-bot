module.exports = {
    run: (client, message, args) => {
        message.channel.send({embed: {
			"title": "__Staff members__",
			"description": "\n**<@&632674518317531137>**\n<@387088097374109698>\n\n**<@&589435378147262464>**\n<@506033590656696332>\n<@615761944154210305>\n<@478922521601638400>\n\nIf you need help, or want to report bad behavior, feel free to message anyone of these people and they will get back to you asap.",
			"color": 3971825}});
    },
    name: 'staff'
};