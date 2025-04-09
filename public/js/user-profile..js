document.addEventListener('DOMContentLoaded', async () => {
    const message = localStorage.getItem("message");
    if(message){
        document.getElementById("message-tab").style.display = "block";
        document.getElementById("message-tab").innerText = message ;
        document.getElementById("message-tab").classList.add("alert-success");

        localStorage.removeItem("message");
    }

    const name = document.getElementById("user-name");
    const email = document.getElementById("user-email");
    const contact = document.getElementById("user-contact");
    const joinDate = document.getElementById("join-date");
    
    async function getUserInfo(){
        const response = await fetch(`/api/user-info`,{
            method : "GET",
            headers : {
                "Content-Type" : "application/json"
            },credentials : "include"
        })

        const data = await response.json();
        displayData(data);
    }
    
    function displayData(data){
        name.innerText += ` ${data.userData.name}`;
        email.innerText += ` ${data.userData.email}`;
        contact.innerText += ` ${data.userData.contact}`;
        
        document.getElementById("name").placeholder = data.userData.name;
        document.getElementById("email").placeholder = data.userData.email;
        document.getElementById("contact").placeholder = data.userData.contact;
        
        
        const creationDate = new Date(data.userData.created_at);
        joinDate.innerText += ` ${creationDate.toLocaleDateString("en-us",{day: "numeric", month: "long", year: "numeric"})}`;

        let orderInfo =""
        data.orderData.forEach((order, index)=>{
            let orderDate = new Date(order.created_at);
            let status = (order.status === "processing") ? "bg-warning" : "bg-success";
            orderInfo += `
            <tr>
                    <td>${index + 1}</td>
                    <td><a href="/order-details/${order.order_id}">${orderDate.toLocaleDateString("en-us",{day: "numeric", month: "long", year: "numeric"})}</a></td>
                    <td>${order.total_price}</td>
                    <td><span class="badge rounded-pill ${status} p-2 text-dark">${order.status}</span></td>
            </tr>
            `
        })
        
        document.getElementById("order-history").innerHTML += orderInfo;
    }
    
    await getUserInfo();

   document.getElementById("update-link").addEventListener("click", () => {
        document.getElementById("update-profile").style.display = "flex";
   })

   document.getElementById("close-modal").addEventListener("click", () => {
        document.getElementById("update-profile").style.display = "none";
   })

    document.getElementById("profile-update-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const name = (document.getElementById("name").value !== "") ? document.getElementById("name").value : document.getElementById("name").placeholder;
        const email = (document.getElementById("email").value !== "") ? document.getElementById("email").value : document.getElementById("email").placeholder;
        const contact = (document.getElementById("contact").value !== "") ? document.getElementById("contact").value : document.getElementById("contact").placeholder;

        const response = await fetch("/update-profile",{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },body: JSON.stringify({
                name: name,
                email: email,
                contact: contact
            }),credentials : "include"
        })

        const result = await response.json();
        if(response.status === 200){
            localStorage.setItem("message" , result.message)
            window.location.reload();
        }else if(response.status === 422){
            result.message.forEach(error => {
                document.getElementById(error.fieldName).classList.add("is-invalid");
                document.getElementById(`${error.fieldName}-feedback`).innerText = error.errorMessage;
        })
        }else{
            document.getElementById("message-tab").style.display = "block";
            document.getElementById("message-tab").innerText = result.message ;
            document.getElementById("message-tab").classList.add("alert-danger");
        }
    })
})