document.getElementById("login-form").addEventListener("submit", async function(event){
    event.preventDefault();

    // Getting all input fields and clearing them of the error messages
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.classList.remove("is-invalid");
        input.nextElementSibling.innerText = "";
    })

   try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password  
        })
    })

    const result = await response.json();
    if (response.ok) {
        window.location.href = "/";
    } else if (response.status === 302){
        window.location.href = result.redirectUrl;
    } else if(response.status === 422) {
        result.message.forEach(error => {
            document.getElementById(error.fieldName).classList.add("is-invalid");
            document.getElementById(`${error.fieldName}-feedback`).innerText = error.errorMessage;
        })
    } else if(response.status === 401){
        document.getElementById("password").classList.add("is-invalid");
        document.getElementById("password").nextElementSibling.innerText = result.message;

    }
   } catch (error) {
    alert("Please try again later.");
   }
})