module.exports = {
	run: (client, message, args) => {
		const embed = new client.embed()
			.setTitle('Credits')
            .addField('Bot Owner', '<@615761944154210305>')
            .addField('Bot Developer', '<@384002606621655040>')
            .addField('CPU data', '<@615761944154210305> <@731186471461060641> <@506033590656696332> <@491620401810767881>')
            .addField('GPU data', '<@615761944154210305> <@731186471461060641> <@469571345810718721> <@491620401810767881> <@506033590656696332>')
			.setColor(client.embedColor)
		message.channel.send(embed);
	},
	name: 'credits',
    description: 'People who have helped out with developing the bot'
};