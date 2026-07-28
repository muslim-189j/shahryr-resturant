/* ==========================================================================
   SHAHRYAR RESTAURANT - LUXURY INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ----------------------------------------------------------------------
     * 1. PRELOADER & TYPING EFFECT
     * ---------------------------------------------------------------------- */
    const preloader = document.getElementById('preloader');
    const loadingBar = document.getElementById('loadingBar');
    const typingTextElement = document.getElementById('typingLoadingText');
    
    const loadingPhrases = [
        "Preparing Your Dining Experience...",
        "Firing Up The Charcoal Embers...",
        "Selecting Fresh Farm Ingredients...",
        "Welcome To Shahryar Restaurant"
    ];

    let currentPhraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    // Typing Effect Function
    function typeEffect() {
        if (!typingTextElement) return;
        const currentPhrase = loadingPhrases[currentPhraseIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 1000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % loadingPhrases.length;
            typeSpeed = 300;
        }

        if (preloader && !preloader.classList.contains('hidden')) {
            setTimeout(typeEffect, typeSpeed);
        }
    }

    if (typingTextElement) {
        typeEffect();
    }

    // Progress Bar Simulation
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress > 100) progress = 100;
        
        if (loadingBar) {
            loadingBar.style.width = `${progress}%`;
        }

        if (progress === 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                if (preloader) {
                    preloader.classList.add('hidden');
                    initScrollReveal();
                    initAnimatedCounters();
                }
            }, 500);
        }
    }, 120);

    // Fail-safe to remove preloader after 3 seconds anyway
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
        }
    }, 3000);


    /* ----------------------------------------------------------------------
     * 2. CUSTOM CURSOR & GLOW EFFECT
     * ---------------------------------------------------------------------- */
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorGlow = document.querySelector('[data-cursor-glow]');

    if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorGlow) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorGlow.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 400, fill: "forwards" });
        });

        const clickables = document.querySelectorAll('a, button, input, select, textarea, .gallery-item, .signature-card');
        clickables.forEach(elem => {
            elem.addEventListener('mouseenter', () => {
                cursorGlow.style.width = '60px';
                cursorGlow.style.height = '60px';
                cursorGlow.style.borderColor = 'var(--accent-gold)';
            });
            elem.addEventListener('mouseleave', () => {
                cursorGlow.style.width = '40px';
                cursorGlow.style.height = '40px';
                cursorGlow.style.borderColor = 'rgba(212, 175, 55, 0.5)';
            });
        });
    }


    /* ----------------------------------------------------------------------
     * 3. SCROLL PROGRESS BAR & STICKY HEADER
     * ---------------------------------------------------------------------- */
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const mainHeader = document.getElementById('mainHeader');
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        if (scrollProgressBar) {
            scrollProgressBar.style.width = `${scrollPercent}%`;
        }

        if (mainHeader) {
            if (scrollTop > 80) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        }

        if (backToTopBtn) {
            if (scrollTop > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        updateActiveNavLink();
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    /* ----------------------------------------------------------------------
     * 4. MOBILE NAVIGATION DRAWER
     * ---------------------------------------------------------------------- */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburgerBtn.classList.toggle('open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (hamburgerBtn) hamburgerBtn.classList.remove('open');
            });
        });
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }


    /* ----------------------------------------------------------------------
     * 5. SCROLL REVEAL ANIMATIONS
     * ---------------------------------------------------------------------- */
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('[data-reveal]');

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }


    /* ----------------------------------------------------------------------
     * 6. ANIMATED COUNTERS
     * ---------------------------------------------------------------------- */
    function initAnimatedCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        let animated = false;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    statNumbers.forEach(counter => {
                        const target = +counter.getAttribute('data-count');
                        const speed = 200;
                        
                        const updateCount = () => {
                            const count = +counter.innerText;
                            const inc = target / speed;

                            if (count < target) {
                                counter.innerText = Math.ceil(count + inc);
                                setTimeout(updateCount, 15);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCount();
                    });
                }
            });
        }, { threshold: 0.5 });

        const heroStats = document.querySelector('.hero-quick-stats');
        if (heroStats) {
            counterObserver.observe(heroStats);
        }
    }


    /* ----------------------------------------------------------------------
     * 7. COMPLETE FOOD MENU FILTERING SYSTEM
     * ---------------------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.menu-filter-btn');
    const menuItems = document.querySelectorAll('.menu-item-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            menuItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === category) {
                    item.style.display = 'flex';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    /* ----------------------------------------------------------------------
     * 8. 3D CARD TILT EFFECT
     * ---------------------------------------------------------------------- */
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
        });
    });


    /* ----------------------------------------------------------------------
     * 9. LIGHTBOX POPUP FOR GALLERY
     * ---------------------------------------------------------------------- */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');

    if (galleryItems && lightboxModal && lightboxImage) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.getAttribute('data-lightbox-src');
                if (imgSrc) {
                    lightboxImage.setAttribute('src', imgSrc);
                    lightboxModal.style.display = 'flex';
                }
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightboxModal.style.display = 'none';
            });
        }

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.style.display = 'none';
            }
        });
    }


    /* ----------------------------------------------------------------------
     * 10. RESERVATION FORM HANDLING
     * ---------------------------------------------------------------------- */
    const bookingForm = document.getElementById('bookingForm');
    const formFeedback = document.getElementById('formFeedback');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('resName')?.value || 'Guest';
            const phone = document.getElementById('resPhone')?.value || '';
            const guests = document.getElementById('resGuests')?.value || '1';
            const date = document.getElementById('resDate')?.value || '';
            const time = document.getElementById('resTime')?.value || '';

            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : '';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Processing Request...</span>';
            }

            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }

                if (formFeedback) {
                    formFeedback.style.color = '#D4AF37';
                    formFeedback.innerHTML = `Thank you, <strong>${name}</strong>! Your table for ${guests} on ${date} at ${time} has been requested. Our team will contact you at ${phone} to confirm.`;
                }

                bookingForm.reset();
            }, 1500);
        });
    }

});