document.getElementById("password-reset-email").addEventListener("submit", async function (event){
    event.preventDefault();
    
    const form = document.getElementById("password-reset-email");
    const alert = document.getElementById("alert-message");
    const email = document.getElementById("email").value;

    alert.innerText = "";
    alert.classList.remove("alert-danger", "alert-success");

    try{
        const response = await fetch("/password-reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },body : JSON.stringify({
                "email": email,
            })
        })
        
        const result = await response.json();
        if (response.ok) {
            form.reset();
            alert.innerText = result.message;
            alert.classList.add("alert-success");
            alert.style.display = "block";
        } else if (response.status === 404) {
            form.reset();
            alert.innerText = result.message;
            alert.classList.add("alert-danger");
            alert.style.display = "block";
        }
    } catch (error){
        console.log(error);
    }
})