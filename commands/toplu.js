const Discord = require('discord.js');


module.exports = {
  name: 'toplu',
  description: 'Belirtilen mesajı herkese özel mesaj ve duyuru kanalına gönderir.',
  usage: 'toplu <mesaj>',
  async execute(message, args) {
    
    // Mesaj içeriğini alıyoruz
    const msgContent = args.join(' ');

    // Sunucudaki tüm üyeleri alıyoruz
    const members = message.guild.members.cache;

    // Botların dışındaki üyelere mesaj gönderiyoruz
    let counter = 0;
    let sentCount = 0;

    for (const [, member] of members) {
      // Eğer üye bir bot değilse ve mesaj gönderme izni varsa mesaj gönderiyoruz
      if (!member.user.bot && member.permissions.has('SEND_MESSAGES')) {
        counter++;

        try {
          await member.user.send(msgContent);
          sentCount++;
          console.log(`Özel mesaj gönderildi: ${member.user.tag}`);
        } catch (error) {
          console.error(`Hata: ${member.user.tag} adlı üyeye mesaj gönderilirken bir hata oluştu: ${error}`);
        }
      }
    }

    
    // Geri bildirim olarak mesaj gönderen kişiye bilgi veriyoruz
    const sender = message.member;
    const logChannelId = process.env.toplumesajlogID;
    const logChannel = message.guild.channels.cache.get(logChannelId);

    if (sentCount > 0) {
      logChannel.send(`Toplu özel mesaj gönderildi! Toplam: ${sentCount}\nMesaj: "${msgContent}"\nGönderen: ${sender}`);
    } else {
      logChannel.send("Hiçbir üyeye özel mesaj gönderilemedi.");
    }
  },
};
