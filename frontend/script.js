

const task_input = document.getElementById("inp");
const add_btn = document.getElementById("add-btn");
const task_list = document.getElementById("tasklist");

const API_URL = "https://todo-application-backend-nhmb.onrender.com/todolist";
window.onload = () => {
    fetch(API_URL)
        .then(res => res.json())
        .then(tasks => {
            task_list.innerHTML = ""; 
            tasks.forEach(task => createTask(task));
            updateCount();
        });
};

add_btn.onclick = () => {
    const text = task_input.value.trim();
    if (!text) return;
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userTask: text })
    })
    .then(res => res.json())
    .then(newTask => {
        createTask(newTask);
        updateCount();
        task_input.value = "";
    });
};

function createTask(task) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const completeBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    span.textContent = task.userTask;
    completeBtn.innerHTML = "✔";
    deleteBtn.textContent = "Delete";
    
    completeBtn.className = "tick-btn";
    deleteBtn.className = "del-btn";

    if (task.status) li.classList.add("completed");

    completeBtn.onclick = function() {
        // Use current DOM state to toggle
        const isCurrentlyCompleted = li.classList.contains("completed");
        const newStatus = !isCurrentlyCompleted;

        fetch(`${API_URL}/${task._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        })
        .then(res => res.json())
        .then(updatedTask => {
            // Sync the object and UI
            task.status = updatedTask.status;
            if (updatedTask.status) {
                li.classList.add("completed");
            } else {
                li.classList.remove("completed");
            }
            updateCount();
        });
    };

    deleteBtn.onclick = () => {
        fetch(`${API_URL}/${task._id}`, { method: "DELETE" })
            .then(() => { li.remove(); updateCount(); });
    };

    li.append(completeBtn, span, deleteBtn);
    task_list.appendChild(li);
}

function updateCount() {
    document.getElementById("total").textContent = document.querySelectorAll("#tasklist li").length;
    document.getElementById("completed").textContent = document.querySelectorAll("#tasklist li.completed").length;
}