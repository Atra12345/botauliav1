"use strict";
const {
	MessageType,
	Presence
} = require("@adiwajshing/baileys");
const fs = require("fs");

const { getBuffer, sleep } = require("../lib/myfunc");

let setting = JSON.parse(fs.readFileSync('./config.json'));
let { botName } = setting

module.exports = async(aulia, anj, welcome, left) => {
    const isWelcome = welcome.includes(anj.jid)
    const isLeft = left.includes(anj.jid)
    const mdata = await aulia.groupMetadata(anj.jid)
    const groupName = mdata.subject

    if (anj.action === 'add'){
        if (anj.participants[0] === xinz.user.jid){
            await sleep(5000)
            aulia.updatePresence(anj.jid, Presence.composing)
            aulia.sendMessage(anj.jid, `hai aku ${botName}, Terima kasih telah memasuki bot ke dalam group anda , silahkan ketik #menu`, MessageType.text)
        } else if (isWelcome){
           try {
                var pic = await aulia.getProfilePicture(anj.participants[0])
            } catch {
                var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
            }
            aulia.sendMessage(anj.jid, await getBuffer(pic), MessageType.image, {caption: `hai @${anj.participants[0].split("@")[0]}, selamat datang di ${groupName}\n\nbaru masuk wajib intro gk intro di kick-!!`, contextInfo: {"mentionedJid": [anj.participants[0]]}})
        }
    } else if (anj.action === 'remove' && isLeft){
        try {
                var pic = await aulia.getProfilePicture(anj.participants[0])
            } catch {
                var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
            }
        aulia.sendMessage(anj.jid, await getBuffer(pic), MessageType.image, {caption: `sayonaraa👋... @${anj.participants[0].split("@")[0]} jangan bawa makanan cuy:v`, contextInfo: {"mentionedJid": [anj.participants[0]]}})
    }
}
