module.exports = {
	run: (client, message, args) => {
		if (!args[1]) return message.channel.send(`You need to search for a GPU with \`${client.prefix}gpuamd [gpu name]\``);
		if (args[1].toUpperCase() === '3090') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce RTX 3090 FE",
					"description": "**Memory Interface**: 384-bit\n**Memory size**:  24GB\n**Memory type**: GDDR6X\n**Power connectors**: 12-pin\n**TDP**: 350w\n**MSRP**: $1499 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '3080TI') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce RTX 3080 Ti FE",
					"description": "**Memory Interface**: 384-bit\n**Memory size**:  12GB\n**Memory type**: GDDR6X\n**Power connectors**: 12-pin\n**TDP**: 350w\n**MSRP**: $1199 USD",
					"color": 7780608
				}
            })
		} else if (args[1].toUpperCase() === '3080') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce RTX 3080 FE",
					"description": "**Memory Interface**: 320-bit\n**Memory size**:  10GB\n**Memory type**: GDDR6X\n**Power connectors**: 12-pin\n**TDP**: 320w\n**MSRP**: $699 USD",
					"color": 7780608
				}
            })
		} else if (args[1].toUpperCase() === '3070TI') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce RTX 3070 Ti FE",
					"description": "**Memory Interface**: 256-bit\n**Memory size**:  8GB\n**Memory type**: GDDR6X\n**Power connectors**: 12-pin\n**TDP**: 290w\n**MSRP**: $599 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '3070') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce RTX 3070 FE",
					"description": "**Memory Interface**: 256-bit\n**Memory size**:  8GB\n**Memory type**: GDDR6\n**Power connectors**: 12-pin\n**TDP**: 220w\n**MSRP**: $499 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '3060TI') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce RTX 3060 Ti FE",
					"description": "**Memory Interface**: 256-bit\n**Memory size**:  8GB\n**Memory type**: GDDR6X\n**Power connectors**: 12-pin\n**TDP**: 200w\n**MSRP**: $399 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '3060') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce RTX 3060",
					"description": "**Memory Interface**: 192-bit\n**Memory size**:  12GB\n**Memory type**: GDDR6\n**Power connectors**: N/A\n**TDP**: 170w\n**MSRP**: $329 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '2080TI') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce RTX 2080 Ti FE",
					"description": "**Memory Interface**: 352-bit\n**Memory size**:  11GB\n**Memory type**: GDDR6\n**Power connectors**: 8 + 8-pin\n**TDP**: 260w\n**MSRP**: $1199 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '2080S') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce RTX 2080 Super FE",
					"description": "**Memory Interface**: 256-bit\n**Memory size**:  8GB\n**Memory type**: GDDR6\n**Power connectors**: 6 + 8-pin\n**TDP**: 250w\n**MSRP**: $699 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '2080') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce RTX 2080 FE",
					"description": "**Memory Interface**: 256-bit\n**Memory size**:  8GB\n**Memory type**: GDDR6\n**Power connectors**: 6 + 8-pin\n**TDP**: 225w\n**MSRP**: $699 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '2070S') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce RTX 2070 Super FE",
					"description": "**Memory Interface**: 256-bit\n**Memory size**:  8GB\n**Memory type**: GDDR6\n**Power connectors**: 6 + 8-pin\n**TDP**: 215w\n**MSRP**: $499 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '2070') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce RTX 2070 FE",
					"description": "**Memory Interface**: 256-bit\n**Memory size**:  8GB\n**Memory type**: GDDR6\n**Power connectors**: 8-pin\n**TDP**: 185w\n**MSRP**: $499 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '2060S') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce RTX 2060 Super FE",
					"description": "**Memory Interface**: 256-bit\n**Memory size**:  8GB\n**Memory type**: GDDR6\n**Power connectors**: 8-pin\n**TDP**: 175w\n**MSRP**: $399 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '2060') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce RTX 2060 FE",
					"description": "**Memory Interface**: 192-bit\n**Memory size**:  6GB\n**Memory type**: GDDR6\n**Power connectors**: 8-pin\n**TDP**: 160w\n**MSRP**: $349 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '1660TI') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce GTX 1660 Ti",
					"description": "**Memory Interface**: 192-bit\n**Memory size**:  6GB\n**Memory type**: GDDR6\n**Power connectors**: 8-pin\n**TDP**: 120w\n**MSRP**: $279 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '1660S') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce GTX 1660 Super",
					"description": "**Memory Interface**: 192-bit\n**Memory size**:  6GB\n**Memory type**: GDDR6\n**Power connectors**: 8-pin\n**TDP**: 125w\n**MSRP**: $229 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '1660') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce GTX 1660",
					"description": "**Memory Interface**: 192-bit\n**Memory size**:  6GB\n**Memory type**: GDDR5\n**Power connectors**: 8-pin\n**TDP**: 120w\n**MSRP**: $219 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '1650S') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce GTX 1650 Super",
					"description": "**Memory Interface**: 128-bit\n**Memory size**:  4GB\n**Memory type**: GDDR6\n**Power connectors**: 6-pin\n**TDP**: 100w\n**MSRP**: $169 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '1650') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce GTX 1650",
					"description": "**Memory Interface**: 128-bit\n**Memory size**:  4GB\n**Memory type**: GDDR5**/**GDDR6\n**Power connectors**: N/A**/**6-pin\n**TDP**: 75w+\n**MSRP**: $149 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '1080TI') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce GTX 1080 Ti FE",
					"description": "**Memory Interface**: 352-bit\n**Memory size**:  11GB\n**Memory type**: GDDR5X\n**Power connectors**: 6 + 8-pin\n**TDP**: 250w\n**MSRP**: $699 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '1080') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce GTX 1080 FE",
					"description": "**Memory Interface**: 256-bit\n**Memory size**:  8GB\n**Memory type**: GDDR5X\n**Power connectors**: 8-pin\n**TDP**: 180w\n**MSRP**: $599 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '1070TI') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce GTX 1070 Ti FE",
					"description": "**Memory Interface**: 256-bit\n**Memory size**:  8GB\n**Memory type**: GDDR5\n**Power connectors**: 8-pin\n**TDP**: 180w\n**MSRP**: $449 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '1070') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce GTX 1070 FE",
					"description": "**Memory Interface**: 256-bit\n**Memory size**:  8GB\n**Memory type**: GDDR5\n**Power connectors**: 8-pin\n**TDP**: 180w\n**MSRP**: $379 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '1060') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce GTX 1060 FE",
					"description": "**Memory Interface**: 192-bit\n**Memory size**:  6GB**/**5GB**/**3GB\n**Memory type**: GDDR5**/**GDDR5X\n**Power connectors**: 6-pin\n**TDP**: 120w\n**MSRP**: $299 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '1050TI') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce GTX 1050 Ti FE ",
					"description": "**Memory Interface**: 128-bit\n**Memory size**:  4GB\n**Memory type**: GDDR5\n**Power connectors**: N/A\n**TDP**: 75w\n**MSRP**: $139 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '1050') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce GTX 1050 FE",
					"description": "**Memory Interface**: 128-bit**/**96-bit\n**Memory size**:  2GB**/**3GB\n**Memory type**: GDDR5\n**Power connectors**: N/A\n**TDP**: 75w\n**MSRP**: $109 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '1030') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce GT 1030",
					"description": "**Memory Interface**: 64-bit\n**Memory size**:  2GB\n**Memory type**: SDDR4**/**GDDR5\n**Power connectors**: N/A\n**TDP**: 30w\n**MSRP**: $80 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '1010') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce GT 1010",
					"description": "**Memory Interface**: 64-bit\n**Memory size**:  2GB\n**Memory type**: GDDR5\n**Power connectors**: N/A\n**TDP**: 30w\n**MSRP**: N/A",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '710') {
			message.channel.send({
				embed: {
					"title": "NVIDIA GeForce GT 710",
					"description": "**Memory Interface**: 64-bit\n**Memory size**:  2GB\n**Memory type**: DDR3\n**Power connectors**: N/A\n**TDP**: 19w\n**MSRP**: $34 USD",
					"color": 7780608
				}
			})
		} else if (args[1].toUpperCase() === '210') {
            message.channel.send({
                embed: {
                    "title": "NVIDIA GeForce GT 210",
                    "description": "**Memory Interface**: 64-bit\n**Memory size**:  512MB\n**Memory type**: DDR3\n**Power connectors**: N/A\n**TDP**: 31w\n**MSRP**: $45 USD",
                    "color": 7780608
                }
            })
		} else if (args[1].toUpperCase() === 'TITANRTX') {
            message.channel.send({
                embed: {
                    "title": "NVIDIA Titan RTX",
                    "description": "**Memory Interface**: 384-bit\n**Memory size**:  24GB\n**Memory type**: GDDR6\n**Power connectors**: 8 + 8-pin\n**TDP**: 280w\n**MSRP**: $2499 USD",
                    "color": 7780608
                }
            })
		} 
	},
	name: 'gpunvidia',
	usage: ['gpu name'],
	description: 'Info about NVidia GPUs'
};