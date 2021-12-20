function CPUEmbed(client, CPU, manufacturer) {
	let color;
	if (manufacturer.toLowerCase() === "intel") color = 2793983;
	else if (manufacturer.toLowerCase() === "amd") color = 13582629;
	const embed = new client.embed()
		.setTitle(manufacturer.charAt(0).toUpperCase() + manufacturer.slice(1).toLowerCase() + " " + CPU.name)
		.addField("Cores", `${CPU.cores}`, true)
		.addField("Base Clock Speed", `${CPU.base ? (CPU.base === "N/A" ? "N/A" : CPU.base + " GHz") : "N/A"}`, true)
		.addField("TDP", `${CPU.tdp ? (CPU.tdp === "N/A" ? "N/A" : CPU.tdp + "W") : "N/A"}`, true)
		.addField("Threads", `${CPU.threads ? (CPU.threads === "N/A" ? "N/A" : CPU.threads) : "N/A"}`, true)
		.addField("Boost Clock Speed", `${CPU.boost ? (CPU.boost === "N/A" ? "N/A" : CPU.boost + " GHz") : "N/A"}`, true)
		.addField("Socket", `${CPU.socket ? (CPU.socket === "N/A" ? "N/A" : CPU.socket): "N/A"}`, true)
		.addField("MSRP", `${CPU.price ? (CPU.price === "N/A" ? "N/A" : "$" + CPU.price.toFixed(2)) : "N/A"}`, true)
		.setColor(color);
		if (CPU.igpu) embed.addField("iGPU", CPU.igpu, true);
	return embed;
}

