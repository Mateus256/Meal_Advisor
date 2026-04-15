function getAllTags(recipes) {
  const allTags = recipes.flatMap((recipe) => recipe.tags);

  const uniqueTags = [...new Set(allTags)];

  return uniqueTags.sort();
}

export default getAllTags;