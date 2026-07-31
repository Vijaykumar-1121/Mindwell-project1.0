const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const code = fs.readFileSync('c:/mindwell-project/frontend/js/student-dashboard.js', 'utf8');

const pages = [
    'dynamic-greeting', 
    'mood-tracker-card', 
    'upcoming-appointments-list', 
    'counselor-list', 
    'faq-container', 
    'feedback-form', 
    'report-problem-form', 
    'profile-form', 
    'resource-grid'
];

pages.forEach(id => {
    const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="${id}"></div></body></html>`, { runScripts: 'dangerously' });
    try {
        dom.window.eval(code);
        dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
        console.log(id + ' ran successfully');
    } catch (e) {
        console.error(id + ' ERROR:', e.message);
    }
});
