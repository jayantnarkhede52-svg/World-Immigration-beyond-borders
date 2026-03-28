const fs = require('fs');

const aboutHtml = fs.readFileSync('about.html', 'utf8');
const contactHtml = fs.readFileSync('contact.html', 'utf8');
const servicesHtml = fs.readFileSync('services.html', 'utf8');

// 1. Extract the header and footer from about.html
// Let's use string splitting to extract head, header, footer
const headMatch = aboutHtml.match(/<head>([\s\S]*?)<\/head>/);
let headSection = headMatch[1];
// Fix head of about since it was missing css/aos
if (!headSection.includes('ui-enhancements.css')) {
    headSection += `\n    <link rel="stylesheet" href="ui-enhancements.css">\n    <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet">\n`;
}

const headerMatch = aboutHtml.match(/(<header class="split-header">[\s\S]*?<\/header>)/);
let headerSection = headerMatch[1];
// Ensure About Us is in nav
headerSection = headerSection.replace(
    '<li><a href="other-services.html">Other services</a></li>',
    '<li><a href="other-services.html">Other services</a></li>\n                    <li><a href="about.html">About Us</a></li>'
);

const footerMatch = aboutHtml.match(/(<!-- Mini Contact Form \(Site-Wide\) -->[\s\S]*?<\/html>)/);
let footerSection = footerMatch[1];

const loaderAndGlow = `
    <!-- Page Loader -->
    <div id="page-loader">
        <div class="loader-logo">World Immigration</div>
        <div class="loader-bar"><div class="loader-bar-fill"></div></div>
    </div>

    <!-- Cursor Glow Effect -->
    <div class="cursor-glow" id="cursor-glow"></div>
`;

// Build a function to create a new page
function buildPage(title, desc, mainContent) {
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | World Immigration Beyond Borders</title>
    <meta name="theme-color" content="#e87b37">
    <meta name="description" content="${desc}">
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="mobile.css">
    <link rel="stylesheet" href="ui-enhancements.css">
    <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet">
</head>

<body>
${loaderAndGlow}
${headerSection}

    <main>
${mainContent}
    </main>

${footerSection.replace('</body>', `    <script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>\n    <script>AOS.init({ duration: 800, once: true, offset: 80 }); window.addEventListener('load', () => { setTimeout(() => { const loader = document.getElementById('page-loader'); if (loader) loader.classList.add('hidden'); }, 1500); }); const cursorGlow = document.getElementById('cursor-glow'); document.addEventListener('mousemove', (e) => { if (cursorGlow) { cursorGlow.style.left = e.clientX + 'px'; cursorGlow.style.top = e.clientY + 'px'; } });</script>\n</body>`)}`;
}

// Extract Mains
const contactMainMatch = contactHtml.match(/<main>([\s\S]*?)<\/main>/);
if (contactMainMatch) {
    fs.writeFileSync('contact.html', buildPage(
        'Contact Us', 
        'Get in touch with World Immigration Beyond Borders for premium visa and immigration services.', 
        contactMainMatch[1]
    ));
    console.log("Fixed contact.html");
}

const servicesMainMatch = servicesHtml.match(/<main>([\s\S]*?)<\/main>/);
if (servicesMainMatch) {
    fs.writeFileSync('services.html', buildPage(
        'Our Services', 
        'Comprehensive immigration and visa solutions tailored to your unique journey from World Immigration Beyond Borders.', 
        servicesMainMatch[1]
    ));
    console.log("Fixed services.html");
}

const aboutMainMatch = aboutHtml.match(/<main>([\s\S]*?)<\/main>/);
if (aboutMainMatch) {
    fs.writeFileSync('about.html', buildPage(
        'About Us', 
        'Learn more about World Immigration Beyond Borders.', 
        aboutMainMatch[1]
    ));
    console.log("Fixed about.html");
}
