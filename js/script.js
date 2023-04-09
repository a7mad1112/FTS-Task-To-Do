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

  tasks
    ?.filter((e) => e.isComplete)
    .forEach((task) => {
      template += myTemplate(task);
    });
  completedAccordion.innerHTML = template;
  accordionToggle();
}

// general tasks template
function myTemplate(task) {
  return `
  <div class="content-box">
    <div class="task rounded-3 ${task.priority}-priority" aria-label="task">
      <div class="label">
        <label for="task-title-${task.id}">${task.title}</label>
      </div>
      <div class="task-actions">
        <span id="edit-task-btn" onclick=editTask(${task.id})>
          <i class="fa-solid fa-pen"></i>
        </span>
        <span id="delete-task-btn" role="button" aria-label="Delete task" onclick=deleteTask(${
          task.id
        })>
          <i class="fa-solid fa-trash"></i>
        </span>
      </div>
    </div>
    <div class="content rounded-bottom">
      <p>
        Details: ${task.details}
      </p>
      <p id="end-date" class="mt-1 ${
        hasDatePassed(task.date) ? "time-limit" : "null"
      }">
        <label for="task-date-${task.id}">Date:</label>
        <span id="task-date-${task.id}">${task.date}</span>
      </p>
      <p class="is-done text-end">
        <label for="task-isComplete-${task.id}">Complete: </label>
        <input type="checkbox" id="task-isComplete-${task.id}" ${
    task.isComplete ? "checked" : null
  } name="isComplete" ${task.isComplete ?? "checked"} onclick=CompleteTask(${
    task.id
  })>
      </p>
    </div>
  </div>
  `;
}

// function to check if the date is passed
function hasDatePassed(dateString) {
  // create a Date object for the given date string
  const date = new Date(dateString);

  // create a Date object for the current date
  const today = new Date();

  // compare the two dates and return true if the given date has passed
  return date < today;
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
  if (currentSection === 1)
    return JSON.parse(localStorage.getItem("tasks")) || [];
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

// show add task form on click
function showAddTaskForm() {
  changeFormString("New Task", "Create Task");
  inputs.forEach((e) => (e.value = ""));
  document.getElementById("add-task-form").classList.add("scale");
  document.getElementById("add-task-modal").onsubmit = addTask;
}

// function to reset text nodes in add task form
function changeFormString(title, submit) {
  document.querySelector("#add-task-form h3").innerHTML = title;
  document.querySelector("#add-task-form button").innerHTML = submit;
}

// function to handle the input data and if valid then add them to storage
function addTask(e) {
  e.preventDefault();
  // console.log("here");
  if (!validation()) {
    document.querySelector(".title-err").innerHTML =
      "Task must include a title.";
    return;
  }
  document.getElementById("add-task-form").classList.remove("scale");
  let title = document.getElementById("task-name").value;
  let details = document.getElementById("task-details").value;
  let priority = document.getElementById("select-priority").value;
  let date = document.getElementById("due-date").value;
  let newTask = {
    title,
    priority,
    details,
    date,
    isComplete: false,
    id: Math.random() * 100 + 1,
  };
  storeTask(newTask);
}

function validation() {
  let value = document.getElementById("task-name").value;
  return Boolean(value.trim()) && isNaN(value);
}

function storeTask(task) {
  if (currentSection === 1) {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } else {
    projects = JSON.parse(localStorage.getItem("projects"));
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].id === currentSection) {
        projects[i].tasks.push(task);
        tasks = projects[i].tasks;
        break;
      }
    }
    localStorage.setItem("projects", JSON.stringify(projects));
  }
  displayTasks(tasks);
}

// handle edit tasks
function editTask(taskId) {
  let task = {}; // get the task and display data
  document.getElementById("add-task-form").classList.add("scale");
  changeFormString("Edit Task", "Submit");
  if ([1, 2, 3].includes(currentSection)) {
    for (let t of tasks)
      if (t.id === taskId) {
        task = t;
      }
  } else {
    for (let proj of projects)
      if (proj.id === currentSection) {
        task = proj.tasks.find((e) => e.id === taskId);
        break;
      }
  }
  // display data
  inputs[0].value = task.title;
  inputs[1].value = task.details;
  inputs[2].value = task.priority;
  inputs[3].value = task.date;
  [inputs[0], inputs[1]].forEach(
    (inp) =>
      (inp.onclick = function (e) {
        this.select();
      })
  );
  document.getElementById("add-task-modal").onsubmit = function (e) {
    e.preventDefault();
    if (!validation()) {
      document.querySelector(".title-err").innerHTML =
        "Task must include a title.";
      return;
    }
    let title = document.getElementById("task-name").value;
    let details = document.getElementById("task-details").value;
    let priority = document.getElementById("select-priority").value;
    let date = document.getElementById("due-date").value;

    let task = { title, details, priority, date };
    // update the current task without effect on complete or id
    if ([1, 2, 3].includes(currentSection)) {
      for (let i = 0; i < tasks.length; i++)
        if (tasks[i].id === taskId) tasks[i] = { ...tasks[i], ...task };
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } else {
      for (let proj of projects)
        if (proj.id === currentSection) {
          for (let i = 0; i < proj.tasks.length; i++)
            if (proj.tasks[i].id === taskId) {
              proj.tasks[i] = { ...proj.tasks[i], ...task };
              tasks = proj.tasks;
              break;
            }
        }
      localStorage.setItem("projects", JSON.stringify(projects));
    }
    displayTasks(tasks);
    document.getElementById("add-task-form").classList.remove("scale");
  };
}

// function to complete and unComplete Tasks
function CompleteTask(taskId) {
  getCurrentTasks();
  tasks.forEach((task) => {
    if (task.id === taskId) {
      task.isComplete = !task.isComplete;
    }
  });
  if ([1, 2, 3].includes(currentSection)) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } else {
    for (let proj of projects)
      if (proj.id === currentSection) {
        proj.tasks = tasks;
        break;
      }
    localStorage.setItem("projects", JSON.stringify(projects));
  }
  displayTasks(tasks);
}