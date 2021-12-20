module.exports = {
	run: (client, message, args) => {
		const embed = new client.embed()
			.setTitle('Using common sense.')
			.setImage("https://childdevelopment.com.au/wp-content/uploads/bfi_thumb/shape-sorter-2xjqawyb3s7qeuj8vk2jml3ym5m6yrbslxqx94shln1zpdhaa.jpg")
			.setColor(client.embedColor)
		message.channel.send({embeds: [embed]});
	},
	name: 'cs',
    hidden: true
};