# Henzy Self Patlatma v1.0

Discord sunucu temizleme ve spam aracı.

## 🚀 Kurulum

1. **Exe Oluştur:**
   ```
   build-exe.bat
   ```

2. **Config Düzenle:**
   `config.json` dosyasını açın ve bilgileri girin:
   ```json
   {
       "discord_token": "DISCORD_SELF_TOKEN",
       "user_id": "KULLANICI_ID",
       "channel_name": "KANAL_ADI",
       "message_content": "MESAJ_ICERIGI"
   }
   ```

3. **Çalıştır:**
   ```
   start-exe.bat
   ```

## 📋 Komutlar

- `.selam` - Sunucudaki tüm kanalları siler ve spam başlatır

## ⚠️ Uyarı

- Self-token kullanımı Discord ToS'a aykırıdır
- Hesap banlanması riski vardır
- Sadece eğitim amaçlıdır

## 🔒 Güvenlik

- Ana kod exe dosyasında gizlidir
- Reverse engineering korumalıdır
- Çoklu katmanlı koruma sistemi

## 📧 İletişim

- GitHub: https://github.com/henzy
- Email: henzy@github.com

## 📄 Lisans

MIT License
