import { useState } from 'react';
import recipes from '../data/recipes.json';
import getAllIngredients from '../logic/getAllIngredients';
import matchRecipesByIngredients from '../logic/matchRecipesByIngredients';

function KitchenPage({ setCurrentPage, setSelectedRecipe }) {
  const ingredients = getAllIngredients(recipes);

  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

 const filteredIngredients = ingredients
  .filter((ingredient) =>
    ingredient.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    const aSelected = selectedIngredients.includes(a);
    const bSelected = selectedIngredients.includes(b);

    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return a.localeCompare(b);
  });

  const clearAllIngredients = () => {
    setSelectedIngredients([]);
  };

  const matchedRecipes = matchRecipesByIngredients(recipes, selectedIngredients);

  return (
    <div>
      <h1>What's in My Kitchen</h1>

      <button onClick={() => setCurrentPage('landing')}>
        Back
      </button>

      <h2>Select Ingredients</h2>
      <p>Choose ingredients you already have.</p>

      <button onClick={clearAllIngredients}>Clear All Ingredients</button>

      <input
        type="text"
        placeholder="Search ingredients..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      {filteredIngredients.map((ingredient) => (
        <button
          key={ingredient}
          onClick={() => {
  if (selectedIngredients.includes(ingredient)) {
    setSelectedIngredients(
      selectedIngredients.filter((item) => item !== ingredient)
    );
  } else {
    setSelectedIngredients([...selectedIngredients, ingredient]);
  }

  setSearchTerm('');
}}
          style={{
            backgroundColor: selectedIngredients.includes(ingredient)
              ? 'lightgreen'
              : 'white',
          }}
        >
          {ingredient}
        </button>
      ))}

      <h2>Matching Recipes</h2>

{selectedIngredients.length === 0 ? (
  <p>Select at least one ingredient to see matching recipes.</p>
) : (
  matchedRecipes.map((item) => (
  <div key={item.recipe.id}>
    <button
      onClick={() => {
        setSelectedRecipe(item.recipe);
        setCurrentPage('detail');
      }}
    >
      {item.recipe.title} (
        {item.missingCount} missing
        {item.missingCount > 0
          ? `: ${item.missingIngredients.join(', ')}`
          : ''}
      )
    </button>

    <p>Meal Type: {item.recipe.mealType}</p>
    <p>Protein: {item.recipe.protein}</p>
    <p>Cuisine: {item.recipe.cuisine}</p>
    <p>Tags: {item.recipe.tags.join(', ')}</p>
  </div>
))
)}
    </div>
  );
}

export default KitchenPage;