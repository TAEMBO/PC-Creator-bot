module.exports = {
	run: async (client, message, args) => {
		if (!args[1]) return message.channel.send('You need to search for a CPU');
		const search = args.slice(1).join(' ').toLowerCase().split(',');
		let matches = new client.collection();
		let nameSearch = false;
		let filters = [];
		let oneResult = true;
		if (search[search.length - 1].endsWith('-s')) {
			oneResult = false;
			search = search.slice(0, -2).trim();
		}

		console.log(search);
		// i5, base<4, tdp>65
		// 9600k
		// price>400, price<600

		// loop through every search query
		search.forEach((statement, index) => {
			statement = statement.trim();

			// check for name search
			if (index === 0 && !['<', '>', '=', '~'].some(x => statement.includes(x))) {
				nameSearch = search[0];
			} else {
				const operatorStartIndex = Math.max(statement.indexOf('<'), 0) || Math.max(statement.indexOf('>'), 0) || Math.max(statement.indexOf('='), 0) || Math.max(statement.indexOf('~'), 0);
				const operator = statement.slice(operatorStartIndex, operatorStartIndex + 1);
				let property = statement.slice(0, operatorStartIndex).trim();
				if (['base', 'boost'].includes(property)) property += 'Clock';
				const value = statement.slice(operatorStartIndex + 1).trim();
				filters.push('cpu[1].' + property + operator + value);
			}
		});

		console.log(filters);

		Object.entries(client.cpulist_INTEL).forEach(cpu => {
			console.log(cpu[0]);
			if (!cpu[1].name) return;
			
			if (nameSearch && cpu[1].name.toLowerCase().includes(nameSearch)) {
				console.log('succeeded namesearch');
				matches.set(cpu[0], nameSearch.length / cpu[1].name.length)
			} else {
				console.log('failed namesearch');
				matches.set(cpu[0], false)
			}
			let filtersPassed = true;
			filters.forEach(x => {
				let result = eval(x);
				console.log(x, result);
				if (result === false) filtersPassed = false;
			});
			console.log('filterspassed', filtersPassed);
			if (!filtersPassed) {
				console.log('failed filters');
				matches.set(cpu[0], false);
			}
		});
		console.log(matches.filter(x => x), oneResult);

		if (oneResult) {
			const cpu = client.cpulist_INTEL[matches.filter(x => x).sort((a, b) => b - a).firstKey()];
			const embed = new client.embed()
				.setTitle(client.cpulist_INTEL.manufacturer.charAt(0).toUpperCase() + client.cpulist_INTEL.manufacturer.slice(1) + ' ' + cpu.name)
				.addField('Cores', cpu.cores, true)
				.addField('Base Clock Speed', cpu.baseClock + ' GHz', true)
				.addField('Threads', cpu.threads)
				.addField('Boost Clock Speed', cpu.boostClock + ' GHz', true)
				.addField('MSRP', '$' + cpu.price)
				.addField('Socket', cpu.socket, true)
				.addField('TDP', cpu.tdp + 'W', true)
				.setColor(2793983)
			message.channel.send(embed);
		}
	},
	name: 'cpuintelnew',
	description: 'Experimental ,cpuintel'
};