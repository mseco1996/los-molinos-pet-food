/**
 * Simple HTML Fragment Loader
 * Loads HTML components into placeholders
 */

async function loadComponent(id, file) {
    const container = document.getElementById(id);
    if (!container) return; // Container missing

    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}: ${response.statusText}`);
        const html = await response.text();
        container.innerHTML = html;

        // Execute scripts inside the fetched HTML if any (innerHTML doesn't exec scripts by default)
        // Note: Our fragments are mostly static, but if they had inline scripts, we'd need to eval them.
        // For this refactor, we moved inline scripts to separate JS files, which is safer.

    } catch (error) {
        console.error(`Error loading component ${id}:`, error);
        container.innerHTML = `<p style="color:red">Error loading content.</p>`;
    }
}

async function initApp() {
    // 1. Load all HTML fragments separately
    await Promise.all([
        loadComponent('header-container', 'html/header.html'),
        loadComponent('hero-container', 'html/hero.html'),
        loadComponent('beneficios-container', 'html/beneficios.html'),
        loadComponent('conocenos-container', 'html/conocenos.html'),
        loadComponent('lineas-container', 'html/lineas.html'),
        loadComponent('catalogo-container', 'html/catalogo.html'),
        loadComponent('productos-container', 'html/productos.html'),
        loadComponent('puntos-venta-container', 'html/puntos-venta.html'),
        loadComponent('contacto-container', 'html/contacto.html'),
        loadComponent('footer-container', 'html/footer.html'),
        loadComponent('footer-container', 'html/footer.html')
    ]);

    // 2. Initialize Logic after DOM is ready
    console.log('All components loaded, initializing scripts...');

    // Header Scroll
    if (window.initHeaderScroll) window.initHeaderScroll();

    // Carousel
    // Just ensure it's in a valid state (updateCarousel handles null check)
    if (window.updateCarousel) window.updateCarousel();

    // Re-initialize any other libs if needed (e.g. if tabs need init, but they seem to use onclick inline)

    // 3. Dispatch an event for other scripts (like cart.js)
    document.dispatchEvent(new Event('componentsLoaded'));
}

// Start loading when main DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
