const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'sil',
  description: 'Belirtilen sayıda mesajı siler.',
  execute(message, args) {
    if (message.author.bot) return; // Botların mesajlarına yanıt verme.

    if (args.length !== 1) {
      message.channel.send('Kullanım: `!sil sayi`');
      return;
    }

    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0 || amount > 100) {
      message.channel.send('Geçersiz sayı. Sayı 1 ile 100 arasında olmalıdır.');
      return;
    }

    // Mesajları sil.
    message.channel.bulkDelete(amount + 1) // +1 to include the command message
      .then(() => {
        // Silinen mesajları log olarak gönder.
        const logEmbed = new MessageEmbed()
          .setColor('#ff0000') // Renk
          .setDescription(`${amount} adet mesaj silindi.`); // Log mesajı
        message.channel.send(logEmbed).then(msg => msg.delete({ timeout: 5000 })); // Log mesajını 5 saniye sonra sil
      })
      .catch(error => {
        console.error('Mesajları silerken bir hata oluştu:', error);
        message.channel.send('Mesajları silerken bir hata oluştu.');
      });
  },
};
