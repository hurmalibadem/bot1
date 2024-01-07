const fs = require('fs');

module.exports = {
  name: 'restore',
  description: 'Restore a backup of the server',
  execute(message, args) {
    if (message.author.id !== message.guild.ownerID) {
      return message.reply('Only the server owner can use this command.');
    }

    fs.readFile('backup.json', (err, data) => {
      if (err) {
        console.error('Error reading backup file:', err);
        return message.reply('Failed to restore server backup.');
      }

      try {
        const { serverName, channels, roles } = JSON.parse(data);
        const existingChannels = message.guild.channels.cache;
        const existingRoles = message.guild.roles.cache;

        channels.forEach(channelData => {
          if (!existingChannels.some(existingChannel => existingChannel.id === channelData.id)) {
            message.guild.channels.create(channelData.name, { type: channelData.type })
              .then(createdChannel => {
                const channelPermissions = channelData.permissionOverwrites.map(permission => ({
                  id: permission.id,
                  allow: permission.allow,
                  deny: permission.deny
                }));
                createdChannel.overwritePermissions(channelPermissions);
              })
              .catch(console.error);
          }
        });

        roles.forEach(roleData => {
          if (!existingRoles.some(existingRole => existingRole.id === roleData.id)) {
            message.guild.roles.create({
              data: {
                name: roleData.name,
                color: roleData.color,
                permissions: roleData.permissions
              }
            })
              .catch(console.error);
          }
        });

        message.reply('Server backup restored successfully!');
      } catch (err) {
        console.error('Error restoring backup:', err);
        message.reply('Failed to restore server backup.');
      }
    });
  },
};
          