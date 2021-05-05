const Discord = require("discord.js");
const client = new Discord.Client();

exports.run = async(client, message) => {
    let permission = message.member.hasPermission("ADMINISTRATOR")
    let trueFalse;
    if(permission) trueFalse = false
    if(!permission) trueFalse = true
    const embed = new Discord.MessageEmbed()
    .addFields(
        {
            name: "**Server info command**",
            value: `**\`\`\`fix\nUse: ${client.config.prefix}serverinfo\nDescription: It gives information about the server address set.\`\`\`**`,
        },
        {
            name: "**Kullanıcı info command**",
            value: `**\`\`\`fix\nUse: ${client.config.prefix}userinfo\nDescription: Gives info about Minecraft user.\`\`\`**`
        },
        {
            name: "**IP command**",
            value: `**\`\`\`fix\nUse: ${client.config.prefix}ip\nDescription: Shows the IP address of the server.\`\`\`**`
        },
        {
            name: "**Task command**",
            value: `**\`\`\`fix\nUse: ${client.config.prefix}task\nDescription: You create your own mission.\nDetail: Use + - to leave a space.\`\`\`**`
        },
        {
            name: `${permission ? `**Set IP command**` : "**Set IP command**"}`,
            value: `${permission ? `**\`\`\`fix\nUse: ${client.config.prefix}set-ip\nDescription: You set the server address for installation.\nDetail: Type 0 to reset the address.\`\`\`**` : "```fix\n‏‏‎ ‎```"}`,
            inline: trueFalse
        },
        {
            name: `${permission ? `**Set server command**` : "‏‏‎**Set server command**‎"}`,
            value: `${permission ? `**\`\`\`fix\nUse: ${client.config.prefix}set-server\nDescription: You show your Minecraft server info on your channels.\nDetail: Type 0 to reset the system.\`\`\`**` : "‏‏‎```fix\n‏‏‎ ‎```"}`,
            inline: trueFalse
        },
        {
            name: `${permission ? `**Chat channel command**` : "‏‏‎**Chat channel command**‎"}`,
            value: `${permission ? `**\`\`\`fix\nUse: ${client.config.prefix}chat-channel\nDescription: The chat channel between servers is set up.\nDetail: Type 0 to reset the system.\`\`\`**` : "‏‏‎```fix\n‏‏‎ ‎```"}`,
            inline: trueFalse
        }
    )
    .setColor("GREEN")
    message.channel.send(embed)
}

exports.conf = {
    aliases: ['commands']
}

exports.help = {
    name: "help"
}