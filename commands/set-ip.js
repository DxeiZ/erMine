const Discord = require("discord.js");
const client = new Discord.Client();
const { JsonDatabase } = require("wio.db");
const db = new JsonDatabase("database");
const fetch = require("node-fetch")

exports.run = async(client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`**\`[✘] | You must have [ADMINISTRATOR] authority to use this command.\`**`)
    let ip = args[0]
    if(!ip) return message.channel.send(`**\`[✘] | Please enter a dynamic server address.\`**`)
    if(ip === '0') {
        if(!db.fetch(`ipAdress`)) return message.channel.send(`**\`[✘] | A server address has not been previously registered.\`**`)
        db.delete(`ipAdress`)
        message.channel.send(`**\`[✔] | Server address has been reset successfully.\`**`)
        return;
    }
    let ipSplit = ip.split(".").join(" ")
    if(!isNaN(ipSplit)) return message.channel.send(`**\`[✘] | Please enter dynamic server address, not numeric.\`**`)
    let veri = await fetch(`https://api.mcsrvstat.us/2/${ip}`).then(response => response.json())
    if(!veri.online) return message.channel.send(`**\`[✘] | There is a problem with the server address. The server is down or the address is wrong.\`**`)
    db.set(`ipAdress`, ip)
    message.channel.send(`**\`[✔] | The server address has been successfully registered.\`**`)
}

exports.conf = {
    aliases: []
}

exports.help = {
    name: "set-ip"
}