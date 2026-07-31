const fs = require('fs');
const path = require('path');

const src = fs.readFileSync('c:/mindwell-project/frontend/js/student-dashboard.js', 'utf8');

// Helper to extract a function by name
function extractFunction(code, funcName) {
    const regex = new RegExp(`(?:async\\s+)?function\\s+${funcName}\\s*\\([\\s\\S]*?\\n}`);
    const match = code.match(regex);
    if (!match) return `// Could not find function ${funcName}\n`;
    
    // We need to handle nested braces. This regex will grab everything up to the first \n}, which is often correct for these simple functions, but let's do a brace counter to be safe.
    
    const startIndex = code.indexOf(`function ${funcName}`);
    const asyncStartIndex = code.indexOf(`async function ${funcName}`);
    let actualStart = startIndex !== -1 ? startIndex : asyncStartIndex;
    
    if (actualStart === -1) {
        // Maybe it's a const arrow function?
        const constIndex = code.indexOf(`const ${funcName} =`);
        if (constIndex !== -1) actualStart = constIndex;
        else return `// Could not find function ${funcName}\n`;
    }

    let braceCount = 0;
    let started = false;
    let endIndex = actualStart;
    
    for (let i = actualStart; i < code.length; i++) {
        if (code[i] === '{') {
            braceCount++;
            started = true;
        } else if (code[i] === '}') {
            braceCount--;
        }
        
        if (started && braceCount === 0) {
            endIndex = i + 1;
            break;
        }
    }
    
    return code.substring(actualStart, endIndex) + '\n\n';
}

const globalFuncs = ['setupDropdowns', 'setupMobileMenu', 'setupChatWidget', 'getAiResponse', 'fetchAppointments'];
const dashboardFuncs = ['setDynamicGreeting', 'setCurrentDate', 'renderDashboardAppointmentList', 'renderMoodChart'];
const moodFuncs = ['setupMoodTracker', 'setupMoodHistory'];
const apptFuncs = ['renderFullAppointmentLists', 'setupBookingPage', 'getMindwellCounselors', 'renderFeaturedCounselors'];
const resourceFuncs = ['setupResourcesPage'];
const profileFuncs = ['setupProfilePage'];
const formFuncs = ['setupFaqAccordion', 'setupFeedbackForm', 'setupReportProblemForm'];

let globalJs = `/** Global functionalities for all pages */\n\n`;
globalJs += `document.addEventListener('DOMContentLoaded', () => {
    setupDropdowns();
    setupMobileMenu();
    setupChatWidget();
});\n\n`;
for(let f of globalFuncs) globalJs += extractFunction(src, f);

let dashboardJs = `/** Dashboard Page */\n\ndocument.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dynamic-greeting')) {
        setDynamicGreeting();
        setCurrentDate();
        renderDashboardAppointmentList();
        renderMoodChart();
    }
});\n\n`;
for(let f of dashboardFuncs) dashboardJs += extractFunction(src, f);

let moodJs = `/** Mood Tracker Page */\n\ndocument.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('mood-tracker-card')) {
        setupMoodTracker();
    }
});\n\n`;
for(let f of moodFuncs) moodJs += extractFunction(src, f);

let apptJs = `/** Appointments & Booking */\n\ndocument.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('upcoming-appointments-list')) {
        renderFullAppointmentLists();
    }
    if (document.getElementById('counselor-list')) {
        setupBookingPage();
    }
});\n\n`;
for(let f of apptFuncs) apptJs += extractFunction(src, f);

let resourceJs = `/** Resources Page */\n\ndocument.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('resource-grid')) {
        setupResourcesPage();
    }
});\n\n`;
for(let f of resourceFuncs) resourceJs += extractFunction(src, f);

let profileJs = `/** Profile Page */\n\ndocument.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('profile-form')) {
        setupProfilePage();
    }
});\n\n`;
for(let f of profileFuncs) profileJs += extractFunction(src, f);

let formJs = `/** Forms (Contact, Feedback, Report) */\n\ndocument.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('faq-container')) setupFaqAccordion();
    if (document.getElementById('feedback-form')) setupFeedbackForm();
    if (document.getElementById('report-problem-form')) setupReportProblemForm();
});\n\n`;
for(let f of formFuncs) formJs += extractFunction(src, f);

fs.writeFileSync('c:/mindwell-project/frontend/js/global.js', globalJs);
fs.writeFileSync('c:/mindwell-project/frontend/js/dashboard.js', dashboardJs);
fs.writeFileSync('c:/mindwell-project/frontend/js/mood-tracker.js', moodJs);
fs.writeFileSync('c:/mindwell-project/frontend/js/appointments.js', apptJs);
fs.writeFileSync('c:/mindwell-project/frontend/js/resources.js', resourceJs);
fs.writeFileSync('c:/mindwell-project/frontend/js/profile.js', profileJs);
fs.writeFileSync('c:/mindwell-project/frontend/js/forms.js', formJs);

console.log('Files generated successfully.');
