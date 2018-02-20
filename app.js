
//BUDGET CONTROLLER
var budgetController = (function () {


  //Function constructors for Expense and Income objects
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
    inputBtn: '.add__btn'
  };


  return {
    // Gets input from the HTML form
    getInput: function(){
      return {
        type: document.querySelector(DOMStrings.inputType).value, // Will be either "inc" or "exp"
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      }
    },

    addListItem = function(obj, type){

      var html;
      // Create HTML String with Placeholder text
      if (type === 'inc'){
        html = ' <div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Replace placeholder text with actual Data

      // Insert HTML into the DOM



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
  }

  var ctrlAddItem = function(){
    var input, newItem;

    // 1. Get input data
    input = UICtrl.getInput();

    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Add a new item to the UI
    // 4. Calculate the budget
    // 5. display the budget
  };

  return {
    // Grand ol initialization function
    init: function() {
      console.log("Application has started.");
      setUpEventListeners();
    }
  };

})(budgetController, UIController);

controller.init();
