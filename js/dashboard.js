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
addHabitBtn.addEventListener("click", function(){
    const habitText = habitInput.value;//take user input
    if(habitText != ""){
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
        });
        updateProgress(); //if add habit button is clicked, run the function to recalculate the progress
        habitInput.value = ""; // this is used to remove the habit still written inside the input box after clicking add button
    }
    else{
        alert("Please enter a habit");
    }
} );

//for deleting habits
const deleteButtons = document.querySelectorAll(".delete-btn"); // select all delete buttons
deleteButtons.forEach(function(button){
    button.addEventListener("click", function(){
        const habitItem = button.parentElement;
        habitItem.remove();
        updateProgress();
    });
});

