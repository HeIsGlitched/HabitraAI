const form = document.querySelector("form");

const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

form.addEventListener("submit", async function(event){

    event.preventDefault();

    const response = await fetch(
        "http://localhost:5000/api/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value
            })
        }
    );

    const data = await response.json();

    
    console.log(data);
    
    if(data.message === "User not found"){
        alert("User not found");
        return;
    }
    
    if(data.message === "Wrong password"){
        alert("Wrong password");
        return;
    }
    localStorage.setItem("token",data.token);
    
    window.location.href = "dashboard.html";

});