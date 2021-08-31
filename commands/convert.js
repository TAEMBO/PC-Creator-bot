const quantities = {
	space: [
		{
			name: 'metre',
			value: 1,
			short: ['m', 'meter']
		},
		{
			name: 'centimetre',
			value: 0.01,
			short: ['cm', 'centimeter']
		},
		{
			name: 'millimetre',
			value: 0.001,
			short: ['mm', 'millimeter']
		},
		{
			name: 'kilometre',
			value: 1000,
			short: ['km', 'kilometer']
		},
		{
			name: 'mile',
			value: 1609.344,
			short: ['mi']
		},
		{
			name: 'foot',
			value: 0.3048,
			short: ['ft', '\'']
		},
		{
			name: 'inch',
			value: 0.0254,
			short: ['in', '\"']
		},
		{
			name: 'light-year',
			value: 9460528400000000,
			short: ['ly', 'lightyear']
		},
		{
			name: 'astronomical unit',
			value: 149597870700,
			short: ['au']
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
			value: 0.85,
			short: ['USD', '$'],
		},
		{
			name: 'pound sterling :flag_gb:',
			value: 1.17,
			short: ['GBP', '£']
		},
		{
			name: 'Turkish Lira :flag_tr:',
			value: 0.1,
			short: ['TRY', 'TL', '₺']
		},
		{
			name: 'Russian Ruble :flag_ru:',
			value: 0.012,
			short: ['RUB', '₽']
		},
		{
			name: 'Canadian Dollar :flag_ca:',
			value: 0.67,
			short: ['CAD']
		},
		{
			name: 'Australian Dollar :flag_au:',
			value: 0.62,
			short: ['AUD']
		},
		{
			name: 'Japanese Yen :flag_jp:',
			value: 0.0077,
			short: ['JPY', '¥', 'yen', 'jy']
		},
		{
			name: 'New Zealand Dollar :flag_nz:',
			value: 0.59,
			short: ['NZD']
		},
		{
			name: 'Indonesian Rupiah :flag_id:',
			value: 0.000059,
			short: ['IDR', 'Rp']
		},
		{
			name: 'Chinese Yuan Renminbi :flag_cn:',
			value: 0.13,
			short: ['CN¥', 'CNY', 'RMB', '元']
		},
		{
			name: 'Swedish krona :flag_se:',
			value: 0.098,
			short: ['SEK', 'kr']
		},
		{
			name: 'Norwegian krone :flag_no:',
			value: 0.097,
			short: ['NOK']
		},
		{
			name: 'Danish krone :flag_dk:',
			value: 0.13,
			short: ['DKK']
		},
		{
			name: 'Icelandic króna :flag_is:',
			value: 0.0067,
			short: ['ISK']
		},
		{
			name: 'Czech koruna :flag_cz:',
			value: 0.039,
			short: ['CZK', 'Kč']
		},
		{
			name: 'Swiss franc :flag_sw:',
			value: 0.93,
			short: ['CFH', 'fr']
		},
		{
			name: 'Ukrainian hryvnia :flag_ua:',
			value: 0.031,
			short: ['UAH', '₴', 'грн']
		},
		{
			name: 'Indian rupee :flag_in:',
			value: 0.012,
			short: ['INR', '₹']
		},
		{
			name: 'Among Us ඞ:red_square:',
			value: 0,
			short: ['SUS']
		},
		{
			name: 'United Arab Emirates dirham :flag_ae:',
			value: 0.23,
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
			value: 1000,
			short: ['kg', 'kgs']
		},
		{
			name: 'pound',
			value: 453.59237,
			short: ['lbs', 'b']
		},
		{
			name: 'ounce',
			value: 28.3495231,
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
			value: 0.000001,
			short: ['cm^3', 'cm3', 'centimeter cubed']
		},
		{
			name: 'US fluid ounce',
			value: 0.0000295735296,
			short: ['fl oz', 'floz']
		},
		{
			name: 'litre',
			value: 0.001,
			short: ['l', 'liter']
		},
		{
			name: 'desilitre',
			value: 0.0001,
			short: ['dl', 'desiliter']
		},
		{
			name: 'millilitre',
			value: 0.000001,
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
	],
	time: [
		{
			name: 'millisecond',
			value: 0.001,
			short: ['ms']
		},
		{
			name: 'second',
			value: 1,
			short: ['s']
		},
		{
			name: 'minute',
			value: 60,
			short: ['m', 'min']
		},
		{
			name: 'hour',
			value: 3600,
			short: ['h']
		},
		{
			name: 'day',
			value: 86400,
			short: ['d']
		},
		{
			name: 'week',
			value: 604800,
			short: ['w']
		},
		{
			name: 'month',
			value: 2592000,
			short: ['mo']
		},
		{
			name: 'year',
			value: 31556952,
			short: ['y']
		},
	],
	force: [
		{
			name: 'newton',
			value: 1,
			short: ['N']
		},
		{
			name: 'kilonewton',
			value: 1000,
			short: ['kN']
		},
		{
			name: 'dyne',
			value: 100000,
			short: ['dyn']
		},
		{
			name: 'pound-force',
			value: 4.448222,
			short: ['lbf']
		},
		{
			name: 'poundal',
			value: 0.1382550,
			short: ['pdl']
		},
		{
			name: 'kip',
			value: 4448.22,
			short: ['kip']
		},
		{
			name: 'kilogram-force',
			value: 9.806650,
			short: ['kgf']
		},
	],
	energy: [
		{
			name: 'joule',
			value: 1,
			short: ['J']
		},
		{
			name: 'kilowatt-hour',
			value: 3600000,
			short: ['kWh']
		},
		{
			name: 'calorie',
			value: 4.184,
			short: ['cal']
		},
		{
			name: 'electronvolt',
			value: 0.0000000000000000001602176634,
			short: ['eV']
		},
		{
			name: 'foot-pound force',
			value: 1.355818,
			short: ['ft⋅lbf', 'ftlbf', 'ftlb']
		},
	]
}
function findUnit(unitNameQuery = '') {
	// short search
	for (let i = 0; i < Object.values(quantities).length; i++) {
		const unit = Object.values(quantities)[i].find(x => x.short.some(y => y.toLowerCase() === unitNameQuery.toLowerCase()));
		if (unit) {
			const quantity = Object.keys(quantities)[i];
			return { quantity, unit };
		}
	}

	// name identical search
	for (let i = 0; i < Object.values(quantities).length; i++) {
		const unit = Object.values(quantities)[i].find(x => x.name.toLowerCase() === unitNameQuery.toLowerCase());
		if (unit) {
			const quantity = Object.keys(quantities)[i];
			return { quantity, unit };
		}
	}

	// name inclusive search
	for (let i = 0; i < Object.values(quantities).length; i++) {
		const unit = Object.values(quantities)[i].find(x => x.name.toLowerCase().includes(unitNameQuery.toLowerCase()));
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
				.addField('NEW: Fraction Conversion', 'Use division in your commands to achieve something, for example velocity conversion. In fraction conversion, all the starters\' and the target\'s unit symbol must be a fraction. The syntax for a fraction is \`[unit symbol]["/" or "per"][unit symbol]\`. All of the numerators must be of the same quantity. Same for the denominators. You cannot mix fractions and non-fractions. Examples of Fraction Conversion:\n\`${client.prefix}convert 5m/s >km/h\`\n\`${client.prefix}convert 5 miles per hour, 1 meter per second to kilometers per hour\`')
			return message.channel.send(embed);
		}
		if (!message.content.includes('>') && !message.content.includes('to')) return message.channel.send('There needs to be a greater-than sign (\`>\`) or the word "to" in your message, after the starters and before the target unit.');
		// lets define the > or to, that theyre using
		const usedSeparator = message.content.includes('>') ? '>' : 'to';
		const starters = args.slice(1, args.indexOf(args.find(x => x.includes(usedSeparator)))).join(' ').split(',').map(starter => {
			starter = starter.trim();

			// fraction
			if (starter.includes('/') || starter.includes(' per ')) {
				const separator = starter.includes('/') ? '/' : 'per';
				const multiplier = starter.match(/[0-9\,\.\-]*/gi)[0];
				const numeratorUnitSymbol = starter.slice(multiplier.length, starter.indexOf(separator)).trim();
				const numeratorUnit = findUnit(numeratorUnitSymbol.endsWith('s') && numeratorUnitSymbol.length !== 1 ? numeratorUnitSymbol.slice(0, numeratorUnitSymbol.length - 1) : numeratorUnitSymbol);
				const denominatorUnitSymbol = starter.slice(starter.indexOf(separator) + separator.length).trim();
				const denominatorUnit = findUnit(denominatorUnitSymbol);
				if (!numeratorUnit) {
					message.channel.send(numeratorUnitSymbol + ' is wrong.');
					return;
				}
				if (!denominatorUnit) {
					message.channel.send(denominatorUnitSymbol + ' is wrong.');
					return;
				}
				const division = numeratorUnit.unit.value / denominatorUnit.unit.value;
				const amount = parseFloat(multiplier);
				return {
					amount,
					quantity: 'mixed',
					unit: {
						numeratorQuantity: numeratorUnit.quantity,
						denominatorQuantity: denominatorUnit.quantity,
						name: numeratorUnit.unit.name + '(s) per ' + denominatorUnit.unit.name,
						value: division,
						short: [numeratorUnit.unit.short[0] + '/' + denominatorUnit.unit.short[0]]
					}
				};
			} else {
				const unitSymbol = starter.slice(starter.match(/[0-9\,\.\-]*/gi)[0].length).trim();
				return Object.assign({ amount: parseFloat(starter) }, findUnit(unitSymbol.endsWith('s') && unitSymbol.length !== 1 ? unitSymbol.slice(0, unitSymbol.length - 1) : unitSymbol));
			}
		});
		if (!starters || starters.length === 0) return message.channel.send('You must convert _something._ Your message has 0 starters.');

		const target = (() => {
			const targetPortion = args.slice(args.indexOf(args.find(x => x.includes(usedSeparator)))).join(' ').slice(usedSeparator.length).trim();

			// target: fraction
			if (targetPortion.includes('/') || targetPortion.includes(' per ')) {
				const separator = targetPortion.includes('/') ? '/' : 'per';
				const numeratorUnitSymbol = targetPortion.slice(0, targetPortion.indexOf(separator)).trim();
				const numeratorUnit = findUnit(numeratorUnitSymbol.endsWith('s') && numeratorUnitSymbol.length !== 1 ? numeratorUnitSymbol.slice(0, numeratorUnitSymbol.length - 1) : numeratorUnitSymbol);
				const denominatorUnitSymbol = targetPortion.slice(targetPortion.indexOf(separator) + separator.length).trim();
				const denominatorUnit = findUnit(denominatorUnitSymbol);
				if (!numeratorUnit) {
					message.channel.send(numeratorUnitSymbol + ' is wrong.');
					return;
				}
				if (!denominatorUnit) {
					message.channel.send(denominatorUnitSymbol + ' is wrong.');
					return;
				}
				const division = numeratorUnit.unit.value / denominatorUnit.unit.value;
				return {
					quantity: 'mixed',
					unit: {
						numeratorQuantity: numeratorUnit.quantity,
						denominatorQuantity: denominatorUnit.quantity,
						name: numeratorUnit.unit.name + '(s) per ' + denominatorUnit.unit.name,
						value: division,
						short: [numeratorUnit.unit.short[0] + '/' + denominatorUnit.unit.short[0]]
					}
				};
			} else {
				// target 1 unit
				return findUnit(targetPortion.endsWith('s') && targetPortion.length !== 1 ? targetPortion.slice(0, targetPortion.length - 1) : targetPortion);
				
			}
		})();
		if (!target) return message.channel.send('You must convert _to_ something. Your message doesn\'t have a (valid) target unit.');

		// check that all starters and target are the same quantity
		const usedQuantities = new Set([target.quantity, ...starters.map(x => x.quantity)]);
		const numeratorQuantities = new Set([target?.unit?.numeratorQuantity, ...starters.map(x => x?.unit?.numeratorQuantity)]);
		const denominatorQuantities = new Set([target?.unit?.denominatorQuantity, ...starters.map(x => x?.unit?.denominatorQuantity)]);
		if (usedQuantities.size > 1 || numeratorQuantities.size > 1 || denominatorQuantities.size > 1) return message.channel.send(`All starting units and the target unit must be of the same quantity. The quantities you used were \`${[...usedQuantities, ...numeratorQuantities, ...denominatorQuantities].filter(x => x)}\``);
		const quantity = [...usedQuantities][0];

		// get absolute value: sum of all starters (starter amount * starter unit value)
		let absolute;
		if (starters[0].evalRequired) {
			absolute = starters.map(starter => {
				let x = starter.amount;
				return eval(starter.unit.toBase);
			}).reduce((a, b) => a + b, 0);
		} else {
			absolute = starters.map(starter => starter.amount * starter.unit.value).reduce((a, b) => a + b, 0);
		}

		// multiply absolute by the value of the target unit		
		let amountInTarget;
		if (starters[0].evalRequired) {
			let x = absolute;
			amountInTarget = eval(target.unit.toSelf);
		} else {
			amountInTarget = absolute / target.unit.value;
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