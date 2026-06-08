const checkboxes = document.querySelectorAll('input[type="checkbox"]'); //find all the checkboxes
const progressText = document.querySelector("#progress-text"); //find the element with id = progress-text

function updateProgress(){
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