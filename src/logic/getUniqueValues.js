function getUniqueValues(recipes, key) {
  const values = recipes.map((recipe) => recipe[key]);
  const uniqueValues = [...new Set(values)];

  return uniqueValues.sort();
}

export default getUniqueValues;