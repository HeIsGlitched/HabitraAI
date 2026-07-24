const resetSection = document.querySelector("#reset-section");
const email = document.querySelector("#email");
const sendCodeBtn = document.querySelector("#send-code-btn");
const code = document.querySelector("#code");
const newPassword = document.querySelector("#new-password");
const resetPasswordBtn = document.querySelector("#reset-password-btn");
sendCodeBtn.addEventListener("click", async function(event){

    event.preventDefault();
    sendCodeBtn.disabled = true;

    const response = await fetch(
        `${API_BASE_URL}/api/forgot-password`,
        {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email: email.value
            })
        }
    );

    const data = await response.json();

    alert(data.message);


    if(response.ok){

    resetSection.style.display = "block";

    sendCodeBtn.disabled = true;

    let seconds = 60;

    sendCodeBtn.textContent = `Resend Code (${seconds})`;

    const timer = setInterval(function(){

        seconds--;

        sendCodeBtn.textContent = `Resend Code (${seconds})`;

        if(seconds === 0){

            clearInterval(timer);

            sendCodeBtn.disabled = false;

            sendCodeBtn.textContent = "Resend Code";

        }

    }, 1000);

}

else{

        sendCodeBtn.disabled = false;

    }

});

resetPasswordBtn.addEventListener("click", async function(event){

    event.preventDefault();

    const response = await fetch(
        `${API_BASE_URL}/api/reset-password`,
        {
            method: "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({

                email: email.value,

                code: code.value,

                newPassword: newPassword.value

            })
        }
    );

    const data = await response.json();

    alert(data.message);

    if(response.ok){

        window.location.href = "login.html";

    }

});
