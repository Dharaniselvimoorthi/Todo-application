const API_URL = "https://todo-application-backend-nhmb.onrender.com/todolist";

const task_input = document.getElementById("inp");
const add_btn = document.getElementById("add-btn");
const task_list = document.getElementById("tasklist");

let currentFilter = "all";

window.onload = loadTasks;

function loadTasks(){
    fetch(API_URL)
    .then(res=>res.json())
    .then(tasks=>{
        task_list.innerHTML="";
        tasks.forEach(task=>createTask(task));
        updateCount();
    });
}

add_btn.onclick = ()=>{
    const text = task_input.value.trim();
    if(!text) return;

    fetch(API_URL,{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ userTask:text })
    })
    .then(res=>res.json())
    .then(newTask=>{
        createTask(newTask);
        task_input.value="";
        updateCount();
    });
};

function createTask(task){
    const li=document.createElement("li");
    const span=document.createElement("span");
    const tick=document.createElement("button");
    const del=document.createElement("button");

    span.textContent=task.userTask;
    tick.innerHTML="✔";
    del.textContent="Delete";

    tick.className="tick-btn";
    del.className="del-btn";

    if(task.status) li.classList.add("completed");

    tick.onclick=()=>{
        fetch(`${API_URL}/${task._id}`,{
            method:"PUT",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({ status: !task.status })
        })
        .then(res=>res.json())
        .then(updated=>{
            task.status=updated.status;
            li.classList.toggle("completed");
            updateCount();
            applyFilter();
        });
    };

    del.onclick=()=>{
        fetch(`${API_URL}/${task._id}`,{ method:"DELETE" })
        .then(()=>{
            li.remove();
            updateCount();
        });
    };

    li.append(tick,span,del);
    task_list.appendChild(li);
}

function updateCount(){
    const total=document.querySelectorAll("#tasklist li").length;
    const completed=document.querySelectorAll("#tasklist li.completed").length;

    document.getElementById("total").textContent=total;
    document.getElementById("completed").textContent=completed;
}

document.querySelectorAll(".filter").forEach(btn=>{
    btn.onclick=()=>{
        document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter=btn.dataset.type;
        applyFilter();
    };
});

function applyFilter(){
    document.querySelectorAll("#tasklist li").forEach(li=>{
        if(currentFilter==="all"){
            li.style.display="flex";
        }
        else if(currentFilter==="completed"){
            li.style.display = li.classList.contains("completed") ? "flex" : "none";
        }
        else{
            li.style.display = !li.classList.contains("completed") ? "flex" : "none";
        }
    });
}