module.exports = {
	run: (client, message, args) => {
		client.cpuCommand(client, message, args);
	},
	name: 'cpuamd',
	description: 'Info about IRL AMD CPUs',
	category: 'Real Computers',
	cooldown: 10
};