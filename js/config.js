// ==========================================
// BACKEND CONFIGURATION - CHANGE THIS URL
// ==========================================
// Yahan apna Railway backend URL daalein
// Example: const API_URL = 'https://your-app.up.railway.app';
const API_URL = 'https://portfolio-backend-production-0feb.up.railway.app/'; // <-- YEH LINE UPDATE KAREIN

// Agar API_URL khali hai toh demo mode chalega
const IS_DEMO = !API_URL;

// Demo data for preview
const DEMO_PROJECTS = [
    { id: '1', title: 'AI Chat Bot Website', link: 'https://example.com', banner: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', category: 'AI' },
    { id: '2', title: 'E-Commerce Store', link: 'https://example.com', banner: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', category: 'Business' },
    { id: '3', title: 'Social Media Dashboard', link: 'https://example.com', banner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', category: 'Dashboard' },
    { id: '4', title: 'Portfolio Generator', link: 'https://example.com', banner: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', category: 'Tool' },
    { id: '5', title: 'Weather App', link: 'https://example.com', banner: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800', category: 'App' },
    { id: '6', title: 'Crypto Tracker', link: 'https://example.com', banner: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800', category: 'Finance' }
];

const DEMO_SETTINGS = {
    siteName: "Shadow Official",
    currentTheme: "cyberpunk",
    about: {
        name: "Shadow Developer",
        title: "Full Stack Web Developer",
        description: "Passionate web developer specializing in modern, responsive websites and web applications. I create stunning digital experiences with cutting-edge technologies.",
        email: "shadow@example.com",
        location: "Pakistan"
    },
    social: {
        whatsapp: "+92-XXX-XXXXXXX",
        telegram: "@shadowofficial",
        whatsappChannel: "https://whatsapp.com/channel/shadow",
        telegramChannel: "https://t.me/shadowchannel",
        youtube: "https://youtube.com/@shadowofficial"
    },
    contact: {
        phone: "+92-XXX-XXXXXXX"
    }
};