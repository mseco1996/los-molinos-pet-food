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
 * Mobile Menu Toggle System
 */
window.toggleMobileMenu = function () {
    const nav = document.querySelector('.nav');
    const toggleBtnIcon = document.querySelector('.mobile-menu-toggle i');

    if (!nav) return;

    nav.classList.toggle('active');

    // Toggle icon and body scroll
    if (nav.classList.contains('active')) {
        if (toggleBtnIcon) {
            toggleBtnIcon.classList.remove('fa-bars');
            toggleBtnIcon.classList.add('fa-times');
        }
        document.body.style.overflow = 'hidden'; // Lock scroll
    } else {
        if (toggleBtnIcon) {
            toggleBtnIcon.classList.remove('fa-times');
            toggleBtnIcon.classList.add('fa-bars');
        }
        document.body.style.overflow = ''; // Unlock scroll
    }
};

// Close mobile menu when clicking a link
document.addEventListener('click', function (e) {
    if (e.target.closest('.nav a')) {
        const nav = document.querySelector('.nav');
        // Only close if it's actually open (mobile mode)
        if (nav && nav.classList.contains('active')) {
            window.toggleMobileMenu();
        }
    }
});
