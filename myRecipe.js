var ingredientIndex = 1;
var imageBase64;
var ipAddress  = "https://my-recipe-app-v1.herokuapp.com";
var categoryList = ["Appetizers and Snacks", "Bread Recipes", "Desserts", "Drinks", "Main Dishes", "Salad Recipes", "Soups", "Breakfast and Brunch", "Lunch Recipes", "Dinner Recipes"]
var receipeList;



//document on load function
$(document).ready(function () {

  // save log button
  $('#addIngBtn').click(addIngredientField);
  $('#imageFile').change(imageUpload);
  $('#addRecipeBtn').click(createRecipe);
  loadCategory();
  loadUI();
  for (i = 0; i < categoryList.length; i++) {
    $("#cat" + i).click(listRecipe);
  }
  $('#receipeDetails').hide();


});


 /* this method lists out the recieps list */
listRecipe = function (event) {
  $("#receipeContent").html(" <div class=\"message\" >Loading ! Fetching data from the server :)</div>");

  var categoryName = $("#" + event.target.id).html();
  // alert(categoryName);
  $.get(ipAddress  + "/recipe/search/" + categoryName, function (data, status) {
    receipeList = data.result;
    console.log(receipeList);
    if (receipeList.length <= 0) {
      $("#receipeContent").html(" <div class=\"message\" >Sorry! No records found\ :)</div>");
    }
    else {
      displayRecipeList(receipeList);

    }

    // $('.message').hide();

  });

}
/* this method displays receipes */
function displayRecipeList(receipeList) {
  var txt = "";
  var i = 0;
  for (i = 0; i < receipeList.length; i++) {
    txt += "<div class=\"row\">";
    for (j = 0; j < 4; j++) {
      var receipeIndex = i++;
      if (receipeIndex >= receipeList.length)
        break;
      txt += "                 <div class=\"col-sm-3\">\n"
        + "                        <div class=\"card\">\n"
        + "                            <img class=\"card-img-top\" src=\"" + receipeList[receipeIndex].image + "\" alt=\"Card image\" width=\"100px\" height=\"230px\">\n"
        + "                            <div class=\"card-body\">\n"
        + "                              <a href=\"#receipeDetailPage\"  id=\"receipe" + receipeIndex + "\">" + receipeList[receipeIndex].dishName + "<\a>"
        + "                            </div>\n"
        + "                          </div>\n"
        + "                    </div>\n";
    }
    txt += "</div>";

  }
  $("#receipeContent").html(txt);

  // receipe click registration
  for (i = 0; i < receipeList.length; i++) {
    console.log(receipeList[i]);
    $("#receipe" + i).click(detailRecipe);
  }


}

/* this method  displays  details of receipe */
detailRecipe = function (event) {
  $('.message').hide();
  var receipeId = event.target.id;
  var receipeIndex = receipeId.slice(7)

  var myReceipe = receipeList[receipeIndex];
  console.log(receipeList[receipeIndex]);
  // var txt = "       Receipe name:\n" + myReceipe.dishName +
  //   "                Receipe ingredients:\n" +
  //   "                Receipe Instructions:\n" + myReceipe.instruction +
  //   "                Receipe Image:\n" +
  //   "                Created by:" + myReceipe.creation +
  //   "                CreationDate:" + myReceipe.creationDate


  ;
  var ingredients = "<ul>";
  for (i = 0; i < myReceipe.ingredientList.length; i++) {
    ingredients += "<li>" + myReceipe.ingredientList[i] + "</li>";
  }
  ingredients += "</ul>"


  var txt = " <div class=\"row\">\n"
    + "                    <div class=\"card\" style=\"width:400px; margin:auto\">\n"
    + "                        <img class=\"card-img-top\" src=\"" + myReceipe.image + "\" alt=\"Card image\" style=\"width:100%\">\n"
    + "                        <div class=\"card-body\">\n"
    + "                            <h4 class=\"card-title\" style=\"text-align:center\">" + myReceipe.dishName + "</h4>\n"
    + "                            <h5 class=\"card-title\"> Ingredients:</h4>\n"
    + ingredients
    + "                            <h5 class=\"card-text\">Instructions:</h5>\n"
    + "                    <textarea class=\"form-control\"  rows = \"3\"  readonly>" + myReceipe.instruction + "</textarea>"
    + "                            <p class=\"card-title\"> <b>Receipe  By:</b>" + myReceipe.creation + "</p>\n"
    + "                            <p class=\"card-title\"><b> Creation Date:</b>" + myReceipe.creationDate + "</p>\n"
    + "                            <a href=\"#\" class=\"btn btn-primary stretched-link\"  id=\"" + myReceipe._id + "\"style=\"display:block; color:white;\"  >Delete</a>"
    + "                        </div>\n"
    + "                    </div>\n"
    + "                </div>";
  $("#receipeDetails").html(txt);
  $("#" + myReceipe._id).click(deleteReceipe);
  $('#receipeDetails').show();

}
/* this method deletes the receipe */
deleteReceipe = function (event) {
  console.log(event.target.id);
  var id = event.target.id;
  $.get(ipAddress  + "/recipe/delete/" + id, function (data, status) {
    $.mobile.changePage('#categoryList', { transition: "slidefade" });
    $("#messageType").html("Alert");
    $("#message").html("Record deleted successfully");
    $("#errorMessage").popup();
    $("#errorMessage").popup("open");

  });


}

