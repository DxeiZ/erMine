const Discord = require("discord.js");
const client = new Discord.Client();
const chalk = require("chalk");
const fs = require('fs');
require('./utils/event')(client);
const fetch = require("node-fetch")
const mineflayer = require('mineflayer')
const moment = require('moment');
moment.locale("tr");
const { JsonDatabase } = require("wio.db");
const db = new JsonDatabase("database");
const config = require("./config.json");
client.config = config;

const bot = mineflayer.createBot({
  host: db.fetch(`ipAdress`),
  username: "erMine",
  //password: 'firedia',
  port: 25565
})

client.on('ready', async () => {
    console.log(`${chalk.bold.greenBright(`Bot ${client.user.tag} username in join from discord.`)}`);
    setInterval(async() => {
    let ipServer = db.fetch(`ipAdress`)
    if(!ipServer) return client.user.setPresence({ activity: { name: `Yüklü değil..` }, status: 'dnd'})
    let veri = await fetch(`https://api.mcsrvstat.us/2/${ipServer}`).then(response => response.json())
    let statusX = {
        statusColor: 'online',
        nameStatus: `${veri.online ? veri.players.online+'/'+veri.players.max : '0'}`,

        statusColorDND: 'dnd',
        nameStatusDND: 'Server closed',

        statusColorIDLE: 'idle',
        nameStatusIDLE: `Server full - (${veri.online ? veri.players.online+'/'+veri.players.max : '0'})`
    }
    if(!veri.online) return client.user.setPresence({ activity: { name: statusX.nameStatusDND }, status: statusX.statusColorDND })
    else if(veri.players.online === veri.players.max) return client.user.setPresence({ activity: { name: statusX.nameStatusIDLE }, status: statusX.statusColorIDLE })
    else if(veri.players.online !== veri.players.max) return client.user.setPresence({ activity: { name: statusX.nameStatus }, status: statusX.statusColor })
    }, 1 * 60000)
    setInterval(async() => {
    if(db.fetch(`server-status`)) {
        let ipServer = db.fetch(`ipAdress`)
        if(!ipServer) return;
        let veri = await fetch(`https://api.mcsrvstat.us/2/${ipServer}`).then(response => response.json())
        let statusServer
        if(!veri.online) statusServer = 'Closed'
        else if(veri.players.online === veri.players.max) statusServer = 'Full'
        else if(veri.players.online !== veri.players.max) statusServer = 'Online'
        let server_oyuncu = client.channels.cache.get(db.fetch(`server_oyuncu`))
        let server_adres = client.channels.cache.get(db.fetch(`server_adres`))
        let server_surum = client.channels.cache.get(db.fetch(`server_surum`))
        let server_durum = client.channels.cache.get(db.fetch(`server_durum`))
        let server_kategori = client.channels.cache.get(db.fetch(`server_kategori`))

        let channelID;
        let channels = client.guilds.cache.get(db.fetch('server-status').guild).channels.cache;
    
        channelLoop:
        for (let key in channels) {
            let c = channels[key];
            if (c[1].type === "text") {
                channelID = c[0];
                break channelLoop;
            }
        }
    
        let channel = client.guilds.cache.get(db.fetch('server-status').guild).channels.cache.get(client.guilds.cache.get(db.fetch('server-status').guild).systemChannelID || channelID);
        if(!db.fetch('server-status')) return;
        else if(client.channels.cache.get(db.fetch(`server_oyuncu`))) {
            await server_oyuncu.setName(`Player • ${veri.online ? veri.players.online : `0`}`)
        } else return channel.send(`\`[✘] | #player\` channel not found.`)

        if(client.channels.cache.get(db.fetch(`server_adres`))) {
            await server_adres.setName(`IP • ${veri.hostname}`)
        } else return channel.send(`\`[✘] | #ip\` channel not found.`)

        if(client.channels.cache.get(db.fetch(`server_surum`))) {
            await server_surum.setName(`Version • ${veri.online ? veri.version : ` `}`)
        } else return channel.send(`\`[✘] | #version\` channel not found.`)

        if(client.channels.cache.get(db.fetch(`server_durum`))) {
            await server_durum.setName(`Status • ${statusServer}`)
        } else return channel.send(`\`[✘] | #status\` channel not found.`)

        if(client.channels.cache.get(db.fetch(`server_durum`))) {
            await server_kategori.setName(veri.hostname)
        } else return channel.send(`\`[✘] | #category\` channel not found.`)
} else return;
}, 5 * 60000);
});

const log = message => {
    console.log(`${chalk.bold.green(message)}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
    if (err) console.error(err);
    log(`Total commands size: ${files.length}`);
    files.forEach(f => {
        let props = require(`./commands/${f}`);
        log(`${config.prefix+props.help.name}`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./commands/${command}`)];
            let cmd = require(`./commands/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if(cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e){
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./commands/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e){
            reject(e);
        }
    });
};

client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./commands/${command}`)];
            let cmd = require(`./commands/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
            if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};


bot.on('chat', (username, message) => {
    if(username === bot.username) return;
    let i = db.fetch(`mineChat`)
    if(i) {
    let channel = client.channels.cache.get(i)
    if(channel) {
    channel.createWebhook(username, {
        avatar: `https://minotar.net/avatar/${username}/100.png`,
    }).then(async() => {
        try {
		    const webhooks = await channel.fetchWebhooks();
		    const webhook = webhooks.first();

		    await webhook.send(message, {
			    username: username,
			    avatarURL: `https://minotar.net/avatar/${username}/100.png`,
		    });
	    } catch (error) {
		    console.error(error);
	    }
    }).catch(console.error);
} else if(!channel) return;
} else if(!i) return;
})

client.on("message", message => {
    if(message.author.bot) return;
    if(message.content === "") {
        bot.chat(`[${message.author.tag}]: send a file..`)
    } else {
        if (message.content.match(/^<@!?(\d+)>$/)) {
            let user = message.guild.members.cache.get(message.content.slice(3, -1)).user.username
            bot.chat(`[${message.author.tag}]: ${user}`)
        } else {
            bot.chat(`[${message.author.tag}]: ${message.content}`)
        }
    }
})

bot.on('kicked', console.log)
bot.on('error', console.log)

client.on("error", (e) => console.error(chalk.bold.red(e)));
client.on("warn", (e) => console.warn(chalk.bold.yellow(e)));

client.elevation = message => {
    if(!client) return;
    let permlvl = 0;
    if(message.member.hasPermission("KICK_MEMBERS")) permlvl = 1;
    if(message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if(message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if(message.author.id === config.owner) permlvl = 4;
    return permlvl;
};

client.login(config.token)