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
    if (navLinks && navLinks.parentNode !== document.body) {
        document.body.appendChild(navLinks);
    }
    navLinks.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    const icon = mobileMenuBtn.querySelector('i');
    if (icon) icon.className = 'ph-bold ph-x';
}

function closeMenu() {
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    const icon = mobileMenuBtn.querySelector('i');
    if (icon) icon.className = 'ph-bold ph-list';
}

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.contains('active');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
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
        if (icon) icon.className = isActive ? 'ph-bold ph-x' : 'ph-bold ph-chat-dots';
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!contactToggle.closest('.floating-contact').contains(e.target)) {
            contactOptions.classList.remove('active');
            const icon = contactToggle.querySelector('i');
            if (icon) icon.className = 'ph-bold ph-chat-dots';
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

// ── AI Eligibility Checker Logic ──
let currentStep = 1;
const totalSteps = 4;
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const steps = document.querySelectorAll('.step');
const progressBar = document.getElementById('eligibility-progress');

function showStep(n) {
    steps.forEach(step => step.classList.remove('active'));
    const targetStep = document.querySelector(`.step[data-step="${n}"]`);
    if (targetStep) targetStep.classList.add('active');

    // Update buttons
    if (n === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }

    if (n === totalSteps) {
        document.getElementById('form-nav').style.display = 'none';
        runAIAnalysis();
    } else {
        document.getElementById('form-nav').style.display = 'flex';
        nextBtn.textContent = (n === totalSteps - 1) ? 'See Result' : 'Next Step';
    }

    // Update progress bar
    const progress = (n / totalSteps) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;
}

function runAIAnalysis() {
    const loading = document.getElementById('result-loading');
    const content = document.getElementById('result-content');
    const message = document.getElementById('result-message');
    
    // Get form data
    const destination = document.querySelector('input[name="destination"]:checked')?.value || 'Destination';
    const purpose = document.querySelector('input[name="purpose"]:checked')?.value || 'Goal';
    const qualification = document.querySelector('input[name="qualification"]:checked')?.value || 'Qualification';

    // Simulate analysis
    setTimeout(() => {
        if (loading) loading.style.display = 'none';
        if (content) content.style.display = 'block';
        
        let reco = "";
        if (purpose === 'Study') {
            reco = `Excellent profile for ${destination} Student Visa! With your ${qualification} background, you are a strong candidate for premium university admissions.`;
        } else if (purpose === 'Work') {
            reco = `Great news! Your ${qualification} qualifications match high-demand sectors in ${destination}. We recommend the Skilled Worker pathway.`;
        } else {
            reco = `You have high eligibility for a ${destination} ${purpose} Visa. Our experts can help you prepare a watertight documentation set for first-time approval.`;
        }
        
        if (message) message.textContent = reco;
    }, 2000);
}

// ── Testimonials Carousel ──
const track = document.querySelector('.testimonial-track');
const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
const dotsContainer = document.querySelector('.carousel-dots');
let currentSlideIndex = 0;
let carouselInterval;

if (track && slides.length > 0) {
    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetInterval();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll('.dot'));

    function goToSlide(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        currentSlideIndex = index;
    }

    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        goToSlide(currentSlideIndex);
    }

    function resetInterval() {
        clearInterval(carouselInterval);
        carouselInterval = setInterval(nextSlide, 5000);
    }

    resetInterval();
}

// ── Back to Top ──
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        // Validate if option selected
        const currentActiveStep = document.querySelector('.step.active');
        const hasSelection = currentActiveStep.querySelector('input:checked');
        
        if (!hasSelection && currentStep < totalSteps) {
            alert('Please select an option to continue.');
            return;
        }

        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });
}

function resetEligibility() {
    currentStep = 1;
    document.getElementById('eligibility-form').reset();
    document.getElementById('result-loading').style.display = 'block';
    document.getElementById('result-content').style.display = 'none';
    showStep(1);
}

function scrollToContact() {
    const contactSection = document.getElementById('contact-form') || document.querySelector('.contact-section') || document.querySelector('footer');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

