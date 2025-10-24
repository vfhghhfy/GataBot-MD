import fs from 'fs'
import translate from '@vitalets/google-translate-api'
import moment from 'moment-timezone'
import ct from 'countries-and-timezones'
import { parsePhoneNumber } from 'libphonenumber-js'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
const { levelling } = '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
import chalk from 'chalk'

let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text, command }) => {
if (m.fromMe) return
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
let bot = global.db.data.settings[conn.user.jid] || {}

// إعدادات البوت - Bot Settings
const commandsConfig = [
{
comando: (bot.restrict ? 'off ' : 'on ') + 'restringir , restrict', // تقييد - Restrict
descripcion: bot.restrict ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled',
contexto: 'أذونات للبوت - Permissions for the Bot',
showPrefix: true
},
{
comando: (bot.antiCall ? 'off ' : 'on ') + 'antillamar , anticall', // منع المكالمات - Anti Call
descripcion: bot.antiCall ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled',
contexto: 'منع استقبال المكالمات في البوت - Avoid receiving calls in the Bot',
showPrefix: true
},
{
comando: (bot.temporal ? 'off ' : 'on ') + 'temporal', // مؤقت - Temporary
descripcion: bot.temporal ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled',
contexto: 'دخول البوت مؤقتاً في المجموعات - Bot entry temporarily in groups',
showPrefix: true
},
{
comando: (bot.jadibotmd ? 'off ' : 'on ') + 'serbot , jadibot', // كن بوت - Be Bot
descripcion: bot.jadibotmd ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled',
contexto: 'السماح أو عدم السماح بالبوتات الفرعية في هذا البوت - Allow or not Sub Bots in this Bot',
showPrefix: true
},
{
comando: (bot.antiSpam ? 'off ' : 'on ') + 'antispam', // مضاد السبام - Anti Spam
descripcion: bot.antiSpam ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled',
contexto: 'إعطاء تحذير لممارسة السبام - Give warning for doing Spam',
showPrefix: true
},
{
comando: (bot.antiSpam2 ? 'off ' : 'on ') + 'antispam2', // مضاد السبام 2 - Anti Spam 2
descripcion: bot.antiSpam2 ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled',
contexto: 'تخطي نتيجة الأوامر المتتالية - Skip result of consecutive commands',
showPrefix: true
},
{
comando: (bot.antiPrivate ? 'off ' : 'on ') + 'antiprivado , antiprivate', // مضاد الخاص - Anti Private
descripcion: bot.antiPrivate ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled',
contexto: 'يمنع استخدام هذا البوت في الخاص - Prohibits this Bot from being used in private',
showPrefix: true
},
{
comando: (global.opts['self'] ? 'on ' : 'off ') + 'publico , public', // عام - Public
descripcion: global.opts['self'] ? '❌' + 'معطل || Disabled' : '✅' + 'مفعل || Activated',
contexto: 'السماح للجميع باستخدام البوت - Allow everyone to use the Bot',
showPrefix: true
},
{
comando: (global.opts['autoread'] ? 'off ' : 'on ') + 'autovisto , autoread', // القراءة التلقائية - Auto Read
descripcion: global.opts['autoread'] ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled',
contexto: 'الرسائل المقروءة تلقائياً - Messages read automatically',
showPrefix: true
},
{
comando: (global.opts['gconly'] ? 'off ' : 'on ') + 'sologrupos , gconly', // المجموعات فقط - Groups Only
descripcion: global.opts['gconly'] ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled',
contexto: 'جعله يعمل فقط في المجموعات - Make it work only in groups',
showPrefix: true
},
{
comando: (global.opts['pconly'] ? 'off ' : 'on ') + 'soloprivados , pconly', // الخاص فقط - Private Only
descripcion: global.opts['pconly'] ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled',
contexto: 'جعله يعمل فقط في الخاص - Make it work only in private',
showPrefix: true
},

// إعدادات المجموعة - Group Settings
{
comando: m.isGroup ? (chat.welcome ? 'off ' : 'on ') + 'bienvenida , welcome' : false, // ترحيب - Welcome
descripcion: m.isGroup ? (chat.welcome ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'تعيين الترحيب في المجموعات - Set welcome in groups',
showPrefix: true
},
{
comando: m.isGroup ? (chat.detect ? 'off ' : 'on ') + 'avisos , detect' : false, // إشعارات - Notifications
descripcion: m.isGroup ? (chat.detect ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'إشعارات مهمة في المجموعات - Important notices in groups',
showPrefix: true
},
{
comando: m.isGroup ? (chat.autolevelup ? 'off ' : 'on ') + 'autonivel , autolevelup' : false, // التlevel التلقائي - Auto Level
descripcion: m.isGroup ? (chat.autolevelup ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'الترقية التلقائية للمستوى - Level up automatically',
showPrefix: true
},
{
comando: m.isGroup ? (chat.modoadmin ? 'off ' : 'on ') + 'modoadmin , modeadmin' : false, // وضع الأدمن - Admin Mode
descripcion: m.isGroup ? (chat.modoadmin ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'فقط المشرفين يمكنهم الاستخدام في المجموعة - Only admins can use in group',
showPrefix: true
},

// إعدادات المحادثة - Chat Settings
{
comando: m.isGroup ? (chat.stickers ? 'off ' : 'on ') + 'stickers' : false, // ملصقات - Stickers
descripcion: m.isGroup ? (chat.stickers ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'ملصقات تلقائية في الدردشات - Automatic stickers in chats',
showPrefix: true
},
{
comando: m.isGroup ? (chat.autosticker ? 'off ' : 'on ') + 'autosticker' : false, // الملصقات التلقائية - Auto Sticker
descripcion: m.isGroup ? (chat.autosticker ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'تحويل الوسائط إلى ملصقات تلقائياً - Multimedia to stickers automatically',
showPrefix: true
},
{
comando: m.isGroup ? (chat.reaction ? 'off ' : 'on ') + 'reacciones , reaction' : false, // تفاعلات - Reactions
descripcion: m.isGroup ? (chat.reaction ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'الرد على الرسائل تلقائياً - React to messages automatically',
showPrefix: true
},
{
comando: m.isGroup ? (chat.audios ? 'off ' : 'on ') + 'audios' : false, // صوتيه - Audios
descripcion: m.isGroup ? (chat.audios ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'الصوتيات التلقائية في الدردشات - Automatic audios in chats',
showPrefix: true
},
{
comando: m.isGroup ? (chat.modohorny ? 'off ' : 'on ') + 'modocaliente , modehorny' : false, // وضع ساخن - Horny Mode
descripcion: m.isGroup ? (chat.modohorny ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'أوامر بمحتوى للبالغين - Commands with adult content',
showPrefix: true
},
{
comando: m.isGroup ? (chat.antitoxic ? 'off ' : 'on ') + 'antitoxicos , antitoxic' : false, // مضاد السام - Anti Toxic
descripcion: m.isGroup ? (chat.antitoxic ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'معاقبة/حذف المستخدمين السامين - Punish/delete toxic users',
showPrefix: true
},
{
comando: m.isGroup ? (chat.antiver ? 'off ' : 'on ') + 'antiver , antiviewonce' : false, // مضاد المشاهدة لمرة واحدة - Anti View Once
descripcion: m.isGroup ? (chat.antiver ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'عدم إخفاء رسائل "مرة واحدة" - Do not hide "once only" messages',
showPrefix: true
},
{
comando: m.isGroup ? (chat.delete ? 'off ' : 'on ') + 'antieliminar , antidelete' : false, // مضاد الحذف - Anti Delete
descripcion: m.isGroup ? (chat.delete ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'عرض الرسائل المحذوفة - Show deleted messages',
showPrefix: true
},
{
comando: m.isGroup ? (chat.antifake ? 'off ' : 'on ') + 'antifalsos , antifake' : false, // مضاد المزيفين - Anti Fake
descripcion: m.isGroup ? (chat.antifake ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'حذف المستخدمين المزيفين/الأجانب - Delete fake/foreign users',
showPrefix: true
},
{
comando: m.isGroup ? (chat.antiTraba ? 'off ' : 'on ') + 'antitrabas , antilag' : false, // مضاد التباطؤ - Anti Lag
descripcion: m.isGroup ? (chat.antiTraba ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'إرسال رسالة تلقائية في حالة التباطؤ - Send automatic message in case of lag',
showPrefix: true
},
{
comando: m.isGroup ? (chat.simi ? 'off ' : 'on ') + 'simi' : false, // سيمي - Simi
descripcion: m.isGroup ? (chat.simi ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'سيمي سيجيب تلقائياً - SimSimi will answer automatically',
showPrefix: true
},
{
comando: m.isGroup ? (chat.modoia ? 'off ' : 'on ') + 'ia' : false, // الذكاء الاصطناعي - AI
descripcion: m.isGroup ? (chat.modoia ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'ذكاء اصطناعي تلقائي - Automatic artificial intelligence',
showPrefix: true
},

// إعدادات الروابط - Link Settings
{
comando: m.isGroup ? (chat.antilink ? 'off ' : 'on ') + 'antienlace , antilink' : false, // مضاد الروابط - Anti Link
descripcion: m.isGroup ? (chat.antilink ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'حذف روابط واتساب - Delete WhatsApp links',
showPrefix: true
},
{
comando: m.isGroup ? (chat.antilink2 ? 'off ' : 'on ') + 'antienlace2 , antilink2' : false, // مضاد الروابط 2 - Anti Link 2
descripcion: m.isGroup ? (chat.antilink2 ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'حذف الروابط التي تحتوي على "https" - Delete links containing "https"',
showPrefix: true
},
{
comando: m.isGroup ? (chat.antiTiktok ? 'off ' : 'on ') + 'antitiktok , antitk' : false, // مضاد تيك توك - Anti TikTok
descripcion: m.isGroup ? (chat.antiTiktok ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'حذف روابط تيك توك - Delete TikTok links',
showPrefix: true
},
{
comando: m.isGroup ? (chat.antiYoutube ? 'off ' : 'on ') + 'antiyoutube , antiyt' : false, // مضاد يوتيوب - Anti YouTube
descripcion: m.isGroup ? (chat.antiYoutube ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'حذف روابط يوتيوب - Delete YouTube links',
showPrefix: true
},
{
comando: m.isGroup ? (chat.antiTelegram ? 'off ' : 'on ') + 'antitelegram , antitg' : false, // مضاد تيليجرام - Anti Telegram
descripcion: m.isGroup ? (chat.antiTelegram ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'حذف روابط تيليجرام - Delete Telegram links',
showPrefix: true
},
{
comando: m.isGroup ? (chat.antiFacebook ? 'off ' : 'on ') + 'antifacebook , antifb' : false, // مضاد فيسبوك - Anti Facebook
descripcion: m.isGroup ? (chat.antiFacebook ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'حذف روابط فيسبوك - Delete Facebook links',
showPrefix: true
},
{
comando: m.isGroup ? (chat.antiInstagram ? 'off ' : 'on ') + 'antinstagram , antig' : false, // مضاد انستجرام - Anti Instagram
descripcion: m.isGroup ? (chat.antiInstagram ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'حذف روابط انستجرام - Delete Instagram links',
showPrefix: true
},
{
comando: m.isGroup ? (chat.antiTwitter ? 'off ' : 'on ') + 'antiX' : false, // مضاد X - Anti X
descripcion: m.isGroup ? (chat.antiTwitter ? '✅ ' + 'مفعل || Activated' : '❌ ' + 'معطل || Disabled') : false,
contexto: 'حذف روابط X (تويتر) - Delete X (Twitter) links',
showPrefix: true
}
]

// باقي الكود يبقى كما هو مع الترجمة...
// The rest of the code remains the same with translation...

// وظائف الأوامر - Command Functions
const commandsInfo = [ // معلومات - Information
{comando: 'cuentasgatabot , accounts', descripcion: false, contexto: 'الحسابات الرسمية - Official accounts', showPrefix: true},
{comando: 'grupos , linkgc', descripcion: false, contexto: 'المجموعات الرسمية - Official groups', showPrefix: true},
{comando: 'donar , donate', descripcion: false, contexto: 'ادعم المشروع بالتبرع - Support the project by donating', showPrefix: true},
{comando: 'listagrupos , grouplist', descripcion: false, contexto: 'المجموعات التي أنا فيها - Groups where I am', showPrefix: true},
{comando: 'estado , status', descripcion: false, contexto: 'معلومات عن حالتي - Information about my status', showPrefix: true},
{comando: 'infogata , infobot', descripcion: false, contexto: 'معلومات عن البوت - Information about the Bot', showPrefix: true},
{comando: 'instalarbot , installbot', descripcion: false, contexto: 'معلومات وطرق التثبيت - Information and installation methods', showPrefix: true},
{comando: 'creadora , owner', descripcion: false, contexto: 'معلومات عن مبتكري - Information about my Creator', showPrefix: true},
{comando: 'velocidad , ping', descripcion: false, contexto: 'تحقق من سرعة هذا البوت - Verify the speed of this Bot', showPrefix: true},
{comando: 'Bot', descripcion: false, contexto: 'الرسالة الافتراضية للبوت - Default Bot message', showPrefix: false},
{comando: 'términos y condiciones , terms and conditions', descripcion: false, contexto: 'راجع التفاصيل عند استخدام هذا البوت - Review details when using this Bot', showPrefix: false}
]

const commandsJadiBot = [ // البوتات الفرعية - Sub Bots
{comando: 'serbot , jadibot', descripcion: false, contexto: 'تفعيل أو التحول إلى بوت ثانوي - Reactivate or Become a secondary Bot', showPrefix: true},
{comando: 'serbot --code , jadibot --code', descripcion: false, contexto: 'طلب رمز مكون من 8 أرقام - Request 8-digit code', showPrefix: true},
{comando: 'detener , stop', descripcion: false, contexto: 'التوقف عن كونك بوت فرعي مؤقتاً - Stop being temporarily Sub Bot', showPrefix: true},
{comando: 'bots , listjadibots', descripcion: false, contexto: 'قائمة البوتات الثانوية - List of secondary Bots', showPrefix: true},
{comando: 'borrarsesion , delsession', descripcion: false, contexto: 'حذف بيانات البوت الثانوي - Delete secondary Bot data', showPrefix: true},
{comando: 'bcbot', descripcion: false, contexto: 'إخطار مستخدمي البوتات الفرعية - Notify Sub Bot users', showPrefix: true}
]

const commandsReport = [ // الإبلاغ - Reporting
{comando: 'reporte , report', descripcion: '[نص] || [text]', contexto: 'الإبلاغ عن الأوامر ذات الأخطاء - Report commands with errors', showPrefix: true}
]

const commandsLink = [ // الروابط - Links
{
comando: 'botemporal , addbot', // بوت مؤقت - Temporary Bot
descripcion: '[رابط] [كمية] || [link] [amount]',
contexto: 'إضافة البوت مؤقتاً إلى مجموعة - Add Bot temporarily to a group',
showPrefix: true
}
]

const commandsPrem = [ // بريميوم - Premium
{comando: 'pase premium , pass premium', descripcion: false, contexto: 'الخطط للحصول على بريميوم - Plans to acquire premium', showPrefix: true},
{comando: 'listavip , listprem', descripcion: false, contexto: 'المستخدمون مع وقت بريميوم - Users with premium time', showPrefix: true},
{comando: 'listapremium , listpremium', descripcion: false, contexto: 'قائمة المستخدمين المميزين - List of premium users', showPrefix: true}
]

const commandsGames = [ // ألعاب - Games
{comando: 'matematicas , math', descripcion: '"مبتدئ, متوسط, صعب" || "noob, medium, hard"', contexto: 'عمليات رياضية 🧮 - Mathematical operations', showPrefix: true},
{comando: 'lanzar , launch', descripcion: '"وجه" أو "كتابة" || "cara" o "cruz"', contexto: 'عملة الحظ 🪙 - Luck coin', showPrefix: true},
{comando: 'ppt', descripcion: '"حجر", "ورقة" أو "مقص" || "piedra", "papel" o "tijera"', contexto: 'كلاسيكي 🪨📄✂️ - Classic', showPrefix: true},
{comando: 'ttt', descripcion: '[اسم الغرفة] || [Room name]', contexto: 'ثلاثة في خط/شرطات ❌⭕ - Three in a line/tic-tac-toe', showPrefix: true},
{comando: 'delttt', descripcion: false, contexto: 'إغلاق/مغادرة المباراة 🚪 - Close/leave the game', showPrefix: true},
{comando: 'topgays', descripcion: false, contexto: 'تصنيف المستخدمين المثليين 🏳️‍🌈 - Gay users ranking', showPrefix: true},
{comando: 'topotakus', descripcion: false, contexto: 'تصنيف مستخدمي الأوتاكو 🎌 - Otaku users ranking', showPrefix: true},
{comando: 'toppajer@s', descripcion: false, contexto: 'تصنيف المستخدمين المنحرفين 🥵 - Perverted users ranking', showPrefix: true},
{comando: 'topintegrantes', descripcion: false, contexto: 'أفضل المستخدمين 👑 - Best users', showPrefix: true},
{comando: 'toplagrasa', descripcion: false, contexto: 'المستخدمون الأكثر سخافة XD - Greasiest users', showPrefix: true},
{comando: 'toplind@s', descripcion: false, contexto: 'الأجمل 😻 - The most beautiful', showPrefix: true},
{comando: 'topput@s', descripcion: false, contexto: 'الأكثر عهراً 🫣 - The most promiscuous', showPrefix: true},
{comando: 'toppanafrescos', descripcion: false, contexto: 'الأكثر انتقاداً 🗿 - Those who criticize the most', showPrefix: true},
{comando: 'topshiposters', descripcion: false, contexto: 'الذين يعتقدون أنهم مضحكون 🤑 - Those who think they are funny', showPrefix: true},
{comando: 'topfamosos', descripcion: false, contexto: 'الأكثر شهرة ☝️ - The most famous', showPrefix: true},
{comando: 'topparejas', descripcion: false, contexto: 'أفضل 5 أزواج 💕 - The 5 best couples', showPrefix: true},
{comando: 'gay', descripcion: '[@منشن]', contexto: 'ملف مثلي الجنس 😲 - Gay profile', showPrefix: true},
{comando: 'gay2', descripcion: '[@منشن] أو [اسم] || [@tag] or [name]', contexto: '(%) مثلي الجنس - (%) Gay', showPrefix: true},
{comando: 'lesbiana', descripcion: '[@منشن] أو [اسم] || [@tag] or [name]', contexto: '(%) سحاقية - (%) Lesbian', showPrefix: true},
{comando: 'manca', descripcion: '[@منشن] أو [اسم] || [@tag] or [name]', contexto: '(%) مانكا - (%) Manca', showPrefix: true},
{comando: 'manco', descripcion: '[@منشن] أو [اسم] || [@tag] or [name]', contexto: '(%) مانكو - (%) Manco', showPrefix: true},
{comando: 'pajero', descripcion: '[@منشن] أو [اسم] || [@tag] or [name]', contexto: '(%) منحرف - (%) Pervert', showPrefix: true},
{comando: 'pajera', descripcion: '[@منشن] أو [اسم] || [@tag] or [name]', contexto: '(%) منحرفة - (%) Pervert', showPrefix: true},
{comando: 'puto', descripcion: '[@منشن] أو [اسم] || [@tag] or [name]', contexto: '(%) عاهر - (%) Promiscuous', showPrefix: true},
{comando: 'puta', descripcion: '[@منشن] أو [اسم] || [@tag] or [name]', contexto: '(%) عاهرة - (%) Promiscuous', showPrefix: true},
{comando: 'rata', descripcion: '[@منشن] أو [اسم] || [@tag] or [name]', contexto: '(%) جشع - (%) Greedy', showPrefix: true},
{comando: 'love', descripcion: '[@منشن] أو [اسم] || [@tag] or [name]', contexto: '(%) حب - (%) Love', showPrefix: true},
{comando: 'doxxear', descripcion: '[@منشن]', contexto: 'محاكاة دوكسينج مزيف 🕵️‍♀️ - Simulate fake Doxxing', showPrefix: true},
{comando: 'pregunta', descripcion: '[نص] || [text]', contexto: 'سؤال ❔ وسيجيب - Question ❔ and it will answer', showPrefix: true},
{comando: 'apostar , slot', descripcion: '[كمية] || [amount]', contexto: 'الرهان على الحظ 🎰 - Bet on luck', showPrefix: true},
{comando: 'formarpareja', descripcion: false, contexto: 'يوحد شخصين 💞 - Unites two people', showPrefix: true},
{comando: 'dado', descripcion: false, contexto: 'يرسل نرد عشوائي 🎲 - Sends a random dice', showPrefix: true},
{comando: 'piropo', descripcion: false, contexto: 'إرسال مجاملة 🫢 - Send a compliment', showPrefix: true},
{comando: 'chiste', descripcion: false, contexto: 'يرسل نكات 🤡 - Sends jokes', showPrefix: true},
{comando: 'reto', descripcion: false, contexto: 'سيضع تحدياً 😏 - Will set a challenge', showPrefix: true},
{comando: 'frases', descripcion: '[كمية 1 إلى 99] || [amount 1-99]', contexto: 'يرسل عبارات عشوائية 💐 - Sends random phrases', showPrefix: true},
{comando: 'acertijo', descripcion: false, contexto: 'الرد على رسالة اللغز 👻 - Answer the riddle message', showPrefix: true},
{comando: 'cancion', descripcion: false, contexto: 'خمن الأغنية 🎼 - Guess the song', showPrefix: true},
{comando: 'trivia', descripcion: false, contexto: 'أسئلة بخيارات 💭 - Questions with options', showPrefix: true},
{comando: 'pelicula', descripcion: false, contexto: 'اكتشف الفيلم بالرموز التعبيرة 🎬 - Discover the movie with emojis', showPrefix: true},
{comando: 'adivinanza', descripcion: false, contexto: 'خمن يا عراف 🧞‍♀️ - Guess guesser', showPrefix: true},
{comando: 'ruleta', descripcion: false, contexto: 'حظ غير متوقع 💫 - Unexpected luck', showPrefix: true},
{comando: 'ahorcado', descripcion: false, contexto: 'خمن الكلمات قبل أن يمسكك المشنوق 😱 - Guess the words before the hangman catches you', showPrefix: true},
{comando: 'ruletadelban', descripcion: false, contexto: 'حذف مستخدم عشوائياً، فقط للمشرفين ☠️ - Delete a random user, only for admins', showPrefix: true}
]

const commandsAI = [ // الذكاء الاصطناعي - AI
{comando: 'simi', descripcion: '[نص] || [text]', contexto: 'تحدث مع سيمي - Chat with SimSimi', showPrefix: true},
{comando: 'ia , ai', descripcion: '[نص] || [text]', contexto: 'تكنولوجيا ChatGPT - ChatGPT technology', showPrefix: true},
{comando: 'delchatgpt', descripcion: false, contexto: 'حذف سجل الذكاء الاصطناعي - Delete AI history', showPrefix: true},
{comando: 'iavoz , aivoice', descripcion: '[نص] || [text]', contexto: 'إجابات صوتيه - Audio answers', showPrefix: true},
{
comando: 'calidadimg , qualityimg', // جودة الصورة - Image Quality
descripcion: '(الرد بصورة) || (responds with an image)',
contexto: 'تفاصيل دقة الصورة - Image resolution details',
showPrefix: true
},
{comando: 'dalle', descripcion: '[نص] || [text]', contexto: 'إنشاء صورة من نص - Generate image from text', showPrefix: true},
{comando: 'gemini', descripcion: '[نص] || [text]', contexto: 'ذكاء اصطناعي، تكنولوجيا جوجل - AI, Google technology', showPrefix: true},
{comando: 'geminimg', descripcion: '(صورة) + [نص] || (image) + [text]', contexto: 'ابحث عن معلومات من صورة - Search information from an image', showPrefix: true},
{comando: 'hd', descripcion: '(الرد بصورة) || (responds with an image)', contexto: 'تحسين جودة الصورة - Improve image quality', showPrefix: true}
]

// باقي الكود يبقى كما هو...
// The rest of the code remains the same...
