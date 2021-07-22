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
					"value": "ASOS MAXIMUS VIII",
					"inline": true
				},
				{
					"name": "CPU",
					"value": "INTOL G3900",
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
					"value": "DEEPCOL 15 PWM",
					"inline": true
				},
				{
					"name": "\u200b",
					"value": "\u200b",
					"inline": true
				}
			])
			.setImage('https://images-ext-2.discordapp.net/external/tnkw9dUOYfhUtyYlnKn7tmckIdNo5oIBkd4peFQezcw/https/media.discordapp.net/attachments/778848112588095559/866837595241054258/image0.png')
        message.channel.send(embed);
    },
	name: 'bitcoinminer',
	description: 'Shows the current best bitcoin mining setup for only in-game money.',
	category: 'PC Creator',
	alias: ['bitcoin', 'btcpc'],
	autores: ['what/how/make/build/create/is', 'best/money/cheap/good', 'bitcoin/btc/coin', 'miner/mining', 'pc/computer/rig']
};