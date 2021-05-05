const Discord = require("discord.js");
const client = new Discord.Client();
const { JsonDatabase } = require("wio.db");
const db = new JsonDatabase("database");
const fetch = require("node-fetch")

exports.run = async(client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`**\`[✘] | You must have [ADMINISTRATOR] authority to use this command.\`**`)
    if(args[0] === '0') {
        if(!db.fetch(`mineChat`)) return message.channel.send(`**\`[✘] | A channel has not been recorded before.\`**`)
        db.delete(`mineChat`)
        message.channel.send(`**\`[✔] | The server channel has been reset successfully.\`**`)
        return;
    }
    let channel = message.mentions.channels.first()
    if(channel) {
        db.set(`mineChat`, channel.id)
        message.channel.send(`**\`[✔] | The cross-server chat channel has been adjusted.\`**`)
    } else {
        message.channel.send(`**\`[✘] | There was a problem searching for the channel. Please use it properly.\`**`)
    }
}

exports.conf = {
    aliases: []
}

exports.help = {
    name: "chat-channel"
}