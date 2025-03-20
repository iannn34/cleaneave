document.getElementById("user-register").addEventListener("submit", async function(event){
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const contact = document.getElementById("contact").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if(password !== confirmPassword){
        const alert = document.getElementById("passwordConfirmationAlert");

        alert.style.display = "block";

        document.getElementById("password").value = "";
        document.getElementById("confirmPassword").value = "";

        return false;
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
    if (result.ok) {
        window.location.href = "/";
    } else {
        alert("Registration failed. Please try again.");
    }
   } catch (error) {
    alert("Please try again.");
   }
})