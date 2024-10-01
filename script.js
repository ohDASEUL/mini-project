function myRecipe(name, ingredients, instructions, difficulty) {
    this.name = name;
    this.ingredients = ingredients.split(',');
    this.instructions = instructions;
    this.difficulty = difficulty;
}
