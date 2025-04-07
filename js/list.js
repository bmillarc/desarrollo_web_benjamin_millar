const botcum = () => {
    window.location.href="../html/listadoart/cumple.html";

};
const botfiest = () => {
    window.location.href="../html/listadoart/fiesta.html";

};
const botmarch = () => {
    window.location.href="../html/listadoart/marcha.html";

};
const botmus = () => {
    window.location.href="../html/listadoart/musica.html";

};
const botpart = () => {
    window.location.href="../html/listadoart/partido.html";

};


let bcum = document.getElementById("tC");
bcum.addEventListener("click",botcum);
let bmarch = document.getElementById("tM");
bmarch.addEventListener("click",botmarch);
let bmus = document.getElementById("tMu");
bmus.addEventListener("click",botmus);
let bpart = document.getElementById("tP");
bpart.addEventListener("click",botpart);
let bfiest = document.getElementById("tF");
bfiest.addEventListener("click",botfiest);