const Discord = require("discord.js");
const client = new Discord.Client();
const { JsonDatabase } = require("wio.db");
const db = new JsonDatabase("database");
const fetch = require("node-fetch")

exports.run = async(client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`**\`[✘] | You must have [ADMINISTRATOR] authority to use this command.\`**`)
    let serverIP = db.fetch(`ipAdress`)
    let veri = await fetch(`https://api.mcsrvstat.us/2/${serverIP}`).then(response => response.json())
    let statusServer
    if(!veri.online) statusServer = 'Closed'
    else if(veri.players.online === veri.players.max) statusServer = 'Full'
    else if(veri.players.online !== veri.players.max) statusServer = 'Online'
    if(!args[0]) {
        if(db.fetch('server-status')) return message.channel.send(`**\`[✘] | A server has already been registered.\`**`)
        await message.guild.channels.create(veri.hostname, {
            type: 'category',
            permissionOverwrites: [
                {
                id: message.guild.id,
                deny: ['CONNECT', 'SPEAK'],
                },
            ],
        }).then(async kategori => {
            await message.guild.channels.create(`Player • ${veri.online ? veri.players.online : `0`}`, { type: 'voice' }).then(channel => { db.set(`server_oyuncu`, channel.id); channel.setParent(kategori.id) })
            await message.guild.channels.create(`IP • ${veri.hostname}`, { type: 'voice' }).then(channel => { db.set(`server_adres`, channel.id); channel.setParent(kategori.id) })
            await message.guild.channels.create(`Version • ${veri.online ? veri.version : ` `}`, { type: 'voice' }).then(channel => { db.set(`server_surum`, channel.id); channel.setParent(kategori.id) })
            await message.guild.channels.create(`Status • ${statusServer}`, { type: 'voice' }).then(channel => { db.set(`server_durum`, channel.id); channel.setParent(kategori.id) })
            await kategori.setPosition(0)
            db.set(`server_kategori`, kategori.id)
            db.set(`server-status`, { status: true, guild: message.guild.id })
            message.channel.send(`**\`[✔] | The installation has been completed successfully.\`**\n         └ Do not manually lift the ducts.`)
        })
    } else if(args[0] === '0') {
            if(!db.fetch(`server-status`)) return message.channel.send(`**\`[✘] | A server has not been registered before.\`**`)
            if(message.guild.channels.cache.get(db.fetch(`server_oyuncu`))) {
                await message.guild.channels.cache.get(db.fetch(`server_oyuncu`)).delete()
                await db.delete(`server_oyuncu`)
            } else return message.channel.send(`\`[✘] | #player\` channel not found.`)

            if(message.guild.channels.cache.get(db.fetch(`server_adres`))) {
                await message.guild.channels.cache.get(db.fetch(`server_adres`)).delete()
                await db.delete(`server_adres`)
            } else return message.channel.send(`\`[✘] | #ip\` channel not found.`)

            if(message.guild.channels.cache.get(db.fetch(`server_surum`))) {
                await message.guild.channels.cache.get(db.fetch(`server_surum`)).delete()
                await db.delete(`server_surum`)
            } else return message.channel.send(`\`[✘] | #version\` channel not found.`)

            if(message.guild.channels.cache.get(db.fetch(`server_durum`))) {
                await message.guild.channels.cache.get(db.fetch(`server_durum`)).delete()
                await db.delete(`server_durum`)
            } else return message.channel.send(`\`[✘] | #status\` channel not found.`)

            if(message.guild.channels.cache.get(db.fetch(`server_kategori`))) {
                await message.guild.channels.cache.get(db.fetch(`server_kategori`)).delete()
                await db.delete(`server_kategori`)
            } else return message.channel.send(`\`[✘] | #category\` channel not found.`)
            await db.delete(`server-status`)
            message.channel.send(`**\`[✔] | The server system has been reset successfully.\`**`)
            return;
        }
        
        setInterval(async() => {
            if(!db.fetch(`server-status`)) return;
            let server_oyuncu = message.guild.channels.cache.get(db.fetch(`server_oyuncu`))
            let server_adres = message.guild.channels.cache.get(db.fetch(`server_adres`))
            let server_surum = message.guild.channels.cache.get(db.fetch(`server_surum`))
            let server_durum = message.guild.channels.cache.get(db.fetch(`server_durum`))
            let server_kategori = message.guild.channels.cache.get(db.fetch(`server_kategori`))
            if(message.guild.channels.cache.get(db.fetch(`server_oyuncu`))) {
                await server_oyuncu.setName(`Player • ${veri.online ? veri.players.online : `0`}`)
            } else return message.channel.send(`\`[✘] | #player\` channel not found.`)

            if(message.guild.channels.cache.get(db.fetch(`server_adres`))) {
                await server_adres.setName(`IP • ${veri.hostname}`)
            } else return message.channel.send(`\`[✘] | #ip\` channel not found.`)

            if(message.guild.channels.cache.get(db.fetch(`server_surum`))) {
                await server_surum.setName(`Version • ${veri.online ? veri.version : ` `}`)
            } else return message.channel.send(`\`[✘] | #version\` channel not found.`)

            if(message.guild.channels.cache.get(db.fetch(`server_durum`))) {
                await server_durum.setName(`Status • ${statusServer}`)
            } else return message.channel.send(`\`[✘] | #status\` channel not found.`)

            if(message.guild.channels.cache.get(db.fetch(`server_kategori`))) {
                await server_kategori.setName(veri.hostname)
            } else return message.channel.send(`\`[✘] | #category\` channel not found.`)
        }, 5 * 60000);
}

exports.conf = {
    aliases: []
}

exports.help = {
    name: "set-server"
}