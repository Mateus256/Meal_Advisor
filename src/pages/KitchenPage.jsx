import { useState } from 'react';
import recipes from '../data/recipes.json';
import getAllIngredients from '../logic/getAllIngredients';
import matchRecipesByIngredients from '../logic/matchRecipesByIngredients';
import ExcludeIngredientsPanel from '../components/ExcludeIngredientsPanel';

function KitchenPage({ setCurrentPage, openRecipeDetail, favorites, toggleFavorite, addToShoppingList, excludedIngredients, toggleExcluded, clearExcluded }) {
  const ingredients = getAllIngredients(recipes);

  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIngredients = ingredients
    .filter((ingredient) =>
      ingredient.toLowerCase().startsWith(searchTerm.toLowerCase())
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

  const visibleMatchedRecipes = excludedIngredients.length === 0
    ? matchedRecipes
    : matchedRecipes.filter(item =>
        !item.recipe.ingredients.some(ing => excludedIngredients.includes(ing.name))
      );

  return (
    <>
      <style>{`
        .kp-page {
          max-width: 720px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          box-sizing: border-box;
        }

        .kp-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .kp-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .kp-back-btn {
          padding: 0.4rem 0.9rem;
          font-size: 0.9rem;
          cursor: pointer;
          border: 1px solid var(--border);
          border-radius: 5px;
          background: var(--bg);
          color: var(--text);
          white-space: nowrap;
        }

        .kp-back-btn:hover {
          background: var(--surface-hover);
          border-color: var(--border-hover);
        }

        .kp-ingredient-box {
          border: 1px solid var(--border-md);
          border-radius: 8px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 2rem;
          background: var(--surface);
        }

        .kp-ingredient-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .kp-ingredient-box-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-2);
        }

        .kp-clear-btn {
          padding: 0.35rem 0.8rem;
          font-size: 0.85rem;
          cursor: pointer;
          border: 1px solid var(--border);
          border-radius: 5px;
          background: var(--bg);
          color: var(--text-2);
        }

        .kp-clear-btn:hover {
          background: var(--surface-hover);
          border-color: var(--border-hover);
        }

        .kp-subtitle {
          font-size: 0.9rem;
          color: var(--text-2);
          margin: 0 0 1rem 0;
        }

        .kp-search {
          display: block;
          width: 100%;
          padding: 0.55rem 0.75rem;
          font-size: 0.95rem;
          border: 1px solid var(--border);
          border-radius: 5px;
          box-sizing: border-box;
          margin-bottom: 1rem;
          background: var(--bg);
          color: var(--text);
        }

        .kp-search:focus {
          outline: none;
          border-color: var(--border-hover);
        }

        .kp-ingredient-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .kp-ingredient-btn {
          padding: 0.4rem 0.85rem;
          font-size: 0.875rem;
          border: 1px solid var(--border);
          border-radius: 20px;
          cursor: pointer;
          background: var(--bg);
          color: var(--text);
          transition: background 0.1s, border-color 0.1s;
        }

        .kp-ingredient-btn:hover {
          border-color: var(--border-hover);
          background: var(--surface-hover);
        }

        .kp-ingredient-btn.selected {
          background: var(--accent-mid);
          border-color: var(--accent-border);
          font-weight: 500;
        }

        .kp-results-heading {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
          color: var(--text);
        }

        .kp-empty-msg {
          color: var(--text-2);
          font-size: 0.95rem;
          margin: 0;
        }

        .kp-recipe-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .kp-recipe-card {
          border: 1px solid var(--border-light);
          border-left: 3px solid var(--border-light);
          border-radius: 7px;
          padding: 1rem 1.25rem;
          background: var(--bg);
        }

        .kp-recipe-card--green { border-left-color: #4caf50; }
        .kp-recipe-card--yellow { border-left-color: #e6aa00; }
        .kp-recipe-card--red { border-left-color: #c0392b; }

        .kp-recipe-title-btn {
          display: block;
          text-align: left;
          padding: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
          flex: 1;
          min-width: 0;
        }

        .kp-recipe-title-btn:hover {
          color: var(--text-2);
        }

        .kp-ing-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin: 0.6rem 0 0.5rem;
        }

        .kp-ing-pill {
          font-size: 0.78rem;
          padding: 0.2rem 0.55rem;
          border-radius: 20px;
          line-height: 1.4;
        }

        .kp-ing-pill--have {
          background: var(--accent-bg);
          color: var(--accent-check);
          border: 1px solid var(--accent-border);
        }

        .kp-ing-pill--missing {
          background: #fdf0f0;
          color: #c0392b;
          border: 1px solid #e8a0a0;
        }

        html.dark .kp-ing-pill--missing {
          background: #2a1515;
          color: #e87070;
          border-color: #5a2a2a;
        }

        .kp-recipe-meta {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-2);
          line-height: 1.7;
        }

        .kp-add-shopping-btn {
          margin-top: 0.6rem;
          padding: 0.3rem 0.7rem;
          font-size: 0.8rem;
          border: 1px solid var(--border);
          border-radius: 4px;
          background: var(--bg);
          color: var(--text-2);
        }

        .kp-add-shopping-btn:hover {
          background: var(--surface-hover);
          border-color: var(--border-hover);
          color: var(--text);
        }
      `}</style>

      <div className="kp-page">
        <div className="kp-header">
          <button className="kp-back-btn" onClick={() => setCurrentPage('landing')}>
            ← Back
          </button>
          <h1>What's in My Kitchen</h1>
        </div>

        <div className="kp-ingredient-box">
          <div className="kp-ingredient-box-header">
            <h2>Ingredients</h2>
            <button className="kp-clear-btn" onClick={clearAllIngredients}>
              Clear All
            </button>
          </div>
          <p className="kp-subtitle">Choose ingredients you already have.</p>

          <input
            className="kp-search"
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <div className="kp-ingredient-grid">
            {filteredIngredients.map((ingredient) => (
              <button
                key={ingredient}
                className={`kp-ingredient-btn${selectedIngredients.includes(ingredient) ? ' selected' : ''}`}
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
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>

        <ExcludeIngredientsPanel
          excludedIngredients={excludedIngredients}
          toggleExcluded={toggleExcluded}
          clearExcluded={clearExcluded}
        />

        <h2 className="kp-results-heading">
          Matching Recipes
          {selectedIngredients.length > 0 && ` (${visibleMatchedRecipes.length})`}
        </h2>

        {selectedIngredients.length === 0 ? (
          <p className="kp-empty-msg">Select at least one ingredient to see matching recipes.</p>
        ) : (
          <div className="kp-recipe-list">
            {visibleMatchedRecipes.map((item) => (
              <div key={item.recipe.id} className={`kp-recipe-card ${item.missingCount <= 2 ? 'kp-recipe-card--green' : item.missingCount === 3 ? 'kp-recipe-card--yellow' : 'kp-recipe-card--red'}`}>
                <div className="recipe-card-row">
                  <button
                    className="kp-recipe-title-btn"
                    onClick={() => openRecipeDetail(item.recipe)}
                  >
                    {item.recipe.title}
                  </button>
                  <button
                    className={`fav-btn${favorites.some(r => r.id === item.recipe.id) ? ' fav-btn--on' : ''}`}
                    onClick={() => toggleFavorite(item.recipe)}
                    title={favorites.some(r => r.id === item.recipe.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favorites.some(r => r.id === item.recipe.id) ? '★' : '☆'}
                  </button>
                </div>

                <div className="kp-ing-list">
                  {item.recipe.ingredients.map(ing => (
                    <span
                      key={ing.name}
                      className={`kp-ing-pill ${item.missingIngredients.includes(ing.name) ? 'kp-ing-pill--missing' : 'kp-ing-pill--have'}`}
                    >
                      {ing.name}
                    </span>
                  ))}
                </div>

                {item.missingCount > 0 && (
                  <button
                    className="kp-add-shopping-btn"
                    onClick={() => addToShoppingList(item.missingIngredients)}
                  >
                    + Add missing to shopping list
                  </button>
                )}

                <p className="kp-recipe-meta">
                  {item.recipe.mealType} &middot; {item.recipe.protein} &middot; {item.recipe.cuisine}
                  {item.recipe.tags.length > 0 && <> &middot; {item.recipe.tags.join(', ')}</>}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default KitchenPage;