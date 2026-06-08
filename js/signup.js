const form = document.querySelector("form");

form.addEventListener("submit", function(event){
    event.preventDefault();
    window.location.href = "dashboard.html";
});