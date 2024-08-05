var editFlag = false;
var tableDataFlag = false;
var editedTableRowIndex = "";
var dataFromBrowserStorage = [];
checkingIsItInitialLoad();

class biodata {
  constructor(nameFromLocalStorage, ageFromLocalStorage) {
    this.name = nameFromLocalStorage;
    this.age = ageFromLocalStorage;
  }
  async validation(names, ages) {
    if (names === null || names.length === 0) {
      alert("Please fill namefield")
      return false;
    } else if (ages === null || ages.length === 0) {
      alert("Please fill age field")
      return false;
    } else {
      return true;
    }
  }
}

let biodataClass = new biodata();
var updatedDataArray = [];
class updatedData {
  constructor(updatedName, updatedAge,editRowIndex) {
    this.name = updatedName;
    this.age = updatedAge;
    this.editRowIndex = editRowIndex;
  }
}
let personalDetails = new Map();

document.getElementById("details").addEventListener("submit",  (event) => {
  event.preventDefault();
  editFlag ? updateRow() : SubmitEvent();
})

let inputFieldDetailsArray = [];

async function SubmitEvent() {
  let nameField = document.getElementById("name");
  const names = nameField.value;
  let ageField = document.getElementById("age");
  const ages = ageField.value;
  const isValid = await biodataClass.validation(names, ages);
  if (isValid) {
    inputFieldDetailsArray.push(names);
    inputFieldDetailsArray.push(ages);   
    insertDataToTable();
    clearInputField();
    saveDataInLocalStorage(names, ages);
  }
}

function saveDataInLocalStorage(names, ages) {
  if (tableDataFlag) {
    localStorage.setItem('names', JSON.stringify(names))  // stored each value in local storage
    localStorage.setItem('ages', JSON.stringify(ages))
    // localStorage.setItem('islocalStorageHaveData', true);  // flag to check that is local storage already has data.if lc have data retreive it and Add to bio data class,this bioclass will give data as keyvalue pair and it pushed into array                                                                                                                                                   
    nameFromLocalStorage = JSON.parse(localStorage.getItem("names"))
    ageFromLocalStorage = JSON.parse(localStorage.getItem("ages")) // it will give an array of objects with data retreived from local storage
    dataFromBrowserStorage.push(new biodata(nameFromLocalStorage, ageFromLocalStorage));
    let addIngDataArrayToLocalStorage = JSON.stringify(dataFromBrowserStorage)  // then adding this array to local storage for updating data on table when refreshing
    localStorage.setItem("addIngDataArrayToLocalStorage", addIngDataArrayToLocalStorage)
  } else {
    localStorage.setItem('names', JSON.stringify(names))
    localStorage.setItem('ages', JSON.stringify(ages))
    // localStorage.setItem('islocalStorageHaveData', true);
  }
}

function insertDataToTable() {
  if (inputFieldDetailsArray.length > 0) {
    tableDataFlag = true;
    let table = document.getElementById("personDetailsBody")
    let dataAddingInTable = document.getElementById("personDetailsBody").rows.length;
    let row = table.insertRow(dataAddingInTable);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerHTML = inputFieldDetailsArray[0];
    cell2.innerHTML = inputFieldDetailsArray[1];
    cell3.innerHTML = `
  <i class="fa fa-trash" onclick="deleteRow(this)" style="font-size:24px"></i>
  <i class="fa fa-pencil" onclick="editRow(this)" style="font-size:24px"></i>
`;
    inputFieldDetailsArray = [];
    editFlag = false;
  } else {
    tableDataFlag = false;
  }
}

function deleteRow(button) {
  var row = button.parentNode.parentNode;
  var table = document.getElementById("personDetailsBody");
  table.deleteRow(row.rowIndex - 1);
  deleteRowFromDataBrowserStorage()
}

function editRow(button) {
  editFlag = true; // to determine is it update or submit
  let tableRow = button.parentNode.parentNode;
  editedTableRowIndex = tableRow.rowIndex;
  document.getElementById("name").value = tableRow.cells[0].innerText;
  document.getElementById("age").value = tableRow.cells[1].innerText;
  tableRow.cells[0].innerText = document.getElementById("name").value;
  tableRow.cells[1].innerText = document.getElementById("age").value;
  buttonNameChange()
}

