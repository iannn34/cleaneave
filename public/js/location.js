document.getElementById("getLocation").addEventListener("click", function () {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success,error);
    }else{
        document.getElementById("locationData").style.display = "block"
        document.getElementById("getLocation").style.display = "none";
        alert("Geolocation is not supported");
    }
})

function success(position){
    const latitudeElement = document.getElementById("latitude");
    const longitudeElement = document.getElementById("longitude");

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    latitudeElement.value = latitude;
    longitudeElement.value = longitude;
}

function error(error){
    document.getElementById("locationData").style.display = "block"
    document.getElementById("getLocation").style.display = "none";
    alert("Permission denied");
}
