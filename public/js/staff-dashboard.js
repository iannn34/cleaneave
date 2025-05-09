document.addEventListener("DOMContentLoaded", async function() {
    const table = document.getElementById("orders-table");
    const urlParameters = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlParameters.entries());

    const currentPage = parseInt(params.page);

    async function fetchOrders(page){
        const response = await fetch(`/api/get-orders?page=${page || 1}`, {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json"
                },credentials : "include"
        })

        const result = await response.json();
        displayInfo(result);
    }

    function displayInfo(data) {
        document.getElementById("processed-today").innerText = data.processedToday;
        document.getElementById("received-today").innerText = data.receivedToday;
        document.getElementById("due-today").innerText = data.dueToday;
        document.getElementById("overdue-orders").innerText = data.overdue;

        let tableData = "";

        data.orders.forEach((order, index) => {
            tableData += `
            <tr>
                <td>${index + 1}</td>
                <td><a href="/update-order-status/${order.order_id}">ORD0${order.order_id}</a></td>
                <td>${order.name}</td>
                <td>${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</td>
                <td>${order.pickup_time}</td>
                <td>${order.delivery_time}</td>
                <td>${order.total_price}</td>`
        })

        table.innerHTML = tableData;

        document.getElementById("first-page").href = `/staff-dashboard?page=1`;
        document.getElementById("previous-page").href = `/staff-dashboard?page=${data.page - 1}`;
        document.getElementById("current-page").href = `/staff-dashboard?page=${data.page}`;
        document.getElementById("next-page").href = `/staff-dashboard?page=${data.page + 1}`;
        document.getElementById("last-page").href = `/staff-dashboard?page=${data.max}`;

        if (data.page === 1){
            document.getElementById("previous-page").style.display = "none";
        }

        document.getElementById("previous-page").innerText = `${data.page - 1}`;
        document.getElementById("current-page").innerText = `${data.page}`;
        document.getElementById("next-page").innerText = `${data.page + 1}`;

        if(data.page === data.max){
            document.getElementById("next-page").style.display = "none";
        }
    }

    await fetchOrders(currentPage);

    document.getElementById("order-search").addEventListener("submit", async function (event){
        event.preventDefault();

        const name = document.getElementById("customer-name").value.trim();
        const status = document.getElementById("status-filter").value;
        const fromDate = document.getElementById("from-date").value;
        const toDate = document.getElementById("to-date").value;

        let params = new URLSearchParams()

        params.append("page", "1")
        if (name) params.append("name", name);
        if (status) params.append("status", status);
        if (fromDate) params.append("from", fromDate);
        if (toDate) params.append("to", toDate);

        try{
            const response = await fetch(`/api/get-orders?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json"
                },credentials : "include"
            })

            const result = await response.json();

            displayInfo(result);
        }catch(error){
            console.log(error);
        }
    })

    document.getElementById("test-button").addEventListener("click", async function (event){
        console.log(window.location.href);
    })
})