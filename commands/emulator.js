module.exports = {
	run: (client, message, args) => {
		message.channel.send('To play PC Creator on PC, you need to use an emulator. The game is not available on Steam or any other PC game launcher. The most popular emulators are Bluestacks, MEmu, NoxPlayer');
	},
	name: 'emulator',
	alias: ['bluestacks', 'memu'],
	category: 'PC Creator',
	description: 'Info about how to play PC Creator on PC',
	autores: ['play', 'pc creator', 'on pc']
};