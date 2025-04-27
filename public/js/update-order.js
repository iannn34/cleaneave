document.addEventListener("DOMContentLoaded", async () => {
    const pathParts = window.location.pathname.split("/");
    const orderId = decodeURIComponent(pathParts[pathParts.length - 1]);

    let orderData;
    async function getOrderInfo(){
        const response = await fetch(`/api/order-details/${orderId}`,{
            method : "GET",
            headers : {
                "Content-Type" : "application/json"
            },credentials : "include"
        })

        const data = await response.json();
        orderData = data;
        displayData(data);
    }

    await getOrderInfo();

    function displayData(data) {
        const orderDetailsDiv = document.getElementById("order-details");
        let status = (data.orderDetails.status === "processing") ? "bg-warning" : "bg-success";

        orderDetailsDiv.innerHTML = `
            <div class="d-flex justify-content-between mb-3">
              <h4 style="display: inline">Order Details</h4>
              <button type="button" id="update-link" class="btn btn-outline-primary btn-sm update-link" data-bs-toggle="modal" data-bs-target="#exampleModal">Update status</button>
            </div>
            <hr>
            <p><strong>Posted by:</strong> <span id="orderDate">${data.orderDetails.name}</span></p>
            <p><strong>Date posted:</strong> <span id="orderDate">${data.orderDetails.date}</span></p>
            <p><strong>Status:</strong> <span id="orderStatus" class="badge ${status} text-dark rounded-pill p-2">${data.orderDetails.status}</span></p>
            <p><strong>Total Price:</strong> <span id="totalPrice" class="text-primary fw-bold">Ksh ${data.orderDetails.total_price}</span></p>
            <p><strong>Expected pick-up date:</strong> <span id="pickupdate">${data.orderDetails.pickup_date}</span></p>
            <p><strong>Expected delivery date:</strong> <span id="deliverydate">${data.orderDetails.delivery_date}</span></p>`;

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

    document.getElementById("status-update").addEventListener("submit", async (event) => {
        event.preventDefault();

        const loader = document.getElementById("loader");
        const button = document.getElementById("update-status");

        loader.style.display = "inline";
        button.style.display = "none";
        const status = document.getElementById("status").value;

        const response = await fetch(`/update-order-status/${orderId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                status: status,
                data : orderData
            }), credentials: "include"
        })

        const result = await response.json();

        if (response.status === 200) {
            loader.style.display = "none";
            button.style.display = "block";
            window.location.reload();
        }else{
            console.log(result)
        }
    })
})