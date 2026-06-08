const form = document.querySelector("form");//find the first form element on page

//on clicking submit, run the function
form.addEventListener("submit", function(event){
    event.preventDefault();//this prevents the browser from refreshing the page after hitting submit
    window.location.href = "dashboard.html";//forward to dashboard
});