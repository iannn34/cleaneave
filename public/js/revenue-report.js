document.addEventListener("DOMContentLoaded", async(event) => {
    try{
        const response = await fetch("/api/report-data",{
            method : "GET",
            headers: {
                "Content-Type": "application/json"
            },credentials : "include"
        })

        const data = await response.json();

        const monthlyRevenue = document.getElementById("monthly-revenue-graph").getContext("2d");

        let months = data.monthlyRevenue.map(record => record.month);
        let monthlyTotals = data.monthlyRevenue.map(record => record.total);

        new Chart(monthlyRevenue ,{
            type: "line",
            data: {
                labels: months,
                datasets: [{
                    label : "Revenue",
                    data: monthlyTotals,
                    borderColor: 'rgba(41,159,199,255)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                }]
            },options: {
                responsive: true,
                scales: {
                    y:{
                        beginAtZero: true,
                    }
                }
            }
        });

        const revenueTable = document.getElementById("revenue-table");

        let tableEntries = "";

        data.monthlyRevenue.forEach((month, index) => {
            tableEntries +=
                `<tr>
                <td>${index + 1}</td>
                <td>${month.month}</td>
                <td>${month.total}</td>
                </tr>`;
        })

        revenueTable.innerHTML = tableEntries;
    }catch(error){
        console.log(error);
    }
})