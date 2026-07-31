const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');

const code = fs.readFileSync('c:/mindwell-project/frontend/js/student-dashboard.js', 'utf8');

const pages = [
    'c:/mindwell-project/frontend/student/dashboard.html',
    'c:/mindwell-project/frontend/student/book-appointment.html',
    'c:/mindwell-project/frontend/student/resources.html',
    'c:/mindwell-project/frontend/student/mood-tracker.html'
];

(async () => {
    for (const pagePath of pages) {
        console.log(`\nTesting ${pagePath}...`);
        const html = fs.readFileSync(pagePath, 'utf8');
        const dom = new JSDOM(html, { runScripts: 'dangerously' });
        
        // Mock fetch, localStorage, etc.
        dom.window.localStorage = {
            getItem: (key) => null,
            setItem: () => {},
            removeItem: () => {}
        };
        dom.window.fetch = async () => ({ json: async () => ({ data: [] }) });
        
        try {
            dom.window.eval(code);
            dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
            
            // wait a tick for promises
            await new Promise(r => setTimeout(r, 100));
            console.log(`✅ ${pagePath} executed without throwing`);
        } catch (e) {
            console.error(`❌ ${pagePath} ERROR:`, e);
        }
    }
})();
