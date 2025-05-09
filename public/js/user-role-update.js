document.getElementById("role-update-form").addEventListener("submit", async function (event){
    event.preventDefault();

    const messageTab = document.getElementById("message-tab");
    messageTab.style.display = "none";
    messageTab.classList.remove("alert-success" || "alert-warning" || "alert-danger");
    const name = document.getElementById("user-name").value;
    const email = document.getElementById("user-email").value;
    const role = document.getElementById("user-role").value;

    const updateData = {
        name: name,
        email: email,
        role: role
    }

    try{
        const response = await fetch("/admin/user-role-update", {
            method : "PATCH",
            headers : {
                "Content-Type": "application/json"
            },body: JSON.stringify(updateData),
            credentials : "include"
        })

        const result = await response.json();

        if(response.status === 200){
            messageTab.style.display = "block";
            messageTab.classList.add("alert-success");
            messageTab.innerText = result.message;
            document.getElementById("role-update-form").reset()
        }else if(response.status === 404){
            messageTab.style.display = "block";
            messageTab.classList.add("alert-warning");
            messageTab.innerText = result.message;
            document.getElementById("role-update-form").reset()
        }else if(response.status === 500){
            messageTab.style.display = "block";
            messageTab.classList.add("alert-danger");
            messageTab.innerText = result.message;
            document.getElementById("role-update-form").reset()
        }
    }catch(error){
        console.log(error)
    }
})