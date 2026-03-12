const fs = require('fs');
const path = require('path');

const dir = 'c:\\work\\World immigration website';

const newHeaderTemplate = (scrolled) => `    <header class="split-header${scrolled ? ' scrolled' : ''}">
        <nav class="container nav-split">
            <!-- Left: Logo -->
            <div class="logo">
                <a href="index.html">
                    <img src="assets/logo.png" alt="World Immigration Beyond Borders Logo" class="header-logo">
                </a>
            </div>

            <!-- Center-Left Pill: Socials -->
            <div class="nav-pill left-pill">
                <a href="#"><i data-lucide="facebook"></i></a>
                <a href="#"><i data-lucide="phone"></i></a>
                <a href="#"><i data-lucide="instagram"></i></a>
            </div>
            
            <!-- Right Pill: Navigation -->
            <div class="nav-pill right-pill">
                <ul class="nav-links">
                    <li><a href="index.html#home">Home</a></li>
                    <li><a href="index.html#services">Work visas</a></li>
                    <li><a href="index.html#about">Other services</a></li>
                    <li><a href="index.html#contact">Contacts</a></li>
                </ul>
                <div class="mobile-menu-btn">
                    <i data-lucide="menu"></i>
                </div>
            </div>
        </nav>
    </header>`;

const newFooter = `    <footer style="padding: 3rem 0; border-top: 1px solid #eee; text-align: center;">
        <div class="container">
            <p>&copy; 2026 World Immigration Beyond Borders Services. All rights reserved.</p>
        </div>
    </footer>`;

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Update titles
        if (content.includes('| World Immigration')) {
            content = content.replace('| World Immigration', '| World Immigration Beyond Borders');
            modified = true;
        }

        // Update headers
        const headerRegex = /<header class="split-header( scrolled)?">[\s\S]*?<\/header>/;
        const match = content.match(headerRegex);
        if (match) {
            const isScrolled = !!match[1];
            content = content.replace(headerRegex, newHeaderTemplate(isScrolled));
            modified = true;
        }

        // Update footers (simple version in visa pages)
        const footerRegex = /<footer style="padding: 3rem 0; border-top: 1px solid #eee; text-align: center;">[\s\S]*?<\/footer>/;
        if (footerRegex.test(content)) {
            content = content.replace(footerRegex, newFooter);
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file}`);
        }
    }
});
