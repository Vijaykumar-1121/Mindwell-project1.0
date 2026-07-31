const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');

const code = fs.readFileSync('c:/mindwell-project/frontend/js/student-dashboard.js', 'utf8');
const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="upcoming-appointments-list"></div><div id="past-appointments-list"></div></body></html>`, { runScripts: 'dangerously' });

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
try {
    dom.window.eval(code);
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    console.log('Script ran successfully');
} catch (e) {
    console.error('ERROR:', e);
}
