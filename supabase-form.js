/* ===========================================
   SUPABASE-FORM.JS — Mini Contact Form Handler
   Connects to Supabase to capture leads
   =========================================== */

const SUPABASE_URL = 'https://anmwlzneyiynauoebpbf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFubXdsem5leWl5bmF1b2VicGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MzIxNTIsImV4cCI6MjA5MDIwODE1Mn0.nqRukK_X-jMlKWTHDKV9REvFstKKg5-ylTzaUSaP4HI';

// ── Submit Lead to Supabase ──
async function submitLeadToSupabase(formData) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }
    return true;
}

// ── Initialize Mini Contact Form ──
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mini-contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        const feedback = document.getElementById('mini-form-feedback');

        // Disable button and show loading
        btn.disabled = true;
        btn.innerHTML = '<span class="mini-spinner"></span> Sending...';

        try {
            const formData = {
                name: form.querySelector('#mini-name').value.trim(),
                phone: form.querySelector('#mini-phone').value.trim(),
                visa_interest: form.querySelector('#mini-visa').value,
                message: form.querySelector('#mini-message').value.trim(),
                source_page: window.location.pathname.replace(/\//g, '') || 'homepage'
            };

            // Validate
            if (!formData.name || !formData.phone || !formData.visa_interest) {
                throw new Error('Please fill in all required fields.');
            }

            await submitLeadToSupabase(formData);

            // Success
            feedback.textContent = '✓ Thank you! Our team will contact you shortly.';
            feedback.className = 'mini-form-feedback success';
            feedback.style.display = 'block';
            form.reset();

            // Hide feedback after 5s
            setTimeout(() => {
                feedback.style.display = 'none';
            }, 5000);

        } catch (error) {
            feedback.textContent = error.message || 'Something went wrong. Please try again.';
            feedback.className = 'mini-form-feedback error';
            feedback.style.display = 'block';
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    });
});
