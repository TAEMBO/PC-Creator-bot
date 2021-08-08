module.exports = {
    run: (client, message, args) => {
        message.channel.send("The goal of this requirement is to make the PC get the specified FPS in the specified game, meaning you must test hardware and play the game on the PC till you find something that meets or beats the requirement. Parts that affect FPS are CPUs, RAM, and GPUs.");
    },
	name: 'optimize',
	description: 'Explains how to complete an optimize OS order',
	category: 'PC Creator',
    alias: ['opt'],
	autores: ['how/what', 'optimize']
};