
//BUDGET CONTROLLER
var budgetController = (function () {


  // Function constructors for Expense and Income objects
  var Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {

    if (totalIncome > 0){
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else{
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  }

  var Income = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type){
    var sum = 0;
    // Loop adds up the values of each element within the 'exp' or 'inc' array
    data.allItems[type].forEach(function(current) {
      sum += current.value;
    });
    // which then gets stored into the data object
    data.totals[type] = sum;
  };

  // Massive Data Strucutre for everything to be added to page
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1,

  }


  return {
    // public function to add an income / expense to data structure
    addItem: function(type, desc, val) {
      var newItem, ID;

      // Create unique ID based on last element in array
      if (data.allItems[type].length === 0){
        ID = 0;
      }else{
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }

      // Create new item
      if (type === 'exp') {
        newItem = new Expense(ID, desc, val);
      } else if (type === 'inc'){
        newItem = new Income(ID, desc, val);
      }

      // Add new item to data structure and push it.
      data.allItems[type].push(newItem);
      return newItem;

    },

    deleteItem: function (type, id) {
      var ids, index;

      // Returns an array with just the IDs of the items of that type
      ids = data.allItems[type].map(function(current){
        return current.id;
      });

      // get the index of the id we want to delete, and then delete it
      index = ids.indexOf(id);
      if (index !== -1){
        data.allItems[type].splice(index, 1);
      }

    },

    calculateBudget: function() {

      // 1. Calculate total income and expenses
      calculateTotal('inc');
      calculateTotal('exp');

      // 2. Calculate budget (income - expenses)
      data.budget = data.totals.inc - data.totals.exp;

      // 3. Calculate percentage of income that we spent
      if (data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else{
        data.percentage = -1;
      }
    },

    calculatePercentages: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });

    },

    getPercentages: function () {
      var allPercentages = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPercentages;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    // Public function to test data structure
    testing: function() {
      console.log(data);
    }
  }


})();















//UI CONTROLLER
var UIController = (function () {

  // Holds all the different strings that refer to HTML classes
  // Which would make it easier to change things in the future
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var capitalize = function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  };

  //Adds +/-, commas, 2 decimal points
  var formatNumber = function (num,type) {
    var numSplit, int, decimal;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');
    int = numSplit[0];
    if (int.length > 3){
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }
    decimal = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + decimal;
  };

  return {
    // Gets input from the HTML form
    getInput: function(){
      return {
        type: document.querySelector(DOMStrings.inputType).value, // Will be either "inc" or "exp"
        description: capitalize(document.querySelector(DOMStrings.inputDescription).value),
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value) //String parsed into float
      }
    },

    addListItem: function(obj, type){
      var html, newHtml, element;

      // Create HTML String with Placeholder text
      if (type === 'inc'){
        element = DOMStrings.incomeContainer;

        html = ' <div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        element = DOMStrings.expensesContainer;

        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace placeholder text with actual Data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    deleteListItem: function (selectorID) {
      // Have to move up to parent and delete child to remove item from DOM
      var element = document.getElementById(selectorID);
      element.parentNode.removeChild(element);

    },

    clearFields: function() {
      var fields, fieldsArray;

      fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function(current, index, array) {
        current.value = "";
      });

      fieldsArray[0].focus();
    },

    displayBudget: function (obj) {
      var type;
      obj.budget >= 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget,type);
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
      if (obj.percentage !== -1){
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
    },

    displayPercentages: function(percentages){

      var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

      var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++){
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });

    },

    displayMonth: function(){
      var now, months, year, month;
      now = new Date();

      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
       'August', 'September', 'October', 'November', 'December'];

      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
    },

    // Allows other classes to use the DOM Strings object
    getDOMStrings: function(){
      return DOMStrings;
    }
  };

})();



















//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

  //Self explanatory function
  var setUpEventListeners = function() {
    var DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    document.addEventListener('keypress', function(event) {
        // If the pressed key was Enter
        if (event.keyCode === 13 || event.which === 13){
          ctrlAddItem();
        }
    });
  };

  var updateBudget = function() {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    var budget = budgetCtrl.getBudget();

    // 3. display the budget
    UICtrl.displayBudget(budget);

  };

  var updatePercentages = function () {

    // 1. Calculate Percentages
    budgetCtrl.calculatePercentages();
    // 2. Read percentages from budget controller
    var percentages = budgetCtrl.getPercentages();
    // 3. Update UI with percentages
    UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function(){
    var input, newItem;

    // 1. Get input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0){
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add a new item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear fields
      UICtrl.clearFields();

      // 5. Calculate and Update budget
      updateBudget();

      // 6. Calculate and update Percentages
      updatePercentages();
    }

  };

  var ctrlDeleteItem = function(event){
    var itemID, splitID, type, id;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {

      // format is something like inc-1, we split to gain access to parts
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. Delete item from DataStructure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete item from UI
      UICtrl.deleteListItem(itemID);
      // 3. Update new Budget
      updateBudget();
      // 4. calculate and update Percentages
      updatePercentages();

    }

  }

  return {
    // Grand ol initialization function
    init: function() {
      console.log("Application has started.");
      setUpEventListeners();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      UICtrl.displayMonth();
    }
  };

})(budgetController, UIController);

controller.init();
