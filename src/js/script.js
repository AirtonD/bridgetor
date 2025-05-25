// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mainNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Specialist Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const specialistCards = document.querySelectorAll('.specialist-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            specialistCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Pre-registration Form Submission
    const preRegistrationForm = document.getElementById('pre-registration-form');
    const successModal = document.getElementById('success-modal');
    const pixModal = document.getElementById('pix-modal');
    
    if (preRegistrationForm) {
        preRegistrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real implementation, you would send the form data to a server
            // For this demo, we'll show the PIX payment modal
            if (pixModal) {
                pixModal.classList.add('active');
            }
            
            // Reset form
            this.reset();
        });
    }
    
    // PIX Modal Close Buttons
    const closePixModalBtns = document.querySelectorAll('.close-pix-modal, .cancel-pix');
    closePixModalBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (pixModal) {
                pixModal.classList.remove('active');
            }
        });
    });
    
    // PIX Payment Confirmation
    const pixConfirmBtn = document.querySelector('.pix-btn');
    if (pixConfirmBtn) {
        pixConfirmBtn.addEventListener('click', function() {
            if (pixModal) {
                pixModal.classList.remove('active');
            }
            if (successModal) {
                successModal.classList.add('active');
            }
        });
    }
    
    // Modal Close Buttons
    const closeModalBtns = document.querySelectorAll('.close-modal, .close-btn');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check on initial load
});
