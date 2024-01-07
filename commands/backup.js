const fs = require('fs');

module.exports = {
  name: 'backup',
  description: 'Create a backup of the server',
  execute(message, args) {
    if (message.author.id !== '1060760874312290314') {
      return message.reply('Only the server owner can use this command.');
    }

    const backupData = {
      serverName: message.guild.name,
      channels: message.guild.channels.cache.map(channel => channel.toJSON()),
      roles: message.guild.roles.cache.map(role => ({
        name: role.name,
        color: role.color,
        permissions: role.permissions.serialize()
      }))
    };

    fs.writeFile('backup.json', JSON.stringify(backupData), err => {
      if (err) {
        console.error('Error creating backup:', err);
        message.reply('Failed to create server backup.');
      } else {
        message.reply('Server backup created successfully!');
      }
    });
  },
};
