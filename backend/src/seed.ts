import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Prompt from './models/Prompt';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const dummyUsers = [
    {
        username: 'DesignWizard',
        email: 'wizard@example.com',
        password: 'password123',
        bio: 'Creating magical UI/UX prompts for everyone.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop'
    },
    {
        username: 'AIEthusiast',
        email: 'ai@example.com',
        password: 'password123',
        bio: 'Exploring the boundaries of LLMs and generative art.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
        username: 'CodeCracker',
        email: 'code@example.com',
        password: 'password123',
        bio: 'Python developer by day, prompt engineer by night.',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop'
    }
];

const dummyPrompts = [
    {
        title: 'Cyberpunk Neon Street',
        modelUsed: 'Midjourney',
        promptText: 'A rainy cyberpunk street in Tokyo, neon signs reflecting on puddles, cinematic lighting, 8k resolution, highly detailed, futuristic city vibe.',
        tags: ['cyberpunk', 'neon', 'art'],
        outputImage: 'https://images.unsplash.com/photo-1605142859862-978be7eba909?w=800'
    },
    {
        title: 'Python Web Scraper',
        modelUsed: 'GPT-4',
        promptText: 'Write a robust Python script using BeautifulSoup and Requests to scrape news headlines from a specific website and save them to a CSV file.',
        tags: ['coding', 'python', 'automation'],
        outputText: 'import requests\nfrom bs4 import BeautifulSoup\nimport csv\n\n# Your scraping logic here...'
    },
    {
        title: 'Minimalist Interior Design',
        modelUsed: 'Stable Diffusion',
        promptText: 'A minimalist living room with large windows, natural sunlight, wooden floors, Scandinavian furniture, white walls, hyper-realistic, 4k.',
        tags: ['interior', 'minimalism', 'design'],
        outputImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41fa6fbb?w=800'
    },
    {
        title: 'Emotional Intelligence Essay',
        modelUsed: 'Claude 3',
        promptText: 'Write a 500-word essay on the importance of emotional intelligence in modern leadership and how it affects team productivity.',
        tags: ['essay', 'writing', 'leadership'],
        outputText: 'Emotional intelligence (EQ) is the ability to understand and manage your own emotions...'
    }
];

const seedDatabase = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        if (!MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env file');
        }

        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // 1. Generate 25 Users
        const usernames = [
            'DesignKing', 'ArtMaster', 'CodeNinja', 'PromptQueen', 'VisualWizard',
            'CreativeMind', 'TechGuru', 'PixelPerfect', 'DataScientist', 'AIFanatic',
            'MidnightCoder', 'SkylineArt', 'OceanBreeze', 'MountainMan', 'StarGazer',
            'LunaLove', 'SolPower', 'EcoWarrior', 'UrbanExplorer', 'NatureLover',
            'GamerPro', 'MusicManiac', 'FilmBuff', 'BookWorm', 'FoodieLife'
        ];

        const bios = [
            'Love exploring AI!', 'Prompt engineering is my passion.', 'Casual artist.',
            'Tech enthusiast and coder.', 'Always learning new things.', 'Digital nomad.',
            'Coffee and code.', 'Graphic designer.', 'Machine learning expert.', 'Hobbyist writer.'
        ];

        const userEmails = usernames.map(u => `${u.toLowerCase()}@example.com`);
        await Prompt.deleteMany({});
        await User.deleteMany({ email: { $in: userEmails } });
        console.log('Cleaned up existing dummy data.');

        const createdUsers = [];
        for (let i = 0; i < usernames.length; i++) {
            const user = await User.create({
                username: usernames[i],
                email: userEmails[i],
                password: 'password123',
                bio: bios[i % bios.length],
                avatar: `https://i.pravatar.cc/150?u=${usernames[i]}`
            });
            createdUsers.push(user);
        }
        console.log(`Created ${createdUsers.length} dummy users.`);

        // 2. Generate 125 Prompts
        const models = ['GPT-4', 'DALL-E 3', 'Midjourney', 'Stable Diffusion', 'Claude 3', 'Llama 3'];
        const titleTemplates = [
            'Realistic {0} in {1}', 'Futuristic {0} concept', 'Abstract {0} art',
            '{0} generator for {1}', '{0} automation script', 'Hyper-realistic {0}'
        ];
        const subjects = [
            'Portrait', 'Landscape', 'Cyberpunk City', 'Interior Design', 'Forest',
            'Space Station', 'Ancient Ruins', 'Mountain Range', 'Underwater World', 'Robot'
        ];
        const modifiers = [
            '8k', 'unreal engine 5', 'cinematic lighting', 'macro photography', 'detailed textures',
            'van gogh style', 'pixel art', 'low poly', 'watercolor', 'sketch'
        ];

        for (let i = 0; i < 125; i++) {
            const author = createdUsers[i % createdUsers.length];
            const model = models[i % models.length];
            const subject = subjects[i % subjects.length];
            const modifier = modifiers[i % modifiers.length];

            const title = titleTemplates[i % titleTemplates.length].replace('{0}', subject).replace('{1}', modifier);
            const promptText = `Generate a ${title} using ${model}. Focused on ${modifier}, high quality, professional results.`;

            const isImageModel = ['Midjourney', 'DALL-E 3', 'Stable Diffusion'].includes(model);

            await Prompt.create({
                author: author._id,
                title,
                modelUsed: model,
                promptText,
                tags: [subject.toLowerCase(), modifier.toLowerCase().split(' ')[0], model.toLowerCase().replace(' ', '')],
                likes: [],
                comments: [],
                outputImage: isImageModel ? `https://picsum.photos/seed/${i}/800/600` : undefined,
                outputText: !isImageModel ? `This is a sample output generated by ${model} for the prompt: "${title}". it includes detailed analysis and relevant information based on the ${modifier} constraints.` : undefined
            });
        }
        console.log('Created 125 dummy prompts.');

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
