const historyHabits = document.querySelector(".history-habits");
const historyDate = document.querySelector("#history-date");
const historyList = document.querySelector(".history-list");
const selectedDate = document.querySelector("#selected-date");
const calendarGrid = document.querySelector(".calendar-grid");
const monthTitle = document.querySelector("#month-title");

const today = new Date();

const year = today.getFullYear();
const month = today.getMonth();

const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

monthTitle.textContent = `${monthNames[month]} ${year}`;
let selectedDay = null;

const firstDay = new Date(year, month, 1).getDay();

const daysInMonth = new Date(year, month + 1, 0).getDate();

// Empty boxes before the 1st
for(let i = 0; i < firstDay; i++){

    const empty = document.createElement("div");

    calendarGrid.appendChild(empty);

}

// Actual days
for(let day = 1; day <= daysInMonth; day++){

    const box = document.createElement("div");

    box.classList.add("calendar-day");

    box.textContent = day;

    box.addEventListener("click", function(){
        if(selectedDay){
            selectedDay.classList.remove("selected-day");
        }
        box.classList.add("selected-day");
        selectedDay = box;
        historyHabits.style.display = "block";
        historyDate.textContent = `📅 ${day} ${monthNames[month]} ${year}`;
    });

    calendarGrid.appendChild(box);

}