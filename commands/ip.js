const Discord = require("discord.js");
const client = new Discord.Client();
const { JsonDatabase } = require("wio.db");
const db = new JsonDatabase("database");
const fetch = require("node-fetch")

exports.run = async(client, message) => {
    let ip = db.fetch(`ipAdress`)
    if(!ip) return message.channel.send(`**\`[✘] | No previous server address could be saved.\`**`)
    message.channel.send(`**[!] | \`${ip.toUpperCase()} | ${ip}\`**`)
}

exports.conf = {
    aliases: []
}

exports.help = {
    name: "ip"
}