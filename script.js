/**
 * EmailJS config – one template for both Contact and Booking forms.
 * Replace with your IDs from https://dashboard.emailjs.com/
 * Use emailjs-unified-template.html for the template content.
 */
const EMAILJS_CONFIG = {
    serviceId: 'service_3bihqqb',
    templateId: 'template_ot7vgoy',
    publicKey: '-veGxRxhZnZ2ZlRwb'
};

// Initialize EmailJS (required in v4 before send)
if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey) {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
}

// Shared validation (used by Contact and Booking forms)
const VALIDATION = {
    emailRegex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    phoneRegex: /^[\+]?[0-9]\d{6,19}$/,
    nameMinLength: 2,
    messageMinLength: 10,
    participantCountMin: 1,
    participantCountMax: 500
};
function isValidEmail(value) {
    return !value || VALIDATION.emailRegex.test(value);
}
function isValidPhone(countryCode, value) {
    if (!value) return true;
    const full = (countryCode || '+91') + value;
    const cleaned = full.replace(/[\s\-\(\)]/g, '');
    return VALIDATION.phoneRegex.test(cleaned);
}

// Form Integration Functions
function openBookingModal(serviceType = 'general') {
    const modal = document.getElementById('bookingModal');
    const sessionTypeSelect = document.getElementById('sessionType');
    
    if (!modal) return;
    
    // Set the service type based on the button clicked
    if (sessionTypeSelect && serviceType) {
        sessionTypeSelect.value = serviceType;
    }
    
    // Update modal title based on service type
    const modalTitle = document.getElementById('modal-title');
    const titles = {
        'general': 'Book a Storytelling Session',
        'school-programs': 'Book School Program Session',
        'ngo-events': 'Book NGO & Community Event',
        'hotel-events': 'Book Hotel Event Session',
        'teacher-training': 'Book Teacher Training Session',
        'workshop-school': 'Book School Workshop',
        'workshop-teacher': 'Book Teacher Training Program',
        'beginners-reading': 'Book Beginners Reading Club',
        'storytime': 'Book Storytime Class',
        'creative-writing': 'Book Grammar Basics and Creative Writing',
        'public-speaking': 'Book Public Speaking & Debate Class'
    };
    
    if (modalTitle) {
        modalTitle.textContent = titles[serviceType] || titles['general'];
    }
    
    // Set minimum date to today
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus on first visible input (skip honeypot to avoid aria-hidden + focus violation)
    setTimeout(() => {
        const firstInput = modal.querySelector('.form-group:not(.honeypot) input, .form-group:not(.honeypot) select, .form-group:not(.honeypot) textarea');
        if (firstInput) firstInput.focus();
    }, 100);
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    
    // Reset form
    const form = document.getElementById('bookingForm');
    if (form) {
        form.reset();
        // Clear all error states
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
        });
        // Clear all error messages
        form.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
    }
}

