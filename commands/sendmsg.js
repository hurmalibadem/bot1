const { Client, Message } = require('discord.js');

module.exports = {
  name: 'sendmsg',
  description: 'Belirtilen kullanıcıya mesaj gönderir.',
  execute(message, args) {
    const targetUserId = args[0];
    const targetUser = message.client.users.cache.get(targetUserId);
    if (!targetUser) return message.reply('Geçerli bir kullanıcı IDsi girin.');

    const messageContent = args.slice(1).join(' ');
    targetUser.send(messageContent)
      .then(() => {
        message.reply(`Mesajınız başarıyla gönderildi: "${messageContent}"`);
      })
      .catch(error => {
        console.error(`Mesaj gönderirken hata oluştu: ${error}`);
        message.reply('Mesaj gönderirken bir hata oluştu.');
      });
  },
};
