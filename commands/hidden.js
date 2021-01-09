module.exports = {
	run: (client, message, args) => {
		message.delete();
		message.channel.send({
			embed: {
				"title": "__Hidden Commands__",
				"description": "``,leave`` - How to leave a server\n``,google`` - For people who have questions simple enough that google can answer them\n``,pcpp`` - Sends PCPartPicker links\n``,data`` - For those people that ask if someone can help, but not tell their issue first. *tl;dr read the site yourself*\n``,b&`` - A special prize\n``,build`` - Shows a POV of how to build a PC by LTT\n``,after`` - Shows a video by JayzTwoCents on what to do after you build your PC\n``,link`` - Shows the propper PCPP link to use\n``,cable`` - Shows bandwidth for each HDMI and DisplayPort revision\n ``,unded`` - Brings the chat back to life\n``,usb`` - Finally explains those crappy usb names",
				"color": 12794193
			}
		}).then(message => message.delete({ timeout: 10000 }));
	},
	name: 'hidden'
};