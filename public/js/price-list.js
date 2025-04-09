document.addEventListener("DOMContentLoaded", async() => {
    // Fetch products from the API
    async function fetchProducts() {
        try {
            const response = await fetch("/api/products", {
                method: "GET",
                credentials: "include"
            });

            const product_data = await response.json();
            displayProducts(product_data);  // Pass the array of products
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    // Call the fetch function when the page loads
    await fetchProducts();

    function displayProducts(products) {
        const tableBody = document.getElementById("table-body");

        products.data.forEach(product => {
            const productRow = document.createElement("tr");

            productRow.innerHTML = `
            <td>${product.product_id}</td>
            <td>${product.name}</td>
            <td>${product.unit_price}</td>`

            tableBody.appendChild(productRow)
        })
    }
})