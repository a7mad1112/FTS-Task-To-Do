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
  projectsContainer.innerHTML = "";
  projects.forEach((proj) => {
    projectsContainer.appendChild(projectTemplate(proj));
  });
}

// template for projects
function projectTemplate(project) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  const iList = document.createElement("i");
  const span = document.createElement("span");
  const deleteBtn = document.createElement("div");
  const iTrash = document.createElement("i");

  li.appendChild(a);
  a.appendChild(iList);
  a.appendChild(span);
  a.appendChild(deleteBtn);
  deleteBtn.appendChild(iTrash);

  li.classList.add("my-class");
  a.href = "#";
  a.dataset.id = project.id;
  a.onclick = function () {
    displayProjectTasks(project.id);
  };
  iList.classList.add("fa-solid", "fa-list", "me-2");
  span.textContent = project.name;
  deleteBtn.id = "delete-project-btn";
  deleteBtn.onclick = function () {
    deleteProject(project.id);
  };
  iTrash.classList.add("fa-solid", "fa-trash");

  return li;
}

// function to display tasks
let [homeAccordion, completedAccordion] = [
  ...document.querySelectorAll(".my-accordion"),
];
displayTasks(tasks);
function displayTasks(tasks) {
  completedAccordion.innerHTML = "";
  homeAccordion.innerHTML = "";
  let template = "";
  // console.log(tasks);
  if (tasks.filter((e) => !e.isComplete).length === 0)
    homeAccordion.innerHTML = `
  <div class="relax-img">
            <img src="./imgs/relax2.svg" alt="relax">
            <p>You don't have any tasks, just relax!</p>
          </div>
  `;
  else {
    tasks
      .filter((e) => !e.isComplete)
      .forEach((task) => {
        homeAccordion.appendChild(myTemplate(task));
      });
  }

  tasks
    ?.filter((e) => e.isComplete)
    .forEach((task) => {
      completedAccordion.appendChild(myTemplate(task));
    });
  accordionToggle();

  const inlineInputs = [
    ...document.querySelectorAll(
      ".tasks-container .my-accordion .label > input"
    ),
  ];

  inlineInputs.forEach((ele) => {
    // console.log(ele);
    ele.addEventListener("focus", inlineEdit);
  });
  // console.log(inlineInputs);
}

// general tasks template
function myTemplate(task) {
  const contentBox = document.createElement("div");
  contentBox.className = "content-box";

  const taskContainer = document.createElement("div");
  taskContainer.className = `task rounded-3 ${task.priority}-priority`;
  taskContainer.setAttribute("aria-label", "task");

  const label = document.createElement("div");
  label.className = "label";

  const labelFor = document.createElement("label");
  labelFor.setAttribute("for", `task-title-${task.id}`);

  const input = document.createElement("input");
  input.value = task.title;

  input.dataset.taskId = task.id;

  label.appendChild(input);
  label.appendChild(labelFor);

  const taskActions = document.createElement("div");
  taskActions.className = "task-actions";

  const editTaskBtn = document.createElement("span");
  editTaskBtn.id = "edit-task-btn";
  editTaskBtn.setAttribute("onclick", `editTask(${task.id})`);

  const editIcon = document.createElement("i");
  editIcon.className = "fa-solid fa-pen";

  editTaskBtn.appendChild(editIcon);
  taskActions.appendChild(editTaskBtn);

  const deleteTaskBtn = document.createElement("span");
  deleteTaskBtn.id = "delete-task-btn";
  deleteTaskBtn.setAttribute("role", "button");
  deleteTaskBtn.setAttribute("aria-label", "Delete task");
  deleteTaskBtn.setAttribute("onclick", `deleteTask(${task.id})`);

  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fa-solid fa-trash";

  deleteTaskBtn.appendChild(deleteIcon);
  taskActions.appendChild(deleteTaskBtn);

  taskContainer.appendChild(label);
  taskContainer.appendChild(taskActions);

  const content = document.createElement("div");
  content.className = "content rounded-bottom";

  const details = document.createElement("p");
  details.textContent = `Details: ${task.details}`;

  const endDate = document.createElement("p");
  endDate.id = "end-date";
  endDate.className = `mt-1 ${
    hasDatePassed(task.date) ? "time-limit" : "null"
  }`;

  const endDateLabel = document.createElement("label");
  endDateLabel.setAttribute("for", `task-date-${task.id}`);
  endDateLabel.textContent = "Date:";

  const endDateSpan = document.createElement("span");
  endDateSpan.id = `task-date-${task.id}`;
  endDateSpan.textContent = task.date;

  endDate.appendChild(endDateLabel);
  endDate.appendChild(endDateSpan);

  const isDone = document.createElement("p");
  isDone.className = "is-done text-end";

  const isCompleteLabel = document.createElement("label");
  isCompleteLabel.setAttribute("for", `task-isComplete-${task.id}`);
  isCompleteLabel.textContent = "Complete: ";

  const isCompleteCheckbox = document.createElement("input");
  isCompleteCheckbox.type = "checkbox";
  isCompleteCheckbox.id = `task-isComplete-${task.id}`;
  isCompleteCheckbox.name = "isComplete";
  isCompleteCheckbox.checked = task.isComplete;
  isCompleteCheckbox.onclick = () => CompleteTask(task.id);

  isDone.appendChild(isCompleteLabel);
  isDone.appendChild(isCompleteCheckbox);

  content.appendChild(details);
  content.appendChild(endDate);
  content.appendChild(isDone);

  contentBox.appendChild(taskContainer);
  contentBox.appendChild(content);

  return contentBox;
}

