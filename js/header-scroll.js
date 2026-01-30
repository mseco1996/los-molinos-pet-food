/**
 * Header Scroll Effect
 */
window.initHeaderScroll = function () {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
};

/**
 * Mobile Menu Toggle System (Hardy Architecture)
 */
window.toggleMobileMenu = function () {
    const mobileNav = document.querySelector('.mobile-nav');
    const backdrop = document.querySelector('.mobile-backdrop');
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const closeBtn = document.querySelector('.mobile-nav-close');

    if (!mobileNav || !backdrop) return;

    // Toggle active states
    const isOpen = mobileNav.classList.contains('active');

    if (isOpen) {
        // Close menu
        mobileNav.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';

        // Update icon
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    } else {
        // Open menu
        mobileNav.classList.add('active');
        backdrop.classList.add('active');
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';

        // Update icon
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        }
    }
};

/**
 * Close menu when clicking on a link
 */
document.addEventListener('DOMContentLoaded', function () {
    // Wait for mobile nav to be loaded
    setTimeout(function () {
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function () {
                const mobileNav = document.querySelector('.mobile-nav');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    toggleMobileMenu();
                }
            });
        });
    }, 500);
});

/**
 * Close menu on ESC key
 */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const mobileNav = document.querySelector('.mobile-nav');
        if (mobileNav && mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
});
