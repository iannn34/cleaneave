document.addEventListener("DOMContentLoaded", async () => {
    const pathParts = window.location.pathname.split("/");
    const orderId = decodeURIComponent(pathParts[pathParts.length - 1]);

    /**
     * Fetches order details from the server and displays the data.
     *
     * This function sends a GET request to the `/api/order-details/{orderId}` endpoint
     * to retrieve information about a specific order. The request includes credentials
     * for authentication. Once the data is fetched, it is passed to the `displayData`
     * function for rendering.
     *
     * @async
     * @function getOrderInfo
     * @throws {Error} Throws an error if the fetch request fails or the response cannot be parsed as JSON.
     */

    async function getOrderInfo(){
        const response = await fetch(`/api/order-details/${orderId}`,{
            method : "GET",
            headers : {
                "Content-Type" : "application/json"
            },credentials : "include"
        })

        const data = await response.json();
        displayData(data);
    }

    await getOrderInfo();

    /**
     * Updates the DOM to display order details and order items.
     *
     * @param {Object} data - The data containing order details and items.
     * @param {Object} data.orderDetails - The details of the order.
     * @param {string} data.orderDetails.date - The date the order was posted.
     * @param {string} data.orderDetails.status - The status of the order (e.g., "processing", "completed").
     * @param {number} data.orderDetails.total_price - The total price of the order.
     * @param {Array<Object>} data.orderItems - The list of items in the order.
     * @param {string} data.orderItems[].name - The name of the order item.
     * @param {string} data.orderItems[].service - The service associated with the order item.
     * @param {number} data.orderItems[].quantity - The quantity of the order item.
     * @param {number} data.orderItems[].total_unit_price - The total price for the quantity of the order item.
     * @param {string} data.orderItems[].image_url - The URL of the image representing the order item.
     */

    function displayData(data) {
        const orderDetailsDiv = document.getElementById("order-details");
        let status = (data.orderDetails.status === "processing") ? "bg-warning" : "bg-success";

        orderDetailsDiv.innerHTML = `
            <h4 class="mb-3">Order Details</h4><hr>
            <p><strong>Date Posted:</strong> <span id="orderDate">${data.orderDetails.date}</span></p>
            <p><strong>Status:</strong> <span id="orderStatus" class="badge ${status} text-dark rounded-pill p-2">${data.orderDetails.status}</span></p>
            <p><strong>Total Price:</strong> <span id="totalPrice" class="text-primary fw-bold">Ksh ${data.orderDetails.total_price}</span></p>`;

        const orderItemsContainer = document.getElementById("orderItems");
        orderItemsContainer.innerHTML = ""; // Clear existing content

        data.orderItems.forEach(item => {
            const col = document.createElement("div");
            col.classList.add("col-md-6", "mb-4");

            col.innerHTML = `
                <div class="card order-item-card shadow">
                    <img src="/public/assets/images/${item.product_id}.jpg" class="card-img-top order-item-image" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text"><strong>Service:</strong> ${item.service}</p>
                        <p class="card-text"><strong>Quantity:</strong> ${item.quantity}</p>
                        <p class="card-text text-primary fw-bold">Ksh ${item.total_unit_price}</p>
                    </div>
                </div>
            `;

            orderItemsContainer.appendChild(col);
        });
    }
})