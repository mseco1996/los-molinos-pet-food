let currentCarouselSlide = 0;
const totalCarouselSlides = 5;

// Make these functions global so they can be called from onclick handlers in the HTML
window.moveCarousel = function (direction) {
    currentCarouselSlide += direction;

    if (currentCarouselSlide < 0) {
        currentCarouselSlide = totalCarouselSlides - 1;
    } else if (currentCarouselSlide >= totalCarouselSlides) {
        currentCarouselSlide = 0;
    }

    updateCarousel();
};

window.goToSlide = function (index) {
    currentCarouselSlide = index;
    updateCarousel();
};

window.updateCarousel = function () {
    const track = document.getElementById('carouselTrack');
    const indicators = document.querySelectorAll('.indicator');

    // Safety check: if element doesn't exist yet (loading)
    if (!track) return;

    track.style.transform = `translateX(-${currentCarouselSlide * 100}%)`;

    indicators.forEach((indicator, index) => {
        if (index === currentCarouselSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
};

// Touch / Swipe Support
document.addEventListener('DOMContentLoaded', () => {
    // We delegate because the carousel might be loaded dynamically
    // But since the containers exist, we can try to attach to the container if it's there
    // Or attach to document and check target.

    // Better strategy: Since loader.js inits logic, let's wait for logic init
    // Or just attach a MutationObserver or a simple periodic check, or just check every click?
    // Touchstart is robust enough on document.

    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50; // min swipe distance
        const carouselTrack = document.getElementById('carouselTrack');

        // Ensure we only swipe if we interacted with the carousel
        // Check if the touch event happened inside .carousel-wrapper
        // Since we are using document listener, we can't easily check e.target of touchstart here 
        // without saving it.
        // Let's rely on the fact that if a user swipes horizontally significantly, they likely intend to swipe the main slider if it's visible.
        // But to be safe, let's limit scope. 
    }
});


// Robust init for Swipe attached to the element content when loaded
window.initCarouselSwipe = function () {
    const slider = document.querySelector('.carousel-wrapper');
    if (!slider) return;

    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            window.moveCarousel(1); // Swipe Left -> Next
        }
        if (touchEndX - touchStartX > 50) {
            window.moveCarousel(-1); // Swipe Right -> Prev
        }
    }, { passive: true });
};

// Hook into the loader
document.addEventListener('componentsLoaded', () => {
    window.initCarouselSwipe();
});
