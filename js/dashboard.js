//now dashboard page is protected
const token = localStorage.getItem("token");
if(!token){
    window.location.href = "login.html";
}

const weekBoxes = document.querySelector(".week-boxes");
const globalStreak = document.querySelector("#global-streak");
const progressText = document.querySelector("#progress-text"); //find the element with id = progress-text
const progressFill = document.querySelector("#progress-fill");
const welcomeText = document.querySelector("#welcome-text");
async function loadUser(){

    const response = await fetch(
        "http://localhost:5000/api/me",
        {
            headers:{
                authorization: localStorage.getItem("token")
            }
        }
    );

    const data = await response.json();

    welcomeText.textContent = `Welcome Back, ${data.name}`;

}
function updateProgress(){

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    let completed = 0;

    checkboxes.forEach(function(checkbox){
        if(checkbox.checked){
            completed++;
        }
    });

    progressText.textContent = `${completed} / ${checkboxes.length}`;

    let percentage = 0;

    if(checkboxes.length > 0){
        percentage = (completed / checkboxes.length) * 100;
    }

    progressFill.style.width = `${percentage}%`;

}
updateProgress();

//for adding habits
const habitInput = document.querySelector("#habit-input");
const addHabitBtn = document.querySelector("#add-habit-btn");
const habitsContainer = document.querySelector(".habits");
//function for adding habits
function createHabit(habit){
     const newHabit = document.createElement("div");//create a div 
        newHabit.classList.add("habit-item");// put class on that div
        newHabit.dataset.id = habit._id; // for storing backend it
        const today = new Date().toDateString();

const completedToday = habit.completedDates.find(function(date){
    return new Date(date).toDateString() === today;
});
//providing the inner HTML of div with class = habit-item
newHabit.innerHTML = `
<input type="checkbox" ${completedToday ? "checked" : ""}>
<label>${habit.name}</label>
<span class="habit-streak">🔥 ${habit.streak}</span>
<button type="button" class="edit-btn">Edit</button>
<button type="button" class="delete-btn">Delete</button>
`;
        habitsContainer.appendChild(newHabit);//add this newhabit(div) into habits container
        const newCheckbox = newHabit.querySelector("input"); //find the input in div we created above
        const streakSpan = newHabit.querySelector(".habit-streak");
       newCheckbox.addEventListener("change", async function(){

    const habitId = newHabit.dataset.id;

    const response = await fetch(
    `http://localhost:5000/api/habits/${habitId}/toggle`,
    {
        method: "PUT",
        headers: {
            authorization: localStorage.getItem("token")
        }
    }
);

const data = await response.json();

streakSpan.textContent = `🔥 ${data.habit.streak}`;
globalStreak.textContent = `${data.globalStreak} Days`;
renderWeekHistory(data.weekHistory);
    updateProgress();
}); 
//if the state of input of div we selected changes, run the function
        const newDeleteButton = newHabit.querySelector(".delete-btn");

        //edit habits
        const editButton = newHabit.querySelector(".edit-btn");
        editButton.addEventListener("click",async function(){
            const label = newHabit.querySelector("label"); // select the label
            const newText = prompt("Edit habit:", label.textContent); //take the input
            if(newText!=null && newText!=""){
                const habitId = newHabit.dataset.id; // stores the id of the habit to be edited

                //put method in action, we send request and update in backend
                const response= await fetch(
                    `http://localhost:5000/api/habits/${habitId}`,
                    {
                        method : "PUT",
                        headers:{
                            "Content-Type": "application/json",
                            authorization: localStorage.getItem("token")
                        },
                        body: JSON.stringify({
                            name:newText
                        })
                    }
                )
                const updatedHabit = await response.json(); // backend sends response
                label.textContent = updatedHabit.name; // UI update
            }
        })
        newDeleteButton.addEventListener("click", async function(){

    const habitItem = newDeleteButton.parentElement;

    const habitId = habitItem.dataset.id;

    const response = await fetch(
    `http://localhost:5000/api/habits/${habitId}`,
    {
        method: "DELETE",
        headers: {
            authorization: localStorage.getItem("token")
        }
    }
);

const data = await response.json();

habitItem.remove();

globalStreak.textContent = `${data.globalStreak} Days`;
renderWeekHistory(data.weekHistory);

updateProgress();
});

        updateProgress(); //if add habit button is clicked, run the function to recalculate the progress
}
addHabitBtn.addEventListener("click", async function(){

    const habitText = habitInput.value;

    if(habitText != ""){
        const response = await fetch(
            "http://localhost:5000/api/habits",
            {
                method:"POST",
                headers:{
                    "Content-Type" : "application/json",
                    authorization: localStorage.getItem("token")
                },
                body:JSON.stringify({
                    name:habitText
                })


            }
        );
        const data = await response.json();

createHabit(data.habit);

globalStreak.textContent = `${data.globalStreak} Days`;
renderWeekHistory(data.weekHistory);

habitInput.value = "";

updateProgress();
    }
    else{
        alert("Please enter a habit");
    }

});

//for logging out
const logout_btn = document.querySelector("#logout-btn");
logout_btn.addEventListener("click", function(){
    localStorage.removeItem("token");
    window.location.href = "../index.html";
})

function renderWeekHistory(weekHistory) {

    weekBoxes.innerHTML = "";

    weekHistory.forEach(function(day) {

        const box = document.createElement("div");

        box.classList.add("day-box");

        if (day === true) {
            box.classList.add("completed");
        }
        else if (day === false) {
            box.classList.add("missed");
        }
        else {
            box.classList.add("future");
        }

        weekBoxes.appendChild(box);

    });

}

async function loadHabits() {

    const response = await fetch(
        "http://localhost:5000/api/habits",
        {
            headers: {
                authorization: localStorage.getItem("token")
            }
        }
    );

    const data = await response.json();
    globalStreak.textContent = `${data.globalStreak} Days`;
    renderWeekHistory(data.weekHistory);
    data.habits.forEach(function(habit) {
        createHabit(habit);
    });
}

loadHabits();
loadUser();

const historyBtn = document.querySelector("#history-btn");

historyBtn.addEventListener("click", function(){

    window.location.href = "history.html";

});