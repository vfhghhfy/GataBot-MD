// أزرار تفاعلية مكيفة وتعمل بواسطة Gata Dios (GataNina-Li)

// أصبحت قديمة مرة أخرى بسبب خلل في الواتساب :v
import { getDevice } from '@whiskeysockets/baileys'
import fs from 'fs'
import moment from 'moment-timezone'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
const { levelling } = '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'

let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text, command }) => {
    const device = await getDevice(m.key.id)
    try {
        let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch((_) => ({}))) || {}
        let { exp, limit, level, role } = global.db.data.users[m.sender]
        let { min, xp, max } = xpRange(level, global.multiplier)
        let name = await conn.getName(m.sender)
        let d = new Date(new Date() + 3600000)
        let locale = 'es'
        let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
        let week = d.toLocaleDateString(locale, { weekday: 'long' })
        let date = d.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(d)
        let time = d.toLocaleTimeString(locale, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        })
        let _uptime = process.uptime() * 1000
        let _muptime
        if (process.send) {
            process.send('uptime')
            _muptime =
                (await new Promise((resolve) => {
                    process.once('message', resolve)
                    setTimeout(resolve, 1000)
                })) * 1000
        }
        let { money, joincount } = global.db.data.users[m.sender]
        let user = global.db.data.users[m.sender]
        let muptime = clockString(_muptime)
        let uptime = clockString(_uptime)
        let totalreg = Object.keys(global.db.data.users).length
        let rtotalreg = Object.values(global.db.data.users).filter((user) => user.registered == true).length
        let replace = {
            '%': '%',
            p: _p,
            uptime,
            muptime,
            me: conn.getName(conn.user.jid),
            npmname: _package.name,
            npmdesc: _package.description,
            version: _package.version,
            exp: exp - min,
            maxexp: xp,
            totalexp: exp,
            xp4levelup: max - exp,
            github: _package.homepage ? _package.homepage.url || _package.homepage : '[رابط جيثب غير معروف]',
            level,
            limit,
            name,
            weton,
            week,
            date,
            dateIslamic,
            time,
            totalreg,
            rtotalreg,
            role,
            readmore: readMore
        }
        text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
        let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
        let mentionedJid = [who]
        let username = conn.getName(who)
        let taguser = '@' + m.sender.split('@s.whatsapp.net')[0]
        let pp = gataVidMenu
        let vn = 'https://qu.ax/bfaM.mp3'
        let partner = global.db.data.users[m.sender].partner
        //let fsizedoc = '1'.repeat(10)
        //let adReply = { fileLength: fsizedoc, seconds: fsizedoc, contextInfo: { forwardingScore: fsizedoc, externalAdReply: { showAdAttribution: true, title: wm, body: '👋 ' + username, mediaUrl: ig, description: 'مرحباً', previewType: 'PHOTO', thumbnail: await(await fetch(gataMenu.getRandom())).buffer(), sourceUrl: redesMenu.getRandom() }}}
        const numberToEmoji = { 0: '0️⃣', 1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣' }
        let lvl = level
        let emoji = Array.from(lvl.toString())
            .map((digit) => numberToEmoji[digit] || '❓')
            .join('')

        const locationDate = moment().tz('America/Lima')
        const dateFormat = {
            weekdays: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
            months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
        }
        locationDate.locale('es', dateFormat)
        const scheduleDate = locationDate.format('dddd, DD [من] MMMM [سنة] YYYY || HH:mm A').replace(/^\w/, (c) => c.toUpperCase())

        if (!m.isWABusiness && !/web|desktop|unknown/gi.test(device)) {
            let menu = `⎔ \`\`\`${scheduleDate}\`\`\`
⎔ *${lenguajeGB['smsTotalUsers']()}* ➺ _${Object.keys(global.db.data.users).length}_ 
⎔ *المسجلون »* ${rtotalreg}/${totalreg}    
⎔ *${lenguajeGB['smsUptime']()}* ➺ _${uptime}_ 
⎔ *${lenguajeGB['smsVersion']()}* ➺ _${vs}_
⎔ *${lenguajeGB['smsMode']()} ➺* _${global.opts['self'] ? `${lenguajeGB['smsModePrivate']().charAt(0).toUpperCase() + lenguajeGB['smsModePrivate']().slice(1).toLowerCase()}` : `${lenguajeGB['smsModePublic']().charAt(0).toUpperCase() + lenguajeGB['smsModePublic']().slice(1).toLowerCase()}`}_
⎔ *${lenguajeGB['smsBanChats']()}* ➺ _${Object.entries(global.db.data.chats).filter((chat) => chat[1].isBanned).length}_ 
⎔ *${lenguajeGB['smsBanUsers']()}* ➺ _${Object.entries(global.db.data.users).filter((user) => user[1].banned).length}_ ${(conn.user.jid == global.conn.user.jid ? '' : `\n⎔ *أنا بوت فرعي لـ: https://wa.me/${global.conn.user.jid.split`@`[0]}*`) || ''}

✨ *◜معلومات المستخدم◞* ✨
⊜ *نوع التسجيل »* ${user.registered === true ? `_${user.registroC === true ? 'تسجيل كامل 🗂️' : 'تسجيل سريع 📑'}_` : '❌ _بدون تسجيل_'}
⊜ *حالتي »* ${typeof user.miestado !== 'string' ? '❌ _' + usedPrefix + 'miestado_' : '_أشعر ' + user.miestado + '_'}
⊜ *مسجل »* ${user.registered === true ? '✅' : '❌ _' + usedPrefix + 'تحقق_'}
⊜ *${lenguajeGB['smsBotonM7']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM7']().slice(1).toLowerCase()} »* ${user.premiumTime > 0 ? '✅' : '❌ _' + usedPrefix + 'بريميوم_'}
⊜ *${lenguajeGB['smsBotonM5']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM5']().slice(1).toLowerCase()} »* ${role}
⊜ *${lenguajeGB['smsBotonM6']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM6']().slice(1).toLowerCase()} »* ${emoji} || ${user.exp - min}/${xp}
⊜ *${lenguajeGB['smsPareja']()}* ${partner ? `\n*»* ${name} 💕 ${conn.getName(partner)}` : `🛐 ${lenguajeGB['smsResultPareja']()}`}
⊜ *الهواية(ات)* ➺ ${user.pasatiempo === 0 ? '*غير مسجل*' : user.pasatiempo + '\n'}
⊜ *الخبرة ➟* ${exp} ⚡
⊜ *الماس ➟* ${limit} 💎
⊜ *GataCoins ➟* ${money} 🐈
⊜ *الرموز ➟* ${joincount} 🪙`.trim()

            const buttonParamsJson = JSON.stringify({
                title: 'عرض القائمة',
                description: 'احصل على المعلومات عبر القنوات الرسمية حول GataBot',
                sections: [
                    {
                        title: 'ℹ️ معلومات',
                        highlight_label: 'شائع',
                        rows: [
                            {
                                header: '✅ الشبكات',
                                title: '🔓 للجميع',
                                description: 'احصل على المعلومات عبر القنوات الرسمية حول GataBot',
                                id: usedPrefix + 'cuentasgb'
                            },
                            { header: '📢 المجموعات/القنوات', title: '🔓 للجميع', description: 'نحن في انتظارك!', id: usedPrefix + 'groups' },
                            {
                                header: '🎁 تبرع',
                                title: '🔓 للجميع',
                                description: 'GataBot يظل يعمل بفضل التبرعات. يمكنك أيضًا الانضمام لدعم المشروع!',
                                id: usedPrefix + 'donate'
                            }
                        ]
                    },
                    {
                        title: '🔖 اختصارات',
                        highlight_label: 'شائع',
                        rows: [
                            {
                                header: '🆕 كن بوت (كود)',
                                title: '🔓 للجميع',
                                description: 'كن بوت باستخدام طريقة الكود المكون من 8 أرقام!',
                                id: usedPrefix + 'serbot --code'
                            },
                            { header: '🤖 كن بوت (QR)', title: '🔓 للجميع', description: 'الطريقة القياسية لتصبح بوت مع كود QR', id: usedPrefix + 'serbot' },
                            {
                                header: '🚄 السرعة',
                                title: '🔓 للجميع',
                                description: 'اختر هذا إذا كنت تريد معرفة بينغ البوت',
                                id: usedPrefix + 'ping'
                            },
                            { header: '😺 الحالة', title: '🔓 للجميع', description: 'اعرف حالة GataBot', id: usedPrefix + 'status' }
                        ]
                    },
                    {
                        title: 'Ⓜ️ القائمة',
                        highlight_label: 'شائع',
                        rows: [{ header: '⭐ القائمة الكاملة', title: '', description: 'زور جميع الأوامر', id: usedPrefix + 'allmenu' }]
                    }
                ]
            })
            const interactiveMessage = {
                body: { text: menu },
                footer: { text: wm + ` \nإذا كان شيء لا يعمل استخدم الأمر *${usedPrefix}menu2*` },
                header: {
                    title: `⭐ *------- القائمة الجديدة -------* ⭐\n${lenguajeGB['smsConfi2']()} *${user.genero === 0 ? '👤' : user.genero == 'مخفي 🕶️' ? '🕶️' : user.genero == 'أنثى 🚺' ? '🚺' : user.genero == 'ذكر 🚹' ? '🚹' : '👤'} ${user.registered === true ? user.name : taguser} 💖*`,
                    subtitle: 'test4',
                    hasMediaAttachment: false
                },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: 'single_select',
                            buttonParamsJson
                        }
                    ]
                }
            }
            const message = { messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 }, interactiveMessage }
            await conn.relayMessage(m.chat, { viewOnceMessage: { message } }, {})
        } else {
            let menu =
                `${lenguajeGB['smsConfi2']()} *${user.genero === 0 ? '👤' : user.genero == 'مخفي 🕶️' ? '🕶️' : user.genero == 'أنثى 🚺' ? '🚺' : user.genero == 'ذكر 🚹' ? '🚹' : '👤'} ${user.registered === true ? user.name : taguser} 💖*

⎔ \`\`\`${scheduleDate}\`\`\`
⎔ *${lenguajeGB['smsTotalUsers']()}* ➺ _${Object.keys(global.db.data.users).length}_ 
⎔ *المسجلون »* ${rtotalreg}/${totalreg}    
⎔ *${lenguajeGB['smsUptime']()}* ➺ _${uptime}_ 
⎔ *${lenguajeGB['smsVersion']()}* ➺ _${vs}_
⎔ *${lenguajeGB['smsMode']()} ➺* _${global.opts['self'] ? `${lenguajeGB['smsModePrivate']().charAt(0).toUpperCase() + lenguajeGB['smsModePrivate']().slice(1).toLowerCase()}` : `${lenguajeGB['smsModePublic']().charAt(0).toUpperCase() + lenguajeGB['smsModePublic']().slice(1).toLowerCase()}`}_
⎔ *${lenguajeGB['smsBanChats']()}* ➺ _${Object.entries(global.db.data.chats).filter((chat) => chat[1].isBanned).length}_ 
⎔ *${lenguajeGB['smsBanUsers']()}* ➺ _${Object.entries(global.db.data.users).filter((user) => user[1].banned).length}_ ${(conn.user.jid == global.conn.user.jid ? '' : `\n⎔ *أنا بوت فرعي لـ: https://wa.me/${global.conn.user.jid.split`@`[0]}*`) || ''}

✨ *◜معلومات المستخدم◞* ✨
⊜ *نوع التسجيل »* ${user.registered === true ? `_${user.registroC === true ? 'تسجيل كامل 🗂️' : 'تسجيل سريع 📑'}_` : '❌ _بدون تسجيل_'}
⊜ *حالتي »* ${typeof user.miestado !== 'string' ? '❌ _' + usedPrefix + 'miestado_' : '_أشعر ' + user.miestado + '_'}
⊜ *مسجل »* ${user.registered === true ? '✅' : '❌ _' + usedPrefix + 'تحقق_'}
⊜ *${lenguajeGB['smsBotonM7']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM7']().slice(1).toLowerCase()} »* ${user.premiumTime > 0 ? '✅' : '❌ _' + usedPrefix + 'بريميوم_'}
⊜ *${lenguajeGB['smsBotonM5']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM5']().slice(1).toLowerCase()} »* ${role}
⊜ *${lenguajeGB['smsBotonM6']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM6']().slice(1).toLowerCase()} »* ${emoji} || ${user.exp - min}/${xp}
⊜ *${lenguajeGB['smsPareja']()}* ${partner ? `\n*»* ${name} 💕 ${conn.getName(partner)}` : `🛐 ${lenguajeGB['smsResultPareja']()}`}
⊜ *الهواية(ات)* ➺ ${user.pasatiempo === 0 ? '*غير مسجل*' : user.pasatiempo + '\n'}
⊜ *الخبرة ➟* ${exp} ⚡
⊜ *الماس ➟* ${limit} 💎
⊜ *GataCoins ➟* ${money} 🐈
⊜ *الرموز ➟* ${joincount} 🪙

*╭━〔 🐈 خيارات القائمة 🐈 〕⬣*
┃
┃Ⓜ️ _*القائمة الكاملة*_ Ⓜ️
┃➺ _${usedPrefix}menucompleto | allmenu_
┃
┃🔊 _*قائمة الصوتيات*_ 🔊
┃➺ _${usedPrefix}menuaudio | menuaudios_
┃
┃💫 _${lenguajeGB['smsTex13']()}_ 💫
┃➺ _${usedPrefix}infomenu_
┃
┃👾 _${lenguajeGB['smsTex10']()}_ 👾
┃➺ _${usedPrefix}juegosmenu_
┃
┃🚀 _${lenguajeGB['smsTex9']()}_ 🚀
┃➺ _${usedPrefix}descargasmenu_
┃
┃🔐 _${lenguajeGB['smsTex11']()}_ 🔐
┃➺ _${usedPrefix}grupomenu_
┃
┃🧸 _${lenguajeGB['smsTex22']()}_ 🧸
┃➺ _${usedPrefix}stickermenu_
┃
┃🛠️ _${lenguajeGB['smsTex12']()}_ 🛠️
┃➺ _${usedPrefix}herramientasmenu_
┃
┃⛩️ _${lenguajeGB['smsTex23']()}_ ⛩️
┃➺ _${usedPrefix}randommenu_
┃
┃🛰️ _${lenguajeGB['smsTex8']()}_ 🛰️
┃➺ _${usedPrefix}convertidormenu_
┃
┃🎈 _${lenguajeGB['smsTex1']()}_🎈
┃➺ _${usedPrefix}buscarmenu_
┃
┃🎧 _${lenguajeGB['smsTex2']()}_ 🎧
┃➺ _${usedPrefix}audioefectomenu_
┃
┃🔞 _${lenguajeGB['smsTex3']()}_ 🔞
┃➺ _${usedPrefix}menu18 | hornymenu_
┃
┃⚗️ _${lenguajeGB['smsTex21']()}_ ⚗️
┃➺ _${usedPrefix}rpgmenu_
┃
┃⛺ _${lenguajeGB['smsTex14']()}_ ⛺
┃➺ _${usedPrefix}makermenu_
┃
┃💮 _${lenguajeGB['smsTex15']()}_ 💮
┃➺ _${usedPrefix}menulogos2_
┃
┃🌅 _${lenguajeGB['smsTex15']()}_ 🌅
┃➺ _${usedPrefix}menulogos2_
┃
┃💎 _${lenguajeGB['smsTex20']()}_ 💎
┃➺ _${usedPrefix}ownermenu_
┃
┃✅ *_الحسابات الرسمية لـ GATABOT_* ✅
┃➺ _${usedPrefix}cuentasgatabot | cuentasgb_
┃
*╰━━━━━━━━━━━━━⬣*`.trim()
            await conn.sendFile(m.chat, gataImg, 'lp.jpg', menu, fkontak, false, {
                contextInfo: {
                    externalAdReply: {
                        mediaUrl: null,
                        mediaType: 1,
                        description: null,
                        title: gt,
                        body: ' 😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 ',
                        previewType: 0,
                        thumbnail: imagen4,
                        sourceUrl: redesMenu
                    }
                }
            })
            await conn.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })
            //conn.sendFile(m.chat, gataVidMenu.getRandom(), 'gata.mp4', menu, fkontak)
        }
    } catch (e) {
        await m.reply(
            lenguajeGB['smsMalError3']() +
            '\n*' +
            lenguajeGB.smsMensError1() +
            '*\n*' +
            usedPrefix +
            `${lenguajeGB.lenguaje() == 'es' ? 'reporte' : 'report'}` +
            '* ' +
            `${lenguajeGB.smsMensError2()} ` +
            usedPrefix +
            command
        )
        console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
        console.log(e)
    }
}

handler.command = /^(menu|اوامر|memu|memú|help|2help|commands|commandos)$/i
//handler.register = true
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':')
}
