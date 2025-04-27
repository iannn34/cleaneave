document.getElementById("login-form").addEventListener("submit", async function(event){
    event.preventDefault();

    const loader = document.getElementById('loader');
    const button = document.getElementById('login-button');

    loader.style.display = 'block';
    button.style.display = 'none';

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
    if (response.status === 200) {
        document.getElementById("login-form").reset();

        loader.style.display = 'none'; // Hide the loader after sleep
        button.style.display = 'block'; // Show the button again

        window.location.href = result.redirectURL;
    } else if (response.status === 302){
        document.getElementById("login-form").reset();

        loader.style.display = 'none'; // Hide the loader after sleep
        button.style.display = 'block'; // Show the button again

        window.location.href = result.redirectUrl;
    } else if(response.status === 422) {
        loader.style.display = 'none'; // Hide the loader after sleep
        button.style.display = 'block'; // Show the button again

        result.message.forEach(error => {
            document.getElementById(error.fieldName).classList.add("is-invalid");
            document.getElementById(`${error.fieldName}-feedback`).innerText = error.errorMessage;
        })
    } else if(response.status === 401){
        loader.style.display = 'none'; // Hide the loader after sleep
        button.style.display = 'block'; // Show the button again

        document.getElementById("password").classList.add("is-invalid");
        document.getElementById("password").nextElementSibling.innerText = result.message;
    }
   } catch (error) {
    alert("Please try again later.");
   }
})