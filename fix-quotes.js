const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'frontend', 'js');

function fix(dirPath) {
    fs.readdirSync(dirPath).forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fix(fullPath);
        } else if (fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let original = content;
            // replace '${API_BASE_URL}/path' with `${API_BASE_URL}/path`
            content = content.replace(/'\$\{API_BASE_URL\}(.*?)'/g, '`${API_BASE_URL}$1`');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed', fullPath);
            }
        }
    });
}
fix(dir);
