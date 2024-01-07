const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'commands',
    description: 'Kullanılabilir komutların ve komut dosyalarının listesini gösterir.',
    execute(message, args) {
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        const commands = [];

        for (const file of commandFiles) {
            const command = require(`./${file}`);
            commands.push({
                name: command.name,
                description: command.description || 'Açıklama bulunmuyor.',
            });
        }

        const embed = new MessageEmbed()
            .setTitle('Mevcut Komutlar')
            .setColor('#0099ff');

        for (const cmd of commands) {
            embed.addField(`**${cmd.name}**`, cmd.description);
        }

        message.channel.send(embed);
    },
};
