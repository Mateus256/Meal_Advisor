function filterRecipes(
  recipes,
  selectedMealTypes,
  selectedProteins,
  selectedCuisines,
  selectedTags
) {
  return recipes.filter((recipe) => {
    const matchesMealType =
      selectedMealTypes.length === 0 || selectedMealTypes.includes(recipe.mealType);

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