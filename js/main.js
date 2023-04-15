// let taskList = [
//   //   {
//   // id:1
//   //     taskInput: "task 1",
//   //     asigneeInput: "ayah",
//   //     doneState: false,
//   //   },
//   //   {
//   //     taskInput: "task 2",
//   //     asigneeInput: "ameen",
//   //     doneState: false,
//   //   },
// ];


let text = "";
let searchedResult = [];
let taskInput = "";
let asigneeInput = "";

let task = document.getElementById("task");
let asignee = document.getElementById("assignee");
let submitTask = document.getElementById("submitTask");
let search = document.getElementById("search");
let taskDisplay = document.getElementById("taskDisplay");
let counterDone = document.getElementById("counterDone");
let counterUnDone = document.getElementById("counterUnDone");
let exampleModal = document.getElementById('exampleModal');
let delBtn = document.getElementById('delBtn');
let closeBtn = document.getElementById('closeBtn');

let taskList = getFromLocalStorage();
let count = taskList[taskList.length-1]?.id +1 || 0 ;
let genID = generateID();


task.addEventListener("keyup", function taskHandler(event) {
  taskInput = event.target.value;
});
asignee.addEventListener("keyup", function assigneeHandler(event) {
  asigneeInput = event.target.value;
});
submitTask.addEventListener("click", function addTaskHandler(event) {
  event.preventDefault();
  addTask(taskInput, asigneeInput);
  clearInput();
  displayTask(taskList);
  displayCounter(taskList);
});
search.addEventListener("keyup", function searchHandler(event) {
  searchedResult = [];
  if (event.target.value == "") {
    displayTask(taskList);
    displayCounter(taskList);
    return;
  }
  taskList.forEach((item) => {
    if (
      item.taskInput.includes(event.target.value) ||
      item.asigneeInput.includes(event.target.value)
    ) {
      searchedResult.push(item);
    }
  });
  displayTask(searchedResult);
  displayCounter(searchedResult);

});
function changeDoneHandler(event, _taskList, id) {
    let _state = "";
    taskList.forEach((item) => {
        if (item.id === id) {
            _state = !item.doneState;
        }
      });

  taskList.forEach((item) => {
    if (item.id === id) {
      item.doneState = _state;
    }
  });
  _taskList.forEach((item) => {
    if (item.id === id) {
      item.doneState = _state;
    }
  });
  storeInLocal(taskList);
  displayTask(_taskList);
  displayCounter(_taskList);
}
function deleteHandler(_taskList, id) {
  _taskList.forEach((item, idx) => {
    if (item.id === id) {
      _taskList.splice(idx, 1);
    }
  });
  taskList.forEach((item, idx) => {
    if (item.id === id) {
      taskList.splice(idx, 1);
    }
  });
  storeInLocal(taskList);
  displayTask(_taskList);
  displayCounter(_taskList);
}
function addTask(taskInput, asigneeInput) {
  let objTask = {
    id: genID.next().value,
    taskInput,
    asigneeInput,
    doneState: false,
  };
  taskList.push(objTask);
  storeInLocal(taskList);
}
function clearInput() {
  task.value = "";
  asignee.value = "";
  taskInput = "";
  asigneeInput = "";
}
function storeInLocal(list){
    localStorage.setItem('taskList', JSON.stringify(list));
}
function getFromLocalStorage(){
    let _list = JSON.parse(localStorage.getItem('taskList'))
    displayTask(_list)
    displayCounter(_list)
    return _list;
}
function displayTask(list) {
  taskDisplay.innerHTML = "";
  list.forEach((item) => {
    const taskParag = document.createElement("p");
    taskParag.innerHTML = item.taskInput;
    const assigneeParag = document.createElement("p");
    assigneeParag.innerHTML = item.asigneeInput;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i class="fa-solid fa-circle-xmark"></i>`;
    deleteBtn.setAttribute("id", "deleteTask");
    deleteBtn.addEventListener("click", () => displayAlert(list, item.id));


    const btnDoneState = document.createElement("button");
    btnDoneState.innerHTML = item.doneState ? (
      `<i class="fa-solid fa-circle-check"></i>`
    ) : (
      `<i class="fa-regular fa-circle-check"></i>`
    );
    btnDoneState.addEventListener('click',(event)=> changeDoneHandler(event, list, item.id))


    const newDiv = document.createElement("div");
    newDiv.appendChild(taskParag);
    newDiv.appendChild(assigneeParag);
    newDiv.appendChild(deleteBtn);
    newDiv.appendChild(btnDoneState);

    const newList = document.createElement("li");
    newList.appendChild(newDiv);
    taskDisplay.appendChild(newList);
  });
}




function displayAlert(list, id){
  exampleModal.hidden = false;
  delBtn.addEventListener('click', ()=> {
    deleteHandler(list, id);
    exampleModal.hidden = true;
  })
  closeBtn.addEventListener('click', ()=> {
    exampleModal.hidden = true;
    id=-1;
  })
  window.addEventListener('click', (event)=>{
    if ( event.target.tagName !=="I" && event.target.tagName !=="BUTTON" && !exampleModal.hidden) {
       exampleModal.hidden = true;
       id=-1;
    }
 })
}
function displayCounter(taskList) {
  let countUnDone = 0;
  let countDone = 0;
  taskList?.forEach((item) => {
    if (item.doneState) {
      countDone++;
    } else {
      countUnDone++;
    }
  });
  counterDone.innerHTML = countDone;
  counterUnDone.innerHTML = countUnDone;
}
function* generateID() {
  while (true) {
    yield count++;
  }
}
