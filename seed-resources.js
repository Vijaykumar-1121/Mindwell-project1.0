const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/mindwell-project/backend/.env' });

const Resource = mongoose.model('Resource', new mongoose.Schema({
    title: String,
    type: String,
    topic: String,
    link: String,
    img: String,
    summary: String,
    body: String,
    createdAt: { type: Date, default: Date.now }
}));

const resources = [
    {
        title: 'Understanding & Taming Anxiety',
        type: 'article',
        topic: 'anxiety',
        img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&q=80',
        link: '#',
        summary: 'Learn the science behind anxiety and practical techniques to break the cycle of worry.',
        body: `<h3>What is Anxiety?</h3><p>Anxiety is your body's natural alarm system — a response to stress that evolved to keep us safe from danger. But in today's world, that alarm can go off too often, triggered by exams, social situations, or an uncertain future.</p><h3>The Anxiety Cycle</h3><p>Anxiety feeds on avoidance. When we avoid something that makes us anxious, we get short-term relief — but the anxiety grows stronger over time, because we never learn that we can handle it. Breaking this cycle means gradually approaching what we fear, not running from it.</p><h3>Proven Techniques</h3><p><strong>1. Name It to Tame It:</strong> Simply labelling your emotion ("I notice I am feeling anxious") activates the prefrontal cortex and calms the amygdala — your brain's alarm centre.</p><p><strong>2. The 5-4-3-2-1 Grounding Method:</strong> Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This anchors you in the present moment.</p><p><strong>3. Scheduled Worry Time:</strong> Set aside 15 minutes per day as your designated "worry time." When anxious thoughts arise outside this window, write them down and tell yourself you will address them later. This contains the worry.</p>`
    },
    {
        title: 'The Science of Better Sleep',
        type: 'article',
        topic: 'sleep',
        img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&q=80',
        link: '#',
        summary: 'Why you can\'t just "try harder" to sleep — and what actually works according to neuroscience.',
        body: `<h3>Why Sleep Matters More Than You Think</h3><p>During sleep, your brain's glymphatic system activates — essentially washing away toxic waste products that accumulate during the day. Poor sleep is directly linked to increased anxiety, impaired memory, and reduced emotional regulation.</p><h3>The Two Enemies of Sleep</h3><p><strong>1. Blue Light:</strong> Screens emit blue-wavelength light that suppresses melatonin production by up to 3 hours. Use "Night Mode" after sunset or wear blue-light blocking glasses.</p><p><strong>2. Irregular Schedule:</strong> Your circadian rhythm is anchored by consistent wake times. Even on weekends, waking up at the same time dramatically improves your sleep quality the following night.</p><h3>The Military Sleep Method</h3><p>Relax your facial muscles. Drop your shoulders. Breathe out slowly and relax your chest. Relax your legs from thighs to calves. For 10 seconds, clear your mind by imagining a peaceful scene. Most people fall asleep within 2 minutes with consistent practice.</p>`
    },
    {
        title: 'Managing Exam Stress',
        type: 'article',
        topic: 'stress',
        img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80',
        link: '#',
        summary: 'Transform exam pressure into performance energy with these evidence-based strategies.',
        body: `<h3>Reframe Stress as Excitement</h3><p>Research from Harvard shows that telling yourself "I am excited" before a stressful event significantly improves performance compared to trying to "calm down." Excitement and anxiety are physiologically identical — only the label differs.</p><h3>The Pomodoro Technique</h3><p>Study for 25 minutes with full focus, then take a 5-minute break. After 4 cycles, take a 20-minute break. This technique leverages your brain's natural attention span and prevents the burnout that comes from marathon study sessions.</p><h3>The Night Before</h3><p>Stop studying 2 hours before bed. Prepare everything you need the night before (clothes, bag, stationery). Do light stretching or a short walk. Your brain consolidates memories during sleep — a good night's rest before an exam is more valuable than a late-night cramming session.</p>`
    },
    {
        title: 'Deep Focus & Flow State',
        type: 'article',
        topic: 'focus',
        img: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80',
        link: '#',
        summary: 'How to enter the elusive "flow state" and protect your attention in a distracted world.',
        body: `<h3>What is Flow?</h3><p>Flow is the state of being completely absorbed in a challenging but manageable task. Time seems to disappear. Psychologist Mihaly Csikszentmihalyi identified it as the ultimate form of human happiness and peak performance.</p><h3>The Three Conditions for Flow</h3><p><strong>1. Clear Goals:</strong> Know exactly what you are trying to accomplish in the next 25 minutes.</p><p><strong>2. Immediate Feedback:</strong> Can you tell if you are making progress? For studying, this means practice problems over passive re-reading.</p><p><strong>3. Challenge-Skill Balance:</strong> The task must be neither too easy (boring) nor too hard (anxious). Aim for slightly above your comfort zone.</p><h3>Environment Design</h3><p>Put your phone in another room — not face-down on your desk, but literally in another room. Studies show that just having a phone visible reduces available cognitive capacity, even if you never touch it.</p>`
    },
    {
        title: 'A Mindful Morning Routine',
        type: 'article',
        topic: 'stress',
        img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
        link: '#',
        summary: 'The first 30 minutes of your day shape your entire mental state. Here\'s how to design them.',
        body: `<h3>The First 5 Minutes</h3><p>Before you check your phone, take 5 slow, deep breaths. This activates the parasympathetic nervous system and prevents the cortisol spike that comes from immediately consuming information and notifications.</p><h3>Movement Beats Caffeine</h3><p>Even a 10-minute walk outside in the morning light is more effective at improving alertness and mood than a cup of coffee. It sets your circadian clock, boosts dopamine, and reduces cortisol.</p><h3>The 3-Item Priority List</h3><p>Before you open any apps, write down just 3 things you want to accomplish today. Not a full to-do list — just 3. This creates focus and gives you clear criteria for a "successful day," which protects against the anxiety of feeling like you are always behind.</p>`
    },
    {
        title: 'Overcoming Social Anxiety',
        type: 'article',
        topic: 'anxiety',
        img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
        link: '#',
        summary: 'Social anxiety is one of the most common struggles among students. Here is how to navigate it.',
        body: `<h3>What Social Anxiety Really Is</h3><p>Social anxiety is not shyness. It is an intense fear of being judged, humiliated, or rejected by others. It often involves significant anticipatory anxiety — dreading social events long before they happen.</p><h3>The Spotlight Effect</h3><p>Research consistently shows that people believe others notice their flaws and mistakes far more than they actually do. This "spotlight effect" is a cognitive distortion. In reality, other people are mostly thinking about themselves.</p><h3>Gradual Exposure</h3><p>Start small: make eye contact and smile at one person per day. Progress to saying good morning to a classmate. Work up to asking a question in class. Each small success builds genuine confidence that no amount of positive self-talk alone can create.</p>`
    },
    {
        title: 'Deep Sleep Meditation',
        type: 'meditation',
        topic: 'sleep',
        img: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&q=80',
        link: 'https://www.youtube.com/embed/aXItOY0sLRY',
        summary: 'A 10-minute guided body scan to prepare your nervous system for deep, restorative sleep.',
        body: `<p>This guided meditation uses progressive muscle relaxation and breath awareness to calm your nervous system and ease you into sleep. Best practiced lying down with headphones.</p>`
    },
    {
        title: 'Box Breathing for Stress',
        type: 'meditation',
        topic: 'breathe',
        img: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=600&q=80',
        link: '#',
        summary: 'The breathing technique used by Navy SEALs and surgeons to perform under extreme pressure.',
        body: `<h3>The Technique</h3><p>Box breathing (also called 4-4-4-4 breathing) is a powerful, evidence-based technique used by the US Navy SEALs and high-performance athletes to regulate the autonomic nervous system on demand.</p><h3>How to Practice</h3><p><strong>Step 1 – Inhale:</strong> Breathe in slowly through your nose for a count of 4 seconds.</p><p><strong>Step 2 – Hold:</strong> Hold your breath for 4 seconds.</p><p><strong>Step 3 – Exhale:</strong> Exhale slowly through your mouth for 4 seconds.</p><p><strong>Step 4 – Hold:</strong> Hold your empty lungs for 4 seconds.</p><p>Repeat this cycle 4 times. You will notice a calm, alert clarity within minutes. This technique works by stimulating the vagus nerve, which directly slows the heart rate.</p>`
    }
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    await Resource.deleteMany({});
    await Resource.insertMany(resources);
    console.log(`Seeded ${resources.length} resources.`);
    process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
