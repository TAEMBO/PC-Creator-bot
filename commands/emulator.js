module.exports = {
	run: (client, message, args) => {
		message.channel.send('To play PC Creator on a PC, you need to use an emulator. The game is not available on desktop yet. Some popular emulators are LDPlayer, MEmu, NoxPlayer');
	},
	name: 'emulator',
	alias: ['bluestacks', 'memu'],
	category: 'PC Creator',
	description: 'Info about how to play PC Creator on PC',
	autores: ['play', 'pc creator', 'on pc']
};