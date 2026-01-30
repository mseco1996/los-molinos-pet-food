/**
 * Product Carousel Logic (Hardy Architecture)
 * Handles swipe gestures, resistance, and snapping
 */

class HardyCarousel {
    constructor(containerId, trackId) {
        this.container = document.querySelector(containerId);
        this.track = document.getElementById(trackId);
        if (!this.container || !this.track) return;

        this.slides = Array.from(this.track.children);
        this.indicatorsContainer = document.getElementById('hardyIndicators');

        // State
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.currentIndex = 0;
        this.animationID = 0;

        // Configuration
        this.threshold = 50; // Drag threshold to snap

        this.init();
    }

    init() {
        // Event Listeners
        this.track.addEventListener('touchstart', this.touchStart.bind(this));
        this.track.addEventListener('touchend', this.touchEnd.bind(this));
        this.track.addEventListener('touchmove', this.touchMove.bind(this));

        this.track.addEventListener('mousedown', this.touchStart.bind(this));
        this.track.addEventListener('mouseup', this.touchEnd.bind(this));
        this.track.addEventListener('mouseleave', this.touchEnd.bind(this));
        this.track.addEventListener('mousemove', this.touchMove.bind(this));

        // Prevent context menu on images
        this.track.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });

        // Resize observer to handle responsiveness
        window.addEventListener('resize', this.updateDimensions.bind(this));

        // Initialize indicators
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
        return this.slides.length - this.getSlidesPerView();
    }

    touchStart(index) {
        return (event) => {
            this.isDragging = true;
            this.startPos = this.getPositionX(event);
            this.animationID = requestAnimationFrame(this.animation.bind(this));
            this.track.style.cursor = 'grabbing';
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
        // Calculate snap position
        this.currentTranslate = this.currentIndex * -slideWidth;
        this.prevTranslate = this.currentTranslate;

        // Apply transform with transition
        this.track.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
        this.setSliderPosition();

        // Reset transition after animation
        setTimeout(() => {
            if (this.isDragging) this.track.style.transition = 'none';
        }, 300);

        this.updateIndicators();
    }

    createIndicators() {
        if (!this.indicatorsContainer) return;
        this.indicatorsContainer.innerHTML = '';

        // Create an indicator for each possible starting position
        const totalDots = this.slides.length - this.getSlidesPerView() + 1;

        for (let i = 0; i < totalDots; i++) {
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
        // Re-calculate position on resize to keep correct slide in view
        this.track.style.transition = 'none'; // Disable transition for resize
        this.setPositionByIndex();
        this.createIndicators(); // Re-create indicators as pages might change
        this.updateIndicators();
    }
}

// Initialize when DOM is ready or component loaded
function initProductCarousel() {
    new HardyCarousel('.hardy-carousel-container', 'hardyCarouselTrack');
}

// Expose to window for loader
window.initProductCarousel = initProductCarousel;

// Auto-init if DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductCarousel);
} else {
    initProductCarousel();
}
