const { Client } = require('discord.js-selfbot-v13');
const client = new Client({
    checkUpdate: false,
    patchVoice: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
});

const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const OWNER_ID = '1369831885462835252';

const BocchiWaiter = [
    "A... a... chào ạ! M-mời vào ạ...",
    "E-em... em phục vụ nước ở đây nhé... đừng nhìn em...",
    "Chào... mừng... mong quý khách đừng làm ồn ạ...",
    "K-không biết có làm gì sai không... m-mời ngồi ạ...",
    "STARRY... chào... dạ em hơi run...",
    "V-vâng, chào ạ... gọi món thì... gọi em nhé...",
    "Nhạc... nhạc đang lên đấy ạ... m-mời vào ạ...",
    "E-em là nhân viên mới... chào ạ..."
];

const squadStatuses = [
    "Kessoku Band đang tập luyện...",
    "Bocchi đang trốn trong thùng carton...",
    "Nijika đang quản lý Starry...",
    "Ryo đang tìm tiền mua bass...",
    "Kita đang chụp ảnh sống ảo..."
];

const bandColors = [0xFF9AA2, 0xFFE082, 0x82B1FF, 0xFF8A80];

client.on('ready', () => {
    console.log(`[READY] Bocchi Waiter đã sẵn sàng: ${client.user.tag}`);
    
    setInterval(() => {
        const randomStatus = squadStatuses[Math.floor(Math.random() * squadStatuses.length)];
        client.user.setActivity(randomStatus, { type: 'PLAYING' });
    }, 3 * 60 * 60 * 1000); 

    client.user.setActivity("Starry Bar chào khách!", { type: 'PLAYING' });
});

// Lệnh ahem ẩn danh, chỉ Owner biết
client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase() === 'ahem' && message.author.id === OWNER_ID) {
        try { await message.delete(); } catch (e) {}
        const channel = message.member.voice.channel;
        if (channel) {
            try {
                await channel.setName('Starry™');
            } catch (err) {
                const owner = await client.users.fetch(OWNER_ID);
                await owner.send(`⚠️ **Lỗi đổi tên:** \`\`\`${err.message}\`\`\``);
            }
        }
    }
});

// Thông báo khách vào Voice (Webhook sạch sẽ, không tag)
client.on('voiceStateUpdate', async (oldState, newState) => {
    if (!oldState.channelId && newState.channelId && !newState.member.user.bot) {
        const randomGreeting = BocchiWaiter[Math.floor(Math.random() * BocchiWaiter.length)];
        const randomColor = bandColors[Math.floor(Math.random() * bandColors.length)];

        try {
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'Bocchi Waiter',
                    avatarURL: 'https://i.ibb.co/LDYLdxzc/282817-panickedno.gif',
                    embeds: [{
                        author: { 
                            name: 'Hitori Gotoh (Bocchi) - Starry Bar', 
                            icon_url: 'https://i.ibb.co/LDYLdxzc/282817-panickedno.gif' 
                        },
                        description: `**${newState.member.displayName}**\n\n*${randomGreeting}*`,
                        image: { url: 'https://images.steamusercontent.com/ugc/2462978499899794420/31183CA7507D6DFB6845952964B1262E55E58DDA/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true' },
                        color: randomColor,
                        footer: { text: '...b-bocchi' }
                    }]
                })
            });
        } catch (err) {
            console.error("[ERROR] Webhook failed:", err);
        }
    }
});

client.login(TOKEN);
