let balance = 0;
const transactionList = document.getElementById("transactionList");
const balanceAmount = document.getElementById("balanceAmount");

function updateBalance() {
  let balanceMessage = "";
  const absBalance = Math.abs(balance).toFixed(2);

  if (balance > 0) {
    balanceMessage = `Możesz jeszcze wydać ${absBalance} PLN`;
    balanceAmount.style.color = "green";
  } else if (balance < 0) {
    balanceMessage = `Bilans jest ujemny. Jesteś na minusie ${absBalance} PLN`;
    balanceAmount.style.color = "red";
  } else {
    balanceMessage = "Bilans wynosi 0";
    balanceAmount.style.color = "black";
  }

  balanceAmount.textContent = balanceMessage;
}

function addIncome() {
  const incomeName = document.getElementById("incomeName").value;
  const incomeAmount = parseFloat(
    document.getElementById("incomeAmount").value
  );
  if (!isNaN(incomeAmount) && incomeAmount > 0) {
    balance += incomeAmount;
    updateBalance();
    addTransaction(incomeName, incomeAmount, "income");
  }
}

function addExpense() {
  const expenseName = document.getElementById("expenseName").value;
  const expenseAmount = parseFloat(
    document.getElementById("expenseAmount").value
  );
  if (!isNaN(expenseAmount) && expenseAmount > 0) {
    balance -= expenseAmount;
    updateBalance();
    addTransaction(expenseName, expenseAmount, "expense");
  }
}

function addTransaction(name, amount, type) {
  const transactionItem = document.createElement("li");

  const nameSpan = document.createElement("span");
  nameSpan.textContent = name;
  nameSpan.className = "transaction-name";
  const amountSpan = document.createElement("span");
  amountSpan.textContent = amount.toFixed(2) + " PLN";
  amountSpan.className = "transaction-amount";

  const editButton = document.createElement("button");
  editButton.textContent = "Edytuj";
  editButton.addEventListener("click", () =>
    editTransaction(event, name, amount, type)
  );

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Usuń";
  deleteButton.addEventListener("click", () =>
    deleteTransaction(transactionItem)
  );

  if (type === "income") {
    transactionItem.style.border = "1px solid green";
    amountSpan.style.color = "green";
  } else {
    transactionItem.style.border = "1px solid red";
    amountSpan.style.color = "red";
  }

  transactionItem.appendChild(nameSpan);
  transactionItem.appendChild(amountSpan);
  transactionItem.appendChild(editButton);
  transactionItem.appendChild(deleteButton);

  transactionList.appendChild(transactionItem);
  clearInputFields();
}

function clearInputFields() {
  document.getElementById("incomeName").value = "";
  document.getElementById("incomeAmount").value = "";
  document.getElementById("expenseName").value = "";
  document.getElementById("expenseAmount").value = "";
}

function editTransaction(event, name, amount, type) {
  const transactionItem = event.target.parentElement;
  const nameSpan = transactionItem.querySelector(".transaction-name");
  const amountSpan = transactionItem.querySelector(".transaction-amount");

  const newName = prompt("Wprowadź nową nazwę transakcji:", name);
  const newAmount = parseFloat(
    prompt("Wprowadź nową kwotę transakcji:", amount)
  );

  if (newName !== null && !isNaN(newAmount) && newAmount > 0) {
    const oldAmount = parseFloat(amountSpan.textContent);

    if (!isNaN(oldAmount)) {
      const diffAmount = newAmount - oldAmount;

      nameSpan.textContent = newName;
      amountSpan.textContent = newAmount.toFixed(2) + " PLN";

      if (type === "income") {
        balance += diffAmount;
      } else {
        balance -= diffAmount;
      }

      updateBalance();
    }
  }
}

function deleteTransaction(transactionItem) {
  const amountSpan = transactionItem.querySelector(".transaction-amount");
  const amount = parseFloat(amountSpan.textContent);

  if (!isNaN(amount)) {
    const type = amount > 0 ? "income" : "expense";

    if (type === "income") {
      balance -= amount;
    } else {
      balance += Math.abs(amount);
    }

    updateBalance();
    transactionList.removeChild(transactionItem);

    // Poprawa: Jeśli nie ma już transakcji, ustaw bilans na zero
    if (transactionList.children.length === 0) {
      balance = 0;
      updateBalance();
    }
  }
}

document
  .getElementById("incomeAmount")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addIncome();
    }
  });

document
  .getElementById("expenseAmount")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addExpense();
    }
  });
