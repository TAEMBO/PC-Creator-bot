function gpuEmbed(client, gpu, manufacturer) {
	let color;
	if (manufacturer.toLowerCase() === 'nvidia') color = '75b900';
	else if (manufacturer.toLowerCase() === 'amd') color = 13582629;
	const embed = new client.embed()
		.setTitle(manufacturer.toUpperCase() + ' ' + gpu.name)
		.addField('Memory Interface', gpu.memoryInterface === 'N/A' ? 'N/A' : gpu.memoryInterface + '-bit', true)
		.addField('Memory Size', gpu.vram === 'N/A' ? 'N/A' : gpu.vram >= 1024 ? gpu.vram / 1024 + 'GB' : gpu.vram + 'MB', true)
		.addField('Memory Type', gpu.vramType === 'N/A' ? 'N/A' : gpu.vramType, true)
		.addField('Power Connectors', gpu.powerConnectors === 'N/A' ? 'N/A' : parseInt(gpu.powerConnectors) ? gpu.powerConnectors + ' pin' : gpu.powerConnectors, true)
		.addField('TDP', gpu.tdp === 'N/A' ? 'N/A' : gpu.tdp + 'W', true)
		.addField('MSRP', gpu.price === 'N/A' ? 'N/A' : '$' + gpu.price + ' USD', true)
		.setColor(color);
	if (gpu.imageUrl) embed.setImage(gpu.imageUrl);
	return embed;
}

