module.exports = {
	run: (client, message, args) => {
		message.channel.send("To update drivers you need to:\n1. Turn on the PC\n2. Install and run DriverPack\n3. Click \"Update drivers\"");
	},
	name: 'drivers',
	description: 'Offers help with updating drivers',
	category: 'PC Creator',
	autores: ['update', 'driver']
};