function showThankYouScreen() {
    // Close the booking modal first
    closeBookingModal();
    
    // Create thank you overlay
    const thankYouOverlay = document.createElement('div');
    thankYouOverlay.id = 'thankYouOverlay';
    thankYouOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Create thank you content
    const thankYouContent = document.createElement('div');
    thankYouContent.style.cssText = `
        background: white;
        padding: 3rem;
        border-radius: 20px;
        text-align: center;
        max-width: 500px;
        margin: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    thankYouContent.innerHTML = `
        <div style="color: #4CAF50; font-size: 4rem; margin-bottom: 1rem;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h2 style="color: #2E7D32; margin-bottom: 1rem; font-size: 2rem;">Thank You!</h2>
        <p style="color: #666; font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Your booking request has been submitted successfully!<br>
            We'll contact you within 24 hours to confirm your session.
        </p>
        <div style="color: #4CAF50; font-size: 0.9rem;">
            <i class="fas fa-clock"></i> This window will close automatically in <span id="countdown">5</span> seconds
        </div>
    `;
    
    thankYouOverlay.appendChild(thankYouContent);
    document.body.appendChild(thankYouOverlay);
    
    // Animate in
    setTimeout(() => {
        thankYouOverlay.style.opacity = '1';
        thankYouContent.style.transform = 'scale(1)';
    }, 10);
    
    // Countdown timer
    let countdown = 5;
    const countdownElement = document.getElementById('countdown');
    
    const timer = setInterval(() => {
        countdown--;
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }
        
        if (countdown <= 0) {
            clearInterval(timer);
            closeThankYouScreen();
        }
    }, 1000);
    
    // Close on click outside
    thankYouOverlay.addEventListener('click', (e) => {
        if (e.target === thankYouOverlay) {
            clearInterval(timer);
            closeThankYouScreen();
        }
    });
}

function closeThankYouScreen() {
    const thankYouOverlay = document.getElementById('thankYouOverlay');
    if (thankYouOverlay) {
        thankYouOverlay.style.opacity = '0';
        setTimeout(() => {
            if (thankYouOverlay.parentNode) {
                thankYouOverlay.parentNode.removeChild(thankYouOverlay);
            }
        }, 300);
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Privacy Policy Modal
function openPrivacyModal(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('privacyModal');
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const closeBtn = modal.querySelector('#closePrivacyModal');
        if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
    }
}

function closePrivacyModal() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ['privacyLink', 'privacyLinkContact', 'privacyLinkBooking'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', openPrivacyModal);
    });
    const closeBtn = document.getElementById('closePrivacyModal');
    if (closeBtn) closeBtn.addEventListener('click', closePrivacyModal);
    const privacyOverlay = document.getElementById('privacyModal');
    if (privacyOverlay) {
        privacyOverlay.addEventListener('click', (e) => { if (e.target === privacyOverlay) closePrivacyModal(); });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && privacyOverlay && privacyOverlay.classList.contains('active')) closePrivacyModal();
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.program-card, .benefit-item, .testimonial-card, .about-content, .hero-content');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Handle class images - hide icons when images load successfully
    const classPhotos = document.querySelectorAll('.class-photo');
    classPhotos.forEach(photo => {
        const icon = photo.parentElement.querySelector('.class-icon');
        
        // Function to hide icon when image loads
        const hideIcon = () => {
            if (icon) {
                icon.style.opacity = '0';
            }
        };
        
        // Function to show icon when image fails
        const showIcon = () => {
            if (icon) {
                icon.style.opacity = '1';
            }
            photo.style.display = 'none';
        };
        
        // Check if image has a valid source
        if (photo.src && photo.src.trim() !== '' && !photo.src.includes('undefined') && !photo.src.includes('null')) {
            // Image has a valid source
            photo.onload = function() {
                hideIcon();
            };
            
            photo.onerror = function() {
                // If image fails to load, show icon as fallback
                showIcon();
            };
            
            // Check if image is already loaded (cached images)
            if (photo.complete && photo.naturalHeight !== 0) {
                hideIcon();
            } else if (photo.complete && photo.naturalHeight === 0) {
                // Image failed to load
                showIcon();
            }
        } else {
            // No valid image source, show icon
            showIcon();
        }
    });
});

// Button click animations
document.querySelectorAll('.cta-button, .program-button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for floating stars
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const stars = document.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        star.style.transform = `translateY(${yPos}px)`;
    });
});

// Interactive tree growth animation on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const tree = document.querySelector('.magical-tree');
        if (tree) {
            tree.style.animation = 'grow 2s ease-out';
        }
    }, 500);
});

// Floating bubbles animation for storyteller
function createFloatingBubble() {
    const bubble = document.createElement('div');
    bubble.innerHTML = ['✨', '📚', '🌟', '💫'][Math.floor(Math.random() * 4)];
    bubble.style.position = 'fixed';
    bubble.style.left = Math.random() * 100 + 'vw';
    bubble.style.top = '100vh';
    bubble.style.fontSize = '2rem';
    bubble.style.pointerEvents = 'none';
    bubble.style.zIndex = '1000';
    bubble.style.animation = 'floatUp 8s linear forwards';
    
    document.body.appendChild(bubble);
    
    setTimeout(() => {
        bubble.remove();
    }, 8000);
}

// Add floating bubble animation
const bubbleStyle = document.createElement('style');
bubbleStyle.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(bubbleStyle);

// Create bubbles periodically
setInterval(createFloatingBubble, 3000);

// Interactive testimonials carousel (if needed for future enhancement)
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? 'block' : 'none';
    });
}

// Button hover effects
document.querySelectorAll('.program-button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// CTA button interactions (skip form submit buttons so Contact/Booking forms actually submit)
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Let form submit buttons submit their form — don't intercept
        if (button.type === 'submit' && button.closest('form')) {
            return;
        }
        e.preventDefault();
        
        // Add a temporary success message for non-form CTA buttons
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Thank you!';
        this.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';
        
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.background = '';
        }, 2000);
    });
});

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Preload critical resources
    preloadCriticalResources();
    
    // Initialize lazy loading
    lazyLoadImages();
    
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-visual > *');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 300);
});

// Add loading animation
window.addEventListener('load', () => {
    // Additional optimizations after page load
    console.log('Page fully loaded - performance optimizations active');
});

// Add loading styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .hero-visual > * {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
`;
document.head.appendChild(loadingStyle);

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    const isActive = navMenu.classList.contains('active');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', !isActive);
    
    // Focus management for mobile menu
    if (!isActive) {
        // Menu is opening - focus first menu item
        const firstMenuItem = navMenu.querySelector('.nav-link');
        if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 100);
        }
    }
}

