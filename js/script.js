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
  // console.log(tasks);
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

// Handle delete project
function deleteProject(id) {
  projects = projects.filter((p) => {
    return p.id !== id;
  });
  storeProjects(projects);
  displayProjects(projects);
}

// function to display the tasks that match the current section
function displayProjectTasks(id) {
  // close aside bar of needed
  document.querySelector("body aside").classList.remove("show-side");

  // remove active li from each and set it
  document
    .querySelectorAll("aside ul li a")
    .forEach((e) => e.classList.remove("active"));
  document.querySelector(`[data-id='${id}']`).classList.add("active");
  currentSection = +id;

  changeHeadingSection(currentSection);
  // console.log(currentSection);
  // get project tasks
  tasks = getCurrentTasks(currentSection);
  // display project tasks
  displayTasks(tasks);
}


// function that return tasks that match current status
function getCurrentTasks(currentSection) {
  if (currentSection === 1) return JSON.parse(localStorage.getItem("tasks")) || [];
  else if (currentSection === 2) return getTasksForCurrentDay();
  else if (currentSection === 3) return getTasksForNextSevenDays();
  else {
    for (let proj of projects) {
      if (proj.id === currentSection) return proj.tasks;
    }
  }
}

// function that filter the tasks and return the tasks with current day
function getTasksForCurrentDay() {
  const today = new Date().toDateString(); // get today's date in the format "Day Month Date Year"
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  currentTasksState = tasks.filter((task) => {
    const taskDate = new Date(task.date).toDateString(); // convert the task's date to the same format
    return taskDate === today; // return true if the task's date matches today's date
  });
  return currentTasksState;
}

// function to return tasks for the next week
function getTasksForNextSevenDays() {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const today = new Date(); // get today's date
  const nextSevenDays = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7 // change this to 6 to include the current day
  ); // get the date for 7 days from now
  currentTasksState = tasks.filter((task) => {
    const taskDate = new Date(task.date); // convert the task's date to a Date object
    // return taskDate <= nextSevenDays;
    return taskDate >= today && taskDate <= nextSevenDays;
    // return taskDate >= today && taskDate <= nextSevenDays; // return true if the task's date falls within the next 7 days
  });
  return currentTasksState;
}


function changeHeadingSection(id) {
  let header = document.querySelector("#main-content header h2");
  if (id === 1) header.innerHTML = "Home";
  else if (id === 2) header.innerHTML = "Today";
  else if (id === 3) header.innerHTML = "Week";
  else {
    // find project name
    for (let proj of projects) {
      if (proj.id === id) {
        header.innerHTML = proj.name;
        break;
      }
    }
  }
  // display and hidden the add tasks button
  document.getElementsByClassName("add-task")[0].style.display = !(
    id !== 2 && id !== 3
  )
    ? "none"
    : "block";
}
