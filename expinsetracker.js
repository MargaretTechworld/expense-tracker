let List = [];
const ExpenseList = document.getElementById("expenses");
const expenseForm = document.getElementById("expenseForm");
const output = document.getElementById("output");


// Load expenses from local storage on page load
loadExpensesFromLocalStorage();

const renderList = () => {
  ExpenseList.innerHTML = '';
  List.forEach((element, index) => {
    ExpenseList.innerHTML += `
      <li data-index="${index}">    
        <h3>${element.type}</h3>
        <p>Amount: Le ${element.amount}.00</p>
        <p>Date: ${element.date}</p>
        <div class="actions">
          <a href="#" class="edit-btn" data-index="${index}"><i class="fas fa-edit"></i></a>
          <a href="#" class="delete-btn" data-index="${index}"><i class="fas fa-trash"></i></a>
        </div>
      </li>
    `;
  });

  // Attach event listeners to all delete and edit buttons after rendering
  const deleteButtons = ExpenseList.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const listItem = event.target.closest('li');
      if (listItem) {
        const indexToDelete = parseInt(listItem.dataset.index);
        List.splice(indexToDelete, 1);
        renderList();
        updateTotalExpenses();
        saveExpensesToLocalStorage(); // Save after deleting
      }
    });
  });

  const editButtons = ExpenseList.querySelectorAll('.edit-btn');
  editButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const listItem = event.target.closest('li');
      if (listItem) {
        const indexToEdit = parseInt(listItem.dataset.index);
        editExpense(indexToEdit);
      }
    });
  });
};

// inline editing
function editExpense(index) {
  const expense = List[index];
  const listItem = ExpenseList.querySelector(`li[data-index="${index}"]`);
  listItem.innerHTML = `
 <div id="popup" class="popup-overlay">
  <div class="popup-content">
    <h3><input type="text" value="${expense.type}" id="edit-type"></h3>
    <p>Amount: Le <input type="number" value="${expense.amount}" id="edit-amount"></p>
    <p>Date: <input type="date" value="${expense.date}" id="edit-date"></p>
    <div class="actions">
      <button onclick="saveEdit(${index})">Save</button>
      <button onclick="cancelEdit(${index})">Cancel</button>
    </div>
  </div>
</div>
  `;
}

function saveEdit(index) {
  const newType = document.getElementById("edit-type").value;
  const newAmount = parseInt(document.getElementById("edit-amount").value);
  const newDate = document.getElementById("edit-date").value;
  List[index] = { type: newType, amount: newAmount, date: newDate };
  renderList();
  updateTotalExpenses();
  saveExpensesToLocalStorage(); 
}

function cancelEdit(index) {
  renderList(); 
}

// Add new expense
expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const expenseName = document.getElementById("expense-name").value;
  const expenseAmount = parseInt(document.getElementById("expense-amount").value);
  const expenseDate = document.getElementById("expense-date").value;

  List.push({
    type: expenseName,
    amount: expenseAmount,
    date: expenseDate,
  });

  expenseForm.reset();
  renderList();
  updateTotalExpenses();
  saveExpensesToLocalStorage();

});

// Calculate total expenses
function updateTotalExpenses() {
  let totalExpenses = 0;
  List.forEach((expense) => {
    totalExpenses += expense.amount;
  });
  output.textContent = `Total Expenses: Le ${totalExpenses}.00`;
}

// Local Storage Functions
function saveExpensesToLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(List));
}

function loadExpensesFromLocalStorage() {
  const storedExpenses = localStorage.getItem("expenses");
  if (storedExpenses) {
    List = JSON.parse(storedExpenses);
  }
}

renderList();
updateTotalExpenses();