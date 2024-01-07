const fs = require('fs');
const path = require('path');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

module.exports = {
    name: 'link',
    description: 'Sunucu için kalıcı davet linki oluşturur veya mevcut kalıcı davet linkini gösterir.',
    execute(message) {
        let inviteLinks;
        const filePath = path.join(__dirname, '../invitelink.json'); // invitelink.json dosyasının tam yolu

        try {
            // invitelink.json dosyasını oku, eğer dosya yoksa {} olarak başlat
            inviteLinks = require(filePath);
        } catch (error) {
            inviteLinks = {};
            console.log('invitelink.json dosyası oluşturuldu.'); // Dosya oluşturulduğuna dair log mesajı
        }

        let guildId = message.guild.id;

        function isValidInvite(invite) {
            // Davet linkini doğrulamak için burada uygun bir kontrol yapabilirsiniz
            // Bu örnekte sadece null veya undefined olup olmadığını kontrol ediyoruz
            return invite !== null && invite !== undefined;
        }

        if (inviteLinks[guildId] && isValidInvite(inviteLinks[guildId])) {
            // Mevcut davet linki varsa, Discord API üzerinden kontrol et
            client.fetchInvite(inviteLinks[guildId])
                .then(invite => {
                    if (invite && invite.expiresTimestamp > Date.now()) {
                        // Davet linki geçerli ise, mevcut davet linkini göster
                        message.reply('Mevcut kalıcı davet linki: ' + inviteLinks[guildId]);
                    } else {
                        // Davet linki geçersiz ise, yeni davet oluştur ve json dosyasını güncelle
                        createNewInvite(message, inviteLinks, filePath, guildId);
                    }
                })
                .catch(() => {
                    // Davet linki geçersiz ise, yeni davet oluştur ve json dosyasını güncelle
                    createNewInvite(message, inviteLinks, filePath, guildId);
                });
        } else {
            // Davet linki yoksa, yeni davet oluştur ve json dosyasını güncelle
            createNewInvite(message, inviteLinks, filePath, guildId);
        }
    }
};

function createNewInvite(message, inviteLinks, filePath, guildId) {
    message.channel
        .createInvite({
            maxAge: 0,
            maxUses: 0
        })
        .then(invite => {
            inviteLinks[guildId] = invite.url;
            fs.writeFileSync(filePath, JSON.stringify(inviteLinks, null, 2));
            message.reply('Yeni kalıcı davet linki oluşturuldu: ' + invite.url);
        })
        .catch(console.error);
}

