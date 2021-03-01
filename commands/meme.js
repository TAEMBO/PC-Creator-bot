const memes = new Map(Object.entries(require('./../memes.json')));
module.exports = {
	run: (client, message, args) => {
		if (!args[1]) {

		} else {
			const meme = memes.get(args[1]);
			const embed = new client.embed()
				.setTitle(meme.name)
				.setImage(meme.url)
				.setAuthor(meme.author)
				.setColor('#00ff44')
			message.channel.send(embed);
		}
	},
	name: 'meme',
	description: 'Works like xkcd, images are given a number and you can view a specific image if you know the number. This command is for memes made by the PCC community'
};