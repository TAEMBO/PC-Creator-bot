module.exports = {
	run: (client, message, args) => {
		message.channel.send({
			embed: {
				"title": "Command Infomation",
				"description": "This command does not search the web, TÆMBØ, Finn, Apollo, Chikkennnn, and High Quality TNT have to manually add each CPU and search it's specs (why? cuz bot don't have pixie dust yet) so don't expect your CPU to be on here. To use the command, type ``,cpuintel`` or ``,cpuamd``, space, then the cpu model.\n\nPlease note that the current CPU lineups we have are as follows: AMD Ryzen, AMD FX, AMD Epyc, AMD Phenom (in progress), Intel Core 2, Intel Xeon (in progress), Intel Core mainstream, Intel Core Extreme Edition.\nNo we don't have laptop CPUs too bad so sad."
			}
		})
	},
	name: 'cpuinfo',
	description: 'Explains `cpuintel` and `cpuamd`'
};