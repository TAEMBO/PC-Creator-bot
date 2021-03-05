module.exports = {
	run: (client, message, args) => {
		client.cpuCommand(client, message, args);
	},
	name: 'cpuintel',
	description: 'Info about Intel CPUs',
	cooldown: 10
};