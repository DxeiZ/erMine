const Discord = require("discord.js");
const client = new Discord.Client();
const fetch = require("node-fetch")

exports.run = async(client, message, args) => {
    if(message.content === "") return message.channel.send(`**\`[✘] | By sending a file, you cannot use this command.\`**`)
    if(!args[0]) return message.channel.send(`**\`[✘] | Please enter a player name.\`**`)
    let username = await fetch(`https://api.minetools.eu/uuid/${args[0]}`).then(response => response.json())
    if(username === undefined) return message.channel.send(`**\`[✘] | You cannot use this command by tagging a user.\`**`)
    let trueFalse;
    if(username.id === null) trueFalse = true
    if(username.id !== null) trueFalse = false
    const embed = new Discord.MessageEmbed()
    .setAuthor(`${username.id === null ? args[0] : username.name}`, `https://crafatar.com/avatars/${username.status === 'ERR' ? "0068eded1816eff05c66b2e123e0a05e" : username.id}`)
    .setDescription(`[**\`Texture\`**](https://crafatar.com/skins/${username.status === 'ERR' ? null : username.id}})**\`&\`**[**\`Cape\`**](https://crafatar.com/capes/${username.status === 'ERR' ? null : username.id})`)
    .addField(`Username`, `**\`\`\`fix\n${username.name}\`\`\`**`, trueFalse)
    .addField(`UUID`, `**\`\`\`fix\n${username.id === null ? ' ' : username.id}\`\`\`**`, trueFalse)
    .setColor("GREEN")
    .setFooter(!args[0] ? "You forgot to enter a username." : " ")
    .setThumbnail(`https://crafatar.com/avatars/${username.id === null ? "0068eded1816eff05c66b2e123e0a05e" : username.id}`)
    message.channel.send(embed)
}

exports.conf = {
    aliases: ['user-info']
}

exports.help = {
    name: "userinfo"
}