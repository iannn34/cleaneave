document.getElementById("password-reset").addEventListener("submit", async function (event) {
    event.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    document.querySelectorAll("input").forEach(input => {
        input.classList.remove("is-invalid");
    })
    document.getElementById("password-feedback").innerText = "";

    if(password !== confirmPassword) {
        document.getElementById("password").value = "";
        document.getElementById("confirmPassword").value = "";

        document.getElementById("password").classList.add("is-invalid");
        document.getElementById("confirmPassword").classList.add("is-invalid");
        document.getElementById("password-feedback").innerText = "Passwords do not match";

        return;
    }

    const pathParts = window.location.pathname.split("/");
    const token = decodeURIComponent(pathParts[pathParts.length - 1]);

    if(!token) {
        console.log("No token found");
    }

    try{
        const response = await fetch(`/reset-password/${encodeURIComponent(token)}`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },body : JSON.stringify({
                password: password
            })
        })

        const result = await response.json();

        if(response.status === 200){
            window.location.href = result.redirectURL;
        }else if (response.status === 303){
            window.location.href = result.redirectURL;
        }else if (response.status === 422){
            document.getElementById("password-reset").reset();
            document.getElementById("password").classList.add("is-invalid");
            document.getElementById("confirmPassword").classList.add("is-invalid");
            document.getElementById("password-feedback").innerText = result.errorMessage;
        }
    }catch(error){
        return null;
    }
})

