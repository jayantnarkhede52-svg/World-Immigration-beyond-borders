/* ===========================================
   SCRIPT.JS — Optimized with Mobile Support
   =========================================== */

// ── Sticky Header on Scroll ──
const header = document.querySelector('header');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

// ── Inject Mobile Nav Overlay ──
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

// ── Mobile Menu Toggle ──
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

function openMenu() {
    navLinks.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    const icon = mobileMenuBtn.querySelector('i');
    icon.setAttribute('data-lucide', 'x');
    lucide.createIcons();
}

function closeMenu() {
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    const icon = mobileMenuBtn.querySelector('i');
    icon.setAttribute('data-lucide', 'menu');
    lucide.createIcons();
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('active');
        isOpen ? closeMenu() : openMenu();
    });
}

// Close menu when overlay is clicked
overlay.addEventListener('click', closeMenu);

// Close mobile menu when a nav link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});

// ── Floating Contact Toggle ──
const contactToggle = document.getElementById('contact-toggle');
const contactOptions = document.querySelector('.contact-options');

if (contactToggle) {
    contactToggle.addEventListener('click', () => {
        contactOptions.classList.toggle('active');
        const icon = contactToggle.querySelector('i');
        const isActive = contactOptions.classList.contains('active');
        icon.setAttribute('data-lucide', isActive ? 'x' : 'message-square');
        lucide.createIcons();
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!contactToggle.closest('.floating-contact').contains(e.target)) {
            contactOptions.classList.remove('active');
            const icon = contactToggle.querySelector('i');
            icon.setAttribute('data-lucide', 'message-square');
            lucide.createIcons();
        }
    });
}

// ── Scroll Reveal Animations ──
const revealObserverOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, revealObserverOptions);

document.querySelectorAll('.service-card, .stat-item, .why-list li, .fade-in, .fade-in-delay, .reveal, .country-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ── Lazy Load Images ──
if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

// ── Smooth Scroll for Anchor Links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ── CTA Form Submit Handling ──
const ctaForm = document.querySelector('.cta-form');
if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = ctaForm.querySelector('button[type="submit"]');
        btn.textContent = '✓ Request Sent!';
        btn.style.background = '#28a745';
        setTimeout(() => {
            btn.textContent = 'Get Consultation';
            btn.style.background = '';
            ctaForm.reset();
        }, 3000);
    });
}
