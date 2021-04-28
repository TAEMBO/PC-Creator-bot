module.exports = {
    run: async (client, message, args) => {
		const embed = new client.embed()
			.setTitle("Best Bitcoin build")
			.setDescription("All items in this list are buyable with in-game money.\nCost: $3000")
			.setColor(client.embedColor)
			.addFields([
				{
					"name": "Case",
					"value": "N/A",
					"inline": true
				},
				{
					"name": "Motherboard",
					"value": "ASOS ROG B450-E",
					"inline": true
				},
				{
					"name": "CPU",
					"value": "RMD A6-9400",
					"inline": true
				},
				{
					"name": "RAM",
					"value": "GODRAM DDR4 4GB",
					"inline": true
				},
				{
					"name": "GPUS",
					"value": "3x GIGABATE GTX 1080 Ti\n(or 1090 Ti, no difference in performance)",
					"inline": true
				},
				{
					"name": "Storage",
					"value": "DW GREEN DWS120",
					"inline": true
				},
				{
					"name": "PSU",
					"value": "ZALMVN ZM1000",
					"inline": true
				},
				{
					"name": "Cooler",
					"value": "DEEPCOL MAXX GTE",
					"inline": true
				},
				{
					"name": "\u200b",
					"value": "\u200b",
					"inline": true
				}
			])
			.setImage('https://media.discordapp.net/attachments/696448442989543445/835965157716656148/unknown.png')
        message.channel.send(embed);
    },
	name: 'bitcoinminer',
	description: 'Shows the current best bitcoin mining setup for only in-game money.',
	category: 'PC Creator',
	alias: ['bitcoin', 'btcpc'],
	autores: ['what/how/make/build/create/is', 'best/money/cheap/good', 'bitcoin/btc/coin', 'miner/mining', 'pc/computer/rig']
};