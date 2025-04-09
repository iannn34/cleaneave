document.addEventListener('DOMContentLoaded', async () => {
    try{
        const response = await fetch("/api/check-auth",{
            method: "GET",
            credentials: "include",
        })

        if (response.status === 200) {
            document.getElementById("drop-down-link-1").href = "/profile";
            document.getElementById("drop-down-link-1").innerText = "Profile";
            document.getElementById("drop-down-link-2").href = "/logout";
            document.getElementById("drop-down-link-2").innerText = "Logout";
        }else{
            document.getElementById("drop-down-link-1").href = "/login";
            document.getElementById("drop-down-link-1").innerText = "Login";
            document.getElementById("drop-down-link-2").href = "/register";
            document.getElementById("drop-down-link-2").innerText = "Register";
        }
    }catch(error){
        console.log(error)
    }
})