module.exports = {
	run: (client, message, args) => {
		// if no gpu was searched, tell user to do gpu help
		if (!args[1]) return message.channel.send('You need to search for a GPU. For help, do `' + client.prefix + 'gpu help`');
		// if they did help and didnt put anything else in the command, get help embed and send it
		if (args[1].toLowerCase() === 'help' && args.length === 2) {
			const embed = new client.embed()
			.setTitle('GPU Command Help [BETA]')
			.setColor(client.embedColor)
			.setDescription('This command searches a list of real life GPUs and supplies you with technical information about them. This guide explains how to use this command properly.')
			.addField('Search Terms', 'Search Terms narrow down search results. They are text after the command. A Search Term may consist of Manufacturer Search and Name search, or only one of the previously mentioned, or a Filter. Search Terms must be separated with a commad \`,\`.')
			.addField('Manufacturer Search', 'Manufacturer Search is used to narrow down your search results to 1 brand instead of the existing 2. It should be `amd` or `nvidia`. It should be the first word in the first Search Term. Manufacturer Search is optional. If a manufacturer is not supplied, both manufacturers will be searched for search results and the first Search Term will be tested for Filter Operators. If Filter Operators are not found in the first Search Term, it will be tested for Name Search.')
			.addField('i dont want to write this', 'so here are examples\n\`,gpu nvidia 3080, price > 1000\`\n2 search terms, separated with a comma\nmanufacturer = nvidia (only nvidia gpus will be searched)\nname search = 3080 (gpu name must include "3080")\nfilter: price > 1000 (gpu msrp must be more than 1000 usd)\n\n\`,gpu 6900\`\n1 search term\nno manufacturer, no filters\nnamesearch = 6900 (gpu name must include "6900")\n\n\`,gpu nvidia -sl\`\n1 search term\nno namesearch or filters\nmanufacturer = nvidia\nmultiple search: list is active (\`-s\` also works)')
			return message.channel.send(embed);
		}
		const searchTerms = args.slice(1).join(' ').split(',');

		const multipleSearch = (() => {
			const lastArg = searchTerms[searchTerms.length - 1];
			if (lastArg.endsWith('-s')) {
				searchTerms[searchTerms.length - 1] = lastArg.slice(0, -2).trim();
				return 's';
			} else if (lastArg.endsWith('-sl')) {
				searchTerms[searchTerms.length - 1] = lastArg.slice(0, -3).trim();
				return 'sl';
			} else return false;
		})();

		const firstSearchTermsParts = searchTerms[0].split(' ');

		let manufacturer = firstSearchTermsParts[0].toLowerCase() === 'nvidia' ? 'nvidia' : firstSearchTermsParts[0].toLowerCase() === 'amd' ? 'amd' : undefined;

		function operatorsIn(string) {
			return ['<', '>', '=', '~'].some(x => string.includes(x))
		}
		let filtersStart;
		const nameSearch = (() => {
			if (manufacturer) {
				if (firstSearchTermsParts[1]) {
					filtersStart = 1;
					return firstSearchTermsParts.slice(1).join(' ').toLowerCase().trim().replace(/ /g, '-');
				} else {
					filtersStart = 1;
					return false;
				}
			} else {
				if (operatorsIn(searchTerms[0])) {
					filtersStart = 0;
					return false;
				}
				else {
					filtersStart = 1;
					return searchTerms[0].toLowerCase().trim().replace(/ /g, '-');
				}
			}
		})();
		const filters = searchTerms.slice(filtersStart).filter(x => x.length > 0).map(filter => {
			const operatorStartIndex = ['<', '>', '=', '~'].map(x => filter.indexOf(x)).find(x => x >= 0);
			const operator = filter.slice(operatorStartIndex, operatorStartIndex + 1);
			const property = filter.slice(0, operatorStartIndex).trim();
			const value = filter.slice(operatorStartIndex + 1).trim().toLowerCase();
			if (!operator) {
				message.channel.send(`Invalid operator in \`${property + operator + value}\``);
				return false;
			}
			if (!property) {
				message.channel.send(`Invalid property in \`${property + operator + value}\``);
				return false;
			}
			if (!value) {
				message.channel.send(`Invalid value in \`${property + operator + value}\``);
				return false;
			}
			if (property === 'vramtype' || property === 'powerconnectors') {
				if (operator !== '=') {
					message.channel.send(`Invalid operator in \`${property + operator + value}\` because that property only works with \`=\` operator`);
					return false;
				} else {
					return { property, operator, value };
				}
			} else {
				return { property, operator, value };
			}
		});
		if (filters.find(x => !x)) return;
		const gpus = (() => {
			if (manufacturer) {
				if (manufacturer === 'nvidia') {
					return { nvidia: new client.collection(Object.entries(require('../gpulist-NVIDIA.json'))) };
				} else if (manufacturer === 'amd') {
					return { amd: new client.collection(Object.entries(require('../gpulist-AMD.json'))) };
				}
			} else {
				return {
					nvidia: new client.collection(Object.entries(require('../gpulist-NVIDIA.json'))),
					amd: new client.collection(Object.entries(require('../gpulist-AMD.json')))
				};
			}
		})();
		function rankGpu(gpu) {
			let score = 0;
			if (nameSearch) {
				if (gpu.name.toLowerCase().replace(/ /g, '-').includes(nameSearch)) {
					score += nameSearch.length / gpu.name.length;
				} else score -= 1;
			}
			let filtersScore = 0;
			filters.forEach(filter => {
				const gpuProperty = gpu[filter.property];
				if (typeof gpuProperty === 'number') {
					if (filter.operator === '=') {
						if (gpuProperty === parseInt(filter.value)) filtersScore += 1;
						else filtersScore -= 1;
					} else if (filter.operator === '<') {
						if (gpuProperty < parseInt(filter.value)) filtersScore += gpuProperty / parseInt(filter.value)
						else filtersScore -= 1;
					} else if (filter.operator === '>') {
						if (gpuProperty > parseInt(filter.value)) filtersScore += 1 / (gpuProperty / parseInt(filter.value))
						else filtersScore -= 1;
					} else if (filter.operator === '~') {
						if (gpuProperty >= parseInt(filter.value) * 0.8 && gpuProperty <= parseInt(filter.value) * 1.2) {
							if (gpuProperty >= parseInt(filter.value)) filtersScore += 1 / (gpuProperty / parseInt(filter.value));
							else if (gpuProperty <= parseInt(filter.value)) filtersScore += gpuProperty / parseInt(filter.value)
						} else filtersScore -= 1;
					}
				} else {
					if (gpuProperty.toLowerCase() === filter.value.toLowerCase()) filtersScore += 1;
					else filtersScore -= 1;
				}
			});
			if (filters.length > 0) score += filtersScore / filters.length;
			return score;
		}

		function getManufacturer(gpuKey) {
			if (gpus.amd.has(gpuKey)) return 'AMD';
			else if (gpus.nvidia.has(gpuKey)) return 'NVIDIA';
			else return undefined;
		}

		if (multipleSearch) {
			const rankedGpus = [];
			if (manufacturer) {
				gpus[manufacturer].filter(x => x.name).forEach((gpu, key) => {
					gpu.score = rankGpu(gpu);
					if (gpu.score < 0) return;
					rankedGpus.push([key, gpu]);
				});
			} else {
				Object.entries(gpus).forEach(manufacturerGpus => {
					manufacturerGpus[1].filter(x => x.name).forEach((gpu, key) => {
						gpu.score = rankGpu(gpu);
						if (gpu.score < 0) return;
						rankedGpus.push([key, gpu]);
					});
				});
			}
			rankedGpus.sort((a, b) => b[1].score - a[1].score);
			const limit = 64;
			const embed = new client.embed()
				.setTitle('Choose GPU')
				.setDescription('Your search returned many GPU\'s.' +( multipleSearch === 's' ? ' Choose one and respond with the corresponding number. (20s)' : ' Here is a list of them.'))
			if (manufacturer === 'nvidia') embed.setColor('75b900');
			else if (manufacturer === 'amd') embed.setColor(13582629);
			else embed.setColor(client.embedColor);
			let text = '';
			rankedGpus.slice(0, limit).forEach((gpu, i) => {
				let textAddition;
				if (manufacturer) textAddition = `\`${i + 1}. ${gpu[1].name}\`\n`;
				else textAddition = `\`${i + 1}. ${getManufacturer(gpu[0])} ${gpu[1].name}\`\n`;
				if (text.length + textAddition.length > 1024) {
					embed.addField('\u200b', text, true);
					text = '';
				}
				text += textAddition;
			});
			if (text.length > 0) {
				if (embed.fields.length > 0) {
					embed.addField('\u200b', text, true);
				} else {
					embed.description += '\n' + text;
				}
			}
			if (rankedGpus.length <= limit) {
				embed.setFooter(`Showing all ${rankedGpus.length} GPUs.`)
			} else {
				embed.setFooter(`Showing ${limit} of ${rankedGpus.length} GPUs.`)
			}
			message.channel.send(embed);
			if (multipleSearch === 's') {
				return message.channel.awaitMessages(x => x.author.id === message.author.id && parseInt(x.content), { max: 1, time: 20000, errors: ['time']}).then(responses => {
					const index = parseInt(responses.first()?.content) - 1;
					if (isNaN(index)) return message.channel.send('That\'s not a valid number.');
					message.channel.send(gpuEmbed(client, rankedGpus[index][1], manufacturer || getManufacturer(rankedGpus[index][0])));
				}).catch(() => message.channel.send('You failed.'))
			}
		} else {
			Object.entries(gpus).forEach(gpuList => {
				if (manufacturer) {
					if (manufacturer !== gpuList[0]) return;
				}
				gpuList[1].filter(x => x.name).forEach((gpu, key) => {
					gpus[gpuList[0]].get(key).score = rankGpu(gpu);
				});
			});
			let matches = {
				nvidia: null,
				amd: null
			};
			if (manufacturer) {
				if (manufacturer === 'nvidia') {
					matches.nvidia = gpus.nvidia.filter(x => x.name).find(x => gpus.nvidia.filter(z => z.name).every(y => y.score <= x.score));
				} else if (manufacturer === 'amd') {
					matches.amd = gpus.amd.filter(x => x.name).find(x => gpus.amd.filter(z => z.name).every(y => y.score <= x.score));

				}
			} else {
				matches.nvidia = gpus.nvidia.filter(x => x.name).find(x => gpus.nvidia.filter(z => z.name).every(y => y.score <= x.score));
				matches.amd = gpus.amd.filter(x => x.name).find(x => gpus.amd.filter(z => z.name).every(y => y.score <= x.score));
			}
			const bestMatch = Object.entries(matches).find((x, index) => (typeof x[1]?.score === 'number' ? x[1]?.score : -1) >= (typeof Object.entries(matches)[(!index) + 0][1]?.score === 'number' ? Object.entries(matches)[(!index) + 0][1]?.score : -1));
			if (!bestMatch[1] || bestMatch[1].score < 0) return message.channel.send('That query returned `0` results.');
			message.channel.send(gpuEmbed(client, bestMatch[1], bestMatch[0]));
		}
	},
	name: 'gpu',
	description: 'Info about IRL GPUs.',
	usage: ['"help" / manufacturer', 'name', 'filter', '?"-s" / "-sl"'],
	cooldown: 10
}