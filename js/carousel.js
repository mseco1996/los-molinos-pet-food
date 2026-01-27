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
