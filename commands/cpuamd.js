module.exports = {
	run: (client, message, args) => {
		client.cpuCommand(client, message, args);
	},
	name: 'cpuamd',
	description: 'Info about AMD CPUs'
};