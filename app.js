
//BUDGET CONTROLLER
var budgetController = (function () {


  // Function constructors for Expense and Income objects
  var Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

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
    percentageLabel: '.budget__expenses--percentage'
  };

  var capitalize = function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

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

        html = ' <div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        element = DOMStrings.expensesContainer;

        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace placeholder text with actual Data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    // Clear the UI
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

      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
      if (obj.percentage !== -1){
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
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
    }

  };

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
    }
  };

})(budgetController, UIController);

controller.init();
