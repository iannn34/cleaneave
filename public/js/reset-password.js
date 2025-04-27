document.getElementById("password-reset").addEventListener("submit", async function (event) {
    event.preventDefault();

    const loader = document.getElementById('loader');
    const button = document.getElementById('password-update');

    loader.style.display = 'block';
    button.style.display = 'none';

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
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json"
            },body : JSON.stringify({
                password: password
            })
        })

        const result = await response.json();

        if(response.status === 200){
            document.getElementById("password-reset").reset();

            loader.style.display = 'none';
            button.style.display = 'block';

            window.location.href = result.redirectURL;
        }else if (response.status === 303){
            document.getElementById("password-reset").reset();

            loader.style.display = 'none';
            button.style.display = 'block';

            window.location.href = result.redirectURL;
        }else if (response.status === 422){
            document.getElementById("password-reset").reset();

            loader.style.display = 'none';
            button.style.display = 'block';

            document.getElementById("password").classList.add("is-invalid");
            document.getElementById("confirmPassword").classList.add("is-invalid");
            document.getElementById("password-feedback").innerText = result.errorMessage;
        }
    }catch(error){
        return null;
    }
})

