function matchRecipesByIngredients(recipes, selectedIngredients) {
  return recipes
    .map((recipe) => {
      const recipeIngredientNames = recipe.ingredients.map(
        (ingredient) => ingredient.name
      );

      const missingIngredients = recipeIngredientNames.filter(
        (ingredient) => !selectedIngredients.includes(ingredient)
      );

      return {
        recipe,
        missingIngredients,
        missingCount: missingIngredients.length,
      };
    })
    .filter((item) =>
      item.missingCount <= 5 &&
      item.recipe.ingredients.some(ing => selectedIngredients.includes(ing.name))
    )
    .sort((a, b) => a.missingCount - b.missingCount);
}

export default matchRecipesByIngredients;