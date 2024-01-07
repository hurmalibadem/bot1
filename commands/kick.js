const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Belirtilen kullanıcıyı sunucudan atar.',
  execute(message, args) {
    // Yetkilendirme kontrolü
    if (!message.member.hasPermission('KICK_MEMBERS')) {
      return message.reply('Bu komutu kullanmaya yetkiniz yok.');
    }

    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!target) {
      return message.reply('Lütfen bir kullanıcı etiketleyin veya ID girin.');
    }

    // Kick işlemi
    target.kick();

    const kickEmbed = new MessageEmbed()
      .setTitle('Kullanıcı Atıldı')
      .setDescription(`${target.user.tag} sunucudan atıldı.`)
      .setColor('#ff9900');

    message.channel.send(kickEmbed);
  },
};
