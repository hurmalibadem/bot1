const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const express = require('express')
const app = express();
//const moment = require('moment');
require('moment-duration-format');
const { timeZone } = require('moment-timezone');
const moment = require('moment-timezone');
client.login(process.env.token);

console.log(`===================================================`);
console.log(`Bot başlatıldı.`);


/*const port = 3000;
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
  //console.log(`Example app listening at https://nodejs.lickyonlinee.repl.co:${port}`)
})*/




const prefix = "!";
const afkChannelId = '1189322952894844999'; // AFK kanalının ID'si
const notificationChannelId = '1191405644847255613'; // Bildirim gönderilecek kanalın ID'si

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'afk') {
    const reason = args.join(' ');

    // Check if the user is in a voice channel
    if (message.member.voice.channel) {
      // Move the user to the AFK channel
      message.member.voice.setChannel(afkChannelId);

      // Update user's nickname with reason
      const nickname = `${message.member.displayName} [${reason}]`;
      message.member.setNickname(nickname).catch(console.error);

      // Find the notification channel
      const notificationChannel = client.channels.cache.get(notificationChannelId);

      // Check if the notification channel is found and is a text channel
      if (notificationChannel && notificationChannel.type === 'text') {
        // Reply with a confirmation message to the notification channel
        notificationChannel.send(`AFK oldu: ${message.member.displayName} - ${reason}`);
      }
    } else {
      message.reply('Bu komutu kullanabilmek için ses kanalında olmalısınız.');
    }
  }
});

client.on('voiceStateUpdate', (oldState, newState) => {
  // Check if the user is moving from the AFK channel
  if (oldState.channel && oldState.channel.id === afkChannelId) {
    // Reset user's nickname to the original nickname
    const originalNickname = oldState.member.displayName.replace(/\s\[[^\]]*\]/, '');
    oldState.member.setNickname(originalNickname).catch(console.error);
  }
});


const allowedChannelIds = ['1166886474122285056', '1159592180004966533'];

client.on('message', message => {
  // Botun kendi mesajlarını yok sayması
  if (message.author.bot) return;

  // Kanal kontrolü
  if (allowedChannelIds.includes(message.channel.id) && message.content && !message.attachments.size) {
    // Yazı mesajını sil
    message.delete()
      .then(() => {
        // Uyarı mesajını gönder
        message.channel.send('Sadece fotoğraf atabilirsiniz!')
          .then(warningMessage => {
            // Uyarı mesajını 1 dakika sonra sil
            setTimeout(() => {
              warningMessage.delete();
            }, 60000);
          });
      })
      .catch(console.error);
  }
});



const channelIdWithLinks = '1160577093269213234'; // Sadece link atılmasına izin vermek istediğiniz kanal ID'si

let lastMessageTime = {}; // Kullanıcının son mesaj zamanını takip etmek için bir nesne

client.on('message', message => {
  // Botun kendi mesajlarını yok sayması
  if (message.author.bot) return;

  // Belirli kanal kontrolü
  if (message.channel.id === channelIdWithLinks) {
    const currentTime = Date.now();
    const authorId = message.author.id;

    // Kullanıcının son mesaj zamanını kontrol et
    if (lastMessageTime[authorId] && currentTime - lastMessageTime[authorId] < 5000) {
      // Eğer son mesajdan bu yana 5 saniyeden az zaman geçtiyse mesajı sil ve uyarı gönderme
      message.delete()
        .then(() => {
          // Hızlı mesajlar için uyarı gönderme
          message.channel.send('Lütfen biraz yavaşlayın! Bu kanala sadece link atabilirsiniz.')
            .then(warningMessage => {
              // Uyarı mesajını 5 saniye sonra sil
              setTimeout(() => {
                warningMessage.delete();
              }, 5000);
            });
        })
        .catch(console.error);
    } else {
      // Eğer 5 saniyeden fazla zaman geçtiyse mesajı kabul et ve son mesaj zamanını güncelle
      lastMessageTime[authorId] = currentTime;

      // Mesaj içeriğinde sadece link varsa silme işlemi yapılmaz
      if (!isLink(message.content)) {
        // Sadece link içermeyen mesajları sil
        message.delete()
          .then(() => {
            // Uyarı mesajını gönder
            message.channel.send('Bu kanala sadece link atabilirsiniz!')
              .then(warningMessage => {
                // Uyarı mesajını 5 saniye sonra sil
                setTimeout(() => {
                  warningMessage.delete();
                }, 5000);
              });
          })
          .catch(console.error);
      }
    }
  }
});

