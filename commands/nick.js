const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'nick',
  description: 'Belirtilen kullanıcının sunucudaki adını değiştirir.',
  execute(message, args) {
    if (!message.member.hasPermission('KICK_MEMBERS')) {
      return message.reply('Bu komutu kullanmaya yetkiniz yok.');
    }
    const target = message.mentions.members.first();

    if (!target) {
      return message.reply('Lütfen bir kullanıcı etiketleyin.');
    }

    const newNickname = args.slice(1).join(' ');

    if (!newNickname) {
      return message.reply('Yeni kullanıcı adı belirtmelisiniz.');
    }

    // Kullanıcının adını değiştir
    target.setNickname(newNickname)
      .then(updatedUser => {
        const nickChangeEmbed = new MessageEmbed()
          .setTitle('Kullanıcı Adı Değiştirildi')
          .setDescription(`${target.user.tag} kullanıcısının adı "${updatedUser.displayName}" olarak değiştirildi.`)
          .setColor('#009900');

        message.channel.send(nickChangeEmbed);
      })
      .catch(error => {
        console.error('Kullanıcı adı değiştirme işlemi sırasında hata oluştu:', error);
        message.reply('Kullanıcı adı değiştirme işlemi sırasında bir hata oluştu.');
      });
  },
};
