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
function createHabit(habitText){
     const newHabit = document.createElement("div");//create a div 
        newHabit.classList.add("habit-item");// put class on that div
        //providing the inner HTML of div with class = habit-item
        newHabit.innerHTML = `
        <input type="checkbox">
        <label>${habitText}</label>
        <button type="button" class="delete-btn">Delete</button>
        `;
        habitsContainer.appendChild(newHabit);//add this newhabit(div) into habits container
        const newCheckbox = newHabit.querySelector("input"); //find the input in div we created above
        newCheckbox.addEventListener("change", updateProgress); //if the state of input of div we selected changes, run the function
        const newDeleteButton = newHabit.querySelector(".delete-btn");
        newDeleteButton.addEventListener("click", function(){
            const habitItem = newDeleteButton.parentElement;
            habitItem.remove();
            updateProgress();
            saveHabits();
        });
        updateProgress(); //if add habit button is clicked, run the function to recalculate the progress
}

addHabitBtn.addEventListener("click", function(){

    const habitText = habitInput.value;

    if(habitText != ""){

        createHabit(habitText);
        saveHabits();
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
    const allHabits = document.querySelectorAll("label");
    allHabits.forEach(function(habit){
        arr.push(habit.textContent); // we use textContent to only get the value of the label
    })
    const storeHabits = JSON.stringify(arr);
    localStorage.setItem("Habits",storeHabits);
}

const habits = JSON.parse(localStorage.getItem("Habits"));
if(habits){
    habits.forEach(function(habit){
        createHabit(habit);
    });

}



