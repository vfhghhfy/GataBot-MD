import fs from 'fs'
import path from 'path'

let tempSelection = {} // 🗂️ لتخزين حالة كل مستخدم مؤقتًا

let handler = async (m, { conn, text }) => {
  const sender = m.sender

  // 🔒 السماح فقط للمطور
  if (!sender.includes('967778668253')) {
    return m.reply('⛔ هذا الأمر خاص بالمطور فقط.')
  }

  const pluginDir = './plugins'
  const files = fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'))

  // 📂 المرحلة 1: عرض قائمة الملفات إذا لم يُرسل نص
  if (!tempSelection[sender]) {
    if (!text) {
      let list = files.map((f, i) => `${i + 1}. ${f}`).join('\n')
      tempSelection[sender] = { stage: 'chooseFile', files }
      return m.reply(`📂 *اختر الملف الذي تريد تعديل أوامره:*\n\n${list}\n\n✏️ أرسل رقم الملف أو اسمه.`)
    }
  }

  // 📂 المرحلة 2: اختيار الملف
  if (tempSelection[sender]?.stage === 'chooseFile' || !tempSelection[sender]) {
    const chosen = isNaN(text) ? text.trim() : files[parseInt(text) - 1]
    const selectedFile = files.find(f => f.toLowerCase() === chosen.toLowerCase()) || chosen

    if (!files.includes(selectedFile)) {
      delete tempSelection[sender]
      return m.reply('⚠️ لم يتم العثور على هذا الملف.')
    }

    const filePath = path.join(pluginDir, selectedFile)
    const content = fs.readFileSync(filePath, 'utf-8')

    // 🔍 البحث عن handler.command بأنماط مختلفة
    const match = content.match(/handler\.command\s*=\s*.*$/m)
    const current = match ? match[0] : '❌ لا يوجد handler.command في هذا الملف.'

    tempSelection[sender] = { stage: 'awaitCommand', file: selectedFile }
    return m.reply(`✅ تم اختيار الملف: *${selectedFile}*\n\n🔍 السطر الحالي:\n\`\`\`${current}\`\`\`\n\n✏️ أرسل الآن *الأمر الجديد* لإضافته.`)
  }

  // ⚙️ المرحلة 3: تعديل handler.command
  if (tempSelection[sender].stage === 'awaitCommand') {
    const file = tempSelection[sender].file
    const filePath = path.join(pluginDir, file)
    const newCommand = text.trim()
    let content = fs.readFileSync(filePath, 'utf-8')

    // 🧠 التعرف على أنماط handler.command (Regex أو Array)
    const regexArray = /handler\.command\s*=\s*\[([^\]]*)\]/
    const regexRegex = /handler\.command\s*=\s*\/\^.*?\$\/i/

    if (regexArray.test(content)) {
      // إضافة للأوامر في المصفوفة
      content = content.replace(regexArray, match => {
        if (match.includes(`'${newCommand}'`) || match.includes(`"${newCommand}"`)) return match
        return match.replace(/\[([^\]]*)\]/, `[$1, '${newCommand}']`)
      })
    } else if (regexRegex.test(content)) {
      // إضافة للأوامر في Regex
      const matchRegex = content.match(regexRegex)
      if (matchRegex[0].includes(newCommand)) {
        delete tempSelection[sender]
        return m.reply(`⚠️ الأمر *${newCommand}* موجود مسبقاً.`)
      }
      content = content.replace(regexRegex, match => match.replace(/(?=\)\$\/i)/, `|${newCommand}`))
    } else {
      delete tempSelection[sender]
      return m.reply('❌ لم يتم العثور على أي سطر يحتوي على `handler.command =` في الملف.')
    }

    // 💾 حفظ التعديل
    fs.writeFileSync(filePath, content)

    // 🔍 عرض السطر بعد التعديل
    const afterEdit = content.match(/handler\.command\s*=\s*.*$/m)
    const newLine = afterEdit ? afterEdit[0] : '⚠️ لم يتم العثور على السطر بعد التعديل.'

    delete tempSelection[sender]

    return m.reply(`✅ *تمت الإضافة بنجاح!*\n\n📄 الملف: *${file}*\n🔹 الأمر المضاف: *${newCommand}*\n\n🧩 السطر بعد التعديل:\n\`\`\`${newLine}\`\`\``)
  }
}

handler.help = ['ضيف']
handler.tags = ['المطور']
handler.command = /^ضيف$/i
handler.owner = true

export default handler
