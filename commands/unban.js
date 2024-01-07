const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'unban',
  description: 'Belirtilen kullanıcının yasağını kaldırır.',
  execute(message, args) {
    // Yetkilendirme kontrolü
    if (!message.member.hasPermission('BAN_MEMBERS')) {
      return message.reply('Bu komutu kullanmaya yetkiniz yok.');
    }

    const userId = args[0];

    if (!userId) {
      return message.reply('Lütfen bir kullanıcının ID\'sini girin.');
    }

    // Unban işlemi
    message.guild.members.unban(userId);

    const unbanEmbed = new MessageEmbed()
      .setTitle('Yasak Kaldırıldı')
      .setDescription(`ID'si ${userId} olan kullanıcının yasağı kaldırıldı.`)
      .setColor('#00ff00');

    message.channel.send(unbanEmbed);
  },
};
