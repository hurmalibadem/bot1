module.exports = {
    name: 'olustur',
    description: 'Kanal oluştur komutu',
    execute(message, args) {

        // Gerekli argümanların sağlanıp sağlanmadığını kontrol et
        if (args.length < 3) {
            return message.reply('Yanlış kullanım. Lütfen kategori adı, kanal adları ve türünü belirtin.');
        }

        // Sadece yetkililerin komutu kullanabilmesini sağla
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return message.reply('Bu komutu kullanma izniniz yok.');
        }

        // Mesajın gönderildiği sunucuyu al
        const guild = message.guild;

        // Kategori adını ve kanal isimlerini ve türünü argümanlardan al
        const category = args[0];
        const channelNames = args.slice(1, args.length - 1);
        const channelType = args[args.length - 1].startsWith('type:') ? args[args.length - 1].substring(5) : null;

        // Kategori adı ve kanal türü belirtilmemişse uyarı ver
        if (!category || !channelType) {
            return message.reply('Lütfen kategori adı ve kanal türünü belirtin.');
        }

        // Belirtilen kategori adında bir kategori kanalı var mı kontrol et, yoksa oluştur
        const categoryChannel = guild.channels.cache.find(c => c.type === 'category' && c.name === category);
        if (!categoryChannel) {
            guild.channels.create(category, { type: 'category' })
                .then(createdCategory => {
                    // Kategori oluşturulduysa, kanalları oluştur
                    createChannels(guild, createdCategory, channelNames, channelType);
                })
                .catch(error => {
                    console.error('Kategori oluşturulurken bir hata oluştu:', error);
                });
        } else {
            // Kategori zaten varsa, kanalları doğrudan oluştur
            createChannels(guild, categoryChannel, channelNames, channelType);
        }

        // Kanalların oluşturulmasını sağlayan yardımcı fonksiyon
        function createChannels(guild, category, channelNames, channelType) {
            channelNames.forEach(channelName => {
                guild.channels.create(channelName, { type: channelType, parent: category })
                    .then(createdChannel => {
                        console.log(`Kanal oluşturuldu: ${createdChannel.name}`);
                    })
                    .catch(error => {
                        console.error('Kanal oluşturulurken bir hata oluştu:', error);
                    });
            });

            // Başarı mesajını gönder
            message.channel.send(`Kanal(lar) başarıyla oluşturuldu.`);
        }
    }
};
