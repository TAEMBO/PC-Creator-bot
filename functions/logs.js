const { MessageEmbed, MessageActionRow, MessageButton, Client } = require("discord.js");
module.exports = async (client) => {
    const channel = await client.channels.fetch(require("../config.json").mainServer.channels.staffLogs)
   client.on("messageDelete", async (msg)=>{
       if(msg.partial) return;
       if(msg.author.bot) return;
       if(msg.guild.id !== client.config.mainServer.id) return;
      channel.send({embeds: [new MessageEmbed().setTitle("Message Deleted!").setDescription(`Content:\n\`\`\`js\n${msg.content}\n\`\`\`\nChannel: <#${msg.channel.id}>`).setAuthor(`Author: ${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL({})).setColor(14495300)]})
   })
   client.on("messageUpdate", async (oldMsg, newMsg)=>{
       if(oldMsg.partial) return;
       if(newMsg.partial) return;
       if(oldMsg.author.bot) return;
       if(newMsg.guild.id !== client.config.mainServer.id) return;
       channel.send({embeds: [new MessageEmbed().setTitle("Message Edited!").setDescription(`Old Content:\n\`\`\`js\n${oldMsg.content}\n\`\`\`\nNew Content:\n\`\`\`js\n${newMsg.content}\n\`\`\`\nChannel: <#${oldMsg.channel.id}>`).setAuthor(`Author: ${oldMsg.author.tag} (${oldMsg.author.id})`, oldMsg.author.displayAvatarURL({})).setColor(client.embedColor)], components: [new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL(`${oldMsg.url}`).setLabel("Jump to message"))]})
   })
   client.on("guildMemberAdd", async (member)=>{
        const embed = new MessageEmbed()
        .setTitle(`Member Joined: ${member.user.tag}`)
        .addField('🔹 Account Creation Date', `${member.user.createdAt.getUTCFullYear()}-${('0' + (member.user.createdAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.user.createdAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.user.createdTimestamp, 1, { longNames: true })} ago`)
        .addField('🔹 ID and Mention', `ID: ${member.user.id}\nMention: <@${member.user.id}>`)
        .setColor(7844437)
        .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048}))
        channel.send({embeds: [embed]})
   })
   client.on("guildMemberRemove", async (member)=>{
    const embed = new MessageEmbed()
    .setTitle(`Member Left: ${member.user.tag}`)
    .addField('🔹 Account Creation Date', `${member.user.createdAt.getUTCFullYear()}-${('0' + (member.user.createdAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.user.createdAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.user.createdTimestamp, 1, { longNames: true })} ago`)
    .addField('🔹 Join Date', `${member.joinedAt.getUTCFullYear()}-${('0' + (member.joinedAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.joinedAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.joinedTimestamp, 1, { longNames: true })} ago`)
    .addField('🔹 ID and Mention', `ID: ${member.user.id}\nMention: <@${member.user.id}>`)
    .addField('🔹 Roles', `${member.roles.cache.map(x => x).join(", ")}`)
    .setColor(14495300)
    .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048}))
    channel.send({embeds: [embed]})
   })
   client.on("messageDeleteBulk", async (messages)=>{
    let text = "";
    messages.forEach((e)=>{
        text += `${e.author.tag}: ${e.content}\n`;
    });
    const embed = new MessageEmbed()
    .setDescription(`\`\`\`${text}\`\`\``)
    .setTitle(`${messages.size} Messages Were Deleted.`)
    .addField("Channel", `<#${messages.first().channel.id}>`)
    .setColor(client.embedColor)
    channel.send({embeds: [embed]})
})
 channel.send(':warning: Bot restarted :warning:')
};