module.exports = {
	run: (client, message, args) => {
		message.channel.send("If you want to use MacOS on a PC, you need an **Intol** CPU, and an **RMD** gpu. You can also use the iGPU on the CPU as well.");
	},
	name: 'macos',
	description: 'Tells you what parts are needed to make a working PC with MacOS',
	category: 'PC Creator',
	autores: ['how/what', 'mac/apple', 'OPT-blue/screen', 'OPT-install']
};