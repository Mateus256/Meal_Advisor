function getAllIngredients(recipes) {
  const ingredientNames = recipes.flatMap((recipe) =>
    recipe.ingredients.map((ingredient) => ingredient.name)
  );

  const uniqueIngredients = [...new Set(ingredientNames)];

  return uniqueIngredients.sort();
}

export default getAllIngredients;