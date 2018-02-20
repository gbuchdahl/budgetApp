
//BUDGET CONTROLLER
var budgetController = (function () {

  var Expense = function(id, desctiption, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, desctiption, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };


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
    addItem: function(type, desc, val) {
      var newItem, ID;




      if (type === 'exp') {
        newItem = new Expense(ID, desc, val);
      } else if (type === 'inc'){
        newItem = new Income(ID, desc, val);
      }

      data.allItems[type].push(newItem);
      return newItem;

    }
  }


})();




//UI CONTROLLER
var UIController = (function () {


  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };


  return {
    getInput: function(){
      return {
        type: document.querySelector(DOMStrings.inputType).value, // Will be either "inc" or "exp"
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      }
    },

    getDOMStrings: function(){
      return DOMStrings;
    }
  };

})();




//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

  var setUpEventListeners = function() {

    var DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {

        if (event.keyCode === 13 || event.which === 13){
          ctrlAddItem();
        }

    });
  }

  var ctrlAddItem = function(){
    // 1. Get input data
    var input = UICtrl.getInput();
    console.log(input);

    // 2. Add the item to the budget controller
    // 3. Add a new item to the UI
    // 4. Calculate the budget
    // 5. display the budget
  };

  return {
    init: function() {
      console.log("Application has started.");
      setUpEventListeners();
    }
  };

})(budgetController, UIController);

controller.init();
