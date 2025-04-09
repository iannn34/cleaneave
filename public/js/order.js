document.addEventListener("DOMContentLoaded", async () => {
    const productRow = document.getElementById("productRow");
    const totalPriceElement = document.getElementById("total-price");
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

        products.data.forEach(product => {
            const column = document.createElement("div");
            column.classList.add("col-md-4");

            column.innerHTML = `
                <div class="card m-3">
                    <img src="${product.image_url}" class="card-img-top" alt="${product.description} image">
                    <div class="card-body">
                        <h5 class="card-title">
                            <a href="/product/${product.product_id}" class="text-primary text-decoration-none">${product.name}</a>
                        </h5>
                        <p class="card-text">Price: ${product.unit_price}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item p-3">
                        Quantity: <input type="number" class="form-control quantity-input" min="0" value="0" data-id="${product.product_id}" data-price="${product.unit_price}">
                        </li>
                        <li class="list-group-item p-3">
                        Service: 
                        <select name="service" class="form-select service-select" data-id="${product.product_id}">
                            <option value="Dry cleaning">Dry cleaning</option>
                            <option value="Press">Press</option>
                            <option value="Wash and fold">Wash and fold</option>
                            <option value="Laundry">Laundry</option>
                        </select>
                        </li>
                    </ul>
                </div>
            `;

            productRow.appendChild(column); // Append each product to the container
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

    document.querySelectorAll(".service-select").forEach(service => {
        service.addEventListener("change", updateTotalPrice);
    })

    document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener("input", updateTotalPrice);
    });

    document.getElementById("placeOrder").addEventListener("click", () => {
        document.getElementById("order-modal").style.display = "flex";
    });

     document.getElementById("cancelButton").addEventListener("click", () => {
        document.getElementById("order-modal").style.display = "none";
    });

    document.getElementById("orderForm").addEventListener("submit", async function(event){
        event.preventDefault();

        if(cart.length === 0){
            alert("Please add some products to the cart.");
            return;
        }

        const pickUpTime = document.getElementById("pickup-date").value+ " " +document.getElementById("pickup-time").value;
        const deliveryTime = document.getElementById("delivery-date").value+ " " +document.getElementById("delivery-time").value;

        let locationData;

        if(document.getElementById("locationData").style.display === "none"){
            const latitude = document.getElementById("latitude").value;
            const longitude = document.getElementById("longitude").value;

            locationData = {
                latitude : latitude,
                longitude : longitude
            }
        }else{
            const city = document.getElementById("city").value;
            const address = document.getElementById("address").value;
            const zip = document.getElementById("zip-code").value;

            locationData = {
                city : city,
                address : address,
                zip : zip
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

            const result = await response.json();

            if (response.status === 200) {
                window.location.href = result.redirectURL;
            } else if(response.status === 500){
                document.getElementById("order-modal").style.display = "none";

                window.location.hash = "logo"
                const alert = document.getElementById("message-tab");

                alert.style.display = "block";
                alert.classList.add("alert-danger");
                alert.innerHTML = error.message;
            } else {
                throw new Error("Order failed. Please try again.");
            }
        } catch (error) {
            document.getElementById("order-modal").style.display = "none";

            window.location.hash = "logo"
            const alert = document.getElementById("message-tab");

            alert.style.display = "block";
            alert.classList.add("alert-danger");
            alert.innerHTML = error.message;
        }
    })
});