async function updateRow() {
  let table = document.getElementById("personDetailsBody");
  let rows = table.rows;
  tableDataFlag = true;
  let isValid = await biodataClass.validation(document.getElementById("name").value, document.getElementById("age").value);
  if (isValid) {
    let updatedName = rows[editedTableRowIndex - 1].cells[0].innerText = document.getElementById("name").value;
    let updatedAge = rows[editedTableRowIndex - 1 ].cells[1].innerText = document.getElementById("age").value;
    editFlag = false;
    clearInputField();
    document.getElementById("submit-button").innerHTML = "Add";
    updatedDataArray.push(new updatedData(updatedName, updatedAge, editedTableRowIndex))
    localStorage.setItem('updatedDataArray', JSON.stringify(updatedDataArray));
    updateTableFromLocalStorageFlag = true;
  }

}

function clearInputField() {
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
}
function buttonNameChange() {
  editFlag ? document.getElementById("submit-button").innerHTML = "Update" : document.getElementById("submit-button").innerHTML = "Add";
}

// Function to delete a row from both the table and local storage
function deleteRowFromDataBrowserStorage(rowIndex) {
  // Get data from local storage
  let dataFromBrowserStorage = JSON.parse(localStorage.getItem("addIngDataArrayToLocalStorage"));
  // Remove the specified row from the data array
  dataFromBrowserStorage.splice(rowIndex, 1);
  // Update local storage with the new data array
  localStorage.setItem("addIngDataArrayToLocalStorage", JSON.stringify(dataFromBrowserStorage));
  // Update the table with the new data array
  updateTableWithDataFromBrowserStorage();
}

// Function to check if it's the initial load and initialize the table
function checkingIsItInitialLoad() {
  if (localStorage.getItem("addIngDataArrayToLocalStorage") === null) {
    window.addEventListener("load", (event) => {
      event.preventDefault();
      localStorage.setItem("addIngDataArrayToLocalStorage", JSON.stringify([]));
      updateTableWithDataFromBrowserStorage();
    });
  } else {
    window.addEventListener("load", (event) => {
      event.preventDefault();
      if(localStorage.getItem("updatedDataArray") !== null) {   
        updateRowFromDataBrowserStorage(); 
      }else {
       updateTableWithDataFromBrowserStorage();
      }
    });
  }
}

// Function to update the table with data from local storage
function updateTableWithDataFromBrowserStorage() {
  // Get data from local storage
  let dataStoredInBrowserStorage = localStorage.getItem("addIngDataArrayToLocalStorage");
   dataFromBrowserStorage = JSON.parse(dataStoredInBrowserStorage);
  // Get table body element
  let table = document.getElementById("personDetailsBody");
  // Clear the current table content
  table.innerHTML = "";
  // Populate the table with data
  for (let i = 0; i < dataFromBrowserStorage.length; i++) {
    let row = table.insertRow(i);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerHTML = dataFromBrowserStorage[i].name;
    cell2.innerHTML = dataFromBrowserStorage[i].age;
    cell3.innerHTML = `
      <i class="fa fa-trash" onclick="deleteRow(${i})" style="font-size:24px"></i>
      <i class="fa fa-pencil" onclick="editRow(this)" style="font-size:24px"></i>
    `;
  }
}

// Function to delete a row and update local storage
function deleteRow(rowIndex) {
  deleteRowFromDataBrowserStorage(rowIndex);
}

// Initialize the table on load
checkingIsItInitialLoad();

function updateRowFromDataBrowserStorage(){
  let updatedDataFromLocalStorage = [];
  updatedDataFromLocalStorage = JSON.parse(localStorage.getItem("updatedDataArray"));
  let dataStoredInBrowserStorage = localStorage.getItem("addIngDataArrayToLocalStorage");
  dataFromBrowserStorage = JSON.parse(dataStoredInBrowserStorage);
  updatedDataFromLocalStorage.forEach(object => {
    let index = object.editRowIndex - 1;   // this condition is to replace unedited data array from local storage with editred data data
    if (index >= 0 && index < dataFromBrowserStorage.length) {  // from browser storage replace unedited data with edited data and populate it in table
      dataFromBrowserStorage[index].name = object.name; 
      dataFromBrowserStorage[index].age = object.age;
    }
    let table = document.getElementById("personDetailsBody");
  table.innerHTML = "";
  for (let i = 0; i < dataFromBrowserStorage.length; i++) {
    let row = table.insertRow(i);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerHTML = dataFromBrowserStorage[i].name;
    cell2.innerHTML = dataFromBrowserStorage[i].age;
    cell3.innerHTML = `
      <i class="fa fa-trash" onclick="deleteRow(${i})" style="font-size:24px"></i>
      <i class="fa fa-pencil" onclick="editRow(this)" style="font-size:24px"></i>
    `;
  }
  });
}

function clearBrowserStorage() {
  localStorage.clear();
  dataFromBrowserStorage = [];
  tableDataFlag = false;
  document.getElementById("personDetailsBody").innerHTML = "";
  document.getElementById("submit-button").innerHTML = "Add";
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
}

// test