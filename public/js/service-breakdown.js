document.addEventListener("DOMContentLoaded", async(event) => {
    try{
        const response = await fetch("/api/report-data",{
            method : "GET",
            headers: {
                "Content-Type": "application/json"
            },credentials : "include"
        })

        const data = await response.json();

        const serviceBreakdown = document.getElementById("services-breakdown").getContext("2d");

        let services = data.serviceCount.map(service => service.service)
        let serviceCount = data.serviceCount.map(count => count.service_count)

        new Chart(serviceBreakdown, {
            type: 'pie',
            data: {
                labels: services,
                datasets: [{
                    label: 'Count',
                    data: serviceCount,
                    backgroundColor: [
                        'rgba(230, 230, 230, 1)',
                        'rgba(71, 187, 249, 1)',
                        'rgba(234, 220, 248, 1)',
                        'rgba(207, 255, 229, 1)'
                    ],
                    borderColor: [
                        'rgba(230, 230, 230, 1)',
                        'rgba(71, 187, 249, 1)',
                        'rgba(234, 220, 248, 1)',
                        'rgba(207, 255, 229, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true
            }
        });

        const serviceBreakdownTable = document.getElementById("service-breakdown-table");

        let tableEntries = "";

        data.serviceCount.forEach((service, index) => {
            tableEntries +=
                `<tr>
                <td>${index + 1}</td>
                <td>${service.service}</td>
                <td>${service.service_count}</td>
                </tr>`;
        })

        serviceBreakdownTable.innerHTML = tableEntries;
    }catch(error){
        console.log(error);
    }
})