document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [
        { id: 1, image: 'path/to/image1.jpg', name: 'Product 1', price: 100, quantity: 2 },
        { id: 2, image: 'path/to/image2.jpg', name: 'Product 2', price: 150, quantity: 1 }
        // Add more items as needed
    ];

    const cartItemsContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');

    const renderTotal = (price, quantity) => price * quantity;

    const renderTotalALL = () => {
        return cartItems
            .reduce((total, item) => total + renderTotal(item.price, item.quantity), 0)
            .toLocaleString();
    };

    const updateCartUI = () => {
        cartItemsContainer.innerHTML = cartItems.map(item => `
            <tr>
                <td>${item.id}</td>
                <td><img src="${item.image}" alt="Product image for ${item.name}" style="width: 50px;"></td>
                <td>${item.name}</td>
                <td>${item.price} $</td>
                <td>${item.quantity}</td>
                <td>${renderTotal(item.price, item.quantity)} $</td>
                <td>
                    <button class="btn btn-success" onclick="deleteItem(${item.id})">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        totalElement.textContent = `Total Amount: ${renderTotalALL()} $`;
    };

    window.deleteItem = (id) => {
        const index = cartItems.findIndex(item => item.id === id);
        if (index !== -1) {
            cartItems.splice(index, 1);
            updateCartUI();
        }
    };

    updateCartUI();
});
