const { exec } = require("child_process");

module.exports = {
  name: "restart1",
  description: "Botu yeniden başlatır.",
  execute(message) {
    if (message.author.id !== "1060760874312290314") {
      return message.reply("Bu komutu kullanma izniniz yok!");
    }

message.channel.send("Bot yeniden başlatılıyor...").then(() => {
      const restartProcess = exec("nodemon bot.js");

      restartProcess.stdout.on("data", (data) => {
        console.log(`Çıktı: ${data}`);
        
      });

      restartProcess.stderr.on("data", (data) => {
        console.error(`Hata çıktısı: ${data}`);
      });

      restartProcess.on("close", (code) => {
        console.log(`Child process kodu: ${code}`);
        message.channel.send(`Bot yeniden başlatıldı!123`);
      });
    });
  },
};