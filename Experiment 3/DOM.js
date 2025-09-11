document.addEventListener('DOMContentLoaded', () => {
  const products = [
    { id: 1, name: 'Laptop', category: 'electronics', price: 1200 },
    { id: 2, name: 'T-shirt', category: 'clothing', price: 25 },
    { id: 3, name: 'Headphones', category: 'electronics', price: 150 },
    { id: 4, name: 'Book: The Martian', category: 'books', price: 15 },
    { id: 5, name: 'Jeans', category: 'clothing', price: 50 },
    { id: 6, name: 'Smartphone', category: 'electronics', price: 800 }
  ];

  const categoryFilter = document.getElementById('category-filter');
  const productList = document.getElementById('product-list');

  const renderProducts = (filteredProducts) => {
    const productHTML = filteredProducts.map(product => `
      <div class="product-card">
        <h3>${product.name}</h3>
        <p>Category: ${product.category}</p>
        <p>Price: $${product.price}</p>
      </div>
    `).join('');

    productList.innerHTML = productHTML;
  };

  renderProducts(products);

  categoryFilter.addEventListener('change', (event) => {
    const selectedCategory = event.target.value;

    let filteredProducts = [];
    if (selectedCategory === 'all') {
      filteredProducts = products;
    } else {
      filteredProducts = products.filter(product => product.category === selectedCategory);
    }
    
    renderProducts(filteredProducts);
  });
});