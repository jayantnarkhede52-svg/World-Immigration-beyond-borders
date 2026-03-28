const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && f !== 'index.html');
let modifiedCount = 0;

const loaderString = `    <!-- Page Loader -->
    <div id="page-loader">
        <div class="loader-logo">World Immigration</div>
        <div class="loader-bar"><div class="loader-bar-fill"></div></div>
    </div>`;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes(loaderString)) {
        content = content.replace(loaderString + '\n', '');
        content = content.replace(loaderString, '');
        fs.writeFileSync(file, content);
        modifiedCount++;
    }
}
console.log('Removed loader from ' + modifiedCount + ' non-index HTML files.');
