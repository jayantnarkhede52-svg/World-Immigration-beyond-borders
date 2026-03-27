/**
 * inject-form.js — Injects mini contact form into all HTML pages
 * Run: node inject-form.js
 */

const fs = require('fs');
const path = require('path');

const FORM_HTML = `
    <!-- Mini Contact Form (Site-Wide) -->
    <section class="mini-contact-section">
        <div class="container">
            <div class="mini-contact-wrapper">
                <div class="mini-contact-header">
                    <h2>Get <span class="gold">Free Consultation</span></h2>
                    <p>Fill in your details and our immigration experts will reach out to you.</p>
                </div>
                <div class="mini-contact-card">
                    <form id="mini-contact-form">
                        <div class="mini-form-grid">
                            <div class="mini-form-group">
                                <label for="mini-name">Full Name *</label>
                                <input type="text" id="mini-name" placeholder="Your full name" required>
                            </div>
                            <div class="mini-form-group">
                                <label for="mini-phone">Phone Number *</label>
                                <input type="tel" id="mini-phone" placeholder="+91 9876543210" required>
                            </div>
                            <div class="mini-form-group">
                                <label for="mini-visa">Visa Interest *</label>
                                <select id="mini-visa" required>
                                    <option value="" disabled selected>Select visa type</option>
                                    <option value="Schengen">Schengen Visa</option>
                                    <option value="USA">USA Visa</option>
                                    <option value="UK">UK Visa</option>
                                    <option value="Canada">Canada Visa</option>
                                    <option value="Australia">Australia Visa</option>
                                    <option value="UAE">UAE Visa</option>
                                    <option value="Japan">Japan Visa</option>
                                    <option value="Student Visa">Student Visa</option>
                                    <option value="Work Visa">Work Visa</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div class="mini-form-group">
                                <label for="mini-message">Message</label>
                                <textarea id="mini-message" placeholder="Any specific requirements..." rows="2"></textarea>
                            </div>
                        </div>
                        <div id="mini-form-feedback" class="mini-form-feedback"></div>
                        <div class="mini-form-submit">
                            <button type="submit" class="btn-mini-submit">
                                <i data-lucide="send" style="width:16px;height:16px;"></i>
                                Get Free Consultation
                            </button>
                            <div class="mini-form-trust">
                                <i data-lucide="shield-check"></i>
                                <span>Your data is secure & confidential</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>`;

const SCRIPT_TAG = `<script src="supabase-form.js"></script>`;

// Get all HTML files in root directory
const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir)
    .filter(f => f.endsWith('.html') && !f.startsWith('_'));

let modified = 0;
let skipped = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already has the form
    if (content.includes('mini-contact-form')) {
        console.log(`⏭️  Skipped (already has form): ${file}`);
        skipped++;
        return;
    }

    // Inject form before <footer>
    if (content.includes('<footer>') || content.includes('<footer ')) {
        const footerRegex = /(<footer[\s>])/;
        content = content.replace(footerRegex, FORM_HTML + '\n\n    $1');
    } else {
        console.log(`⚠️  No <footer> found in: ${file}`);
        return;
    }

    // Add supabase-form.js script if not already present 
    if (!content.includes('supabase-form.js')) {
        // Add before closing </body>
        content = content.replace('</body>', `    ${SCRIPT_TAG}\n</body>`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Injected form into: ${file}`);
    modified++;
});

console.log(`\n📊 Results: ${modified} modified, ${skipped} skipped`);
