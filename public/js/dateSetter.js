function generateDateOptions() {
    const pickupDateSelect = document.getElementById("pickup-date");
    const deliveryDateSelect = document.getElementById("delivery-date");
    const today = new Date();
    let pickUpOptions = "";
    let deliveryOptions = "";

    for (let i = 0; i < 14; i++) {
        let futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        let formattedDate = futureDate.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" });
        let formattedOption = futureDate.toLocaleDateString("en-CA");
        pickUpOptions += `<option value="${formattedOption}">${formattedDate}</option>`;
    }

    pickupDateSelect.innerHTML = pickUpOptions;

    for (let i = 0; i < 15; i++) {
        let futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);

        if(i === 0){
            continue;
        }

        let formattedDate = futureDate.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" });
        let formattedOption = futureDate.toLocaleDateString("en-CA");
        deliveryOptions += `<option value="${formattedOption}">${formattedDate}</option>`;
    }

    deliveryDateSelect.innerHTML = deliveryOptions;
}

document.addEventListener("DOMContentLoaded", generateDateOptions);