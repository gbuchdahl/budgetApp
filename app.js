
//BUDGET CONTROLLER
var budgetController = (function () {

  //Some code

})();




//UI CONTROLLER
var UIController = (function () {

  return {
    getInput: function(){
      return {
        type: document.querySelector('.add__type').value, // Will be either "inc" or "exp"
        description: document.querySelector('.add__description').value,
        value: document.querySelector('.add__value').value,
      }
    }
  };

})();




//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

  var ctrlAddItem = function(){
    // 1. Get input data
    // 2. Add the item to the budget controller
    // 3. Add a new item to the UI
    // 4. Calculate the budget
    // 5. display the budget
    console.log("ENTER was pressed.")
  }

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(event) {

      if (event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
      }

  });

})(budgetController, UIController);
