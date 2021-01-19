module.exports = {
	run: (client, message, args) => {
		message.channel.send({
			embed: {
				"title": "Command Infomation",
				"description": "This command does not search the web, TÆMBØ, Finn, and High Quality TNT have to manually add each CPU and search it's specs (why? cuz TÆ still learning how to code a bot) so don't expect your CPU to be on here. To use the command, type ``,cpuintel`` or ``,cpuamd``, space, then the cpu model, do not include the family the cpu is in like Ryzen 9 or i5, just the model. like ``,cpuintel 10400``."
			}
		})
	},
	name: 'cpuinfo',
	description: 'Explains `cpuintel` and `cpuamd`'
};