// Add event listener for hamburger menu
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Keyboard navigation for mobile menu
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
});

// Add touch interactions for mobile
if ('ontouchstart' in window) {
    document.querySelectorAll('.program-card, .benefit-item').forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimization: Debounce function
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalImages = ['logo.png', 'Store tree banner.png'];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Existing scroll logic here
}, 16)); // ~60fps

// Contact Form Validation and Submission
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearError(input));
        });
    }
});

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const formGroup = field.closest('.form-group');
    
    // Clear previous states
    formGroup.classList.remove('error', 'success');
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(formGroup, `${getFieldLabel(fieldName)} is required`);
        return false;
    }
    
    // Name min length (Contact form)
    if (fieldName === 'name' && value && value.length < VALIDATION.nameMinLength) {
        showFieldError(formGroup, 'Name must be at least ' + VALIDATION.nameMinLength + ' characters');
        return false;
    }
    
    // Email validation
    if (fieldName === 'email' && value && !isValidEmail(value)) {
        showFieldError(formGroup, 'Please enter a valid email address');
        return false;
    }
    
    // Phone validation (if provided)
    if (fieldName === 'phone' && value) {
        const countryCodeSelect = formGroup.querySelector('#phoneCountryCode');
        const countryCode = countryCodeSelect ? countryCodeSelect.value : '+91';
        if (!isValidPhone(countryCode, value)) {
            showFieldError(formGroup, 'Please enter a valid phone number (7-20 digits)');
            return false;
        }
    }
    
    // Message length validation
    if (fieldName === 'message' && value && value.length < VALIDATION.messageMinLength) {
        showFieldError(formGroup, 'Message must be at least ' + VALIDATION.messageMinLength + ' characters');
        return false;
    }
    
    // Show success state for valid fields
    if (value) {
        formGroup.classList.add('success');
    }
    
    return true;
}

function showFieldError(formGroup, message) {
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    }
    formGroup.classList.add('error');
}

function clearError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    const errEl = formGroup.querySelector('.error-message');
    if (errEl) errEl.textContent = '';
}

function clearAllContactErrors() {
    const errorMessages = document.querySelectorAll('#contactForm .error-message');
    const errorGroups = document.querySelectorAll('#contactForm .form-group.error');
    const successGroups = document.querySelectorAll('#contactForm .form-group.success');
    
    errorMessages.forEach(error => {
        error.textContent = '';
    });
    
    errorGroups.forEach(group => {
        group.classList.remove('error');
    });
    
    successGroups.forEach(group => {
        group.classList.remove('success');
    });
}

