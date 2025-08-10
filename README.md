# Henzy Self Patlatma

Discord sunucu temizleme ve spam aracı.

## Kurulum

1. Node.js kurulu olmalı
2. `npm install discord.js-selfbot-v13` komutunu çalıştır
3. `index.js` dosyasındaki değişkenleri doldur:
   - `DISCORD_TOKEN`: Discord self-token
   - `USER_ID`: Komutu kullanacak kişinin ID'si
   - `CHANNEL_NAME`: Oluşturulacak kanal adı
   - `MESSAGE_CONTENT`: Gönderilecek mesaj

## Kullanım

1. `node index.js` ile çalıştır
2. Discord'da `.selam` komutunu kullan
3. Tool otomatik olarak:
   - Tüm üyeleri atar
   - Tüm kanalları siler
   - Sürekli yeni kanal oluşturur
   - Her kanala mesaj gönderir

## Özellikler

- Hızlı üye atma
- Toplu kanal silme
- Sürekli kanal oluşturma
- Otomatik mesaj gönderme
- Rate limit koruması
- Akıllı hız kontrolü

## Dikkat

Self-token kullanımı Discord ToS'a aykırıdır. Hesap banlanma riski vardır.
