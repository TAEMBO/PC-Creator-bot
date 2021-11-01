module.exports = (client, options) => {
	const { cpu, manufacturer, color } = options;
	const embed = new client.embed()
		.setTitle(manufacturer.charAt(0).toUpperCase() + manufacturer.slice(1).toLowerCase() + ' ' + cpu.name)
		.addField('Cores', cpu.cores, true)
		.addField('Base Clock Speed', cpu.base ? (cpu.base === 'N/A' ? 'N/A' : cpu.base + ' GHz') : 'N/A', true)
		.addField('TDP', cpu.tdp ? (cpu.tdp === 'N/A' ? 'N/A' : cpu.tdp + 'W') : 'N/A', true)
		.addField('Threads', cpu.threads ? (cpu.threads === 'N/A' ? 'N/A' : cpu.threads) : 'N/A', true)
		.addField('Boost Clock Speed', cpu.boost ? (cpu.boost === 'N/A' ? 'N/A' : cpu.boost + ' GHz') : 'N/A', true)
		.addField('Socket', cpu.socket ? (cpu.socket === 'N/A' ? 'N/A' : cpu.socket): 'N/A', true)
		.addField('MSRP', cpu.price ? (cpu.price === 'N/A' ? 'N/A' : '$' + cpu.price.toFixed(2)) : 'N/A')
		.setColor(color);
	return embed;
};