const quantities = {
	space: [
		{
			name: 'metre',
			value: 1,
			short: ['m', 'meter']
		},
		{
			name: 'centimetre',
			value: 100,
			short: ['cm', 'centimeter']
		},
		{
			name: 'millimetre',
			value: 1000,
			short: ['mm', 'millimeter']
		},
		{
			name: 'kilometre',
			value: 0.001,
			short: ['km', 'kilometer']
		},
		{
			name: 'mile',
			value: 0.000621371192,
			short: ['mi']
		},
		{
			name: 'foot',
			value: 3.2808399,
			short: ['ft', '\'']
		},
		{
			name: 'inch',
			value: 39.3700787,
			short: ['in', '\"']
		}
	],
	currency: [
		{
			name: 'Euro :flag_eu:',
			value: 1,
			short: ['EUR', '€']
		},
		{
			name: 'US Dollar :flag_us:',
			value: 1.19,
			short: ['USD', '$'],
		},
		{
			name: 'pound sterling :flag_gb:',
			value: 0.86,
			short: ['GBP', '£']
		},
		{
			name: 'Turkish Lira :flag_tr:',
			value: 10.24,
			short: ['TRY', 'TL', '₺']
		},
		{
			name: 'Russian Ruble :flag_ru:',
			value: 88.27,
			short: ['RUB', '₽']
		},
		{
			name: 'Canadian Dollar :flag_ca:',
			value: 1.48,
			short: ['CAD']
		},
		{
			name: 'Australian Dollar :flag_au:',
			value: 1.59,
			short: ['AUD']
		},
		{
			name: 'Japanese Yen :flag_jp:',
			value: 130.84,
			short: ['JPY', '¥']
		},
		{
			name: 'New Zealand Dollar :flag_nz:',
			value: 1.7,
			short: ['NZD']
		},
		{
			name: 'Indonesian Rupiah :flag_id:',
			value: 17205.91,
			short: ['IDR', 'Rp']
		},
		{
			name: 'Chinese Yuan Renminbi :flag_cn:',
			value: 7.68,
			short: ['CN¥', 'CNY', 'RMB', '元']
		},
		{
			name: 'Swedish krona :flag_se:',
			value: 10.25,
			short: ['SEK', 'kr']
		},
		{
			name: 'Norwegian krone :flag_no:',
			value: 10.54,
			short: ['NOK']
		},
		{
			name: 'Danish krone :flag_dk:',
			value: 7.44,
			short: ['DKK']
		},
		{
			name: 'Icelandic króna :flag_is:',
			value: 146.3,
			short: ['ISK']
		},
		{
			name: 'Czech koruna :flag_cz:',
			value: 25.69,
			short: ['CZK', 'Kč']
		},
		{
			name: 'Swiss franc :flag_sw:',
			value: 1.08,
			short: ['CFH', 'fr']
		},
		{
			name: 'Ukrainian hryvnia :flag_ua:',
			value: 32.13,
			short: ['UAH', '₴', 'грн']
		},
		{
			name: 'Indian rupee :flag_in:',
			value: 88.37,
			short: ['INR', '₹']
		},
		{
			name: 'Among Us ඞ:red_square:',
			value: 0,
			short: ['SUS']
		},
		{
			name: 'United Arab Emirates dirham :flag_ae:',
			value: 4.34,
			short: ['AED', 'د.إ']
		}
	],
	mass: [
		{
			name: 'gram',
			value: 1,
			short: ['g']
		},
		{
			name: 'kilogram',
			value: 0.001,
			short: ['kg', 'kgs']
		},
		{
			name: 'pound',
			value: 0.00220462262,
			short: ['lbs', 'b']
		},
		{
			name: 'ounce',
			value: 0.0352739619,
			short: ['oz']
		}
	],
	volume: [
		{
			name: 'metre cubed',
			value: 1,
			short: ['m^3', 'm3', 'meter cubed']
		},
		{
			name: 'centimetre cubed',
			value: 1000000,
			short: ['cm^3', 'cm3', 'centimeter cubed']
		},
		{
			name: 'US fluid ounce',
			value: 33814.0227,
			short: ['fl oz', 'floz']
		},
		{
			name: 'litre',
			value: 1000,
			short: ['l', 'liter']
		},
		{
			name: 'desilitre',
			value: 10000,
			short: ['dl', 'desiliter']
		},
		{
			name: 'millilitre',
			value: 1000000,
			short: ['ml', 'milliliter']
		}
	],
	temperature: [
		{
			name: 'kelvin',
			toSelf: 'x',
			toBase: 'x',
			short: ['K'],
			evalRequired: true
		},
		{
			name: 'celsius',
			toSelf: 'x-273.15',
			toBase: 'x+273.15',
			short: ['°C', 'c'],
			evalRequired: true
		},
		{
			name: 'fahrenheit',
			toSelf: '((9/5)*(x-273))+32',
			toBase: '((5/9)*(x-32))+273',
			short: ['°F', 'fh', 'f'],
			evalRequired: true
		}
	]
}
function findUnit(unitNameQuery = '') {
	for (let i = 0; i < Object.values(quantities).length; i++) {
		const unit = Object.values(quantities)[i].find(x => x.name.toLowerCase() === unitNameQuery.toLowerCase() || x.short.some(y => y.toLowerCase() === unitNameQuery.toLowerCase()));
		if (unit) {
			const quantity = Object.keys(quantities)[i];
			return { quantity, unit };
		}
	}
	return null;
}
module.exports = {
	run: (client, message, args) => {
		if (args[1] === 'help') {
			const wantedQuantity = Object.keys(quantities).find(x => x === args[2]);
			if (wantedQuantity) {
				const units = quantities[wantedQuantity];
				const baseValue = units.find(x => x.value === 1 || x.toBase === 'x');
				
				const embed = new client.embed()
					.setTitle('Convert help: ' + wantedQuantity)
					.setDescription(`This quantity comprises ${units.length} units, which are:\n\n${units.sort((a, b) => a.name.localeCompare(b.name)).map(unit => `**${unit.name[0].toUpperCase() + unit.name.slice(1)}** (${unit.short.map(x => `\`${x}\``).join(', ')})`).join('\n')}`)
					.setColor(client.embedColor)
				return message.channel.send(embed);
			}
			const embed = new client.embed()
				.setTitle('Convert help')
				.setColor(client.embedColor)
				.setDescription(`To convert something, you add **amount** and **unit** combinations to the end of the command. The syntax for an amount and unit combination is \`[amount][unit symbol]\`. Amount and unit combinations are called **arguments**. Arguments are divided into **starters** and a **target unit**. Starters are the starting values that you want to convert to the target unit. A conversion command consists of one or many starters, separated with a comma (\`,\`) in case there are many. After starters comes the target unit, which must have a greater-than sign (\`>\`) or the word "to" before it. The argument(s) after the \`>\` (or "to"), called the target unit, must not include an amount. It is just a **unit symbol**. Because you cannot convert fruits into lengths, all starters and the target unit must be of the same **quantity**.`)
				.addField('Supported Quantities', Object.keys(quantities).map(x => x[0].toUpperCase() + x.slice(1)).join(', ') + `\n\nTo learn more about a quantity and its units and unit symbols,\ndo \`${client.prefix}convert help [quantity]\``)
				.addField('Examples', `An amount: "5", "1200300", "1.99"\nA unit: metre, kelvin, Euro\nA unit symbol: "fh", "cm^3", "$", "fl oz"\nAn argument: "180cm", "12.99€", "5km", "16fl oz"\nA target unit: ">km", ">c", ">m2"\nA complete conversion command: "\`${client.prefix}convert 5ft, 8in to cm\`", "\`${client.prefix}convert 300kelvin >celsius\`", "\`${client.prefix}convert 57mm, 3.3cm, 0.4m >cm\`", "\`${client.prefix}convert 2dl, 0.2l to fl oz\`"`)
			return message.channel.send(embed);
		}
		if (!message.content.includes('>') && !message.content.includes('to')) return message.channel.send('There needs to be a greater-than sign (\`>\`) or the word "to" in your message, after the starters and before the target unit.');
		const starters = args.slice(1, args.indexOf(args.find(x => x.includes('>') || x.includes('to')))).join(' ').split(',').map(starter => {
			starter = starter.trim();
			const unitSymbol = starter.slice(starter.match(/[0-9\,\.\-]*/gi)[0].length).trim();
			return Object.assign({ amount: parseFloat(starter) }, findUnit(unitSymbol));
		});
		if (!starters || starters.length === 0) return message.channel.send('You must convert _something._ Your message has 0 starters.');
		const target = findUnit(args.slice(args.indexOf(args.find(x => x.includes('>')))).join(' ').slice(1).trim()) || findUnit(args.slice(args.indexOf(args.find(x => x.includes('to')))).join(' ').slice(2).trim());
		if (!target) return message.channel.send('You must convert _to_ something. Your message doesn\'t have a (valid) target unit.');

		// check that all starters and target are the same quantity
		const usedQuantities = new Set([target.quantity, ...starters.map(x => x.quantity)]);
		if (usedQuantities.size > 1) return message.channel.send(`All starting units and the target unit must be of the same quantity. The quantities you used were \`starters: ${starters.map(x => toString(x.quantity)).join(', ')}. target: ${toString(target.quantity)}\``);
		const quantity = [...usedQuantities][0];

		// get absolute value: sum of all starters (starter amount * starter unit value)
		let absolute;
		if (starters[0].evalRequired) {
			absolute = starters.map(starter => {
				let x = starter.amount;
				return eval(starter.unit.toBase);
			}).reduce((a, b) => a + b, 0);
		} else {
			absolute = starters.map(starter => starter.amount / starter.unit.value).reduce((a, b) => a + b, 0);
		}

		// multiply absolute by the value of the target unit		
		let amountInTarget;
		if (starters[0].evalRequired) {
			let x = absolute;
			amountInTarget = eval(target.unit.toSelf);
		} else {
			amountInTarget = absolute * target.unit.value;
		}

		// display amount and target unit symbol
		const embed = new client.embed()
			.setTitle(quantity[0].toUpperCase() + quantity.slice(1) + ' conversion')
			.addField('Starting amount', starters.map(x => `${x.amount.toLocaleString('en-US')} ${x.unit.short[0]}`).join(', '), true)
			.addField('Converted amount', amountInTarget.toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' ' + target.unit.short[0], true)
			.setColor(client.embedColor)
		message.channel.send(embed);
	},
	name: 'convert',
	description: '[BETA] Convert measurements. Use many starting amounts and units by attaching amounts and units of the same quantity with a comma, eg. \`convert 5ft, 8in >cm\` converts the sum of 5 feet and 8 inches into centimeters. For help, add \`help\`',
	shortDescription: '[BETA] Convert measurements.',
	usage: ['starting amounts and units / help', '">" target unit / ?quantity'],
	alias: ['cv']
}