// Yardımcı fonksiyon: Mesaj içeriğinde link kontrolü yapar
function isLink(content) {
  // Link kontrolü için bir regex kullanabilirsiniz, örneğin:
  const linkRegex = /(http(s)?:\/\/[^\s]+)/g;
  return linkRegex.test(content);
}



client.on('message', message => {
  if (!message.content.startsWith(process.env.prefix) || message.author.bot) return;

  const args = message.content.slice(process.env.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('Komut yürütülürken bir hata oluştu.');
  }
})





client.on('message', message => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  if (content.includes('günaydın') || content.includes('gunaydın')) {
    const responses = [
      'Günaydın! Harika bir gün geçirmenizi dilerim.',
      'Gunaydın, umarım gününüz güzel geçer!',
      'Günaydın! Bugün size şans getirecek bir gün olmasını diliyorum.',
      'Gunaydın! Sizi gülümsetecek bir gün olsun.',
      'Günaydın! Bugün kendinizi iyi hissetmenizi sağlayacak güzel şeyler yaşayın.',
      'Merhaba! Size pozitif enerji dolu bir gün diliyorum.',
      'Günaydın! Yeni güne enerjik bir başlangıç yapın!',
      'Merhaba! Bugün size keyifli anılar getirsin.',
      'Günaydın! Hayallerinizin peşinden koşacağınız bir gün olsun.',
      'Merhaba! Bugün sizi mutlu edecek güzel sürprizlerle dolu olsun.'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    message.reply(randomResponse);
  }
});


client.on('message', message => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  if (
    content.toLowerCase() === 'selamun aleykum' ||
    content.toLowerCase() === 'selamün aleyküm' ||
    content.toLowerCase() === 'sa' ||
    content.toLowerCase() === 'hello' ||
    content.toLowerCase() === 'sa' ||
    content.toLowerCase() === 'sea' ||
    content.toLowerCase() === 'merhaba' ||
    content.toLowerCase() === 'hi'
  ) {
    const responses = [
      'Aleyküm selam!',
      'Ve aleyküm selam!',
      'Aleyküm selam! Nasıl yardımcı olabilirim?',
      'Aleyküm selam! paşam',
      'Aleyküm selam mübarek!'
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    message.reply(randomResponse);
  }
});



const serverId = '1136054174279290920';
const updateIntervalMinutes = 5; // Güncelleme aralığı (dakika cinsinden)
client.on('ready', () => {

  setInterval(updateServerStatus, updateIntervalMinutes * 60 * 1000); // Belirtilen dakika cinsine çevrildi
  updateServerStatus();
});


async function updateServerStatus() {
  const guild = client.guilds.cache.get(serverId);
  if (!guild) return console.log('Sunucu bulunamadı.');

  const totalMembers = guild.members.cache.filter(member => !member.user.bot).size;
  const onlineMembers = guild.members.cache.filter(member => !member.user.bot && member.presence.status !== 'offline').size;
  const maleMembers = guild.roles.cache.get('1159591610485575740').members.filter(member => !member.user.bot).size;
  const femaleMembers = guild.roles.cache.get('1159618289702555738').members.filter(member => !member.user.bot).size;
  const botCount = guild.members.cache.filter(member => member.user.bot).size;

  const channelsInfo = [{
    channelId: '1160541136264384602',
    data: '👥 Toplam Üye: ' + totalMembers
  },
  {
    channelId: '1160541148364939324',
    data: '🟢 Çevrimiçi: ' + onlineMembers
  },
  {
    channelId: '1160541161207894037',
    data: '👨 Erkek Üye: ' + maleMembers
  },
  {
    channelId: '1160541175246246039',
    data: '👩 Kız Üye: ' + femaleMembers
  },
  {
    channelId: '1166484214917648394',
    data: '🤖 Bot Üye: ' + botCount
  },
  {
    channelId: '1160628571082072096',
    data: '💻 Bot Ping: ' + client.ws.ping
  }
  ];

  for (const channelInfo of channelsInfo) {
    const channel = guild.channels.cache.get(channelInfo.channelId);
    if (channel && channel.type === 'voice') {
      try {
        await channel.setName(channelInfo.data);
        //console.log(`==================================`);
        //console.log(`Kanal ismi başarıyla değiştirildi: ${channel.name}`);
        //console.log(`==================================`);
        
      } catch (error) {
        console.error(`Kanal ismi değiştirilirken hata oluştu (${channel.name}):`, error);
      }
    } else {
      console.error(`Kanal bulunamadı: ${channelInfo.channelId}`);
    }
  }
}


