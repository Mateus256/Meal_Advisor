function RecipeDetailPage({ setCurrentPage, selectedRecipe }) {
  if (!selectedRecipe) {
    return (
      <div>
        <h1>No recipe selected</h1>
        <button onClick={() => setCurrentPage('recipe')}>Back</button>
      </div>
    );
  }

  return (
    <div>
      <h1>{selectedRecipe.title}</h1>

      <button onClick={() => setCurrentPage('recipe')}>
        Back to Recipe Finder
      </button>

      <h2>Ingredients</h2>
      <ul>
        {selectedRecipe.ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.quantity} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>

      <h2>Steps</h2>
      <ol>
        {selectedRecipe.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
}

export default RecipeDetailPage;