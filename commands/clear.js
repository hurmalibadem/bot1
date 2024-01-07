module.exports = {
    name: 'temizle',
    description: 'Belirtilen sayıda mesajı siler.',
    execute(message, args) {
        // Check if the user has permission to manage messages
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            return message.reply('Bu komutu kullanma izniniz yok.');
        }

        // Parse the number of messages to delete
        const amount = parseInt(args[0]) + 1;

        // Check if the argument is a valid number
        if (isNaN(amount)) {
            return message.reply('Lütfen silinecek geçerli sayıda mesaj belirtin.');
        }

        // Check if the number of messages to delete is within the limit
        if (amount <= 1 || amount > 100) {
            return message.reply('Lütfen 1 ile 99 arasında bir sayı belirtin.');
        }

        // Delete the specified number of messages
        message.channel.bulkDelete(amount, true)
            .then(messages => {
                message.channel.send(`Başarıyla ${messages.size - 1} mesaj silindi.`)
                    .then(msg => {
                        // Automatically delete the success message after 5 seconds
                        setTimeout(() => {
                            msg.delete();
                        }, 5000);
                    });
            })
            .catch(error => {
                console.error(`Mesajlar silinirken hata oluştu: ${error}`);
                message.channel.send('Mesajlar silinirken hata oluştu').then(msg => {
                    // Automatically delete the error message after 5 seconds
                    setTimeout(() => {
                        msg.delete();
                    }, 5000);
                });
            });
    },
};
