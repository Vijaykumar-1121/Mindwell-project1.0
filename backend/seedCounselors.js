const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });
const Counselor = require('./src/models/counselor');

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://admin:admin123@cluster0.mongodb.net/mindwell', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('MongoDB connected for seeding');
    const counselors = [
        { name: 'Dr. Jothishree', specialty: 'Anxiety & Stress Specialist', bio: 'Specializes in helping students manage anxiety, academic stress, and perfectionism using Cognitive Behavioral Therapy.', isDefault: true },
        { name: 'Dr. Vijaykumar', specialty: 'Academic Stress & Burnout', bio: 'Focuses on burnout prevention, time management, and resilience building for university students.', isDefault: true },
        { name: 'Dr. EswarSai', specialty: 'General Counseling', bio: 'Provides a safe space for exploring identity, relationships, and navigating the complexities of young adulthood.', isDefault: true }
    ];

    for (let c of counselors) {
        const exists = await Counselor.findOne({ name: c.name });
        if (!exists) {
            await Counselor.create(c);
            console.log(`Created ${c.name}`);
        } else {
            console.log(`${c.name} already exists`);
        }
    }
    
    console.log('Counselor seeding complete.');
    process.exit(0);
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
});
