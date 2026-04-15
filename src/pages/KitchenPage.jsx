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
          border: 1px solid #ccc;
          border-radius: 5px;
          background: #fff;
          white-space: nowrap;
        }

        .kp-back-btn:hover {
          background: #f5f5f5;
        }

        .kp-ingredient-box {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 2rem;
          background: #fafafa;
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
          color: #444;
        }

        .kp-clear-btn {
          padding: 0.35rem 0.8rem;
          font-size: 0.85rem;
          cursor: pointer;
          border: 1px solid #ccc;
          border-radius: 5px;
          background: #fff;
          color: #555;
        }

        .kp-clear-btn:hover {
          background: #f5f5f5;
        }

        .kp-subtitle {
          font-size: 0.9rem;
          color: #666;
          margin: 0 0 1rem 0;
        }

        .kp-search {
          display: block;
          width: 100%;
          padding: 0.55rem 0.75rem;
          font-size: 0.95rem;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-sizing: border-box;
          margin-bottom: 1rem;
          background: #fff;
        }

        .kp-search:focus {
          outline: none;
          border-color: #999;
        }

        .kp-ingredient-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .kp-ingredient-btn {
          padding: 0.4rem 0.85rem;
          font-size: 0.875rem;
          border: 1px solid #ccc;
          border-radius: 20px;
          cursor: pointer;
          background: #fff;
          transition: background 0.1s, border-color 0.1s;
        }

        .kp-ingredient-btn:hover {
          border-color: #999;
          background: #f5f5f5;
        }

        .kp-ingredient-btn.selected {
          background: #c6f0c2;
          border-color: #7dc97a;
          font-weight: 500;
        }

        .kp-results-heading {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
        }

        .kp-empty-msg {
          color: #666;
          font-size: 0.95rem;
          margin: 0;
        }

        .kp-recipe-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .kp-recipe-card {
          border: 1px solid #e0e0e0;
          border-radius: 7px;
          padding: 1rem 1.25rem;
          background: #fff;
        }

        .kp-recipe-title-btn {
          display: block;
          width: 100%;
          text-align: left;
          padding: 0;
          margin-bottom: 0.4rem;
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .kp-recipe-title-btn:hover {
          color: #555;
        }

        .kp-recipe-missing {
          font-size: 0.8rem;
          color: #c0392b;
          margin: 0 0 0.4rem 0;
        }

        .kp-recipe-meta {
          margin: 0;
          font-size: 0.875rem;
          color: #555;
          line-height: 1.7;
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

        <h2 className="kp-results-heading">
          Matching Recipes
          {selectedIngredients.length > 0 && ` (${matchedRecipes.length})`}
        </h2>

        {selectedIngredients.length === 0 ? (
          <p className="kp-empty-msg">Select at least one ingredient to see matching recipes.</p>
        ) : (
          <div className="kp-recipe-list">
            {matchedRecipes.map((item) => (
              <div key={item.recipe.id} className="kp-recipe-card">
                <button
                  className="kp-recipe-title-btn"
                  onClick={() => {
                    setSelectedRecipe(item.recipe);
                    setCurrentPage('detail');
                  }}
                >
                  {item.recipe.title}
                </button>

                {item.missingCount > 0 && (
                  <p className="kp-recipe-missing">
                    Missing {item.missingCount}: {item.missingIngredients.join(', ')}
                  </p>
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