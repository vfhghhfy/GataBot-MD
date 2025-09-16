// قائمة إيموجيات مميزة وأنيقة
const allowedEmojis = [
  '❤️','💖','💜','🤍',  // قلوب
  '🔥','✨','🌹','⭐'   // طاقة ونار وورد ونجوم
];

// رقم المطور
const ownerNumbers = [
  "967778668253@s.whatsapp.net"  // رقمك مطوّر
];

export async function before(m, { conn }) {
  if (m.isBaileys && m.fromMe) return true;

  // السماح فقط للمطور
  if (!ownerNumbers.includes(m.sender)) return true;

  try {
    // اختيار إيموجي عشوائي من القائمة
    const randomEmoji = allowedEmojis[(Math.random() * allowedEmojis.length) | 0];
    
    await conn.sendMessage(m.chat, {
      react: { text: randomEmoji, key: m.key }
    });

  } catch (error) {
    console.error('Error reacting to message:', error);
  }

  return true;
}
