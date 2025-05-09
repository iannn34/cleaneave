document.addEventListener("DOMContentLoaded", async () => {
    async function getReportData(){
        try{
            const response = await fetch("/api/report-data", {
                method: "GET",
                headers : {
                    "Content-Type" : "application/json"
                },credentials : "include"
            })
            
            const result = await response.json();
            
            displayData(result);
        }catch(error){
            console.log(error);
        }
    }
    
    function displayData(data){
        document.getElementById("total-customers").innerText = data.userCount;
        document.getElementById("monthly-revenue").innerText = `Ksh. ${data.avgMonthlyRevenue}`;
        document.getElementById("repeat-customers").innerText = `${data.repeatCustomers}%`;
        document.getElementById("avg-order").innerText = `Ksh. ${data.avgOrder}`;

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
                    //borderColor: 'rgba(41,159,199,255)',
                    borderWidth: 1.5,
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

        const customerAcquisitionChart = document.getElementById("customer-acquisition-chart");

        const acquisitionMonth = data.customerAcquisition.map(record => record.month)
        const customerCount = data.customerAcquisition.map(record => record.users_joined)

        new Chart(customerAcquisitionChart, {
            type: "bar",
            data: {
                labels: acquisitionMonth,
                datasets: [{
                    label: "Users gained",
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

        const serviceBreakdown = document.getElementById("services-breakdown").getContext("2d");

        let services = data.serviceCount.map(record => record.service)
        let serviceCount = data.serviceCount.map(record => record.service_count)

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

        const statusBarChart = document.getElementById("status-bar-chart");

        const statuses = data.statusCount.map(record => record.status.charAt(0).toUpperCase() + record.status.slice(1))
        const statusCount = data.statusCount.map(record => record.order_count)

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

        const topCustomerTable = document.getElementById("top-customers");

        let topCustomers = "";

        data.topCustomers.forEach((customer, index) => {
            topCustomers +=
                `<tr>
            <td>${index + 1}</td>
            <td>${customer.name}</td>
            <td>${customer.order_count}</td>
            <td>${customer.sum}</td>
            </tr>`;
        })

        topCustomerTable.innerHTML = topCustomers;

        document.getElementById("average-turnaround").innerText = `${data.avgTurnAround} days`;
    }
    await getReportData();
})