function getFieldLabel(fieldName) {
    const labels = {
        'name': 'Full Name',
        'email': 'Email Address',
        'phone': 'Phone Number',
        'organization': 'Organization',
        'service': 'Service',
        'message': 'Message'
    };
    return labels[fieldName] || fieldName;
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Combine country code with phone number if phone is provided
    const phoneInput = form.querySelector('#phone');
    const countryCodeSelect = form.querySelector('#phoneCountryCode');
    if (phoneInput && phoneInput.value && countryCodeSelect) {
        const fullPhoneNumber = countryCodeSelect.value + phoneInput.value;
        formData.set('fullPhoneNumber', fullPhoneNumber);
    }
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Honeypot anti-spam: if filled, treat as bot
    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        return;
    }
    
    // Validate all fields (skip honeypot)
    let isValid = true;
    form.querySelectorAll('input, select, textarea').forEach(input => {
        if (input.closest('.honeypot')) return;
        if (!validateField(input)) isValid = false;
    });
    
    if (!isValid) {
        console.log('[Contact] Validation failed — fix the errors shown on the form.');
        showNotification('Please fix the errors above', 'error');
        return;
    }
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    if (EMAILJS_CONFIG.templateId === 'YOUR_TEMPLATE_ID' || !EMAILJS_CONFIG.publicKey) {
        showNotification('Please set up EmailJS: add your Service ID, Template ID, and Public Key in script.js.', 'error');
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        return;
    }
    
    const fullPhone = (phoneInput && countryCodeSelect && phoneInput.value)
        ? (countryCodeSelect.value + phoneInput.value).trim()
        : 'Not provided';
    const serviceSelect = form.querySelector('#service');
    const serviceLabel = serviceSelect && serviceSelect.options[serviceSelect.selectedIndex]
        ? serviceSelect.options[serviceSelect.selectedIndex].text
        : formData.get('service') || '—';
    
    const templateParams = {
        form_type: 'Contact',
        subject_line: 'New Contact from The Story Tree: ' + (formData.get('name') || 'Unknown'),
        name: formData.get('name') || '',
        email: formData.get('email') || '',
        phone: fullPhone,
        organization: (formData.get('organization') || '').trim() || '—',
        service_label: serviceLabel,
        message: (formData.get('message') || '').trim() || '—',
        session_type_label: '—',
        participant_count: '—',
        preferred_date: '—',
        preferred_time_label: '—',
        session_duration_label: '—',
        special_requirements: '—'
    };
    
    console.log('[Contact] Sending request to EmailJS...', { form_type: 'Contact', email: templateParams.email });
    
    if (typeof emailjs === 'undefined') {
        showNotification('Email service not loaded. Please refresh the page.', 'error');
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        return;
    }
    
    emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        { publicKey: EMAILJS_CONFIG.publicKey }
    )
        .then(() => {
            console.log('[Contact] Email sent successfully.');
            form.reset();
            clearAllContactErrors();
            showThankYouScreen();
        })
        .catch((err) => {
            console.error('EmailJS Contact error:', err);
            const errMsg = err.text || err.statusText || (err.status ? 'Status ' + err.status : '') || 'Please try again or email us directly.';
            showNotification('Could not send: ' + errMsg, 'error');
        })
        .finally(() => {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        });
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            font-family: 'Poppins', sans-serif;
        }
        
        .notification-success .notification-content {
            background: linear-gradient(135deg, #4CAF50, #66BB6A);
            color: white;
        }
        
        .notification-error .notification-content {
            background: linear-gradient(135deg, #E53E3E, #FC8181);
            color: white;
        }
        
        .notification-info .notification-content {
            background: linear-gradient(135deg, #3182CE, #63B3ED);
            color: white;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 5px;
            margin-left: auto;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'notification-styles';
        styleElement.textContent = notificationStyles;
        document.head.appendChild(styleElement);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Booking Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const bookingModal = document.getElementById('bookingModal');
    const bookSessionBtn = document.getElementById('bookSessionBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelBooking = document.getElementById('cancelBooking');
    const bookingForm = document.getElementById('bookingForm');
    
    // Open modal
    if (bookSessionBtn) {
        bookSessionBtn.addEventListener('click', () => {
            openBookingModal('general');
        });
    }
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', closeBookingModal);
    }
    
    if (cancelBooking) {
        cancelBooking.addEventListener('click', closeBookingModal);
    }
    
    // Close modal when clicking outside
    const modalOverlay = document.getElementById('bookingModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeBookingModal();
            }
        });
    }
    
    
    // Handle booking form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmission);
        
        // Real-time validation for booking form
        const inputs = bookingForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateBookingField(input));
            input.addEventListener('input', () => clearBookingError(input));
        });
    }
    
    // Close modal with Escape key and handle focus trapping
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
            closeBookingModal();
        }
        
        // Focus trapping in modal
        if (bookingModal.classList.contains('active')) {
            const focusableElements = bookingModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        }
    });
});


