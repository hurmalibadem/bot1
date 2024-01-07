const { Message } = require("discord.js");

module.exports = {
  name: "sestasi",
  description: "Belirtilen kullanıcıyı belirtilen ses kanalına taşır veya seste değilse uyarı verir.",
  execute(message) {
    const args = message.content.split(" ");
    const kullanici = message.mentions.members.first();
    const sesKanaliId = args[2];

    if (!kullanici || !sesKanaliId) {
      return message.channel.send("Lütfen geçerli bir kullanıcı ve ses kanalı ID'si belirtin.");
    }

    const sesKanali = message.guild.channels.cache.get(sesKanaliId);

    if (!sesKanali) {
      return message.channel.send("Belirtilen ses kanalı bulunamadı. Lütfen geçerli bir ses kanalı ID'si girin.");
    }

    if (kullanici.voice.channel) {
      kullanici.voice.setChannel(sesKanali)
        .then(() => {
          message.channel.send(`Kullanıcı ${kullanici} başarıyla ${sesKanali} kanalına taşındı.`);
        })
        .catch((error) => {
          console.error(error);
          message.channel.send("Kullanıcıyı belirtilen ses kanalına taşıma sırasında bir hata oluştu.");
        });
    } else {
      message.channel.send(`Kullanıcı ${kullanici} şu anda herhangi bir ses kanalında değil.`);
    }
  },
};
