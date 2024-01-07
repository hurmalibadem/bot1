const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Belirtilen kullanıcıyı sunucudan yasaklar.',
  execute(message, args) {
    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!target) {
      return message.reply('Lütfen bir kullanıcı etiketleyin veya ID girin.');
    }

    // Kendi yetkisinden üstün birini banlamaya çalışıyorsa uyarı ver
    if (target.hasPermission('BAN_MEMBERS') || target.user.id === message.author.id) {
      return message.reply('Bu kullanıcıyı banlamak için yetkiniz yok veya kendinizi banlayamazsınız.');
    }

    // Kullanıcıyı banla
    target.ban()
      .then(bannedUser => {
        const banEmbed = new MessageEmbed()
          .setTitle('Kullanıcı Yasaklandı')
          .setDescription(`${bannedUser.user.tag} sunucudan yasaklandı.`)
          .setColor('#ff0000');

        message.channel.send(banEmbed);
      })
      .catch(error => {
        console.error('Ban işlemi sırasında hata oluştu:', error);
        message.reply('Ban işlemi sırasında bir hata oluştu.');
      });
  },
};
