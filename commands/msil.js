const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'msil',
  description: 'Belirtilen kullanıcının belirtilen sayıda mesajını siler.',
  execute(message, args) {
    if (message.author.bot) return; // Botların mesajlarına yanıt verme.

    if (args.length !== 2) {
      message.channel.send('Kullanım: `!msil @etiket sayi`');
      return;
    }

    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!target || isNaN(amount)) {
      message.channel.send('Geçersiz etiket veya sayı.');
      return;
    }

    // Kullanıcının belirtilen sayıda mesajını sil.
    message.channel.messages.fetch({ limit: amount })
      .then(messages => {
        const userMessages = messages.filter(msg => msg.author.id === target.id);
        message.channel.bulkDelete(userMessages);

        // Silinen mesajları log olarak gönder.
        const logEmbed = new MessageEmbed()
          .setColor('#ff0000') // Renk
          .setDescription(`${target.tag} kullanıcısının ${amount} adet mesajı silindi.`); // Log mesajı
        message.channel.send(logEmbed);
      })
      .catch(error => {
        console.error('Mesajları silerken bir hata oluştu:', error);
        message.channel.send('Mesajları silerken bir hata oluştu.');
      });
  },
};