function validateBookingField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const formGroup = field.closest('.form-group');
    
    // Clear previous states
    formGroup.classList.remove('error', 'success');
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showBookingFieldError(formGroup, `${getBookingFieldLabel(fieldName)} is required`);
        return false;
    }
    
    // Name min length (Booking form)
    if (fieldName === 'bookingName' && value && value.length < VALIDATION.nameMinLength) {
        showBookingFieldError(formGroup, 'Name must be at least ' + VALIDATION.nameMinLength + ' characters');
        return false;
    }
    
    // Email validation
    if (fieldName === 'bookingEmail' && value && !isValidEmail(value)) {
        showBookingFieldError(formGroup, 'Please enter a valid email address');
        return false;
    }
    
    // Phone validation
    if (fieldName === 'bookingPhone' && value) {
        const countryCodeSelect = formGroup.querySelector('#bookingPhoneCountryCode');
        const countryCode = countryCodeSelect ? countryCodeSelect.value : '+91';
        if (!isValidPhone(countryCode, value)) {
            showBookingFieldError(formGroup, 'Please enter a valid phone number (7-20 digits)');
            return false;
        }
    }
    
    // Date validation (future date only)
    if (fieldName === 'preferredDate' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            showBookingFieldError(formGroup, 'Please select a future date');
            return false;
        }
    }
    
    // Number validation for participant count
    if (fieldName === 'participantCount' && value) {
        const count = parseInt(value);
        if (isNaN(count) || count < VALIDATION.participantCountMin || count > VALIDATION.participantCountMax) {
            showBookingFieldError(formGroup, 'Please enter a number between ' + VALIDATION.participantCountMin + ' and ' + VALIDATION.participantCountMax);
            return false;
        }
    }
    
    // Special requirements: optional; any length is fine
    
    // Show success state for valid fields
    if (value) {
        formGroup.classList.add('success');
    }
    
    return true;
}

function showBookingFieldError(formGroup, message) {
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    }
    formGroup.classList.add('error');
}

function clearBookingError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    const errEl = formGroup.querySelector('.error-message');
    if (errEl) errEl.textContent = '';
}

function clearAllBookingErrors() {
    const errorMessages = document.querySelectorAll('#bookingModal .error-message');
    const errorGroups = document.querySelectorAll('#bookingModal .form-group.error');
    const successGroups = document.querySelectorAll('#bookingModal .form-group.success');
    
    errorMessages.forEach(error => {
        error.textContent = '';
    });
    
    errorGroups.forEach(group => {
        group.classList.remove('error');
    });
    
    successGroups.forEach(group => {
        group.classList.remove('success');
    });
}

function getBookingFieldLabel(fieldName) {
    const labels = {
        'bookingName': 'Full Name',
        'bookingEmail': 'Email Address',
        'bookingPhone': 'Phone Number',
        'bookingOrganization': 'Organization',
        'sessionType': 'Session Type',
        'participantCount': 'Number of Participants',
        'preferredDate': 'Preferred Date',
        'preferredTime': 'Preferred Time',
        'sessionDuration': 'Session Duration',
        'specialRequirements': 'Special Requirements'
    };
    return labels[fieldName] || fieldName;
}

function handleBookingSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Combine country code with phone number if phone is provided
    const phoneInput = form.querySelector('#bookingPhone');
    const countryCodeSelect = form.querySelector('#bookingPhoneCountryCode');
    if (phoneInput && phoneInput.value && countryCodeSelect) {
        const fullPhoneNumber = countryCodeSelect.value + phoneInput.value;
        formData.set('fullPhoneNumber', fullPhoneNumber);
    }
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        return;
    }
    
    // Validate all fields (skip honeypot)
    let isValid = true;
    form.querySelectorAll('input, select, textarea').forEach(input => {
        if (input.closest('.honeypot')) return;
        if (!validateBookingField(input)) isValid = false;
    });
    
    if (!isValid) {
        console.log('[Booking] Validation failed — fix the errors shown on the form.');
        showNotification('Please fix the errors above', 'error');
        return;
    }
    
    if (EMAILJS_CONFIG.templateId === 'YOUR_TEMPLATE_ID' || !EMAILJS_CONFIG.publicKey) {
        showNotification('Please set up EmailJS: add your Service ID, Template ID, and Public Key in script.js.', 'error');
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        return;
    }
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
    submitButton.disabled = true;
    
    const fullPhone = (phoneInput && countryCodeSelect && phoneInput.value)
        ? (countryCodeSelect.value + phoneInput.value).trim()
        : 'Not provided';
    const sessionTypeSelect = form.querySelector('#sessionType');
    const sessionTypeLabel = sessionTypeSelect && sessionTypeSelect.options[sessionTypeSelect.selectedIndex]
        ? sessionTypeSelect.options[sessionTypeSelect.selectedIndex].text
        : formData.get('sessionType') || '';
    const preferredTimeSelect = form.querySelector('#preferredTime');
    const preferredTimeLabel = preferredTimeSelect && preferredTimeSelect.options[preferredTimeSelect.selectedIndex]
        ? preferredTimeSelect.options[preferredTimeSelect.selectedIndex].text
        : 'Not specified';
    const sessionDurationSelect = form.querySelector('#sessionDuration');
    const sessionDurationLabel = sessionDurationSelect && sessionDurationSelect.options[sessionDurationSelect.selectedIndex]
        ? sessionDurationSelect.options[sessionDurationSelect.selectedIndex].text
        : 'Not specified';
    
    const templateParams = {
        form_type: 'Booking',
        subject_line: 'New Booking from The Story Tree: ' + (formData.get('bookingName') || 'Unknown'),
        name: formData.get('bookingName') || '',
        email: formData.get('bookingEmail') || '',
        phone: fullPhone,
        organization: formData.get('bookingOrganization') || '',
        service_label: '—',
        message: '—',
        session_type_label: sessionTypeLabel,
        participant_count: formData.get('participantCount') || 'Not specified',
        preferred_date: formData.get('preferredDate') || 'Not specified',
        preferred_time_label: preferredTimeLabel,
        session_duration_label: sessionDurationLabel,
        special_requirements: (formData.get('specialRequirements') || '').trim() || 'None'
    };
    
    console.log('[Booking] Sending request to EmailJS...', { form_type: 'Booking', email: templateParams.email });
    
    if (typeof emailjs === 'undefined') {
        showNotification('Email service not loaded. Please refresh the page.', 'error');
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        return;
    }
    
    emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        { publicKey: EMAILJS_CONFIG.publicKey }
    )
        .then(() => {
            console.log('[Booking] Email sent successfully.');
            form.reset();
            clearAllBookingErrors();
            closeBookingModal();
            showThankYouScreen();
        })
        .catch((err) => {
            console.error('EmailJS Booking error:', err);
            const errMsg = err.text || err.statusText || (err.status ? 'Status ' + err.status : '') || 'Please try again or email us directly.';
            showNotification('Could not send: ' + errMsg, 'error');
        })
        .finally(() => {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        });
}

