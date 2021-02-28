module.exports = (client, options) => {
	const { cpu, manufacturer, color } = options;
	const embed = new client.embed()
		.setTitle(manufacturer.charAt(0).toUpperCase() + manufacturer.slice(1).toLowerCase() + ' ' + cpu.name)
		.addField('Cores', cpu.cores, true)
		.addField('Base Clock Speed', cpu.base.toFixed(2) + ' GHz', true)
		.addField('TDP', cpu.tdp + 'W', true)
		.addField('Threads', cpu.threads, true)
		.addField('Boost Clock Speed', cpu.boost ? cpu.boost.toFixed(2) + ' GHz' : 'N/A', true)
		.addField('Socket', cpu.socket, true)
		.addField('MSRP', cpu.price ? '$' + cpu.price.toFixed(2) : 'N/A')
		.setColor(color);
	return embed;
};