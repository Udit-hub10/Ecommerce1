const bar = document.getElementById('bar')
const close = document.getElementById('close')
const nav = document.getElementById('navbar')

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active')
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active')
    })
}

const mainImage = document.getElementById('MainImg')
const thumbnails = document.querySelectorAll('.small-img')

if (mainImage && thumbnails.length) {
    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', () => {
            mainImage.src = thumbnail.src
        })
    })
}


const cartKey = 'cara-cart'
const readCart = () => JSON.parse(localStorage.getItem(cartKey) || '[]')
const saveCart = (cart) => localStorage.setItem(cartKey, JSON.stringify(cart))
const addToCart = (product) => {
    const cart = readCart()
    const existing = cart.find((item) => item.id === product.id)
    if (existing) existing.quantity += product.quantity
    else cart.push(product)
    saveCart(cart)
}

document.querySelectorAll('.pro .cart').forEach((button) => {
    button.closest('a').addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        const card = button.closest('.pro')
        addToCart({ id: card.querySelector('img').getAttribute('src'), image: card.querySelector('img').getAttribute('src'), name: card.querySelector('h5').textContent.trim(), brand: card.querySelector('.des span').textContent.trim(), price: Number(card.querySelector('h4').textContent.replace('$', '')), quantity: 1 })
        button.setAttribute('name', 'checkmark-outline')
        setTimeout(() => button.setAttribute('name', 'cart-outline'), 900)
    })
})

const productButton = document.querySelector('#add-to-cart')
if (productButton) productButton.addEventListener('click', () => {
    const quantity = Math.max(1, Number(document.querySelector('#product-quantity').value) || 1)
    addToCart({ id: productButton.dataset.id, image: productButton.dataset.image, name: productButton.dataset.name, brand: 'adidas', price: Number(productButton.dataset.price), quantity })
    productButton.textContent = 'Added to cart'
})

const cartContent = document.querySelector('#cart-content')
const cartSummary = document.querySelector('#cart-summary')
const renderCart = () => {
    if (!cartContent || !cartSummary) return
    const cart = readCart()
    if (!cart.length) {
        cartContent.innerHTML = '<div class="empty-cart"><ion-icon name="bag-outline"></ion-icon><h3>Your cart is empty</h3><p>Find something you love in our latest collection.</p><a class="normal" href="shop.html">Continue shopping</a></div>'
        cartSummary.innerHTML = ''
        return
    }
    cartContent.innerHTML = `<div class="cart-table"><div class="cart-table-head"><span>Product</span><span>Price</span><span>Quantity</span><span>Subtotal</span><span></span></div>${cart.map((item, index) => `<div class="cart-row"><div class="cart-product"><button class="remove-item" data-index="${index}" aria-label="Remove ${item.name}"><ion-icon name="close-circle-outline"></ion-icon></button><img src="${item.image}" alt="${item.name}"><div><strong>${item.name}</strong><small>${item.brand}</small></div></div><span>$${item.price.toFixed(2)}</span><input class="cart-quantity" data-index="${index}" type="number" min="1" value="${item.quantity}" aria-label="Quantity for ${item.name}"><strong>$${(item.price * item.quantity).toFixed(2)}</strong><span></span></div>`).join('')}</div>`
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    cartSummary.innerHTML = `<h3>Cart totals</h3><div><span>Subtotal</span><strong>$${subtotal.toFixed(2)}</strong></div><div><span>Shipping</span><strong>Free</strong></div><div class="summary-total"><span>Total</span><strong>$${subtotal.toFixed(2)}</strong></div><a class="normal checkout-button" href="checkout.html">Proceed to checkout</a>`
    cartContent.querySelectorAll('.remove-item').forEach((button) => button.addEventListener('click', () => { cart.splice(Number(button.dataset.index), 1); saveCart(cart); renderCart() }))
    cartContent.querySelectorAll('.cart-quantity').forEach((input) => input.addEventListener('change', () => { cart[Number(input.dataset.index)].quantity = Math.max(1, Number(input.value) || 1); saveCart(cart); renderCart() }))
}
renderCart()

const contactForm = document.querySelector('#contact-form')
if (contactForm) contactForm.addEventListener('submit', (event) => { event.preventDefault(); contactForm.reset(); document.querySelector('#contact-status').textContent = 'Thanks, your message has been sent.' })

const trackingForm = document.querySelector('#tracking-form')
if (trackingForm) trackingForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const orderNumber = document.querySelector('#order-number').value.trim().toUpperCase()
    const status = document.querySelector('#tracking-status')
    status.innerHTML = `<strong>Order ${orderNumber}</strong> is confirmed and being prepared. We will email you when it ships.`
    document.querySelector('#tracking-result').classList.add('visible')
})

const checkoutSummary = document.querySelector('#checkout-summary')
const checkoutForm = document.querySelector('#checkout-form')
if (checkoutSummary) {
    const cart = readCart()
    if (!cart.length) {
        checkoutSummary.innerHTML = '<p>Your cart is empty. <a href="shop.html">Return to the shop</a>.</p>'
        if (checkoutForm) checkoutForm.style.display = 'none'
    } else {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
        checkoutSummary.innerHTML = `${cart.map((item) => `<div><span>${item.name} x ${item.quantity}</span><strong>$${(item.price * item.quantity).toFixed(2)}</strong></div>`).join('')}<div class="summary-total"><span>Total</span><strong>$${total.toFixed(2)}</strong></div>`
    }
}
if (checkoutForm) checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault()
    localStorage.removeItem(cartKey)
    checkoutForm.innerHTML = '<div class="checkout-success"><ion-icon name="checkmark-circle-outline"></ion-icon><h2>Order received.</h2><p>Thanks for shopping with Cara. Your confirmation will arrive by email shortly.</p><a class="normal" href="shop.html">Continue shopping</a></div>'
})