module.exports = {
	run: (client, message, args) => {
		// if no CPU was searched, tell user to do CPU help
		if (!args[1]) return message.channel.send("You need to search for a CPU. For help, do `" + client.prefix + "CPU help`");
		// if they did help and didnt put anything else in the command, get help embed and send it
		if (args[1].toLowerCase() === "help" && args.length === 2) {
			const embed = new client.embed()
			.setTitle("CPU Command Help")
			.setColor(client.embedColor)
			.setDescription("This command searches a list of real life CPUs and supplies you with technical information about them. This guide explains how to use this command properly.")
			.addField("Search Terms", "Search Terms narrow down search results. They are text after the command. A Search Term may consist of Manufacturer Search and Name search, or only one of the previously mentioned, or a Filter. Search Terms must be separated with a commad \`,\`.")
			.addField("Manufacturer Search", "Manufacturer Search is used to narrow down your search results to 1 brand instead of the existing 2. It should be `amd` or `intel`. It should be the first word in the first Search Term. Manufacturer Search is optional. If a manufacturer is not supplied, both manufacturers will be searched for search results and the first Search Term will be tested for Filter Operators. If Filter Operators are not found in the first Search Term, it will be tested for Name Search.")
			.addField("i dont want to write this", "so here are examples\n\`,CPU intel 9900k, price > 1000\`\n2 search terms, separated with a comma\nmanufacturer = intel (only intel CPUs will be searched)\nname search = 9900k (CPU name must include \"9900k\")\nfilter: price > 1000 (CPU msrp must be more than 1000 usd)\n\n\`,CPU 11900k\`\n1 search term\nno manufacturer, no filters\nnamesearch = 5700x (CPU name must include \"5700x\")\n\n\`,CPU intel -sl\`\n1 search term\nno namesearch or filters\nmanufacturer = intel\nmultiple search: list is active (\`-s\` also works)")
			return message.channel.send({embeds: [embed]});
		}
		const searchTerms = args.slice(1).join(" ").split(",");

		const multipleSearch = (() => {
			const lastArg = searchTerms[searchTerms.length - 1];
			if (lastArg.endsWith("-s")) {
				searchTerms[searchTerms.length - 1] = lastArg.slice(0, -2).trim();
				return "s";
			} else if (lastArg.endsWith("-sl")) {
				searchTerms[searchTerms.length - 1] = lastArg.slice(0, -3).trim();
				return "sl";
			} else return false;
		})();

		const firstSearchTermsParts = searchTerms[0].split(" ");

		let manufacturer = firstSearchTermsParts[0].toLowerCase() === "intel" ? "intel" : firstSearchTermsParts[0].toLowerCase() === "amd" ? "amd" : undefined;

		function operatorsIn(string) {
			return ["<", ">", "=", "~"].some(x => string.includes(x))
		}
		let filtersStart;
		const nameSearch = (() => {
			if (manufacturer) {
				if (firstSearchTermsParts[1]) {
					filtersStart = 1;
					return firstSearchTermsParts.slice(1).join(" ").toLowerCase().trim().replace(/ /g, "");
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
					return searchTerms[0].toLowerCase().trim().replace(/ /g, "");
				}
			}
		})();
		const filters = searchTerms.slice(filtersStart).filter(x => x.length > 0).map(filter => {
			const operatorStartIndex = ["<", ">", "=", "~"].map(x => filter.indexOf(x)).find(x => x >= 0);
			const operator = filter.slice(operatorStartIndex, operatorStartIndex + 1);
			const property = filter.slice(0, operatorStartIndex).trim();
			const value = filter.slice(operatorStartIndex + 1).trim().toLowerCase();
			if (!operator) {
				message.channel.send(`Invalid operator in \`${property + operator + value}\``);
				return false;
			}
			if (!property || !["cores", "threads", "base", "boost", "price", "socket", "tdp"].includes(property.toLowerCase())) {
				message.channel.send(`Invalid property in \`${property + operator + value}\``);
				return false;
			}
			if (!value) {
				message.channel.send(`Invalid value in \`${property + operator + value}\``);
				return false;
			}
			if (property === "threads" || property === "cores" || property === "base" || property === "boost" || property === "socket" || property === "tdp") {
				if (operator !== "=") {
					message.channel.send(`Invalid operator in \`${property + operator + value}\` because that property only works with \`=\` operator`);
					return false;
				} else {
					return { property, operator, value };
				}
			} else {
				return { property, operator, value };
			}
		});
		if (filters.find(x => !x) !== undefined) return;
		const CPUs = (() => {
			if (manufacturer) {
				if (manufacturer === "intel") {
					return { intel: new client.collection(Object.entries(require("../databases/CPUlist-INTEL.json"))) };
				} else if (manufacturer === "amd") {
					return { amd: new client.collection(Object.entries(require("../databases/CPUintel-AMD.json"))) };
				}
			} else {
				return {
					intel: new client.collection(Object.entries(require("../databases/CPUlist-INTEL.json"))),
					amd: new client.collection(Object.entries(require("../databases/CPUlist-AMD.json")))
				};
			}
		})();
		function rankCPU(CPU) {
			let score = 0;
			if (nameSearch) {
				if (CPU.name.toLowerCase().replace(/ /g, "").includes(nameSearch)) {
					score += nameSearch.length / CPU.name.length;
				} else score -= 1;
			}
			let filtersScore = 0;
			filters.forEach(filter => {
				const CPUProperty = CPU[filter.property];
				if (typeof CPUProperty === "number") {
					if (filter.operator === "=") {
						if (CPUProperty === parseInt(filter.value)) filtersScore += 1;
						else filtersScore -= 1;
					} else if (filter.operator === "<") {
						if (CPUProperty < parseInt(filter.value)) filtersScore += CPUProperty / parseInt(filter.value)
						else filtersScore -= 1;
					} else if (filter.operator === ">") {
						if (CPUProperty > parseInt(filter.value)) filtersScore += 1 / (CPUProperty / parseInt(filter.value))
						else filtersScore -= 1;
					} else if (filter.operator === "~") {
						if (CPUProperty >= parseInt(filter.value) * 0.8 && CPUProperty <= parseInt(filter.value) * 1.2) {
							if (CPUProperty >= parseInt(filter.value)) filtersScore += 1 / (CPUProperty / parseInt(filter.value));
							else if (CPUProperty <= parseInt(filter.value)) filtersScore += CPUProperty / parseInt(filter.value)
						} else filtersScore -= 1;
					}
				} else {
					if (`${CPUProperty}`.toLowerCase() === filter.value.toLowerCase()) filtersScore += 1;
					else filtersScore -= 1;
				}
			});
			if (filters.length > 0) score += filtersScore / filters.length;
			return score;
		}

		function getManufacturer(CPUKey) {
			if (CPUs.amd.has(CPUKey)) return "AMD";
			else if (CPUs.intel.has(CPUKey)) return "INTEL";
			else return undefined;
		}

		if (multipleSearch) {
			const rankedCPUs = [];
			if (manufacturer) {
				CPUs[manufacturer].filter(x => x.name).forEach((CPU, key) => {
					CPU.score = rankCPU(CPU);
					if (CPU.score < 0) return;
					rankedCPUs.push([key, CPU]);
				});
			} else {
				Object.entries(CPUs).forEach(manufacturerCPUs => {
					manufacturerCPUs[1].filter(x => x.name).forEach((CPU, key) => {
						CPU.score = rankCPU(CPU);
						if (CPU.score < 0) return;
						rankedCPUs.push([key, CPU]);
					});
				});
			}
			rankedCPUs.sort((a, b) => b[1].score - a[1].score);
			const limit = 64;
			const embed = new client.embed()
				.setTitle("Choose CPU")
				.setDescription("Your search returned many CPU\"s." +( multipleSearch === "s" ? " Choose one and respond with the corresponding number. (20s)" : " Here is a list of them."))
			if (manufacturer === "intel") embed.setColor(2793983);
			else if (manufacturer === "amd") embed.setColor("13582629");
			else embed.setColor(client.embedColor);
			let text = "";
			const sliced = rankedCPUs.slice(0, limit);
			if (filters.length === 0) sliced.sort((a, b) => a[0] < b[0]);
			sliced.forEach((CPU, i) => {
				let textAddition;
				if (manufacturer) textAddition = `\`${i + 1}. ${CPU[1].name}\`\n`;
				else textAddition = `\`${i + 1}. ${getManufacturer(CPU[0])} ${CPU[1].name}\`\n`;
				if (text.length + textAddition.length > 1024) {
					embed.addField("\u200b", text, true);
					text = "";
				}
				text += textAddition;
			});
			if (text.length > 0) {
				if (embed.fields.length > 0) {
					embed.addField("\u200b", text, true);
				} else {
					embed.description += "\n" + text;
				}
			}
			if (rankedCPUs.length <= limit) {
				embed.setFooter(`Showing all ${rankedCPUs.length} CPUs.`)
			} else {
				embed.setFooter(`Showing ${limit} of ${rankedCPUs.length} CPUs.`)
			}
			message.channel.send({embeds: [embed]});
			if (multipleSearch === "s") {
				const filter = x => x.author.id === message.author.id && parseInt(x.content)
				return message.channel.awaitMessages({ filter, max: 1, time: 20000, errors: ["time"]}).then(responses => {
					const index = parseInt(responses.first()?.content) - 1;
					if (isNaN(index)) return message.channel.send("That\"s not a valid number.");
					message.channel.send({embeds: [CPUEmbed(client, rankedCPUs[index][1], manufacturer || getManufacturer(rankedCPUs[index][0]))]});
				}).catch(() => message.channel.send("You failed."))
			}
		} else {
			Object.entries(CPUs).forEach(CPUList => {
				if (manufacturer) {
					if (manufacturer !== CPUList[0]) return;
				}
				CPUList[1].filter(x => x.name).forEach((CPU, key) => {
					CPUs[CPUList[0]].get(key).score = rankCPU(CPU);
				});
			});
			let matches = {
				intel: null,
				amd: null
			};
			if (manufacturer) {
				if (manufacturer === "intel") {
					matches.intel = CPUs.intel.filter(x => x.name).find(x => CPUs.intel.filter(z => z.name).every(y => y.score <= x.score));
				} else if (manufacturer === "amd") {
					matches.amd = CPUs.amd.filter(x => x.name).find(x => CPUs.amd.filter(z => z.name).every(y => y.score <= x.score));

				}
			} else {
				matches.intel = CPUs.intel.filter(x => x.name).find(x => CPUs.intel.filter(z => z.name).every(y => y.score <= x.score));
				matches.amd = CPUs.amd.filter(x => x.name).find(x => CPUs.amd.filter(z => z.name).every(y => y.score <= x.score));
			}
			const bestMatch = Object.entries(matches).find((x, index) => (typeof x[1]?.score === "number" ? x[1]?.score : -1) >= (typeof Object.entries(matches)[(!index) + 0][1]?.score === "number" ? Object.entries(matches)[(!index) + 0][1]?.score : -1));
			if (!bestMatch[1] || bestMatch[1].score < 0) return message.channel.send("That query returned `0` results.");
			message.channel.send({embeds: [CPUEmbed(client, bestMatch[1], bestMatch[0])]});
		}
	},
	name: "cpu",
	description: "Info about IRL CPUs.",
	usage: ["help / manufacturer", "name", "filter", "-s / -sl"],
	category: "Real Computers",
	cooldown: 7
}