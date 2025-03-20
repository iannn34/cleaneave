document.getElementById("login-form").addEventListener("submit", async function(event){
    event.preventDefault();

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

    await response.json();
    if (response.ok) {
        window.location.href = "/";
    } else {
        alert("Login failed. Please try again.");
    }
   } catch (error) {
    alert("Please try again later.");
   }
})