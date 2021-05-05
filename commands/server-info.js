const Discord = require("discord.js");
const client = new Discord.Client();
const fetch = require("node-fetch")
const { JsonDatabase } = require("wio.db");
const db = new JsonDatabase("database");

exports.run = async(client, message) => {
    let serverIP = db.fetch(`ipAdress`)
    if(!serverIP) return message.channel.send(`**\`[✘] | Administrator needs to install to use this command.\`**`)
    let veri = await fetch(`https://api.mcsrvstat.us/2/${serverIP}`).then(response => response.json())
    var status;
    if(!veri.online) status = `https://media.discordapp.net/attachments/779301765169283083/800101738438721546/unknown.png`;
    else if(veri.online) status = `https://eu.mc-api.net/v3/server/favicon/${veri.hostname}`
    else if(veri.icon === null) status = `https://media.discordapp.net/attachments/779301765169283083/800101738438721546/unknown.png`;
    const embed = new Discord.MessageEmbed()
    .setAuthor(veri.hostname, status)
    .addField(`Digital IP`, `**\`\`\`fix\n${veri.ip === '127.0.0.1' ? '127.0.0.1 [belirsiz]' : veri.ip}\`\`\`**`, true)
    .addField(`Port`, `**\`\`\`fix\n${veri.port}\`\`\`**`, true)
    .addField(`Player`, veri.online ? `**\`\`\`fix\n${veri.players.online}\`\`\`**` : `**\`\`\`fix\n0\`\`\`**`, true)
    .addField(`Verison`, veri.online ? `**\`\`\`fix\n${veri.version}\`\`\`**` : `**\`\`\`fix\n‏‏‎ ‎\`\`\`**`)
    .setImage(veri.online ? `http://status.mclive.eu/${veri.hostname}/${veri.hostname}/${veri.port}/banner.png`: `http://status.mclive.eu/%20/%20/25565/banner.png`)
    .setThumbnail(status)
    .setColor("GREEN")
    message.channel.send(embed)
}

exports.conf = {
    aliases: ['server-info']
}

exports.help = {
    name: "serverinfo"
}