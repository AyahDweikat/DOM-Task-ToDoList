let task = document.getElementById("task");
let asignee = document.getElementById("assignee");
let newTask =document.getElementById("newTask");
let filters = document.getElementById("filters");
let handleIconToggle = document.getElementById("handleIconToggle")
let search = document.getElementById("search");
let taskList = [];
taskList = getFromLocalStorage();
let count =true;
let flagDone=false, flagPending=false;

storeInLocal(taskList);
getNumTasks(taskList);

filters.addEventListener("click", (event)=>{
  handleFiltering(event)
  
})
handleIconToggle.addEventListener("click", ()=>{
  let logoHandle = document.getElementById("logoHandle");
  let body = document.body;
  count = !count;
  if(!count){
    body.classList.add("dark-theme");
    logoHandle.src="../assets/images/logo-dark-theme-removebg-preview-_1_.webp"
  } else {
    body.classList.remove("dark-theme");
    logoHandle.src= "../assets/images/logo-light-theme.webp"
  }
})
search.addEventListener("keyup", (event) => {
  let value = event.target.value;
  searchHandler(value, taskList);
});
function handleFiltering(event){
  let done = document.getElementById('done');
  let pending = document.getElementById('pending');
  let filter = event.target.id;
  if(filter === "done"){
    flagDone = !flagDone;
    if(flagDone){
      let doneTasks= taskList.filter((item)=>{
        return item.doneState;
      })
      pending.classList.remove("active")
      flagPending=false;
      done.classList.add("active")
      return displayTask(doneTasks);
    } 
    else {
      done.classList.remove("active");
      flagPending=false;
      return displayTask(taskList);
    }
  }
  if(filter === "pending"){
    flagPending= !flagPending;
    if(flagPending){
      let pendingTasks= taskList.filter((item)=>{
        return !item.doneState;
      })
      done.classList.remove("active")
      flagDone=false;
      pending.classList.add("active")
      return displayTask(pendingTasks)
    } else {
      pending.classList.remove("active")
      flagDone=false;
      return displayTask(taskList)
    }
  }
}
function searchHandler(value, taskList) {
  let searchedResult = [];
  if (value == "") {
    displayTask(taskList);
    displayCounter(taskList);
    return;
  }
  searchedResult = taskList.filter((item) => {
    return (
      item.taskInput.toLowerCase().includes(value.toLowerCase()) ||
      item.asigneeInput.toLowerCase().includes(value.toLowerCase())
    );
  });
  displayTask(searchedResult);
  displayCounter(searchedResult);
}
function getNumTasks(taskList) {
  let taskNum = document.getElementById("taskNum");
  let node = taskNum.firstChild;
  taskNum.removeChild(node);
  taskNum.appendChild(document.createTextNode(`${taskList.length} Tasks `));
}
function changeDoneHandler(event, list, id) { 
  let _state = "";
  let { doneState } = list.find((item) => {
    return item.id === id;
  });
  _state = !doneState;
  let _taskList = list.map((item) => {
    if (item.id === id) {
      return {
        id: item.id,
        taskInput: item.taskInput,
        asigneeInput: item.asigneeInput,
        doneState: _state,
      }
    } else {
      return item;
    }
  });
  taskList = _taskList;
  storeInLocal(taskList);
  searchHandler(search.value, taskList);
}
function deleteHandler(list, id) {
  let finalTaskList = list.filter((item) => {
    return item.id !== id;
  });
  taskList = finalTaskList;
  storeInLocal(taskList);
  searchHandler(search.value, taskList);
}
function addTask(taskInput, asigneeInput) {
  if(taskInput && asigneeInput){
    let genID = generateID();
    let objTask = {
      id: genID.next().value,
      taskInput,
      asigneeInput,
      doneState: false,
    };
    taskList.push(objTask);
    storeInLocal(taskList);
  } else {
    return;
  }
}
function clearInput() {
  task.value = "";
  asignee.value = "";
}
function storeInLocal(list) {
  localStorage.setItem("taskList", JSON.stringify(list));
}
function getFromLocalStorage() {
  let _list = JSON.parse(localStorage.getItem("taskList"));
  if (_list == null) {
    _list = [];
  }
  displayTask(_list);
  displayCounter(_list);
  return _list;
}
function displayTask(list) {
  let taskDisplay = document.getElementById("taskDisplay");
  taskDisplay.innerHTML = "";
  list.forEach((item) => {
    let taskParag = document.createElement("p");
    let textP1 = document.createTextNode(item.taskInput);
    taskParag.appendChild(textP1);

    let assigneeSpan = document.createElement("span");
    let textP2 = document.createTextNode(item.asigneeInput);
    assigneeSpan.appendChild(textP2);
    const deleteBtn = document.createElement("button");
    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid");
    deleteIcon.classList.add("fa-trash");
    deleteIcon.style.color = "#FF0000";
    deleteBtn.appendChild(deleteIcon);

    deleteBtn.setAttribute("id", "deleteTask");
    deleteBtn.addEventListener("click", () => displayAlert(list, item.id));
    deleteBtn.classList.add("deleteBtn");

    const btnDoneState = document.createElement("button");
    btnDoneState.classList.add("btnDoneState");
    let stateIcon = document.createElement("i");
    stateIcon.classList.add(item.doneState ? "fa-solid" : "fa-regular");
    stateIcon.classList.add(item.doneState ? "fa-circle-check" : "fa-circle");
    stateIcon.style.color = "#14bba6";
    btnDoneState.appendChild(stateIcon);
    btnDoneState.addEventListener("click", (event) =>
      changeDoneHandler(event, taskList, item.id)
    );
    btnDoneState.classList.add(item.doneState ? "doneBtn" : "undoneBtn");

    const btnEdit = document.createElement("button");
    btnEdit.classList.add("btnEdit");
    let editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid");
    editIcon.classList.add("fa-pen-to-square");
    btnEdit.appendChild(editIcon);

    const divOne = document.createElement("div");
    const divTwo = document.createElement("div");
    const divThree = document.createElement("div");
    divOne.appendChild(btnDoneState);
    divTwo.appendChild(taskParag);
    divTwo.appendChild(assigneeSpan);
    divThree.appendChild(btnEdit);
    divThree.appendChild(deleteBtn);
    divThree.classList.add("del-edit-btn");

    divTwo.disabled = item.doneState;

    taskParag.addEventListener("dblclick",()=>{
      let editTaskInput = document.createElement("input");
      editTaskInput.classList.add("editInpt")
      divTwo.replaceChild(editTaskInput, taskParag);

      editTaskInput.value = item.taskInput;
      editTaskInput.addEventListener("blur", function (event) {
          event.preventDefault();
          item.taskInput = editTaskInput.value;
          let _taskList = taskList.map((ele) => {
            if (ele.id === item.id) {
              return {
                id: item.id,
                taskInput: editTaskInput.value,
                asigneeInput: item.asigneeInput,
                doneState: item.doneState,
              };
            } else {
              return ele;
            }
          });
          let newTextP1 = document.createTextNode(editTaskInput.value);
          taskParag.replaceChild(newTextP1, textP1);
          divTwo.replaceChild(taskParag, editTaskInput);
          textP1= newTextP1;
          taskList = _taskList;
          storeInLocal(taskList);
      });
    })

    btnEdit.addEventListener("click", () => {
      let editTaskInput = document.createElement("input");
      editTaskInput.classList.add("editInpt")
      divTwo.replaceChild(editTaskInput, taskParag);

      editTaskInput.value = item.taskInput;
      editTaskInput.addEventListener("blur", function (event) {
          event.preventDefault();
          item.taskInput = editTaskInput.value;
          let _taskList = taskList.map((ele) => {
            if (ele.id === item.id) {
              return {
                id: item.id,
                taskInput: editTaskInput.value,
                asigneeInput: item.asigneeInput,
                doneState: item.doneState,
              };
            } else {
              return ele;
            }
          });
          let newTextP1 = document.createTextNode(editTaskInput.value);
          taskParag.replaceChild(newTextP1, textP1);dash-span
          divTwo.replaceChild(taskParag, editTaskInput);
          textP1= newTextP1;
          taskList = _taskList;
          storeInLocal(taskList);
      });
    });

    btnEdit.disabled = item.doneState;
    const newList = document.createElement("li");
    newList.classList.add(item.doneState ? "done-task" : "undone-task");
    newList.appendChild(divOne);
    newList.appendChild(divTwo);
    newList.appendChild(divThree);
    taskDisplay.appendChild(newList);
  });
  getNumTasks(taskList);
}
function displayAlert(list, id) {
  let delBtn = document.getElementById("delBtn");
  let closeBtn = document.getElementById("closeBtn");
  let shadowModal = document.getElementById("shadowModal-delete");
  shadowModal.hidden = false;
  function deleteItem() {
    deleteHandler(taskList, id);
    shadowModal.hidden = true;
  }
  delBtn.addEventListener("click", deleteItem);
  closeBtn.addEventListener("click", (event) => {
    delBtn.removeEventListener("click", deleteItem);
    shadowModal.hidden = true;
  });
  shadowModal.addEventListener("click", (event) => {
    delBtn.removeEventListener("click", deleteItem);
    let modal = event.target.closest("#deleteModal");
    if (modal) {
      return;
    }
    shadowModal.hidden = true;
  });
}
function displayCounter(taskList) {
  let counterDone = document.getElementById("counterDone");
  let counterUnDone = document.getElementById("counterUnDone");
  let _countUnDone = 0;
  let _countDone = 0;
  let doneArr = taskList.filter((item) => {
    return item.doneState;
  });
  _countDone = doneArr.length;
  _countUnDone = taskList.length - _countDone;
  let node1 = counterDone.firstChild;
  counterDone.removeChild(node1);
  counterDone.appendChild(document.createTextNode(_countDone));
  let node2 = counterUnDone.firstChild;
  counterUnDone.removeChild(node2);
  counterUnDone.appendChild(document.createTextNode(_countUnDone));
}
function* generateID() {
  while (true) {
    yield Math.random().toString(36).slice(2);
  }
}
newTask.addEventListener("click", ()=>{
  displayForm()
})
function displayForm() {
  let shadowModal = document.getElementById("shadowModal-form");
  shadowModal.hidden = false;

  let submitTask = document.getElementById("submitTask");
  submitTask.addEventListener("click",(event)=>{
    addTaskHandler(event)
    shadowModal.hidden = true;
  });
  let closeAdd = document.getElementById("closeAdd");
  closeAdd.addEventListener("click", (event) => {
    submitTask.removeEventListener("click", addTaskHandler);
    shadowModal.hidden = true;
  });
  
  shadowModal.addEventListener("click", (event) => {
    submitTask.removeEventListener("click", addTaskHandler); 
    let modal = event.target.closest("#formModal");
    if (modal) {
      return;
    }
    shadowModal.hidden = true;
  });
}
function addTaskHandler(event) {
  event.preventDefault();
  let taskInput = task.value;
  let asigneeInput = asignee.value;
  addTask(taskInput, asigneeInput);
  clearInput();
  displayTask(taskList);
  displayCounter(taskList);
}


