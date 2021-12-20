const { Client, ButtonInteraction, MessageEmbed, MessageButton, MessageActionRow, Message } = require("discord.js");
module.exports = async (client, button) =>{
    if(!button.customId === "suggestion-decline" && !button.customId === "suggestion-upvote") return;
    const hasVoted = client.votes._content.includes(`${button.user.id}: ${button.message.id}`)
        // reactions regarding suggestions only happen in the suggestions channel so return if this event didnt originate from the suggestions channel
        if (button.channel.id !== client.config.mainServer.channels.suggestions) return;
        let upvotes;
        let downvotes;
        button.message.components.forEach((a)=>{
            a.components.forEach((ton)=>{
                if(ton.customId === "suggestion-decline"){
                    downvotes = parseInt(ton.label)
                } else if (ton.customId === "suggestion-upvote"){
                    upvotes = parseInt(ton.label)
                }
            })
        })
        if(hasVoted){
            button.reply({embeds: [new MessageEmbed().setDescription("Vote Declined! You Have Already Voted On This Suggestion!").setColor("#420420").setAuthor(button.user.tag, button.user.displayAvatarURL({}))], ephemeral: true})
        } else if(button.message.embeds[0].author.name=== `${button.member.displayName} (${button.user.id})`){
            button.reply({embeds: [new MessageEmbed().setDescription("Vote Declined! You Can't Vote On Your Own Suggestion!").setColor("#420420").setAuthor(button.user.tag, button.user.displayAvatarURL({}))], ephemeral: true})
        } else if(button.customId === "suggestion-decline"){
            const ee = await parseInt(button.component.label) + 1;
            UpdateButtons(upvotes, ee, button.message, button.user.id)
            button.reply({embeds: [new MessageEmbed().setDescription("❌ Your Downvote Has Been Recorded!").setColor("#dd2e44").setAuthor(button.user.tag, button.user.displayAvatarURL({}))], ephemeral: true})
        } else if(button.customId === "suggestion-upvote") {
            const ee = await parseInt(button.component.label) + 1;
            UpdateButtons(ee, downvotes, button.message, button.user.id)
            button.reply({embeds: [new MessageEmbed().setDescription("✅ Your Upvote Has Been Recorded!").setColor("#77b255").setAuthor(button.user.tag, button.user.displayAvatarURL({}))], ephemeral: true})
        }
        // delete message and dont handle reaction if message is not a suggestion, but a suggestion command
        if (button.message.author.id !== client.user.id && message.content.startsWith(client.prefix + 'suggest')) return message.delete();

        const embed = button.message.embeds[0];
        async function UpdateButtons(upvotes, downvotes = Number, message, user){
             message.edit({embeds: [message.embeds[0]], components: [new MessageActionRow().addComponents(new MessageButton().setStyle("SUCCESS").setEmoji("✅").setCustomId("suggestion-upvote").setLabel(`${upvotes}`), new MessageButton().setStyle("DANGER").setEmoji("❌").setCustomId("suggestion-decline").setLabel(`${downvotes}`))]});
             await client.votes.addData(`${user}: ${message.id}`).forceSave();
        }
        function changeProperties(newColor, newTitle) {
            if (embed.hexColor === newColor.toLowerCase() && embed.title === newTitle) return;
            embed.setColor(newColor);
            embed.setTitle(newTitle);
            return button.message.edit({embeds: [embed]});
        }
        if (upvotes / downvotes >= 15.1) { // breakthrough, 15.1
            return changeProperties('#37BE73', 'Breakthrough Suggestion:');
        }
        if (upvotes / downvotes >= 10.1) { // fantastic, 10.1
            return changeProperties('#EE2A6E', 'Fantastic Suggestion:');
        }
        if (upvotes / downvotes >= 5.1) { // good, 5.1
            return changeProperties('#6A36FB', 'Good Suggestion:');
        }
        if (upvotes / downvotes <= 1 / 3) { // bad, 1/3
            return changeProperties('#4E535E', 'Controversial Suggestion:');
        }
        // normal
        return changeProperties('#269CD0', 'Suggestion:');
}