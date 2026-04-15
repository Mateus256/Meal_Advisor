function filterRecipes(
  recipes,
  selectedMealType,
  selectedProteins,
  selectedCuisines,
  selectedTags
) {
  return recipes.filter((recipe) => {
    const matchesMealType =
      selectedMealType === '' || recipe.mealType === selectedMealType;

    const matchesProtein =
      selectedProteins.length === 0 || selectedProteins.includes(recipe.protein);

    const matchesCuisine =
      selectedCuisines.length === 0 || selectedCuisines.includes(recipe.cuisine);

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => recipe.tags.includes(tag));

    return matchesMealType && matchesProtein && matchesCuisine && matchesTags;
  });
}

export default filterRecipes;