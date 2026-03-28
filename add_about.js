const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let count = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('<li><a href="other-services.html">Other services</a></li>')) {
        if (!content.includes('<li><a href="about.html">About Us</a></li>')) {
            content = content.replace(
                '<li><a href="other-services.html">Other services</a></li>',
                '<li><a href="other-services.html">Other services</a></li>\n                    <li><a href="about.html">About Us</a></li>'
            );
            fs.writeFileSync(file, content);
            count++;
        }
    }
}
console.log('Added About Us link to ' + count + ' files.');
