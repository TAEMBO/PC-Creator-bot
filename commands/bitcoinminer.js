module.exports = {
    run: async (client, message, args) => {
		const embed = new client.embed()
			.setTitle("Best Bitcoin build")
			.setDescription("All items in this list are buyable with in-game money.\nCost: $2980")
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
					"value": "L15S 4GB",
					"inline": true
				},
				{
					"name": "GPUS",
					"value": "3x GEFORCE RTX 2060",
					"inline": true
				},
				{
					"name": "Storage",
					"value": "DW GREEN DWS120",
					"inline": true
				},
				{
					"name": "PSU",
					"value": "MWE RED",
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
			.setImage('https://media.discordapp.net/attachments/571031705109135361/873973732874551416/Bitcoin_Pc.jpg')
        message.channel.send(embed);
    },
	name: 'bitcoinminer',
	description: 'Shows the current best bitcoin mining setup for only in-game money.',
	category: 'PC Creator',
	alias: ['bitcoin', 'btcpc'],
	autores: ['what/how/make/build/create/is', 'best/money/cheap/good', 'bitcoin/btc/bit coin', 'miner/mining/mine', 'pc/computer/rig']
};