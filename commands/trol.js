module.exports = {
    run: async (client, message, args) => {
        message.delete();
        message.channel.send('https://cdn.discordapp.com/attachments/696911040700481637/824518099877101619/video1.mp4');

    },
	name: 'trol',
	description: 'Block the trolls',
	hidden: true
};