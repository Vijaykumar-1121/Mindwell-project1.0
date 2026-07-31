const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');

function updateFiles(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            updateFiles(fullPath);
        } else {
            // Replace in JS files
            if (fullPath.endsWith('.js') && file !== 'config.js') {
                let content = fs.readFileSync(fullPath, 'utf-8');
                let modified = false;
                
                // Replace hardcoded URLs
                if (content.includes("'http://localhost:5000/api'")) {
                    content = content.replace(/'http:\/\/localhost:5000\/api'/g, 'API_BASE_URL');
                    modified = true;
                }
                if (content.includes("http://localhost:5000/api")) {
                    content = content.replace(/http:\/\/localhost:5000\/api/g, '${API_BASE_URL}');
                    modified = true;
                }
                if (content.includes("http://localhost:5000")) {
                    content = content.replace(/http:\/\/localhost:5000/g, '${API_BASE_URL.replace("/api", "")}');
                    modified = true;
                }
                
                // Special case for global.js and others that might have const API_URL = ...
                if (content.includes("const API = 'http://localhost:5000/api';")) {
                    content = content.replace("const API = 'http://localhost:5000/api';", "");
                    content = content.replace(/API\//g, 'API_BASE_URL + "/"');
                    content = content.replace(/API \+/g, 'API_BASE_URL +');
                    content = content.replace(/API,/g, 'API_BASE_URL,');
                    content = content.replace(/\(API\)/g, '(API_BASE_URL)');
                    modified = true;
                }
                if (content.includes("const API_URL = 'http://localhost:5000/api';")) {
                    content = content.replace("const API_URL = 'http://localhost:5000/api';", "");
                    content = content.replace(/API_URL/g, 'API_BASE_URL');
                    modified = true;
                }

                if (modified) {
                    fs.writeFileSync(fullPath, content);
                    console.log(`Updated JS: ${fullPath}`);
                }
            }

            // Inject config.js into HTML files
            if (fullPath.endsWith('.html')) {
                let content = fs.readFileSync(fullPath, 'utf-8');
                if (!content.includes('config.js')) {
                    // determine relative path to js/config.js
                    const depth = fullPath.replace(frontendDir, '').split(path.sep).length - 2;
                    let prefix = depth === 0 ? '' : '../'.repeat(depth);
                    const scriptTag = `<script src="${prefix}js/config.js"></script>\n`;
                    
                    // Inject before the first <script> tag or before </body>
                    if (content.includes('<script src=')) {
                        content = content.replace('<script src=', scriptTag + '    <script src=');
                    } else if (content.includes('</body>')) {
                        content = content.replace('</body>', scriptTag + '</body>');
                    } else {
                        content += '\n' + scriptTag;
                    }
                    
                    // Also replace any hardcoded localhost URLs in inline scripts
                    if (content.includes("http://localhost:5000/api")) {
                        content = content.replace(/http:\/\/localhost:5000\/api/g, '${API_BASE_URL}');
                    }

                    fs.writeFileSync(fullPath, content);
                    console.log(`Updated HTML: ${fullPath}`);
                }
            }
        }
    }
}

updateFiles(frontendDir);
console.log('Done mapping API_BASE_URL!');
