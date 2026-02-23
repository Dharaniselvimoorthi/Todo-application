const API_URL = "https://todo-application-backend-nhmb.onrender.com/todolist";

const task_input = document.getElementById("inp");
const add_btn = document.getElementById("add-btn");
const task_list = document.getElementById("tasklist");
const loader = document.getElementById("loader");
const progressCircle = document.getElementById("progress");
const percentText = document.getElementById("percent");

let tasksData = [];

window.onload = () => {
    fetchTasks();
};

function fetchTasks(){
    fetch(API_URL)
    .then(res=>res.json())
    .then(data=>{
        tasksData = data;
        task_list.innerHTML="";
        data.forEach(task=>createTask(task));
        updateCount();
        loader.style.display="none";
    });
}

add_btn.onclick = () => {
    const text = task_input.value.trim();
    if(!text) return;

    fetch(API_URL,{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ userTask:text })
    })
    .then(res=>res.json())
    .then(newTask=>{
        tasksData.push(newTask);
        createTask(newTask);
        updateCount();
        showToast("Task Added 🚀");
        task_input.value="";
    });
};

function createTask(task){
    const li=document.createElement("li");
    const span=document.createElement("span");
    const completeBtn=document.createElement("button");
    const deleteBtn=document.createElement("button");

    span.textContent=task.userTask;
    completeBtn.innerHTML="✔";
    deleteBtn.textContent="Delete";

    completeBtn.className="tick-btn";
    deleteBtn.className="del-btn";

    if(task.status) li.classList.add("completed");

    completeBtn.onclick=()=>{
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
            showToast("Task Updated 🎉");
        });
    };

    deleteBtn.onclick=()=>{
        fetch(`${API_URL}/${task._id}`,{ method:"DELETE" })
        .then(()=>{
            li.style.transform="translateX(100%)";
            setTimeout(()=>{
                li.remove();
                updateCount();
                showToast("Task Deleted ❌");
            },300);
        });
    };

    li.append(completeBtn,span,deleteBtn);
    task_list.appendChild(li);
}

function updateCount(){
    const total = document.querySelectorAll("#tasklist li").length;
    const completed = document.querySelectorAll("#tasklist li.completed").length;

    document.getElementById("total").textContent=total;
    document.getElementById("completed").textContent=completed;

    const percent = total===0?0:Math.round((completed/total)*100);
    percentText.textContent = percent+"%";

    const offset = 314 - (314*percent)/100;
    progressCircle.style.strokeDashoffset = offset;
}

function showToast(message){
    const toast=document.getElementById("toast");
    toast.textContent=message;
    toast.classList.add("show");
    setTimeout(()=>toast.classList.remove("show"),2000);
}

/* DARK MODE */
document.getElementById("themeToggle").onclick=()=>{
    document.body.classList.toggle("dark");
};