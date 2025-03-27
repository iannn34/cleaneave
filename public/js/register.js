document.getElementById("user-register").addEventListener("submit", async function(event){
    event.preventDefault();

    const form = document.getElementById("user-register");
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const contact = document.getElementById("contact").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("password2").value;


    // Getting all input fields and clearing them of the error messages
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.classList.remove("is-invalid");
        input.nextElementSibling.innerText = "";
    })

    if(password !== confirmPassword){
        document.getElementById("password").value = "";
        document.getElementById("password2").value = "";

        document.getElementById("password2").classList.add("is-invalid");
        document.getElementById("password2-feedback").innerText = "Passwords do not match";

        return;
    }

   try {
    const response = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            contact: contact,
            password: password
        })
    });

    const result = await response.json();
         if (response.ok){
             form.reset()
             window.location.href = `/verify-email/email/${encodeURIComponent(email)}`;
         }else if(response.status === 422){
            result.message.forEach(error => {
                document.getElementById(error.fieldName).classList.add("is-invalid");
                document.getElementById(`${error.fieldName}-feedback`).innerText = error.errorMessage;

                document.getElementById("password").value = "";
                document.getElementById("password2").value = "";
            })
        }else if(response.status === 400){
             document.getElementById("email").classList.add("is-invalid");
             document.getElementById("email-feedback").innerText = result.message;

             document.getElementById("password").value = "";
             document.getElementById("password2").value = "";
         }
   } catch (error) {
    alert(`${error}`);
    }
})