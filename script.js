function myRecipe(name, ingredients, instructions, difficulty) {
  this.name = name;
  this.ingredients = ingredients.split(",");
  this.instructions = instructions;
  this.difficulty = difficulty;
}

const recipeForm = document.getElementById("add-recipe-form");
const recipeName = document.getElementById("recipe-name");
const ingredients = document.getElementById("ingredients");
const instructions = document.getElementById("instructions");
const difficulty = document.getElementById("difficulty");

recipeForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = recipeName.value;
  const ingredientList = ingredients.value;
  const instruction = instructions.value;
  const level = difficulty.value;

  const newRecipe = new myRecipe(name, ingredientList, instruction, level);

  // console.log(newRecipe)
  const recipesList = document.createElement("li");
  recipesList.innerHTML = `
    <strong>레시피 이름:</strong> ${newRecipe.name}<br>
    <strong>재료:</strong> ${newRecipe.ingredients.join(", ")}<br>
    <strong>난이도:</strong> ${newRecipe.difficulty}<br>
    <strong>조리법:</strong> ${newRecipe.instructions}
`;
  recipes.appendChild(recipesList);

  recipeName.value = "";
  ingredients.value = "";
  instructions.value = "";
  difficulty.value = "쉬움";
});

const recipes = document.getElementById("recipes");