// loads categroy in the begining
function loadUI() {
  var txt = "";
  for (i = 0; i < categoryList.length; i++) {
    txt += "<div class=\"row\">";
    for (j = 0; j < 4; j++) {
      var catIndex = i++;
      if (catIndex >= catIndex.length)
        break;
      txt += "                 <div class=\"col-sm-3\">\n"
        + "                        <div class=\"card\" style=\"text-align:center;\">\n"
        + "                            <img class=\"card-img-top\" src=\"image/" + categoryList[catIndex] + ".jpg\" alt=\"Card image\" width=\"100px\" height=\"230px\">\n"
        + "                            <div class=\"card-body\">\n"
        + "                              <a href=\"#receipeList\"  id=\"cat" + catIndex + "\">" + categoryList[catIndex] + "<\a>"
        + "                            </div>\n"
        + "                          </div>\n"
        + "                    </div>\n";
    }
    txt += "</div>";
  }
  $("#homePage .container").html(txt);

}


// function that loads category in the bginging
function loadCategory() {
  var txt = " <select id=\"category\">";
  for (i = 0; i < categoryList.length; i++) {
    txt += "<option>" + categoryList[i] + "</option>";

  }
  txt += "</select>";
  $("#categoryLabel").after(txt);

}




/* this method adds the ingredient field dynamically */
addIngredientField = function () {
  ingredientIndex++;
  var txt1 = "<label for=\"ingredient1\">Ingredient:" + ingredientIndex + "</label> <div class=\"ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset\"><input type=\"text\" id=\"ingredient" + ingredientIndex + "\" placeholder=\"ingredient\"></div>";
  $("#addIngBtn").before(txt1);
}

/* this method uploads the image file and geneerate base64 value */
imageUpload = function () {

  var file = document.querySelector('#imageFile').files[0];
  getBase64(file); // prints the base64 string


}

/* this method generates bsase 64 value */
function getBase64(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    console.log(reader.result);
    imageBase64 = reader.result;
    $('#recipeImage').removeAttr('hidden');
    $("#recipeImage").attr("src", reader.result);



  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}

createRecipe = function () {

  // get instruction
  var instruction = $("#instruction").val();



  // setup ingredient list
  var ingredientList = [];
  for (i = 1; i <= ingredientIndex; i++) {
    var ingredient = $("#ingredient" + i).val();
    ingredientList.push(ingredient);
  }
  // dish name
  var dishName = $('#dishName').val();
  // category
  var category = $('#category').val();

  // creation by
  var creation = $('#username').val();


  // creation date
  var creationDate = new Date().toString();
  // create recipe
  var receipe = { dishName: dishName, instruction: instruction, ingredientList: ingredientList, image: imageBase64, category: category, creation: creation, creationDate: creationDate }

  // if (validateFields(receipe)) {

  // send the data
  try {
    if (receipe.dishName == "")
      throw "Dish name is empty"
    if (receipe.category == "")
      throw "Category is empty"
    if (receipe.creation == "")
      throw "Creation name is empty"

    if (receipe.instruction == "")
      throw "Instruction is empty"

    if (receipe.creation == "")
      throw "Creation name is empty"
    if (!receipe.image)
      throw "image is empty"

    for (i = 0; i < receipe.ingredientList.length; i++) {
      if (!receipe.ingredientList[i])
        throw "ingredient is missing"
    }
    $.post(ipAddress  + "/recipe/create",
      receipe,
      function (data, status) {
        console.log("Successful" + data + "\nStatus: " + status);
        $.mobile.changePage('#categoryList', { transition: "slidefade" });
        $("#messageType").html("Alert");
        $("#message").html("Records inserted successfully");
        $("#errorMessage").popup();
        $("#errorMessage").popup("open");
      });

  }
  catch (err) {
    // alert message
    alert(err)
    $("#messageType").html("Alert");
    $("#message").html(err);
  }



}



/* Clear all fields */
function cleanFields() {

  $('#serial').val("");
  $('#pilot').val("");
  $('#key').val("");
  $('#contract').val("");
  $('#category').val("");
  var text = $('#category option:first').text();
  $('#category-button span').text(text);

}
function validateFields(receipe) {
  try {
    if (receipe.dishName == "")
      throw "Dish name is empty"
  }
  catch (err) {
    // alert message
    $("#messageType").html("Alert");
    $("#message").html(err);
    $("#errorMessage").popup();
    $("#errorMessage").popup("open");
    // return false;

  }
  return true;
}