client.on('error', console.error); // Discord.js'den gelen hataları konsola yazdırır


const trackedUserId = '463821661029007363';
const ownerUserId = '1060760874312290314';
const statusFilePath = 'onlinestatus.json';

let offlineNotificationSent = false; // Çevrimdışı olduğu bildirimi gönderildi mi?

client.on('presenceUpdate', (oldPresence, newPresence) => {
  const user = client.users.cache.get(trackedUserId);

  if (user && newPresence.userID === trackedUserId) {
    const options = {
      timeZone: 'Europe/Istanbul',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    const currentDate = new Date().toLocaleString('tr-TR', options);

    const sendNotification = (status) => {
      const message = `@${user.username} - ${user.tag} kişisi ${status}. (${currentDate})`;
      const owner = client.users.cache.get(ownerUserId);
      owner.send(message);
    };

    fs.readFile(statusFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading onlinestatus.json:', err);
        return;
      }

      const onlineStatus = parseInt(data) || 0;

      if (user.presence) {
        if (newPresence.status === 'online' || newPresence.status === 'idle' || newPresence.status === 'dnd') {
          if (onlineStatus !== 1) {
            fs.writeFile(statusFilePath, '1', 'utf8', (err) => {
              if (err) {
                console.error('Error writing onlinestatus.json:', err);
                return;
              }
              offlineNotificationSent = false;
              sendNotification('çevrimiçi oldu');
            });
          }
        } else if (newPresence.status === 'offline') {
          if (onlineStatus !== 2) {
            fs.writeFile(statusFilePath, '2', 'utf8', (err) => {
              if (err) {
                console.error('Error writing onlinestatus.json:', err);
                return;
              }
              offlineNotificationSent = true;
              sendNotification('çevrimdışı oldu');
            });
          }
        }
      }
    });
  }
});

// Her 10 saniyede bir onlinestatus.json dosyasını kontrol et ve güncelle
setInterval(() => {
  const user = client.users.cache.get(trackedUserId);

  if (user && user.presence) {
    fs.readFile(statusFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading onlinestatus.json:', err);
        return;
      }

      const onlineStatus = parseInt(data) || 0;
      const newPresence = user.presence;

      if (newPresence.status === 'online' || newPresence.status === 'idle' || newPresence.status === 'dnd') {
        if (onlineStatus !== 1) {
          fs.writeFile(statusFilePath, '1', 'utf8', (err) => {
            if (err) {
              console.error('Error writing onlinestatus.json:', err);
              return;
            }
            console.log('Kullanıcı çevrimiçi.');
          });
        }
      } else if (newPresence.status === 'offline') {
        if (onlineStatus !== 2) {
          fs.writeFile(statusFilePath, '2', 'utf8', (err) => {
            if (err) {
              console.error('Error writing onlinestatus.json:', err);
              return;
            }
            console.log('Kullanıcı çevrimdışı.');
          });
        }
      }
    });
  }
}, 5000); // 10 saniyede bir kontrol et



client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

console.log('Komutlar yükleniyor...');

for (const file of commandFiles) {
  try {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`[==="${command.name}" komutu yüklendi.===]`);
    
  } catch (error) {
    console.error(`"${file}" dosyası yüklenirken hata oluştu: ${error.message}`);
  }
}

// Komutları alfabetik sırala (A'dan Z'ye)
client.commands = new Discord.Collection(
  [...client.commands.entries()].sort((a, z) => a[0].localeCompare(z[0]))
);

console.log('Komutlar yüklendi.');

console.log(`================================================================`);