// Image Lightbox Functionality
let currentImageIndex = 0;
const mediaImages = [
    'Media Coverage/102693623_172126410926792_3811980227651829760_n.jpg',
    'Media Coverage/105523286_177901517015948_1086158284523145981_n.jpg',
    'Media Coverage/137199048_250527939753305_8838392367134492934_n.jpg',
    'Media Coverage/80955812_125172342288866_1851474089642819584_n.jpg',
    'Media Coverage/81435773_126144912191609_4860656347634466816_n.jpg',
    'Media Coverage/89630793_148154609990639_4308468306651643904_n.jpg',
    'Media Coverage/89773726_148154543323979_1189297343573262336_n.jpg',
    'Media Coverage/89796478_148154586657308_9135402619777318912_n.jpg',
    'Media Coverage/90146551_149627046510062_8785574084659380224_n.jpg',
    'Media Coverage/Screenshot 2025-12-24 015649.png',
    'Media Coverage/Screenshot 2025-12-24 015736.png',
    '1st 40 pictures/IMG_20170522_103102.jpg',
    '1st 40 pictures/IMG_20170522_103122.jpg',
    '1st 40 pictures/IMG_20170522_103910.jpg',
    '1st 40 pictures/IMG_20170522_110011.jpg',
    '1st 40 pictures/IMG_20170524_110103.jpg',
    '1st 40 pictures/IMG_20170530_092312.jpg',
    '1st 40 pictures/IMG_20170530_092647.jpg',
    '1st 40 pictures/IMG_20170530_092651.jpg',
    '1st 40 pictures/IMG_20170808_103723.jpg',
    '1st 40 pictures/IMG_20170908_105856_01.jpg',
    '1st 40 pictures/IMG_20170915_095955.jpg',
    '1st 40 pictures/IMG_20170923_131801.jpg',
    '1st 40 pictures/IMG_20170923_131853.jpg',
    '1st 40 pictures/IMG_20170924_105153.jpg',
    '1st 40 pictures/IMG_20170924_105202.jpg',
    '1st 40 pictures/IMG_20171008_105012.jpg',
    '1st 40 pictures/IMG_20171008_123534.jpg',
    '1st 40 pictures/IMG_20171108_110624.jpg',
    '1st 40 pictures/IMG_20171108_114720.jpg',
    '1st 40 pictures/IMG_20171108_123301.jpg',
    '1st 40 pictures/IMG_20171109_104745.jpg',
    '1st 40 pictures/IMG_20171109_114411.jpg',
    '1st 40 pictures/IMG_20171114_104205.jpg',
    '1st 40 pictures/IMG_20171114_104448.jpg',
    '1st 40 pictures/IMG_20171116_105905.jpg',
    '1st 40 pictures/IMG_20171217_155839.jpg',
    '1st 40 pictures/IMG_20171217_155854_001.jpg',
    '1st 40 pictures/IMG_20171217_155854_004.jpg',
    '1st 40 pictures/IMG_20171217_164403.jpg',
    '1st 40 pictures/IMG_20171217_165316.jpg',
    '1st 40 pictures/IMG_20180309_131726.jpg',
    '1st 40 pictures/IMG_20180516_071201.jpg',
    '1st 40 pictures/IMG_20180516_123812.jpg',
    '1st 40 pictures/IMG_20180518_105815.jpg',
    '1st 40 pictures/IMG_20180518_122112.jpg',
    '1st 40 pictures/IMG_20180523_132948.jpg',
    '1st 40 pictures/IMG_20180523_133049.jpg',
    '1st 40 pictures/IMG_20180829_104945.jpg'
];

function openLightbox(index) {
    currentImageIndex = index;
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    if (!lightboxOverlay || !lightboxImage) return;
    
    // Set the image source
    lightboxImage.src = mediaImages[currentImageIndex];
    lightboxImage.alt = `Media coverage article ${currentImageIndex + 1}`;
    
    // Update counter
    if (lightboxCounter) {
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${mediaImages.length}`;
    }
    
    // Show lightbox
    lightboxOverlay.classList.add('active');
    lightboxOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus on close button for accessibility
    const closeBtn = document.getElementById('lightboxClose');
    if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 100);
    }
}

function closeLightbox() {
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    if (!lightboxOverlay) return;
    
    lightboxOverlay.classList.remove('active');
    lightboxOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % mediaImages.length;
    updateLightboxImage();
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + mediaImages.length) % mediaImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    if (lightboxImage) {
        lightboxImage.src = mediaImages[currentImageIndex];
        lightboxImage.alt = `Media coverage article ${currentImageIndex + 1}`;
    }
    
    if (lightboxCounter) {
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${mediaImages.length}`;
    }
}

