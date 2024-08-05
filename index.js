const URL = "https://api.jsonbin.io/v3/b/66aa1e44ad19ca34f88f654b";

async function addTodo(name, description, priority) {
  const todos = await viewTodos();
  todos.push({
    id: max(todos.map((x) => x.id)) + 1,
    name,
    description,
    priority,
  });
  const res = await axios.put(URL, todos, {
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key":
        "$2a$10$BT7ZLD9oZZdWUsomNPOdte6X9IK9zMvJVCRcyQVqtc.BmUvRzAO/W",
      "X-Access-Key":
        "$2a$10$j2zW152ttx0xD2T43QJEzOCrmDsBUXCzfRTSW3Z7HBond29CK/WwO",
    },
  });
  console.log(res);
}

async function viewTodos() {
  const res = await axios.get(URL + "/latest");
  console.log(res);
  return res.data.record.filter(x => x) ?? [];
}

async function updateTodo(id, name, description, priority) {
  const todos = await viewTodos();
  const idx = todos.findIndex((x) => x.id == id);
  if (idx == -1) {
    return todos;
  } else {
    todos[idx] = {
      id,
      name,
      description,
      priority,
    };
    const res = await axios.put(URL, todos, {
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key":
          "$2a$10$BT7ZLD9oZZdWUsomNPOdte6X9IK9zMvJVCRcyQVqtc.BmUvRzAO/W",
        "X-Access-Key":
          "$2a$10$j2zW152ttx0xD2T43QJEzOCrmDsBUXCzfRTSW3Z7HBond29CK/WwO",
      },
    });
    console.log(res);
  }
}

async function deleteTodo(id) {
  const todos = await viewTodos();
  const idx = todos.findIndex((x) => x.id == id);
  if (idx == -1) {
    return todos;
  } else {
    delete todos[idx];
    const res = await axios.put(URL, todos, {
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key":
          "$2a$10$BT7ZLD9oZZdWUsomNPOdte6X9IK9zMvJVCRcyQVqtc.BmUvRzAO/W",
        "X-Access-Key":
          "$2a$10$j2zW152ttx0xD2T43QJEzOCrmDsBUXCzfRTSW3Z7HBond29CK/WwO",
      },
    });
    console.log(res);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  async function main() {
    let todos = await viewTodos();

    const addTodoForm = document.querySelector("#addTodoForm");
    if (addTodoForm) {
      const addTodoButton = addTodoForm.querySelector("#addTodoButton");

      addTodoButton.addEventListener("click", function () {
        const formControlTaskName = addTodoForm.querySelector(
          "#formControlTaskName"
        );
        const formControlTaskPriority = addTodoForm.querySelector(
          "#formControlTaskPriority"
        );
        const formControlTaskDescription = addTodoForm.querySelector(
          "#formControlTaskDescription"
        );

        if (formControlTaskName && formControlTaskName.value) {
          addTodo(
            formControlTaskName.value,
            formControlTaskDescription.value,
            formControlTaskPriority.value
          )
            .then(() => {
              formControlTaskName.value = "";
              formControlTaskDescription.value = "";
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
    } else {
      renderTodos();
    }
  }

  async function renderTodos() {
    let todos = await viewTodos();
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = "";

    for (let todo of todos) {
      const col = document.createElement("div");
      col.className = "col-4";
      col.innerHTML = `
                  <div class="card">
            <div class="card-body">
              <h5 class="card-title">${todo.name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${todo.priority == "1" ? "Low" : todo.priority == "2" ? "Medium" : "High"}</h6>
              <p class="card-text">
                ${todo.description}
              </p>
              <div class="row">
                <div class="col">
                  <a class="btn btn-primary text-decoration-none mx-2 edit-btn"
                    >Edit</a
                  >
                  <a class="btn btn-danger text-decoration-none mx-2 delete-btn"
                    >Delete</a
                  >
                </div>
              </div>
            </div>
            <div class="card-footer todo-card-form d-none">
              <div class="p-2">
                <label for="formControlTaskName" class="form-label"
                  >Task Name</label
                >
                <input
                  type="text"
                  class="form-control formControlTaskName"
                  placeholder="task1"
                  value="${todo.name}"
                />
              </div>
              <div class="p-2">
                <label for="formControlTaskPriority" class="form-label"
                  >Task Priority</label
                >
                <select
                  class="form-select formControlTaskPriority"
                  aria-label="Default select example"
                >
                  <option selected>Open this select menu</option>
                  <option value="1" ${todo.priority == "1" ? "selected" : ""}>Low</option>
                  <option value="2" ${todo.priority == "2" ? "selected" : ""}>Medium</option>
                  <option value="3" ${todo.priority == "3" ? "selected" : ""}>High</option>
                </select>
              </div>
              <div class="p-2">
                <div class="form-floating">
                  <textarea
                    class="form-control formControlTaskDescription"
                    placeholder="Task description"
                    style="height: 100px"
                  >${todo.description}</textarea>
                  <label for="formControlTaskDescription"
                    >Task Description</label
                  >
                </div>
              </div>
              <div class="p-2">
                <button class="btn btn-danger cancel-edit-btn">
                  Cancel Edit
                </button>
                <button class="btn btn-primary save-edit-btn">
                  Save
                </button>
              </div>
            </div>
          </div>`;

      todoList.appendChild(col);

      const editBtn = col.querySelector(".edit-btn");
      const saveEditBtn = col.querySelector(".save-edit-btn");
      const cancelEditBtn = col.querySelector(".cancel-edit-btn");
      const deleteBtn = col.querySelector(".delete-btn");
      const todoCardForm = col.querySelector(".todo-card-form");

      // select the edit button which we just created
      editBtn.addEventListener("click", function () {
        todoCardForm.className = "card-footer todo-card-form";
      });

      cancelEditBtn.addEventListener("click", function () {
        renderTodos(todos);
      });

      saveEditBtn.addEventListener("click", function () {
        const formControlTaskName = col.querySelector(".formControlTaskName");
        const formControlTaskPriority = col.querySelector(
          ".formControlTaskPriority"
        );
        const formControlTaskDescription = col.querySelector(
          ".formControlTaskDescription"
        );
        updateTodo(
          todo.id,
          formControlTaskName.value,
          formControlTaskDescription.value,
          formControlTaskPriority.value
        ).then(() => {
          renderTodos();
        });
      });

      // allow deleting
      deleteBtn.addEventListener("click", function () {
        const confirmation = confirm(
          "Do you want to delete the task: " + todo.name + "?"
        );
        if (confirmation) {
          deleteTodo(todo.id).then(() => {
            renderTodos();
          });
        }
      });
    }
  }

  main();
});
