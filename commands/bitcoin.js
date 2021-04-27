module.exports = {
    run: async (client, message, args) => {
        await message.channel.send({embed: {
			"title": "Bitcoin build",
      "description": "All items in this list are buyable with in-game money.\nCost: $3000",
      "color": 3971825,
      "fields": [
        {
          "name": "Case",
          "value": "N/A"
        },
        {
          "name": "Motherboard",
          "value": "ASOS ROG B450-E"
        },
        {
          "name": "CPU",
          "value": "RMD A6-9400"
        },
        {
          "name": "RAM",
          "value": "GODRAM DDR4 4GB"
        },
        {
          "name": "GPUS",
          "value": "3x GIGABATE GTX 1080 Ti\n(or 1090 Ti, no difference in performance)"
        },
        {
          "name": "Storage",
          "value": "DW GREEN DWS120"
        },
        {
          "name": "PSU",
          "value": "ZALMVN ZM1000"
        },
        {
          "name": "Cooler",
          "value": "DEEPCOL MAXX GTE"
        }]}});
		message.channel.send('https://media.discordapp.net/attachments/696448442989543445/835965157716656148/unknown.png')
    },
	name: 'bitcoin',
	description: 'Shows the current best bitcoin mining setup for only in-game money.',
	category: 'PC Creator',
	autores: ['best', 'bitcoin', 'mining', 'pc/build/setup']
};