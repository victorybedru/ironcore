// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const pages = document.querySelector('.pages');
    const body = document.body;
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    function toggleMenu() {
        hamburger.classList.toggle('active');
        pages.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('menu-open');
    }
    
    // Hamburger click
    hamburger.addEventListener('click', toggleMenu);
    
    // Overlay click to close menu
    overlay.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on links (optional)
    const navLinks = document.querySelectorAll('.lists a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });
    
    // Close menu on window resize (if resized to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            pages.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
    
    // ESC key to close menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && pages.classList.contains('active')) {
            toggleMenu();
        }
    });
});
// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.hidden-section').forEach(section => {
    observer.observe(section);
});

// Counter animation
const counters = document.querySelectorAll('.counter');
const speed = 200;

const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = target / speed;

    if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(() => animateCounter(counter), 1);
    } else {
        counter.innerText = target;
    }
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// Sticky header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// BMI Calculator
function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100; // convert cm to m
    const resultDiv = document.getElementById('bmi-result');

    if (!weight || !height || height <= 0 || weight <= 0) {
        resultDiv.innerHTML = '<span style="color: red;">Please enter valid values</span>';
        return;
    }

    const bmi = weight / (height * height);
    let category = '';

    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    resultDiv.innerHTML = `Your BMI: <span style="color: #ff0000; font-size: 2rem;">${bmi.toFixed(1)}</span><br>Category: ${category}`;
}

// Add fade-in animation to elements on load
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.heroContent, .aboutSection, .service');
    elements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
        el.classList.add('fade-in');
    });
});

// Gallery Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Lightbox functionality
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const closeLightbox = document.querySelector('.close-lightbox');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    if (viewButtons.length > 0) {
        viewButtons.forEach((button, index) => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const galleryItem = this.closest('.gallery-item');
                const img = galleryItem.querySelector('img');
                const title = galleryItem.querySelector('h3').textContent;
                const desc = galleryItem.querySelector('p').textContent;
                
                lightboxImg.src = img.src;
                lightboxTitle.textContent = title;
                lightboxDesc.textContent = desc;
                lightbox.style.display = 'flex';
            });
        });
    }
    
    // Close lightbox
    if (closeLightbox) {
        closeLightbox.addEventListener('click', function() {
            lightbox.style.display = 'none';
        });
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }
});

// Before-After Slider Functionality - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    const beforeAfterContainers = document.querySelectorAll('.before-after');
    
    beforeAfterContainers.forEach(container => {
        let isResizing = false;
        const after = container.querySelector('.after');
        const handle = container.querySelector('.slider-handle');
        
        function updateSlider(clientX) {
            const containerRect = container.getBoundingClientRect();
            const relativeX = clientX - containerRect.left;
            const percentage = (relativeX / containerRect.width) * 100;
            const clampedPercentage = Math.max(0, Math.min(100, percentage));
            
            after.style.width = clampedPercentage + '%';
            handle.style.left = clampedPercentage + '%';
        }
        
        // Mouse events
        container.addEventListener('mousedown', function(e) {
            isResizing = true;
            updateSlider(e.clientX);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', stopResize);
        });
        
        function handleMouseMove(e) {
            if (!isResizing) return;
            updateSlider(e.clientX);
        }
        
        // Touch events for mobile
        container.addEventListener('touchstart', function(e) {
            isResizing = true;
            updateSlider(e.touches[0].clientX);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', stopResize);
        });
        
        function handleTouchMove(e) {
            if (!isResizing) return;
            updateSlider(e.touches[0].clientX);
        }
        
        function stopResize() {
            isResizing = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('mouseup', stopResize);
            document.removeEventListener('touchend', stopResize);
        }
        
        // Click to move slider
        container.addEventListener('click', function(e) {
            updateSlider(e.clientX);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    
    // Add scroll animations for plan page elements
    const planSections = document.querySelectorAll('.price-card, .nutrition-card, .benefit-item');
    const planObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });
    
    planSections.forEach(section => {
        planObserver.observe(section);
    });
});
// Footer animation
document.addEventListener('DOMContentLoaded', function() {
    const footerSections = document.querySelectorAll('.footer-section');
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });
    
    footerSections.forEach(section => {
        footerObserver.observe(section);
    });
    
    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('.newsletter-input').value;
            if (email) {
                alert('Thank you for subscribing to IronCore updates!');
                this.reset();
            }
        });
    }
});