const fs = require('fs');
const path = require('path');

const dir = 'c:/mindwell-project/frontend/student';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const mapping = {
    'dashboard.html': ['global.js', 'dashboard.js'],
    'mood-tracker.html': ['global.js', 'mood-tracker.js'],
    'appointments.html': ['global.js', 'appointments.js'],
    'book-appointment.html': ['global.js', 'appointments.js'],
    'resources.html': ['global.js', 'resources.js'],
    'profile.html': ['global.js', 'profile.js'],
    'contact.html': ['global.js', 'forms.js'],
    'feedback.html': ['global.js', 'forms.js'],
    'report-problem.html': ['global.js', 'forms.js'],
    'journal.html': ['global.js'],
    'ai-assistant.html': ['global.js'],
    'meditation.html': ['global.js']
};

files.forEach(file => {
    const filePath = path.join(dir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    const scriptsToInject = mapping[file] || ['global.js'];
    const scriptTags = scriptsToInject.map(s => `<script src="../js/${s}"></script>`).join('\n    ');
    
    html = html.replace('<script src="../js/student-dashboard.js"></script>', scriptTags);
    
    fs.writeFileSync(filePath, html);
    console.log(`Updated ${file} with ${scriptTags}`);
});
