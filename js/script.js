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

/* get tasks and projects from localStorage */
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let inputs = [
  ...document.querySelectorAll(
    "#add-task-modal input, #add-task-modal textarea, #add-task-modal select"
  ),
];

/* Add and display Projects */

let addProjectBtn = document.getElementById("add-project");
let projectsContainer = document.getElementById("projects-container");
let currentSection = 1; // refer to Home

displayProjects(projects);
addProjectBtn.onclick = function () {
  const name = prompt("Write project name");
  if (name?.trim()) {
    projects.push({
      name,
      id: Math.random() * 100 + 1,
      tasks: [],
    });
    storeProjects(projects);
    displayProjects(projects);
    // location.reload();
  }
};

function storeProjects(projects) {
  localStorage.setItem("projects", JSON.stringify(projects));
  location.reload();
}

function displayProjects(projects) {
  let template = "";
  projects.forEach((proj) => {
    template += projectTemplate(proj);
  });
  projectsContainer.innerHTML = template;
}

function projectTemplate(project) {
  return `
  <li>
            <a href="#" data-id="${project.id}" onclick="displayProjectTasks(${project.id})">
              <i class="fa-solid fa-list me-2"></i>
              <span>${project.name}</span>
              <div id="delete-project-btn" onclick="deleteProject(${project.id})">
                <i class="fa-solid fa-trash"></i>
              </div>
            </a>
          </li>
  `;
}

// function to display tasks
let [homeAccordion, completedAccordion] = [
  ...document.querySelectorAll(".my-accordion"),
];
displayTasks(tasks);
function displayTasks(tasks) {
  completedAccordion.innerHTML = "";
  let template = "";

  if (tasks.filter((e) => !e.isComplete).length === 0)
    template = `
  <div class="relax-img">
            <img src="./imgs/relax2.svg" alt="relax">
            <p>You don't have any tasks, just relax!</p>
          </div>
  `;
  else {
    tasks
      .filter((e) => !e.isComplete)
      .forEach((task) => {
        template += myTemplate(task);
      });
  }
  homeAccordion.innerHTML = template;

  template = "";

  tasks?.filter((e) => e.isComplete)
    .forEach((task) => {
      template += myTemplate(task);
    });
  completedAccordion.innerHTML = template;
  accordionToggle();
}

/* accordion toggler */
function accordionToggle() {
  const accordions = [...document.getElementsByClassName("content-box")];
  accordions.forEach((element) => {
    element.querySelector(".label").addEventListener("click", function () {
      element.classList.toggle("active");
    });
  });
}