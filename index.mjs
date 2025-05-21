import TelegramBot from 'node-telegram-bot-api';

const token = '7703285441:AAH0CJrBAbg6Zrd0NETLw2EKFJw5olb7nBI';
const adminId = '2115713109';

const bot = new TelegramBot(token, { polling: true });

const messageMap = new Map();

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    // Greating
    if (msg.text && msg.text === '/start') {
        bot.sendMessage(chatId, `Hi ${msg.from.first_name}! 👋\nIf you have any questions, just send them here.`)
        return;
    }

    // Handle user messages
    if (chatId.toString() !== adminId.toString()) {
        const forwarded = await bot.forwardMessage(adminId, chatId, msg.message_id);
        messageMap.set(forwarded.message_id, chatId);
        return;
    }

    // Handle admin replies
    if (msg.reply_to_message) {
        const userId = messageMap.get(msg.reply_to_message.message_id);
        if (!userId) return;

        if (msg.text) {
            bot.sendMessage(userId, msg.text);
        } else if (msg.photo) {
            const photo = msg.photo[msg.photo.length - 1].file_id;
            bot.sendPhoto(userId, photo, { caption: msg.caption });
        } else if (msg.document) {
            bot.sendDocument(userId, msg.document.file_id, { caption: msg.caption });
        } else if (msg.video) {
            bot.sendVideo(userId, msg.video.file_id, { caption: msg.caption });
        } else if (msg.audio) {
            bot.sendAudio(userId, msg.audio.file_id, { caption: msg.caption });
        } else if (msg.voice) {
            bot.sendVoice(userId, msg.voice.file_id);
        } else if (msg.sticker) {
            bot.sendSticker(userId, msg.sticker.file_id);
        }
    }
});
