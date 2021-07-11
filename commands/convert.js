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
			name: 'Euro',
			value: 1,
			short: ['EUR', '€']
		},
		{
			name: 'US Dollar',
			value: 1.19,
			short: ['USD', '$'],
		},
		{
			name: 'pound sterling',
			value: 0.86,
			short: ['GBP', '£']
		}
		// lira
		// ruple
		// btc
		// cad
		// aud
		// yen

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
			short: ['kg']
		},
		{
			name: 'pound',
			value: 0.00220462262,
			short: ['lbs']
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
			short: ['fl oz']
		},
		{
			name: 'liter',
			value: 1000,
			short: ['l']
		}
	],
	temperature: [
		{
			name: 'kelvin',
			toSelf: 'x',
			toKelvin: 'x',
			short: ['K']
		},
		{
			name: 'celsius',
			toSelf: 'x-273.15',
			toKelvin: 'x+273.15',
			short: ['°C', 'c']
		},
		{
			name: 'fahrenheit',
			toSelf: '((9/5)*(x-273))+32',
			toKelvin: '((5/9)*(x-32))+273',
			short: ['°F', 'fh', 'f']
		}
	]
}
function findUnit(unitNameQuery = '') {
	console.log('doing findunit on', unitNameQuery);
	for (let i = 0; i < Object.values(quantities).length; i++) {
		const unit = Object.values(quantities)[i].find(x => x.name.toLowerCase() === unitNameQuery.toLowerCase() || x.short.some(y => y.toLowerCase() === unitNameQuery.toLowerCase()));
		if (unit) {
			console.log('match found in', Object.keys(quantities)[i], ', found', unit);
			const quantity = Object.keys(quantities)[i];
			return { quantity, unit };
		} else {
			console.log('no match found in', Object.keys(quantities)[i]);
		}
	}
	return null;
}
module.exports = {
	run: (client, message, args) => {
		const starters = args[1]?.split(',').map(starter => {
			const unitSymbol = starter.slice(starter.match(/[0-9\,\.\-]*/gi)[0].length);
			return Object.assign({ amount: parseFloat(starter) }, findUnit(unitSymbol));
		});
		if (!starters) return message.channel.send('You must convert _something._');
		console.log('args2', args.slice(2).join(' '));
		const target = findUnit(args.slice(2).join(' '));
		if (!target) return message.channel.send('You must convert _to_ something.');

		console.log('starters', starters);

		// check that all starters and target are the same quantity
		const usedQuantities = new Set([target.quantity, ...starters.map(x => x.quantity)]);
		if (usedQuantities.size > 1) return message.channel.send(`All starting units and the target unit must be of the same quantity. The quantities you used were \`${[...usedQuantities].join(', ')}\``);
		const quantity = [...usedQuantities][0];

		// get absolute value: sum of all starters (starter amount * starter unit value)
		let absolute;
		if (quantity === 'temperature') {
			absolute = starters.map(starter => {
				let x = starter.amount;
				return eval(starter.unit.toKelvin);
			}).reduce((a, b) => a + b, 0);
		} else {
			absolute = starters.map(starter => starter.amount / starter.unit.value).reduce((a, b) => a + b, 0);
		}
		console.log('absolute', absolute);

		// multiply absolute by the value of the target unit		
		let amountInTarget;
		if (quantity === 'temperature') {
			let x = absolute;
			amountInTarget = eval(target.unit.toSelf);
		} else {
			amountInTarget = absolute * target.unit.value;
		}

		// display amount and target unit symbol
		const embed = new client.embed()
			.setTitle(quantity[0].toUpperCase() + quantity.slice(1) + ' conversion')
			.addField('Starting amount', starters.map(x => `${x.amount} ${x.unit.short[0]}`).join(', '), true)
			.addField('Converted amount', amountInTarget.toFixed(2) + ' ' + target.unit.short[0], true)
			.setColor(client.embedColor)
		message.channel.send(embed);
	},
	name: 'convert',
	description: '[BETA] Convert measurements. Use many starting amounts and units by attaching amounts and units of the same quantity with a comma ",", eg. \`convert 5ft,8in cm\`',
	shortDescription: '[BETA] Convert measurements.',
	usage: ['starting amount and unit', 'target unit']
}