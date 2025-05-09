document.addEventListener("DOMContentLoaded", async(event) => {
    try{
        const response = await fetch("/api/report-data",{
            method : "GET",
            headers: {
                "Content-Type": "application/json"
            },credentials : "include"
        })

        const data = await response.json();

        const statusBarChart = document.getElementById("status-count").getContext("2d");

        let statuses = data.statusCount.map(record => record.status.charAt(0).toUpperCase() + record.status.slice(1))
        let statusCount = data.statusCount.map(record => record.order_count)

        new Chart(statusBarChart, {
            type: "bar",
            data: {
                labels: statuses,
                datasets: [{
                    label : "Status",
                    data: statusCount,
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
        const statusCountTable = document.getElementById("status-count-table");

        let tableEntries = "";

        data.statusCount.forEach((record, index) => {
            tableEntries +=
                `<tr>
                <td>${index + 1}</td>
                <td>${record.status.charAt(0).toUpperCase() + record.status.slice(1)}</td>
                <td>${record.order_count}</td>
                </tr>`;
        })

        statusCountTable.innerHTML = tableEntries;
    }catch(error){
        console.log(error);
    }
})
