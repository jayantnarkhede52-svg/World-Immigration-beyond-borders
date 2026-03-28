const fs = require('fs');
let contact = fs.readFileSync('contact.html', 'utf8');

// The file got chopped up to line 1 which starts with:
//                             </div>
//                             <div class="form-group">
//                                 <label for="email">Your Email</label>
// Let's strip any loose start tags and append the correct ones.

const mainPrefix = `
        <!-- Page Header -->
        <section class="page-header" style="background: linear-gradient(135deg, #050c1a 0%, #08111e 100%); position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.05; background-image: radial-gradient(circle at 15% 50%, rgba(232, 123, 55, 0.4), transparent 25%), radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.3), transparent 25%);"></div>
            <div class="container" style="position: relative; z-index: 2;">
                <h1 style="font-size: 3.5rem; font-weight: 700; margin-bottom: 1rem; color: #fff;">Contact <span class="gold">Us</span></h1>
                <p style="font-size: 1.2rem; max-width: 600px; margin: 0 auto; color: #ccc;">We are here to answer your questions and guide your application.</p>
            </div>
        </section>

        <!-- Contact Form & Info -->
        <section class="contact-page-section">
            <div class="container">
                <div class="contact-grid">
                    <div class="contact-form-card reveal">
                        <div class="card-header">
                            <h2 class="gold">Get in Touch</h2>
                            <p>Fill out the form below and one of our dedicated immigration specialists will get back to you within 24 hours.</p>
                        </div>
                        <form id="contact-form">
                            <div class="form-group">
                                <label for="name">Your Name</label>
                                <input type="text" id="name" placeholder="John Doe" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Your Email</label>
`;

let cleaned = contact.replace(/[\s\S]*?<label for="email">Your Email<\/label>/, mainPrefix);
fs.writeFileSync('contact.html', '<main>' + cleaned);
console.log('Restored contact.html main block');
