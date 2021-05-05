const Discord = require("discord.js");
const client = new Discord.Client();

exports.run = async(client, message, args) => {
    let url = `https://minecraftskinstealer.com/achievement`
    let itemCode = args[0]
    if(!itemCode) return message.channel.send(`**\`[✘] | Please enter a number between 1 and 39\`**`)
    if(isNaN(itemCode)) return message.channel.send(`**\`[✘] | Please enter a number between 1 and 39 only.\`**`)
    if(itemCode > 39) itemCode = 15
    if(itemCode < 1) itemCode = 15
    let upText = args[1]
    if(!upText) return message.channel.send(`**\`[✘] | Please enter a superscript.\`**`)
    let downText = args[2]
    if(!downText) return message.channel.send(`**\`[✘] | Please enter a subtext.\`**`)
    let editedURL = `${url}/${itemCode}/${upText.replace(/Ğ/gim, "G") .replace(/Ü/gim, "U") .replace(/Ş/gim, "S") .replace(/İ/gim, "I") .replace(/Ö/gim, "O") .replace(/Ç/gim, "C") .replace(/ğ/gim, "g") .replace(/ü/gim, "u") .replace(/ş/gim, "s") .replace(/ı/gim, "i") .replace(/ö/gim, "o") .replace(/ç/gim, "c").split("+-").join("%20")}/${downText.replace(/Ğ/gim, "G") .replace(/Ü/gim, "U") .replace(/Ş/gim, "S") .replace(/İ/gim, "I") .replace(/Ö/gim, "O") .replace(/Ç/gim, "C") .replace(/ğ/gim, "g") .replace(/ü/gim, "u") .replace(/ş/gim, "s") .replace(/ı/gim, "i") .replace(/ö/gim, "o") .replace(/ç/gim, "c").split("+-").join("%20")}`
    const embed = new Discord.MessageEmbed()
    .setDescription(`[**\`[Visual link]\`**](${editedURL})`)
    .setImage(editedURL)
    .setColor("GREEN")
    message.channel.send(embed)
}

exports.conf = {
    aliases: []
}

exports.help = {
    name: "task"
}