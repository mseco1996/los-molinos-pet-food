/**
 * Product Carousel Logic (Hardy Architecture)
 * Handles swipe gestures, resistance, snapping AND Arrow Navigation
 */

class HardyCarousel {
    constructor(containerId, trackId) {
        this.container = document.querySelector(containerId);
        this.track = document.getElementById(trackId);
        if (!this.container || !this.track) return;

        this.slides = Array.from(this.track.children);
        this.indicatorsContainer = document.getElementById('hardyIndicators');

        // Navigation Buttons
        this.prevBtn = this.container.querySelector('.prev-btn');
        this.nextBtn = this.container.querySelector('.next-btn');

        // State
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.currentIndex = 0;
        this.animationID = 0;

        // Configuration
        this.threshold = 50;

        this.init();
    }

    init() {
        // Touch / Mouse Events
        this.track.addEventListener('touchstart', this.touchStart.bind(this));
        this.track.addEventListener('touchend', this.touchEnd.bind(this));
        this.track.addEventListener('touchmove', this.touchMove.bind(this));

        this.track.addEventListener('mousedown', this.touchStart.bind(this));
        this.track.addEventListener('mouseup', this.touchEnd.bind(this));
        this.track.addEventListener('mouseleave', this.touchEnd.bind(this));
        this.track.addEventListener('mousemove', this.touchMove.bind(this));

        this.track.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });

        // Resize Observer
        window.addEventListener('resize', this.updateDimensions.bind(this));

        // Arrow Navigation
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                if (this.currentIndex > 0) {
                    this.currentIndex--;
                    this.setPositionByIndex();
                } else {
                    // Loop to end (optional) or bounce effect
                    this.currentIndex = this.getMaxIndex(); // Loop to last
                    this.setPositionByIndex();
                }
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                if (this.currentIndex < this.getMaxIndex()) {
                    this.currentIndex++;
                    this.setPositionByIndex();
                } else {
                    // Loop to start
                    this.currentIndex = 0;
                    this.setPositionByIndex();
                }
            });
        }

        // Init state
        this.createIndicators();
        this.updateIndicators();
    }

    getSlidesPerView() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 640) return 2;
        return 1;
    }

    getSlideWidth() {
        return this.container.offsetWidth / this.getSlidesPerView();
    }

    getMaxIndex() {
        // Total positions = Total Slides - Slides Per View + 1 ???
        // Actually, simple carousel logic: index 0 to (Total - SlidesPerView)
        // If we have 5 slides and show 3, max index is 2 (shows 3,4,5).
        return Math.max(0, this.slides.length - this.getSlidesPerView());
    }

    touchStart(index) {
        return (event) => {
            this.isDragging = true;
            this.startPos = this.getPositionX(event);
            this.animationID = requestAnimationFrame(this.animation.bind(this));
            this.track.style.cursor = 'grabbing';
            this.track.style.transition = 'none'; // Disable transition for drag
        }
    }

    touchMove(event) {
        if (this.isDragging) {
            const currentPosition = this.getPositionX(event);
            this.currentTranslate = this.prevTranslate + currentPosition - this.startPos;
        }
    }

    touchEnd() {
        this.isDragging = false;
        cancelAnimationFrame(this.animationID);
        this.track.style.cursor = 'grab';

        const movedBy = this.currentTranslate - this.prevTranslate;

        // Determine direction and snap
        if (movedBy < -this.threshold && this.currentIndex < this.getMaxIndex()) {
            this.currentIndex += 1;
        } else if (movedBy > this.threshold && this.currentIndex > 0) {
            this.currentIndex -= 1;
        }

        this.setPositionByIndex();
    }

    getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    animation() {
        this.setSliderPosition();
        if (this.isDragging) requestAnimationFrame(this.animation.bind(this));
    }

    setSliderPosition() {
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    setPositionByIndex() {
        const slideWidth = this.getSlideWidth();
        this.currentTranslate = this.currentIndex * -slideWidth;
        this.prevTranslate = this.currentTranslate;

        this.track.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
        this.setSliderPosition();
        this.updateIndicators();
    }

    createIndicators() {
        if (!this.indicatorsContainer) return;
        this.indicatorsContainer.innerHTML = '';

        // Dots: one for each possible start position
        // If 5 slides, view 1 -> 5 dots (indices 0,1,2,3,4)
        // If 5 slides, view 3 -> 3 dots (indices 0,1,2) -> shows [0,1,2], [1,2,3], [2,3,4]

        const maxIdx = this.getMaxIndex();

        for (let i = 0; i <= maxIdx; i++) {
            const dot = document.createElement('div');
            dot.classList.add('h-indicator');
            dot.addEventListener('click', () => {
                this.currentIndex = i;
                this.setPositionByIndex();
            });
            this.indicatorsContainer.appendChild(dot);
        }
    }

    updateIndicators() {
        if (!this.indicatorsContainer) return;
        const dots = Array.from(this.indicatorsContainer.children);
        dots.forEach((dot, index) => {
            if (index === this.currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    updateDimensions() {
        this.track.style.transition = 'none';

        // Ensure index is valid for new view count
        const maxIdx = this.getMaxIndex();
        if (this.currentIndex > maxIdx) this.currentIndex = maxIdx;

        this.setPositionByIndex();
        this.createIndicators();
        this.updateIndicators();
    }
}

function initProductCarousel() {
    new HardyCarousel('.hardy-carousel-container', 'hardyCarouselTrack');
}

window.initProductCarousel = initProductCarousel;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductCarousel);
} else {
    initProductCarousel();
}
