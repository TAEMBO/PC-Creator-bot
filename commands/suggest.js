const { MessageActionRow, MessageButton, MessageEmbed, Message } = require("discord.js")
module.exports = {
    run: async (client, message, args) => {
        if (message.channel.id !== client.config.mainServer.channels.suggestions) {
            client.cooldowns.get(message.author.id)?.set('suggest', 0);
            return message.channel.send(`This command only works in <#${client.config.mainServer.channels.suggestions}>`);
        }
        await message.delete();
        if (!args[1]) {
            return message.channel.send('You need to suggest something.').then(x => setTimeout(() => x.delete(), 6000));
        }
        if (args[1].length > 2048) {S
            return message.channel.send('Your suggestion must be less than or equal to 2048 characters in length.').then(x => setTimeout(() => x.delete(), 6000));
        }
        const embed = new MessageEmbed()
            .setAuthor(`${message.member.displayName} (${message.author.id})`, message.author.avatarURL({ format: 'png', size: 128 }))
            .setTitle(`Suggestion:`)
            .setDescription(message.content.slice(message.content.indexOf(' ') + 1))
            .setTimestamp()
            .setColor('269CD0')
        if (message.attachments?.first()?.width && ['png', 'jpeg', 'jpg', 'gif'].some(x => message.attachments.first().name.endsWith(x))) {
            const suggestion = await message.channel.send({embeds: [embed], components: [new MessageActionRow().addComponents(new MessageButton().setStyle("SUCCESS").setEmoji("✅").setCustomId("suggestion-upvote").setLabel("1"), new MessageButton().setStyle("DANGER").setEmoji("❌").setCustomId("suggestion-decline").setLabel("1"))], files: [message.attachments?.first()]});
        } else {
            const suggestion = await message.channel.send({embeds: [embed], components: [new MessageActionRow().addComponents(new MessageButton().setStyle("SUCCESS").setEmoji("✅").setCustomId("suggestion-upvote").setLabel("1"), new MessageButton().setStyle("DANGER").setEmoji("❌").setCustomId("suggestion-decline").setLabel("1"))]});
        }
    },
    name: 'suggest',
    description: 'Create a suggestion. Only works in <#572541644755435520>. If an image is attached, it will be included in the suggestion.',
    category: 'PC Creator',
    alias: ['suggestion'],
    usage: ['suggestion'],
    cooldown: 10800
};