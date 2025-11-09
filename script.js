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
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = modal.querySelector('input, select, textarea');
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

// CTA button interactions
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Add a temporary success message
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
    
    // Email validation
    if (fieldName === 'email' && value) {
        // More comprehensive email regex that handles edge cases
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(value)) {
            showFieldError(formGroup, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation (if provided)
    if (fieldName === 'phone' && value) {
        // Get country code and combine with phone number
        const countryCodeSelect = formGroup.querySelector('#phoneCountryCode');
        const countryCode = countryCodeSelect ? countryCodeSelect.value : '+91';
        const fullPhoneNumber = countryCode + value;
        
        // More flexible phone regex that allows numbers starting with 0
        const cleanedPhone = fullPhoneNumber.replace(/[\s\-\(\)]/g, ''); // Remove spaces, dashes, parentheses
        const phoneRegex = /^[\+]?[0-9]\d{6,19}$/; // Must start with 0-9, then 6-19 more digits
        if (!phoneRegex.test(cleanedPhone)) {
            showFieldError(formGroup, 'Please enter a valid phone number (7-20 digits)');
            return false;
        }
    }
    
    // Message length validation
    if (fieldName === 'message' && value && value.length < 10) {
        showFieldError(formGroup, 'Message must be at least 10 characters long');
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
    
    // Validate all fields
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fix the errors above', 'error');
        return;
    }
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        
        // Clear all success and error states
        clearAllContactErrors();
        
        // Show thank you screen
        showThankYouScreen();
        
    }, 2000);
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
    
    // Email validation
    if (fieldName === 'bookingEmail' && value) {
        // More comprehensive email regex that handles edge cases
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(value)) {
            showBookingFieldError(formGroup, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (fieldName === 'bookingPhone' && value) {
        // Get country code and combine with phone number
        const countryCodeSelect = formGroup.querySelector('#bookingPhoneCountryCode');
        const countryCode = countryCodeSelect ? countryCodeSelect.value : '+91';
        const fullPhoneNumber = countryCode + value;
        
        // More flexible phone regex that allows numbers starting with 0
        const cleanedPhone = fullPhoneNumber.replace(/[\s\-\(\)]/g, ''); // Remove spaces, dashes, parentheses
        const phoneRegex = /^[\+]?[0-9]\d{6,19}$/; // Must start with 0-9, then 6-19 more digits
        if (!phoneRegex.test(cleanedPhone)) {
            showBookingFieldError(formGroup, 'Please enter a valid phone number (7-20 digits)');
            return false;
        }
    }
    
    // Date validation
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
        if (isNaN(count) || count < 1 || count > 500) {
            showBookingFieldError(formGroup, 'Please enter a valid number between 1 and 500');
            return false;
        }
    }
    
    // Special requirements length validation
    if (fieldName === 'specialRequirements' && value && value.length < 10) {
        showBookingFieldError(formGroup, 'Please provide more details (at least 10 characters)');
        return false;
    }
    
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
    
    // Validate all fields
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (!validateBookingField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fix the errors above', 'error');
        return;
    }
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
    submitButton.disabled = true;
    
    // Simulate booking submission (replace with actual API call)
    setTimeout(() => {
        // Show thank you screen
        showThankYouScreen();
        
        // Reset button
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        
    }, 2000);
}
