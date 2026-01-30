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

  // Only add unique terms to the history array
  if(!history.includes(query)){
    history.push({
      query: query, // the search query text
      time: Date.now() // timestamp for when the search occurred
    });
    // Store the updated history back in localStorage
    localStorage.setItem("searchHistory",JSON.stringify(history));
  }

  // Navigate to the search results page, encoding the query into the URL
  window.location.href = `search.html?search=${encodeURIComponent(query)}`;
});
