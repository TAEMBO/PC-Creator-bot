module.exports = {
    run: (client, message, args) => {
        message.channel.send("Go to the online shop in the menu, and under the OS section you will find a list of programs. Select the game and buy it. Then go to customer’s PC and turn it on to the desktop, next press the install button, followed by the small backpack icon, you will then see your game there where you can download it.")
    },
	name: 'games',
	description: 'Provides help with game installation',
	category: 'PC Creator',
	autores: ['install/buy/get', 'game/fortnite/minecraft/witcher']
};