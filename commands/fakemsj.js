const { MessageAttachment } = require('discord.js');

module.exports = {
    name: 'fm',
    description: 'Belirtilen kullanıcının adı ve avatarı ile sahte mesaj gönderir.',
    async execute(message, args) {
        // Kullanım: !fakemesaj <kullanıcı_etiketi> <mesaj_metni>
        if (args.length < 2) {
            return message.reply('Yanlış kullanım! Lütfen doğru şekilde kullanın: `!fakemesaj <kullanıcı_etiketi> <mesaj_metni>`');
        }

        // Kullanıcının adını ve avatarını al
        const user = message.mentions.members.first();
        if (!user) {
            return message.reply('Geçerli bir kullanıcı belirtmelisiniz.');
        }

        // Kullanıcının adı ve avatarı ile sahte mesaj oluştur
        const fakeMessage = args.slice(1).join(' ');

        // Kullanıcının gönderdiği komut mesajını sil
        await message.delete();

        // Sahte mesajı oluştur
        const webhook = await message.channel.createWebhook(user.displayName, {
            avatar: user.user.displayAvatarURL({ format: 'png', dynamic: true })
        });

        // Sahte mesajı gönder
        await webhook.send(fakeMessage, {
            username: user.displayName,
            avatarURL: user.user.displayAvatarURL({ format: 'png', dynamic: true }),
        });

        // Webhook'u sil
        await webhook.delete();
    },
};
