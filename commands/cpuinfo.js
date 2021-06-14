module.exports = {
	run: (client, message, args) => {
		message.channel.send({
			embed: {
				"title": "Command Infomation",
				"description": "This command does not search the web. <@615761944154210305>, <@731186471461060641>, <@506033590656696332>, and <@491620401810767881> have to manually add each CPU and search it's specs so don't expect your CPU to be on here. To use the command, type ``,cpuintel [CPU Name]`` or ``,cpuamd [CPU Name]``.\n\nPlease note that the current CPU lineups we have are as follows: AMD Ryzen, AMD FX, AMD Epyc, AMD Phenom, Intel Core 2, Intel Xeon, Intel Core mainstream, Intel Core Extreme Edition.\nNo we don't have laptop CPUs too bad so sad."
			}
		})
	},
	name: 'cpuinfo',
	description: 'Explains `cpuintel` and `cpuamd`'
};