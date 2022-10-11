const toggle = document.getElementById("toggle");
const p = document.querySelector("h1");


toggle.addEventListener('click', ()=>{
    document.body.classList.toggle("dark-theme");
    p.classList.toggle("dark-theme");
});




console.log(toggle)