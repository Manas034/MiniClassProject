// Reference to the section where products will be rendered
const productSection = document.getElementById("product-section");
// Reference to the search form element
const form = document.getElementById("search-form");
// Reference to the search input field
const searchbar = document.getElementById("search-bar");
// Optional reference to a suggestions list element (may not exist yet)
const suggestionsList = document.getElementById("suggestions-list");

// Fetch the products JSON from the dummy API
fetch("https://dummyjson.com/products")
  // Parse the response as JSON
  .then(res => res.json())
  // Destructure the products array and render each item
  .then(({ products }) => {
    // Clear the section before inserting products
    productSection.innerHTML = "";

    // Loop through each product and build a card
    products.forEach(item => {
      const product = document.createElement("div"); // create a card wrapper
      product.className = "product"; // set CSS class for styling

      // Build the inner HTML for the product card (image, title, price)
      product.innerHTML = `
        <img src="${item.thumbnail}" class="product-img" alt="${item.title}">
        <h3 class="product-title">${item.title}</h3>
        <p class="product-price">Price: $${item.price}</p>
      `;

      // Append the constructed card to the product section
      productSection.appendChild(product);
    });
  })
  // Handle fetch errors gracefully
  .catch(err => console.error("Fetch failed:", err));

// Listen for the form submit event to trigger a search
form.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent the default page reload on submit

  const query = searchbar.value.trim(); // get trimmed search term
  if (!query) return; // ignore empty searches
  
  console.log("Query: ",query); // debug log of the search term

  // Load existing search history or use an empty array
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  console.log("History: ",history); // debug log of stored search history

  // Normalize history entries to objects {query, time}
  history = history.map(h => (typeof h === 'string') ? { query: h, time: 0 } : h);
  // Remove any existing entries for this query (case-insensitive) so newest appears first
  history = history.filter(h => h.query.toLowerCase() !== query.toLowerCase());

  // Insert newest at the front and keep only the latest 20
  history.unshift({ query: query, time: Date.now() });
  history = history.slice(0, 20);

  // Store the updated history back in localStorage
  localStorage.setItem("searchHistory",JSON.stringify(history));

  // Navigate to the search results page, encoding the query into the URL
  window.location.href = `search.html?search=${encodeURIComponent(query)}`;
});

// small enhancement: wire the "View History" button (if present) to open the history view
const viewHistoryBtn = document.getElementById('view-history-button');
if(viewHistoryBtn){
  viewHistoryBtn.addEventListener('click', () => {
    window.location.href = 'history.html';
  });
}
