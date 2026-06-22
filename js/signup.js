const form = document.querySelector("form");

const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

form.addEventListener("submit", async function(event){
    event.preventDefault();
    const response = await fetch("http://localhost:5000/api/signup",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: usernameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            })
        }
    );

    const data = await response.json();

    console.log(data);

    if(data.message === "Email already in use"){
    alert("Email already in use");
    return;
}
    window.location.href = "login.html";
});