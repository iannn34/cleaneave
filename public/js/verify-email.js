document.addEventListener("DOMContentLoaded", () => {
    // Extract the email from the URL path
    const pathParts = window.location.pathname.split("/");
    const email = decodeURIComponent(pathParts[pathParts.length - 1]);
    const alert = document.getElementById("alert-message");

    document.getElementById("verification-message").innerHTML = `Verification email sent to ${email}`;

    document.getElementById("resend-email").addEventListener("click", async () => {
        try{
            const response = await fetch("/resend-verification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email : email
                })
            });

            const result = await response.json();

            if(response.status === 200) {
                alert.classList.add("alert-success");
                alert.innerText = result.message;
            }else if(response.status === 404){
                alert.classList.add("alert-danger");
                alert.innerText = result.message;
            }
        }catch (error) {
            console.log(error)
        }
    })
})

;
