module.exports = {
	run: (client, message, args) => {
		message.channel.send({
			embed: {
				"title": "Command Infomation",
				"description": "This command does not search the web, TÆMBØ and Finn have to manually add each GPU and search it's specs (why? cuz TÆ still learning how to code a bot) so don't expect your GPU to be on here. To use the command, type ``,gpuamd`` or ``,gpunvidia``, space, then the gpu model, keep in mind that there should be no spaces in the model name if it has letters after it such as a 1080 Ti.\n**Example:** ,gpuamd 5700xt\n\n**Please note:** If the card model has no founders edition such as the nvidia 16 series, the specs will be of the lowest end aib card for that model."
			}
		});
	},
	name: 'gpuinfo',
	description: 'Explains `gpunvidia` and `gpuamd`'
};