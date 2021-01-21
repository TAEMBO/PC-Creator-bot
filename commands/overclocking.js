module.exports = {
    run: (client, message, args) => {
        message.channel.send("Overclocking in this game is useful because it gives a higher benchmark score for the item, which is good for tasks that have a requirement such as ``CPU benchmark should be at least > xxxx``. To overclock a component (CPU GPU or RAM), it is **highly** recommended you max out your overclocking skill first, otherise you will get bluescreens very early into overclocking. After you did that, put the item you want to overclock into the pc, press the green play button at the top right, then press the ``BIOS`` button on the right side. go to the section that corresponds to your item type, then enter the correct numbers, hit apply, hope it doesn't bluescreen, then hit reboot. If you don't know what the correct overclocking numbers are for your item, use ``,scores cpu``, ``,scores ram``, or ``,scores gpu`` to find out.");
    },
	name: 'overclocking',
	description: 'Explains how to overclock a component',
	category: 'PC Creator'
};