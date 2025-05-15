const botForm = () => {
    window.location.href="../html/form.html";

};
const botPort = () => {
    window.location.href="../html/portada.html";

};
const botlist = () => {
    window.location.href="../html/listado.html";

};
const botstat = () => {
    window.location.href="../html/stats.html";

};

let bform = document.getElementById("agg-form");
bform.addEventListener("click",botForm);
let blist = document.getElementById("ver-act");
blist.addEventListener("click",botlist);
let bstat = document.getElementById("ver-stat");
bstat.addEventListener("click",botstat);
