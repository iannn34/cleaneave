document.addEventListener("DOMContentLoaded", async(event) => {
    try{
        const response = await fetch("/api/report-data",{
            method : "GET",
            headers: {
                "Content-Type": "application/json"
            },credentials : "include"
        })

        const data = await response.json();

        const customerAcquisitionChart = document.getElementById("customer-acquisition-chart");

        const acquisitionMonth = data.customerAcquisition.map(record => record.month)
        const customerCount = data.customerAcquisition.map(record => record.users_joined)

        new Chart(customerAcquisitionChart, {
            type: "bar",
            data: {
                labels: acquisitionMonth,
                datasets: [{
                    label: "users joined",
                    data: customerCount,
                    borderWidth: 1.5,
                    borderColor: "rgba(230, 230, 230, 1)",
                    backgroundColor: "rgb(89,143,231)"
                }]
            },options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })

        const customerAcquisitionTable = document.getElementById("customer-acquisition-table");

        let tableEntries = "";

        data.customerAcquisition.forEach((record, index) => {
            tableEntries +=
                `<tr>
                <td>${index + 1}</td>
                <td>${record.month}</td>
                <td>${record.users_joined}</td>
                </tr>`;
        })

        customerAcquisitionTable.innerHTML = tableEntries;
    }catch(error){
        console.log(error);
    }
})