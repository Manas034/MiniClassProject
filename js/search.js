const productsDiv = document.getElementById('products');
const searchQueryDisplay = document.getElementById('searchQuery');
const params = new URLSearchParams(window.location.search);
const searchTerm = params.get('q');

if(searchQueryDisplay && searchTerm) {
    searchQueryDisplay.textContent = `Showing results for "${searchTerm}"`;
}

fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => {
        const filtered = data.filter(product => 
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayProducts(filtered);
    })
    .catch(error => {
        productsDiv.innerHTML = '<p class="loading">Error loading products</p>';
        console.error('Error:', error);
    });

function displayProducts(products) {
    productsDiv.innerHTML = '';
    if (products.length === 0) {
        productsDiv.innerHTML = '<p class="loading">No products found</p>';
        return;
    }
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="price">$${product.price}</p>
        `;
        productCard.addEventListener('click', () => {
            saveToViewHistory(product.id);
            window.location.href = `product-details.html?id=${product.id}`;
        });
        productsDiv.appendChild(productCard);
    });
}

function saveToViewHistory(productId) {
    let viewHistory = JSON.parse(localStorage.getItem("viewHistory")) || [];
    
    viewHistory = viewHistory.filter(item => item.id !== productId);
    viewHistory.unshift({
        id: productId,
        timestamp: Date.now()
    });
    
    if(viewHistory.length > 20) {
        viewHistory = viewHistory.slice(0, 20);
    }
    
    localStorage.setItem("viewHistory", JSON.stringify(viewHistory));
}
