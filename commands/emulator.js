module.exports = {
	run: (client, message, args) => {
		message.channel.send('To play PC Creator on a PC, you can download the Steam version at https://store.steampowered.com/app/1831530/PC_Creator__PC_Building_Simulator/ or you can use an Android emulator. Some popular emulators are LDPlayer, MEmu, and NoxPlayer.');
	},
	name: 'emulator',
	alias: ['bluestacks', 'memu'],
	category: 'PC Creator',
	description: 'Info about how to play PC Creator on PC',
	autores: ['play', 'pc creator', 'on pc']
};