// function to edit task title data
function inlineEdit(ele) {
  // console.log("edit");
  const value = ele.target.value;
  ele.target.select();
  // console.log(ele.target.dataset.taskId);
  ele.target.oninput = function () {
    // console.log(ele.target.value);
  };
  ele.target.onblur = renameTask;

  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "Enter") return;
    ele.target.blur()
  });
  

  function renameTask () {
    // some logic:
    if (!isNaN(ele.target.value) || ele.target.value?.trim().length < 1) {
      ele.target.value = value;
      return;
    }
    // edit task data
    editTaskTitle(ele.target.dataset.taskId, ele.target.value);
  };
}

function editTaskTitle(taskId, title) {
  taskId = +taskId;
  if ([1, 2, 3].includes(currentSection)) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === taskId) {
        tasks[i].title = title;
        break;
      }
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } else {
    for (let proj of projects)
      if (proj.id === currentSection) {
        for (let i = 0; i < proj.tasks.length; i++)
          if (proj.tasks[i].id === taskId) {
            proj.tasks[i].title = title;
            break;
          }
      }
    localStorage.setItem("projects", JSON.stringify(projects));
  }
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
    element
      .querySelector(".label label")
      .addEventListener("click", function () {
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
  document.getElementById("task-name").focus();
  inputs.forEach((e) => (e.value = ""));
  document.getElementById("add-task-modal").onsubmit = addTask;
  document.getElementById("add-task-form").classList.add("show-modal");
  document.querySelector(".title-err").innerHTML = "";
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
  document.getElementById("add-task-form").classList.remove("show-modal");
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
  showAddTaskForm();
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
    document.querySelector(".title-err").innerHTML = "";
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
    document.getElementById("add-task-form").classList.remove("show-modal");
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

/* handle show and close adding new task form */
document.querySelector(".close-add-task-form").onclick = () => {
  closeAddTaskModal();
};
document.getElementById("add-task-form").onclick = function (event) {
  if (event.target === this) {
    closeAddTaskModal();
  }
};

/* handle select priority color on change and show the matching color */
document.getElementById("select-priority").oninput = function (e) {
  document
    .querySelector('[for="select-priority"]')
    .setAttribute("data-color", e.target.value);
};

/* toggle aside button */
document.getElementById("toggle-bar").onclick = function () {
  document.querySelector("body aside").classList.toggle("show-side");
};

// function to delete task
const deleteContainer = document.getElementById("delete-task-modal");

function deleteTask(taskId) {
  tasks = getCurrentTasks(currentSection);

  confirmation().then((canDelete) => {
    // if the user click ok, then will return resolved promise with true value
    if (canDelete) {
      // console.log("delete");
      // console.log(canDelete);
      // delete task
      tasks = tasks.filter((t) => t.id !== taskId);
      if ([1, 2, 3].includes(currentSection)) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
      } else {
        for (let proj of projects)
          if (proj.id === currentSection) {
            proj.tasks = tasks;
          }
        localStorage.setItem("projects", JSON.stringify(projects));
      }
      displayTasks(tasks);
    }
  });
}
// function that show the confirmation form and return true if the user enter ok, otherWays return false
function confirmation() {
  return new Promise((resolve) => {
    // console.log("confirmation shown");
    deleteContainer.classList.add("show-modal");

    const deleteButton = document.getElementById("delete-task");
    const cancelButton = document.getElementById("cancel-button");

    document
      .getElementById("delete-task-modal")
      .addEventListener("click", function (e) {
        if (e.target === e.currentTarget) closeDeleteForm();
      });

    deleteButton.addEventListener("click", () => {
      closeDeleteForm();
      resolve(true);
    });

    cancelButton.addEventListener("click", () => {
      closeDeleteForm();
      resolve(false);
    });
  });
}

function closeDeleteForm() {
  deleteContainer.classList.remove("show-modal");
}
// close add, remove task form
function closeAddAndRemoveForm() {
  closeDeleteForm();
  closeAddTaskModal();
}
// close add task modal
function closeAddTaskModal() {
  document.getElementById("add-task-form").classList.remove("show-modal");
}

document.addEventListener("keydown", function (ev) {
  if (ev.key !== "Escape") return;
  closeAddAndRemoveForm();
  closeAddTaskModal();
});
