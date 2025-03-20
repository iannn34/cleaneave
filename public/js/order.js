document.addEventListener("DOMContentLoaded", async () => {
    const productRow = document.getElementById("productRow");
    const totalPriceElement = document.getElementById("totalPrice");
    let cart = [];
    let totalPrice = 0;

    // Fetch products from the API
    async function fetchProducts() {
        try {
            const response = await fetch("/api/products", {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const product_data = await response.json();
            displayProducts(product_data);  // Pass the array of products
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    // Call the fetch function when the page loads
    await fetchProducts();

    // Function to display products
    function displayProducts(products) {
        productRow.innerHTML = ""; // Clear existing content before adding new ones

        products.forEach(product => {
            const column = document.createElement("div");
            column.classList.add("col-md-4");

            column.innerHTML = `
                <div class="card">
                    <img src="${product.image_url}" class="card-img-top" alt="${product.description} image">
                    <div class="card-body">
                        <h5 class="card-title">
                            <a href="/product/${product.product_id}" class="text-primary text-decoration-none">${product.name}</a>
                        </h5>
                        <p class="card-text">Price: ${product.unit_price}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                        Quantity: <input type="number" class="form-control quantity-input" min="0" value="0" data-id="${product.product_id}" data-price="${product.unit_price}">
                        </li>
                        <li class="list-group-item">
                        Service: 
                        <select name="service" class="form-select service-select" data-id="${product.product_id}">
                            <option value="Dry cleaning">Dry cleaning</option>
                            <option value="Press">Press</option>
                            <option value="Wash and fold">Wash and fold</option>
                            <option value="Laundry">Laundry</option>
                        </select>
                        </li>
                    </ul>
                    <div class="card-body">
                        <a href="#" class="card-link">Add to Cart</a>
                    </div>
                </div>
            `;

            productRow.appendChild(column); // Append each product to the container
        });

        document.querySelectorAll(".quantity-input").forEach(input => {
            input.addEventListener("input", updateTotalPrice);
        });
    }

    // Calculate total price
    function updateTotalPrice(){
        let total = 0;
        cart = [];

        document.querySelectorAll(".quantity-input").forEach(input => {
            const quantity = parseInt(input.value);
            const price = parseInt(input.dataset.price, 10);
            const productId = parseInt(input.dataset.id, 10);

            const serviceSelect = document.querySelector(`.service-select[data-id="${productId}"]`);
            const service = serviceSelect ? serviceSelect.value : null;

            if(quantity > 0){
                let unitPrice = quantity * price;
                total += unitPrice;
                cart.push({
                    productId: productId,
                    quantity: quantity,
                    totalUnitPrice: unitPrice,
                    service: service});
            }
        });
        totalPriceElement.textContent = total;
        totalPrice = total;
    }



    document.getElementById("orderForm").addEventListener("submit", async function(event){
        event.preventDefault();

        if(cart.length === 0){
            alert("Please add some products to the cart.");
            return;
        }

        const pickUpTime = document.getElementById("pickUpTime").value;
        const deliveryTime = document.getElementById("deliveryTime").value;

        let locationData;

        if(document.getElementById("locationData").style.display === "none"){
            const latitude = document.getElementById("latitude").value;
            const longitude = document.getElementById("longitude").value;

            locationData ={
                latitude : latitude,
                longitude : longitude
            }
        }else{
            const city = document.getElementById("city").value;
            const town = document.getElementById("town").value;
            const address = document.getElementById("address").value;

            locationData ={
                city : city,
                town : town,
                address : address
            }
        }

        const orderData = {
            items : cart,
            totalPrice: totalPrice,
            pickUpTime: pickUpTime,
            deliveryTime: deliveryTime,
            location : locationData
        }

        try {
            const response = await fetch("/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },credentials : "include",
                body: JSON.stringify(orderData)
            });

            if (response.status === 201) {
                window.location.href = "/";
            } else {
                throw new Error("Order failed. Please try again.");
            }
        } catch (error) {
            alert("Please try again.");
        }
    })
});


