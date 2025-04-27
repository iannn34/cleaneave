document.addEventListener("DOMContentLoaded", () => {
    // Extract the email from the URL path
    const pathParts = window.location.pathname.split("/");
    const email = decodeURIComponent(pathParts[pathParts.length - 1]);
    const alert = document.getElementById("alert-message");

    alert.innerText = `Verification email sent to ${email}`;
    alert.style.display = "block";
    alert.classList.add("alert-success");

    document.getElementById("resend-email").addEventListener("click", async () => {
        try{
            const loader = document.getElementById('loader');
            const button = document.getElementById('resend-email');

            loader.style.display = 'inline';
            button.style.display = 'none';

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
                loader.style.display = 'none';
                button.style.display = 'inline';

                alert.classList.add("alert-success");
                alert.innerText = result.message;
            }else if(response.status === 404){
                loader.style.display = 'none';
                button.style.display = 'inline';

                alert.classList.add("alert-danger");
                alert.innerText = result.message;
            }
        }catch (error) {
            console.log(error)
        }
    })
})