//klasa zadanie
class Task {
  constructor(id, title, isCompleted = false) {
    this.id = id;
    this.title = title;
    this.isCompleted = isCompleted;
  }
  toggleCompletion() {
    this.isCompleted = !this.isCompleted;
  }
}

let tasks = [];

//wczytanie zadań z localStorage
window.addEventListener("DOMContentLoaded", () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  savedTasks.forEach((t) => {
    tasks.push(new Task(t.id, t.title, t.isCompleted));
  });
  renderTaskList();
});

//dodawanie zadań
document.getElementById("taskForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("taskTitle").value;
  if (title) {
    const newTask = new Task(Date.now(), title);
    tasks.push(newTask);
  }
  renderTaskList(getCurrentFilter());
  document.getElementById("taskTitle").value = "";

  localStorage.setItem("tasks", JSON.stringify(tasks));
});

//funkcja renderująca listę zadań
function renderTaskList(filter = getCurrentFilter()) {
  const tasksList = document.getElementById("tasksList");
  tasksList.innerHTML = "";

  const noTasksText = document.getElementById("noTask");
  if (tasks.length === 0) {
    noTasksText.style.display = "block";
  } else {
    noTasksText.style.display = "none";
  }

  //filtrowanie zadań
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") {
      return task.isCompleted;
    } else if (filter === "pending") {
      return !task.isCompleted;
    } else return true;
  });

  //renderowanie zadań
  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = task.title;
    if (task.isCompleted) {
      li.style.color = "gray";
      li.style.backgroundColor = "#e0fbdd";
    }

    //zmiana stanu zadania
    li.addEventListener("click", () => {
      task.toggleCompletion();
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTaskList(getCurrentFilter());
      setCounters();
    });

    //usuwanie zadania
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "✖";
    deleteButton.style.marginLeft = "10px";

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTaskList(getCurrentFilter());
    });
    tasksList.appendChild(li);
    li.appendChild(deleteButton);
  });
  setCounters();
}

//czyszczenie zadań
document.getElementById("clearTasks").addEventListener("click", () => {
  tasks = [];
  localStorage.removeItem("tasks");
  renderTaskList(getCurrentFilter());
});

//aktualizacja liczników
function setCounters() {
  const taskCount = document.getElementById("taskCount");
  const completedCount = document.getElementById("completedCount");
  const pendingCount = document.getElementById("pendingCount");

  const tasksSaved = JSON.parse(localStorage.getItem("tasks")) || [];
  taskCount.textContent = `Liczba zadań: ${tasksSaved.length}`;
  completedCount.textContent = `Zakończone: ${
    tasksSaved.filter((t) => t.isCompleted).length
  }`;
  pendingCount.textContent = `Do zrobienia: ${
    tasksSaved.filter((t) => !t.isCompleted).length
  }`;
}

//funkcja pomocnicza do pobrania aktualnego ustawienia filtra
function getCurrentFilter() {
  return document.querySelector('input[name="filter"]:checked').value;
}

//obsługa zmiany filtra
document.querySelectorAll('input[name="filter"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    renderTaskList(getCurrentFilter());
  });
});
