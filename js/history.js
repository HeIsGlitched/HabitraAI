const historyHabits = document.querySelector(".history-habits");
const historyDate = document.querySelector("#history-date");
const historyList = document.querySelector(".history-list");
const calendarGrid = document.querySelector(".calendar-grid");
const monthTitle = document.querySelector("#month-title");
const dashboardBtn = document.querySelector("#dashboard-btn");
dashboardBtn.addEventListener("click", function(){

    window.location.href = "dashboard.html";

});
let habits = [];
let accountCreatedAt = null;

const today = new Date();
today.setHours(0, 0, 0, 0);

let year = today.getFullYear();
let month = today.getMonth();

const prevMonthBtn = document.querySelector("#prev-month");
const nextMonthBtn = document.querySelector("#next-month");

const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

function renderCalendar(){
    calendarGrid.innerHTML = "";
    historyHabits.style.display = "none";
    historyList.innerHTML = "";
    monthTitle.textContent = `${monthNames[month]} ${year}`;
    if(year === today.getFullYear() && month === today.getMonth()){
        nextMonthBtn.disabled = true;
    }
    else{
        nextMonthBtn.disabled = false;
    }
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
    
        const boxDate = new Date(year, month, day);
        boxDate.setHours(0, 0, 0, 0);
    
        if (boxDate > today) {

    box.classList.add("future-day");

}
else if (boxDate < accountCreatedAt) {

    box.classList.add("future-day");

}
else {

    box.addEventListener("click", function(){

        if(selectedDay){
            selectedDay.classList.remove("selected-day");
        }

        box.classList.add("selected-day");

        selectedDay = box;

        historyHabits.style.display = "block";

        historyDate.textContent = `📅 ${day} ${monthNames[month]} ${year}`;

        showHabits(day);

    });

}
    
        calendarGrid.appendChild(box);
    
    }
}

async function loadHistory(){

    const response = await fetch(
        "http://localhost:5000/api/habits/history",
        {
            headers:{
                authorization: localStorage.getItem("token")
            }
        }
    );

    const data = await response.json();

habits = data.habits;

accountCreatedAt = new Date(data.createdAt);
accountCreatedAt.setHours(0, 0, 0, 0);

renderCalendar();

}
loadHistory();

function showHabits(day){

    historyList.innerHTML = "";

    habits.forEach(function(habit){

        const completed = habit.completedDates.find(function(date){

            const d = new Date(date);

            return (
                d.getDate() === day &&
                d.getMonth() === month &&
                d.getFullYear() === year
            );

        });

        const label = document.createElement("label");

label.innerHTML = `
    <input type="checkbox" ${completed ? "checked" : ""}>
    ${habit.name}
`;

const checkbox = label.querySelector("input");

checkbox.addEventListener("change", async function(){

    await fetch(
        `http://localhost:5000/api/habits/${habit._id}/history`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem("token")
            },
            body: JSON.stringify({
                date: `${year}-${month + 1}-${day}`
            })
        }
    );

});

historyList.appendChild(label);

historyList.appendChild(document.createElement("br"));
historyList.appendChild(document.createElement("br"));

    });

}

nextMonthBtn.addEventListener("click", function(){
    if(year === today.getFullYear() && month === today.getMonth()){
        return;
    }

    month++;

    if(month > 11){
        month = 0;
        year++;
    }

    renderCalendar();

});

prevMonthBtn.addEventListener("click", function(){

    month--;

    if(month < 0){
        month = 11;
        year--;
    }

    renderCalendar();

});