// Initialize lightbox event listeners
document.addEventListener('DOMContentLoaded', () => {
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxPrev = document.getElementById('lightboxPrev');
    
    // Close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Next button
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });
    }
    
    // Previous button
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrevImage();
        });
    }
    
    // Close on overlay click (but not on image or buttons)
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation and focus trap
    document.addEventListener('keydown', (e) => {
        if (lightboxOverlay && lightboxOverlay.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'Tab') {
                const focusable = lightboxOverlay.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    });
    
    // Prevent body scroll when lightbox is open
    const observer = new MutationObserver(() => {
        if (lightboxOverlay && lightboxOverlay.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    if (lightboxOverlay) {
        observer.observe(lightboxOverlay, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});

// Instagram Carousel Functionality
let currentInstagramIndex = 0;
let instagramAutoPlayInterval = null;
const instagramAutoPlayDelay = 5000; // 5 seconds

function initInstagramCarousel() {
    const carousel = document.getElementById('instagramCarousel');
    const track = document.getElementById('instagramTrack');
    const prevBtn = document.getElementById('instagramPrev');
    const nextBtn = document.getElementById('instagramNext');
    const posts = track ? track.querySelectorAll('.instagram-post') : [];
    
    if (!carousel || !track || posts.length === 0) return;
    
    const totalPosts = posts.length;
    
    // Function to update carousel position
    function updateCarouselPosition() {
        const translateX = -currentInstagramIndex * 100;
        track.style.transform = `translateX(${translateX}%)`;
    }
    
    // Function to go to next post
    function nextInstagramPost() {
        currentInstagramIndex = (currentInstagramIndex + 1) % totalPosts;
        updateCarouselPosition();
    }
    
    // Function to go to previous post
    function prevInstagramPost() {
        currentInstagramIndex = (currentInstagramIndex - 1 + totalPosts) % totalPosts;
        updateCarouselPosition();
    }
    
    // Auto-play functionality
    function startAutoPlay() {
        stopAutoPlay(); // Clear any existing interval
        instagramAutoPlayInterval = setInterval(() => {
            nextInstagramPost();
        }, instagramAutoPlayDelay);
    }
    
    function stopAutoPlay() {
        if (instagramAutoPlayInterval) {
            clearInterval(instagramAutoPlayInterval);
            instagramAutoPlayInterval = null;
        }
    }
    
    // Event listeners will be set up later with embed support
    
    // Pause auto-play when user interacts with carousel
    if (track) {
        track.addEventListener('touchstart', stopAutoPlay);
        track.addEventListener('touchend', () => {
            setTimeout(startAutoPlay, 2000); // Resume after 2 seconds
        });
    }
    
    // Keyboard navigation (will be set up after wrapper functions)
    
    // Wrapper to re-initialize Instagram embeds
    const nextWithEmbed = () => {
        nextInstagramPost();
        if (typeof instgrm !== 'undefined') {
            setTimeout(() => instgrm.Embeds.process(), 100);
        }
    };
    
    const prevWithEmbed = () => {
        prevInstagramPost();
        if (typeof instgrm !== 'undefined') {
            setTimeout(() => instgrm.Embeds.process(), 100);
        }
    };
    
    // Update auto-play to use wrapper
    const startAutoPlayWithEmbed = () => {
        stopAutoPlay();
        instagramAutoPlayInterval = setInterval(() => {
            nextWithEmbed();
        }, instagramAutoPlayDelay);
    };
    
    // Update button listeners
    if (nextBtn) {
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            nextWithEmbed();
            stopAutoPlay();
            startAutoPlayWithEmbed();
        };
    }
    
    if (prevBtn) {
        prevBtn.onclick = (e) => {
            e.stopPropagation();
            prevWithEmbed();
            stopAutoPlay();
            startAutoPlayWithEmbed();
        };
    }
    
    // Update hover events
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlayWithEmbed);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && document.activeElement !== prevBtn) {
            prevWithEmbed();
            stopAutoPlay();
            startAutoPlayWithEmbed();
        } else if (e.key === 'ArrowRight' && document.activeElement !== nextBtn) {
            nextWithEmbed();
            stopAutoPlay();
            startAutoPlayWithEmbed();
        }
    });
    
    // Initialize
    updateCarouselPosition();
    startAutoPlayWithEmbed();
}

// Initialize Instagram carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initInstagramCarousel();
});
