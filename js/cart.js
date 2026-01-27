// ==========================================
// CARRITO DE COMPRAS - DELEITA
// ==========================================

// Inicializar carrito desde localStorage
let cart = JSON.parse(localStorage.getItem('deleitaCart')) || [];

// Actualizar UI al cargar la página
document.addEventListener('componentsLoaded', () => {
    updateCartUI();
});

// Incrementar cantidad
function increaseQty(productId) {
    const input = document.getElementById(`qty-${productId}`);
    input.value = parseInt(input.value) + 1;
}

// Decrementar cantidad
function decreaseQty(productId) {
    const input = document.getElementById(`qty-${productId}`);
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Agregar al carrito
function addToCart(productId, productName, price, image) {
    const qty = parseInt(document.getElementById(`qty-${productId}`).value);

    // Buscar si el producto ya existe en el carrito
    const existingProduct = cart.find(item => item.id === productId && !item.options);

    if (existingProduct) {
        existingProduct.quantity += qty;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: qty,
            image: image
        });
    }

    // Guardar en localStorage
    localStorage.setItem('deleitaCart', JSON.stringify(cart));

    // Actualizar UI
    updateCartUI();

    // Mostrar feedback
    showAddedFeedback();

    // Resetear cantidad a 1
    document.getElementById(`qty-${productId}`).value = 1;
}

// Agregar al carrito con opciones (peso/sabor)
function addToCartWithOptions(productId, productName, price, image, pesoSelectId, saborSelectId = null) {
    const qty = parseInt(document.getElementById(`qty-${productId}`).value);
    const peso = document.getElementById(pesoSelectId).value;
    const sabor = saborSelectId ? document.getElementById(saborSelectId).value : null;

    // Crear nombre completo con opciones
    let fullName = productName;
    if (sabor) {
        fullName += ` - ${sabor} - ${peso}`;
    } else {
        fullName += ` - ${peso}`;
    }

    // Crear ID único con opciones
    const uniqueId = `${productId}-${peso}${sabor ? `-${sabor}` : ''}`;

    // Buscar si el producto con las mismas opciones ya existe
    const existingProduct = cart.find(item => item.id === uniqueId);

    if (existingProduct) {
        existingProduct.quantity += qty;
    } else {
        cart.push({
            id: uniqueId,
            name: fullName,
            price: price,
            quantity: qty,
            image: image,
            options: {
                peso: peso,
                sabor: sabor
            }
        });
    }

    // Guardar en localStorage
    localStorage.setItem('deleitaCart', JSON.stringify(cart));

    // Actualizar UI
    updateCartUI();

    // Mostrar feedback
    showAddedFeedback();

    // Resetear cantidad a 1
    document.getElementById(`qty-${productId}`).value = 1;
}

// Remover del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('deleitaCart', JSON.stringify(cart));
    updateCartUI();
}

// Actualizar cantidad en el carrito
function updateCartQuantity(productId, newQty) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        if (newQty <= 0) {
            removeFromCart(productId);
        } else {
            product.quantity = newQty;
            localStorage.setItem('deleitaCart', JSON.stringify(cart));
            updateCartUI();
        }
    }
}

// Actualizar UI del carrito
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartCountHeader = document.getElementById('cartCountHeader');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Calcular total de items
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Actualizar ambos contadores
    if (cartCountHeader) {
        cartCountHeader.textContent = totalItems;
        if (totalItems > 0) {
            cartCountHeader.style.display = 'flex';
        } else {
            cartCountHeader.style.display = 'none';
        }
    }

    if (cartCount) {
        cartCount.textContent = totalItems;
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }

    // Actualizar items del carrito
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toLocaleString('es-AR')}</p>
                    <div class="cart-item-quantity">
                        <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    // Calcular total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toLocaleString('es-AR')}`;
}

// Toggle carrito sidebar
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');

    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('cart-open');
}

// Feedback visual al agregar producto
function showAddedFeedback() {
    const floatingCart = document.querySelector('.floating-cart');
    floatingCart.classList.add('bounce');
    setTimeout(() => {
        floatingCart.classList.remove('bounce');
    }, 600);
}

// Checkout - Enviar a WhatsApp
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    // Generar mensaje
    let message = 'Hola Deleita, quiero realizar el siguiente pedido:\n\n';

    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\n*Total: $${total.toLocaleString('es-AR')}*`;

    // Número de WhatsApp (reemplazar con el número real)
    const phoneNumber = '5491112345678';

    // Codificar mensaje para URL
    const encodedMessage = encodeURIComponent(message);

    // Abrir WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

    // Opcional: Limpiar carrito después de enviar
    // cart = [];
    // localStorage.setItem('deleitaCart', JSON.stringify(cart));
    // updateCartUI();
    // toggleCart();
}

// ==========================================
// TAB SWITCHING
// ==========================================
function switchTab(tabName) {
    // Ocultar todos los tabs
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => tab.classList.remove('active'));

    // Desactivar todos los botones
    const allButtons = document.querySelectorAll('.tab-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));

    // Mostrar el tab seleccionado
    const selectedTab = document.getElementById(`tab-${tabName}`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Activar el botón correspondiente
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        if (btn.onclick.toString().includes(tabName)) {
            btn.classList.add('active');
        }
    });
}

// ==========================================
// MOBILE MENU
// ==========================================
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('active');
}

// Close mobile menu when clicking on a link
document.addEventListener('componentsLoaded', () => {
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const nav = document.querySelector('.nav');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    });
});

// ==========================================
// MAP FILTERS
// ==========================================
function filterByProvince(province) {
    // Remove active class from all items
    const items = document.querySelectorAll('.province-item');
    items.forEach(item => item.classList.remove('active'));

    // Add active class to clicked item
    event.target.closest('.province-item').classList.add('active');

    // Here you would implement the actual map filtering logic
    // For now, just log the selected province
    console.log('Filtering by:', province);

    // You can update the iframe src or use Google Maps API to filter markers
    // Example: updateMapMarkers(province);
}

// Search functionality
document.addEventListener('componentsLoaded', () => {
    const searchInput = document.getElementById('searchLocation');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            console.log('Searching for:', searchTerm);
            // Implement search logic here
        });
    }
});