client.on('message', async (message) => {
    if (message.content === '!ping') {
        message.reply('Hesaplanıyor, lütfen bekleyin...').then(async (sentMessage) => {
            const botPing = await calculatePing(sentMessage.createdTimestamp);
            const discordApiPing = client.ws.ping;
            const databaseResponseTime = await calculatePingFromDatabase(); // Bu fonksiyonu kendi veritabanı ping işleminize uygun şekilde doldurun
            const otherPing = await calculateOtherPing(); // Diğer ping değerlerini uygun şekilde hesaplayın

            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Ping Değerleri')
                .setDescription('İşte anlık ping değerleri:')
                .addField('Bot gecikmesi', `${botPing}ms`, true)
                .addField('Discord API gecikmesi', `${discordApiPing}ms (Shard ${client.ws.shards.get(0).id})`, true)
                .addField('Veritabanı yanıt süresi', `${databaseResponseTime}ms`, true)
                .addField('Diğer ping', `${otherPing}ms`, true);

            sentMessage.edit(embed);
        });
    }
});

function calculatePing(sentTimestamp) {
    return new Promise(resolve => {
        const currentTime = Date.now();
        resolve(currentTime - sentTimestamp);
    });
}

function calculatePingFromDatabase() {
    // Veritabanı ping hesaplama kodunu burada gerçekleştirin ve sonucu döndürün
    return new Promise(resolve => {
        // Örnek olarak 50ms'lik bir değeri döndürdük
        resolve(50);
    });
}

function calculateOtherPing() {
    // Diğer ping hesaplama kodunu burada gerçekleştirin ve sonucu döndürün
    return new Promise(resolve => {
        // Örnek olarak 30ms'lik bir değeri döndürdük
        resolve(30);
    });
}



const BOT_OWNER_ID = '1060760874312290314'; // Bot sahibinin kullanıcı ID'si



client.on('message', async (message) => {
  // Eğer mesaj bir DM mesajı ise ve botun sahibi veya botun kendisi tarafından gönderilmemişse
  if (message.channel.type === 'dm' && message.author.id !== client.user.id && message.author.id !== BOT_OWNER_ID) {
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Yeni DM Mesajı')
      .setDescription(message.content)
      .setAuthor(`Gönderen: ${message.author.username}#${message.author.discriminator}`, message.author.avatarURL())
      .setURL(`https://discordapp.com/users/${message.author.id}`)
      .setTimestamp();

    // Belirtilen kullanıcıya embedli mesajı gönder
    const owner = await client.users.fetch(BOT_OWNER_ID);
    owner.send(embed)
      .then(() => {
        console.log('DM mesajı başarıyla gönderildi.');
      })
      .catch((error) => {
        console.error(`DM mesajı gönderirken hata oluştu: ${error}`);
      });
  }
});


const sunucuID = '1188953978864681051'; // Sunucu ID'si
const hedefSesKanalID = '1189322952894844999'; // Hedef ses kanalı ID'si
const bilgiKanalID = '1191444163573600316'; // Bilgi mesajlarının gönderileceği kanal ID'si
const afkKanalID = '1189322952894844999'; // AFK kanalı ID'si
const timerSure = 120000; // Timer süresi (milisaniye cinsinden), örneğin 120000 = 2 dakika

const afkMesajGonderildi = {}; // Her kullanıcı için bir kere gönderildi kontrolü

client.on('ready', () => {
   

    // Bot yeniden başladığında sesi kapalı olan kullanıcıları kontrol et
    const sunucu = client.guilds.cache.get(sunucuID);
    const kapaliMikrofonKullanicilar = [];

    sunucu.members.cache.forEach((kullanici) => {
        if (kullanici.voice && kullanici.voice.mute && !kullanici.user.bot) {
            // Eğer kişi AFK kanalında değilse (1189322952894844999), kontrolü yap
            if (kullanici.voice.channel.id !== afkKanalID) {
                kapaliMikrofonKullanicilar.push(kullanici.user.tag);
                startTimerForUser(kullanici);
            }
        }
    });

    if (kapaliMikrofonKullanicilar.length === 0) {
        console.log("Mükemmel, herkes aktif!");
    } else {
        console.log("Mikrofonu kapalı olan kullanıcılar:");
        console.log(kapaliMikrofonKullanicilar.join('\n'));
        console.log("Timer başladı.");
    }
});

