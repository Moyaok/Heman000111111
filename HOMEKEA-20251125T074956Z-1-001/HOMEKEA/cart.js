// ระบบจัดการตะกร้าสินค้า
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartBadge();
    }

    // โหลดตะกร้าจาก localStorage
    loadCart() {
        const savedCart = localStorage.getItem('homeKeaCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // บันทึกตะกร้าลง localStorage
    saveCart() {
        localStorage.setItem('homeKeaCart', JSON.stringify(this.items));
        this.updateCartBadge();
    }

    // เพิ่มสินค้าลงตะกร้า
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.showNotification(`เพิ่ม "${product.title}" ลงตะกร้าแล้ว`);
        return true;
    }

    // ลบสินค้าออกจากตะกร้า
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.showNotification('ลบสินค้าออกจากตะกร้าแล้ว', 'warning');
    }

    // อัพเดทจำนวนสินค้า
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
        }
    }

    // ล้างตะกร้าทั้งหมด
    clearCart() {
        this.items = [];
        this.saveCart();
    }

    // คำนวณยอดรวม
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // นับจำนวนสินค้าในตะกร้า
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // อัพเดทตัวเลขบน badge
    updateCartBadge() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            const count = this.getItemCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // แสดงการแจ้งเตือน
    showNotification(message, type = 'success') {
        const oldNotification = document.querySelector('.cart-notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ✅ สร้าง instance ของตะกร้า แค่อันเดียวพอ
const cart = new ShoppingCart();

// ฟังก์ชันสำหรับเพิ่มสินค้าลงตะกร้า
function addToCart(productId, title, price, image, category) {
    const product = {
        id: productId,
        title: title,
        price: price,
        image: image,
        category: category
    };

    cart.addItem(product);
}

// ฟังก์ชันสำหรับไปหน้าตะกร้า
function goToCart() {
    window.location.href = 'cart.html';
}

// Export สำหรับใช้ในหน้าอื่น (สำหรับ Node / test)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoppingCart, cart };
}