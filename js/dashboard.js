const checkboxes = document.querySelectorAll('input[type="checkbox"]'); //find all the checkboxes
const progressText = document.querySelector("#progress-text"); //find the element with id = progress-text
function updateProgress(){
    const checkboxes = document.querySelectorAll('input[type="checkbox"]'); //find all the checkboxes
    let completed = 0;
    checkboxes.forEach(function(checkbox){//for each checkbox, check whether they're checked or not
        if(checkbox.checked){
            completed++;
        }
    });
    progressText.textContent = `Completed : ${completed}/${checkboxes.length}`; //updating the progress
};

checkboxes.forEach(function(checkbox){//for all of the checkboxes, if the state of any changes, call updateProgress function
    checkbox.addEventListener("change", updateProgress);

});
updateProgress();

//for adding habits
const habitInput = document.querySelector("#habit-input");
const addHabitBtn = document.querySelector("#add-habit-btn");
const habitsContainer = document.querySelector(".habits");
//function for adding habits
function createHabit(habitText, checked = false){
     const newHabit = document.createElement("div");//create a div 
        newHabit.classList.add("habit-item");// put class on that div
        //providing the inner HTML of div with class = habit-item
        newHabit.innerHTML = `
        <input type="checkbox" ${checked ? "checked" : ""}>
        <label>${habitText}</label>
        <button type="button" class="edit-btn">Edit</button>
        <button type="button" class="delete-btn">Delete</button>
        `;
        habitsContainer.appendChild(newHabit);//add this newhabit(div) into habits container
        const newCheckbox = newHabit.querySelector("input"); //find the input in div we created above
        newCheckbox.addEventListener("change", function(){
            updateProgress();
            saveHabits();
        }); //if the state of input of div we selected changes, run the function
        const newDeleteButton = newHabit.querySelector(".delete-btn");

        //edit habits
        const editButton = newHabit.querySelector(".edit-btn");
        editButton.addEventListener("click", function(){
            const label = newHabit.querySelector("label");
            const newText = prompt("Edit habit:", label.textContent);
            if(newText!=null && newText!=""){
                label.textContent = newText;
                saveHabits();
            }
        })
        newDeleteButton.addEventListener("click", function(){
            const habitItem = newDeleteButton.parentElement;
            habitItem.remove();
            updateProgress();
            saveHabits();
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
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    name:habitText
                })


            }
        );
        const newHabit = await response.json();
        createHabit(newHabit.name);
        habitInput.value = "";
    }
    else{
        alert("Please enter a habit");
    }

});

//for logging out
const logout_btn = document.querySelector("#logout-btn");
logout_btn.addEventListener("click", function(){
    window.location.href = "../index.html";
})

//Local storage(stores string only) -> localStorage.setItem(key, value), .getItem()
//array of habits -> use JSON.stringify() bcuz local storage only stores string and array of habits is an object
// to retrieve -> use JSON.parse() bcuz we need to convert string stored in local storage back to array
//we are putting this in a function bcuz we need to call it everytime the user add or deletes the habit, otherwise it'll only run after the page loads
function saveHabits(){
    let arr =[];
    const habitItem = document.querySelectorAll(".habit-item");
    habitItem.forEach(function(habit){
        const label = habit.querySelector("label");
        const checkbox = habit.querySelector("input");
        arr.push({
            text : label.textContent,
            checked: checkbox.checked
        }); // we use textContent to only get the value of the label
    })
    localStorage.setItem("Habits",JSON.stringify(arr));
}

// const habits = JSON.parse(localStorage.getItem("Habits"));
// if(habits){
//     habits.forEach(function(habit){
//         createHabit(habit.text, habit.checked);
//     });

// }

//testing
const testBtn = document.getElementById("test-btn");

testBtn.addEventListener("click", async () => {
    const response = await fetch("http://localhost:5000/api/habits");

    const data = await response.json();

    console.log(data);
});

async function loadHabits() {

    const response = await fetch(
        "http://localhost:5000/api/habits"
    );

    const habits = await response.json();

    habits.forEach(function(habit) {
        createHabit(habit.name, habit.completed);
    });
}

loadHabits();