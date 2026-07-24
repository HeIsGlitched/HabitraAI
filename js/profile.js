const profileName = document.querySelector("#profile-name");
const profileEmail = document.querySelector("#profile-email");
const backBtn = document.querySelector("#back-btn");
const changeEmailBtn = document.querySelector("#change-email-btn");
const changePasswordBtn = document.querySelector("#change-password-btn");
async function loadProfile(){

    const response = await fetch(
        `${API_BASE_URL}/api/me`,
        {
            headers:{
                authorization: localStorage.getItem("token")
            }
        }
    );

    const user = await response.json();

    profileName.textContent = user.name;

    profileEmail.textContent = user.email;

}
loadProfile();
backBtn.addEventListener("click", function(){

    window.location.href = "dashboard.html";

});

changeEmailBtn.addEventListener("click", async function(){

    const newEmail = prompt("Enter your new email:");
    if(!newEmail){
        return;
    }
    
    const password = prompt("Enter your password:");
    
    if(!password){
        return;
    }


    const response = await fetch(
        `${API_BASE_URL}/api/me/email`,
        {
            method: "PUT",
            headers:{
                "Content-Type":"application/json",
                authorization: localStorage.getItem("token")
            },
            body: JSON.stringify({
                email: newEmail,
                password
            })
        }
    );

    const data = await response.json();
    
    alert(data.message);
    
    if(response.ok){
        loadProfile();
    }
});

changePasswordBtn.addEventListener("click", async function(){

    const currentPassword = prompt("Enter your current password:");

    if(!currentPassword){
        return;
    }

    const newPassword = prompt("Enter your new password:");

    if(!newPassword){
        return;
    }

    const response = await fetch(
        `${API_BASE_URL}/api/me/password`,
        {
            method: "PUT",
            headers:{
                "Content-Type":"application/json",
                authorization: localStorage.getItem("token")
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        }
    );

    const data = await response.json();

    alert(data.message);

});