client.on('voiceStateUpdate', (eskiDurum, yeniDurum) => {
    const sunucu = client.guilds.cache.get(sunucuID);

    if (yeniDurum.guild.id === sunucuID && !yeniDurum.member.user.bot) {
        const hedefSesKanal = sunucu.channels.cache.get(hedefSesKanalID);
        const bilgiKanal = sunucu.channels.cache.get(bilgiKanalID);
        const afkKanal = sunucu.channels.cache.get(afkKanalID);

        if (yeniDurum.channel && yeniDurum.channel.id !== afkKanalID) {
            const kullanici = sunucu.members.cache.get(yeniDurum.id);

            // Eğer kişi AFK kanalındaysa, kontrolü geç ve işlem yapma
            if (yeniDurum.channel.id === afkKanalID) {
                return;
            }

            if (kullanici.voice.mute) {
                console.log(`${kullanici.user.tag} kişisi mikrofonunu kapattı ve timer başladı.`);
                startTimerForUser(kullanici);
            } else {
                afkMesajGonderildi[kullanici.id] = false;
            }
        }
    }
});




function startTimerForUser(kullanici) {
    setTimeout(() => {
        if (kullanici.voice && kullanici.voice.mute) {
            const hedefSesKanal = kullanici.guild.channels.cache.get(hedefSesKanalID);
            kullanici.voice.setChannel(hedefSesKanal);

            if (!afkMesajGonderildi[kullanici.id]) {
                // Kullanıcıya özel mesaj atma
                kullanici.send(`AFK olduğunuz için ${hedefSesKanal.name} kanalına taşındınız.`);

                // Bilgi kanalına mesaj gönderme
                const bilgiKanal = kullanici.guild.channels.cache.get(bilgiKanalID);
                bilgiKanal.send(`${kullanici.user.tag} kişisi mikrofonunu 2 dakika boyunca kapattığı için otomatik olarak AFK durumuna geçti ve ${hedefSesKanal.name} kanalına taşındı.`);

                afkMesajGonderildi[kullanici.id] = true;
            }
        }
    }, timerSure);
}



const channelId1231 = '1188953978864681057'; // Ses kanalının ID'si
let connection;

client.on('ready', () => {
    console.log('Bot başladı!');
    joinVoiceChannel(); // Bot başladığında ses kanalına katıl
});

client.on('voiceStateUpdate', (oldState, newState) => {
    const newUserChannel = newState.channel;
    const oldUserChannel = oldState.channel;

    // Eğer ses kanalında değişiklik varsa
    if (newUserChannel !== oldUserChannel) {
        // Eğer yeni kanal varsa ve botun olduğu kanal ise
        if (newUserChannel && newUserChannel.id === channelId1231) {
            console.log('Bot zaten ses kanalında.');
            return; // Kanal zaten doğru kanalda, hiçbir işlem yapma
        }

        // Diğer durumlarda, yeni bir kanala katılan kullanıcı varsa veya bir kullanıcı kanaldan ayrılıyorsa
        if (newUserChannel) {
            console.log(`${newState.member.displayName} kanala katıldı.`);
        } else if (oldUserChannel) {
            console.log(`${oldState.member.displayName} kanaldan ayrıldı.`);
        }

        // Tekrar ses kanalına katılma işlemini gerçekleştir
        joinVoiceChannel();
    }
});

function joinVoiceChannel() {
    const channel = client.channels.cache.get(channelId1231);

    if (channel && channel.type === 'voice') {
        channel.join()
            .then(newConnection => {
                connection = newConnection;
              connection.voice.setSelfDeaf(true);
              connection.voice.setSelfMute(true);
                console.log(`Joined ${channel.name}`);
                console.log('Bot ses kanalında');

                // Mikrofonu ve hoparlörü kapalı tut
                connection.voice.setSelfDeaf(true);
                connection.voice.setSelfMute(true);
            })
            .catch(error => {
              //  console.error('Ses kanalına bağlanırken bir hata oluştu:', error);
            });
    } else {
        console.error(`Channel with ID ${channelId1231} not found or not a voice channel.`);
    }
}
