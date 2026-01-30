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
    const mobileMenu = document.querySelector('.mobile-menu');
    const backdrop = document.querySelector('.mobile-backdrop');

    if (!mobileMenu || !backdrop) return;

    // Toggle active states
    const isOpen = mobileMenu.classList.contains('menu-open');

    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
};

function openMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const backdrop = document.querySelector('.mobile-backdrop');

    mobileMenu?.classList.add('menu-open');
    backdrop?.classList.add('backdrop-open');
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    // Update hamburger icon to X
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    }
}

function closeMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const backdrop = document.querySelector('.mobile-backdrop');

    mobileMenu?.classList.remove('menu-open');
    backdrop?.classList.remove('backdrop-open');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = ''; // Restore scroll

    // Update X icon back to hamburger
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}

/**
 * Update active nav link based on current section
 */
function updateActiveNavLink() {
    const currentPath = window.location.hash || '#';
    const navLinks = document.querySelectorAll('[data-nav-link]');

    navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === '#')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', function () {
    // Wait for mobile nav to be loaded
    setTimeout(function () {
        const navLinks = document.querySelectorAll('[data-nav-link]');
        const backdrop = document.querySelector('.mobile-backdrop');

        // Update active link on page load
        updateActiveNavLink();

        // Update active link when hash changes
        window.addEventListener('hashchange', updateActiveNavLink);

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('menu-open')) {
                    closeMenu();
                }
            });
        });

        // Close menu when clicking backdrop
        backdrop?.addEventListener('click', function () {
            closeMenu();
        });
    }, 500);
});

/**
 * Close menu on ESC key
 */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('menu-open')) {
            closeMenu();
        }
    }
});
