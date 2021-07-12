module.exports = {
	run: (client, message, args) => {
		client.cpuCommand(client, message, args);
	},
	name: 'cpuintel',
	description: 'Info about IRL Intel CPUs',
	category: 'Real Computers',
	cooldown: 7
};