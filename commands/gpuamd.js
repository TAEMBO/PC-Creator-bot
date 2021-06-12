module.exports = {
	run: (client, message, args) => {
		if (!args[1]) return message.channel.send(`You need to search for a GPU with \`${client.prefix}gpuamd [gpu name]\``);
		if (args[1].toUpperCase() === '6800') {
			message.channel.send({
				embed: {
					"title": "AMD Radeon RX 6800",
					"description": "**Memory Interface**: 256-bit\n**Memory size**:  16GB\n**Memory type**: GDDR6\n**Power connectors**: 8 + 8-pin\n**TDP**: 250w\n**MSRP**: $579 USD",
					"color": 15547654
				}
			})
		} else if (args[1].toUpperCase() === '6800XT') {
			message.channel.send({
				embed: {
					"title": "AMD Radeon RX 6800 XT",
					"description": "**Memory Interface**: 256-bit\n**Memory size**:  16GB\n**Memory type**: GDDR6\n**Power connectors**: 8 + 8-pin\n**TDP**: 300w\n**MSRP**: $649 USD",
					"color": 15547654
				}
            })
        } else if (args[1].toUpperCase() === '6900XT') {
			message.channel.send({
				embed: {
					"title": "AMD Radeon RX 6900 XT",
					"description": "**Memory Interface**: 256-bit\n**Memory size**:  16GB\n**Memory type**: GDDR6\n**Power connectors**: 8 + 8-pin\n**TDP**: 300w\n**MSRP**: $999 USD",
					"color": 15547654
				}
            })
        } else if (args[1].toUpperCase() === '6700XT') {
			message.channel.send({
				embed: {
					"title": "AMD Radeon RX 6700 XT",
					"description": "**Memory Interface**: 192-bit\n**Memory size**:  12GB\n**Memory type**: GDDR6\n**Power connectors**: 6 + 8-pin\n**TDP**: 230w\n**MSRP**: N/A",
					"color": 15547654
				}
            })
        } else if (args[1].toUpperCase() === '5500XT') {
			message.channel.send({
				embed: {
					"title": "AMD Radeon RX 5500 XT",
					"description": "**Memory Interface**: 128-bit\n**Memory size**:  8GB**/**4GB\n**Memory type**: GDDR6\n**Power connectors**: 8-pin\n**TDP**: 130w\n**MSRP**: $199 USD**/**$169 USD",
					"color": 15547654
				}
            })
        } else if (args[1].toUpperCase() === '5600') {
			message.channel.send({
				embed: {
					"title": "AMD Radeon RX 5600",
					"description": "**Memory Interface**: 192-bit\n**Memory size**:  6GB\n**Memory type**: GDDR6\n**Power connectors**: 8-pin\n**TDP**: 150w\n**MSRP**: OEM Only",
					"color": 15547654
				}
            })
        } else if (args[1].toUpperCase() === '5600XT') {
			message.channel.send({
				embed: {
					"title": "AMD Radeon RX 5600 XT",
					"description": "**Memory Interface**: 192-bit\n**Memory size**:  6GB\n**Memory type**: GDDR6\n**Power connectors**: 8-pin\n**TDP**: 150w\n**MSRP**: $279 USD",
					"color": 15547654
				}
            })
        } else if (args[1].toUpperCase() === '5700') {
			message.channel.send({
				embed: {
					"title": "AMD Radeon RX 5700",
					"description": "**Memory Interface**: 256-bit\n**Memory size**:  8GB\n**Memory type**: GDDR6\n**Power connectors**: 6 + 8-pin\n**TDP**: 180w\n**MSRP**: $349 USD",
					"color": 15547654
				}
            })
        } else if (args[1].toUpperCase() === '5700XT') {
			message.channel.send({
				embed: {
					"title": "AMD Radeon RX 5700 XT",
					"description": "**Memory Interface**: 256-bit\n**Memory size**:  8GB\n**Memory type**: GDDR6\n**Power connectors**: 8 + 8-pin\n**TDP**: 225w\n**MSRP**: $399 USD",
					"color": 15547654
				}
            })
		} 
	},
	name: 'gpuamd',
	usage: ['gpu name'],
	description: 'Info about AMD GPUs.'
};