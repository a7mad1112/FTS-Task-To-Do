console.log('Hello World!!');
/* Get current mode from localStorage */
let displayMode = localStorage.getItem("mode") || "light";
displayMode === "dark" ? document.body.classList.add("display-dark") : null;
/* handle mode  toggler */
document.getElementById("display-mode").onclick = function () {
  displayMode = displayMode === "light" ? "dark" : "light";
  localStorage.setItem("mode", displayMode);
  displayMode === "dark"
    ? document.body.classList.add("display-dark")
    : document.body.classList.remove("display-dark");
};