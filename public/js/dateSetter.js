const pickUpTime = document.getElementById('pickUpTime');
const deliveryTime = document.getElementById('deliveryTime');

const currentTime = new Date();
const minDeliveryTime = new Date();
minDeliveryTime.setDate(minDeliveryTime.getDate() + 1);
const maxPickUpTime = new Date();
maxPickUpTime.setDate(maxPickUpTime.getDate() + 14);

const minPickUpDate = currentTime.toISOString().slice(0, 16);
const maxDate = maxPickUpTime.toISOString().slice(0, 16);
const minDeliveryDate = minDeliveryTime.toISOString().slice(0, 16);

pickUpTime.min = minPickUpDate;
pickUpTime.max = maxDate;

deliveryTime.min = minDeliveryDate;
deliveryTime.max = maxDate;