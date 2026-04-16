import { useState, useRef, useEffect } from 'react';
import recipes from '../data/recipes.json';
import filterRecipes from '../logic/filterRecipes';
import getUniqueValues from '../logic/getUniqueValues';
import getAllTags from '../logic/getAllTags';
import ExcludeIngredientsPanel from '../components/ExcludeIngredientsPanel';

function FilterDropdown({ label, options, selectedValues, onToggle, onClear, isOpen, onOpen, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const summary =
    selectedValues.length === 0
      ? label
      : selectedValues.length === 1
      ? selectedValues[0]
      : `${selectedValues.length} selected`;

  return (
    <div className="fdd-wrapper" ref={ref}>
      <button
        className={`fdd-trigger${isOpen ? ' fdd-trigger--open' : ''}`}
        onClick={isOpen ? onClose : onOpen}
        type="button"
      >
        <span className="fdd-trigger-text">{summary}</span>
        <span className="fdd-arrow">{isOpen ? '▴' : '▾'}</span>
      </button>

      {isOpen && (
        <div className="fdd-panel">
          <ul className="fdd-list">
            {options.map((option) => {
              const checked = selectedValues.includes(option);
              return (
                <li key={option}>
                  <button
                    className={`fdd-option${checked ? ' fdd-option--selected' : ''}`}
                    onClick={() => onToggle(option)}
                    type="button"
                  >
                    <span className="fdd-checkbox">{checked ? '✓' : ''}</span>
                    {option}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="fdd-footer">
            <button className="fdd-clear" onClick={onClear} type="button">Clear</button>
            <button className="fdd-done" onClick={onClose} type="button">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

function RecipeFinderPage({ setCurrentPage, openRecipeDetail, favorites, toggleFavorite, excludedIngredients, toggleExcluded, clearExcluded }) {
  const [selectedMealTypes, setSelectedMealTypes] = useState([]);
  const [selectedProteins, setSelectedProteins] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [openFilter, setOpenFilter] = useState(null);
  const [surpriseRecipe, setSurpriseRecipe] = useState(null);

  const clearAllFilters = () => {
    setSelectedMealTypes([]);
    setSelectedProteins([]);
    setSelectedCuisines([]);
    setSelectedTags([]);
  };

  const handleSurpriseMe = () => {
    const pick = recipes[Math.floor(Math.random() * recipes.length)];
    setSurpriseRecipe(pick);
  };

  const toggle = (setter) => (value) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  const mealTypes = getUniqueValues(recipes, 'mealType');
  const proteins = getUniqueValues(recipes, 'protein');
  const cuisines = getUniqueValues(recipes, 'cuisine');
  const tags = getAllTags(recipes);

  const filteredRecipes = filterRecipes(
    recipes,
    selectedMealTypes,
    selectedProteins,
    selectedCuisines,
    selectedTags
  );

  const visibleRecipes = excludedIngredients.length === 0
    ? filteredRecipes
    : filteredRecipes.filter(recipe =>
        !recipe.ingredients.some(ing => excludedIngredients.includes(ing.name))
      );

  return (
    <>
      <style>{`
        .rfp-page {
          max-width: 720px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          box-sizing: border-box;
        }

        .rfp-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .rfp-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .rfp-back-btn {
          padding: 0.4rem 0.9rem;
          font-size: 0.9rem;
          cursor: pointer;
          border: 1px solid var(--border);
          border-radius: 5px;
          background: var(--bg);
          color: var(--text);
          white-space: nowrap;
        }

        .rfp-back-btn:hover { background: var(--surface-hover); border-color: var(--border-hover); }

        .rfp-filter-box {
          border: 1px solid var(--border-md);
          border-radius: 8px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 2rem;
          background: var(--surface);
        }

        .rfp-filter-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .rfp-filter-box-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-2);
        }

        .rfp-clear-btn {
          padding: 0.35rem 0.8rem;
          font-size: 0.85rem;
          cursor: pointer;
          border: 1px solid var(--border);
          border-radius: 5px;
          background: var(--bg);
          color: var(--text-2);
        }

        .rfp-clear-btn:hover { background: var(--surface-hover); border-color: var(--border-hover); }

        .rfp-filter-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .rfp-filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .rfp-filter-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-2);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        /* ── FilterDropdown ── */

        .fdd-wrapper {
          position: relative;
        }

        .fdd-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.45rem 0.6rem;
          font-size: 0.9rem;
          border: 1px solid var(--border);
          border-radius: 5px;
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          box-sizing: border-box;
          text-align: left;
        }

        .fdd-trigger:hover { border-color: var(--border-hover); }

        .fdd-trigger--open {
          border-color: var(--border-hover);
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .fdd-trigger-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--text);
        }

        .fdd-arrow {
          font-size: 0.7rem;
          color: var(--text-3);
          margin-left: 0.5rem;
          flex-shrink: 0;
        }

        .fdd-panel {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 200;
          background: var(--bg);
          border: 1px solid var(--border-hover);
          border-top: none;
          border-radius: 0 0 5px 5px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .fdd-list {
          list-style: none;
          margin: 0;
          padding: 0.25rem 0;
          max-height: 200px;
          overflow-y: auto;
        }

        .fdd-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.4rem 0.75rem;
          font-size: 0.9rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          color: var(--text);
        }

        .fdd-option:hover { background: var(--surface-hover); }

        .fdd-option--selected { background: var(--accent-bg); }

        .fdd-option--selected:hover { background: var(--accent-hover); }

        .fdd-checkbox {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1rem;
          height: 1rem;
          border: 1px solid var(--border);
          border-radius: 3px;
          font-size: 0.65rem;
          flex-shrink: 0;
          background: var(--bg);
          color: var(--accent-check);
        }

        .fdd-option--selected .fdd-checkbox {
          background: var(--accent-mid);
          border-color: var(--accent-border);
        }

        .fdd-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.4rem 0.75rem;
          border-top: 1px solid var(--border-light);
          gap: 0.5rem;
        }

        .fdd-clear {
          font-size: 0.8rem;
          color: var(--text-3);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.2rem 0.4rem;
        }

        .fdd-clear:hover { color: var(--text-2); }

        .fdd-done {
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.3rem 0.9rem;
          border: 1px solid var(--border);
          border-radius: 4px;
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
        }

        .fdd-done:hover { background: var(--surface-hover); border-color: var(--border-hover); }

        /* ── Results ── */

        .rfp-empty-msg {
          color: var(--text-3);
          font-size: 0.95rem;
          margin: 0;
        }

        .rfp-results-heading {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
          color: var(--text);
        }

        .rfp-recipe-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .rfp-recipe-card {
          border: 1px solid var(--border-light);
          border-radius: 7px;
          padding: 1rem 1.25rem;
          background: var(--bg);
        }

        .rfp-recipe-title-btn {
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

        .rfp-recipe-title-btn:hover { color: var(--text-2); }

        .rfp-recipe-meta {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-2);
          line-height: 1.7;
        }

        .rfp-surprise-btn {
          padding: 0.35rem 0.8rem;
          font-size: 0.85rem;
          border: 1px solid var(--border);
          border-radius: 5px;
          background: var(--bg);
          color: var(--text-2);
        }

        .rfp-surprise-btn:hover {
          background: var(--surface-hover);
          border-color: var(--border-hover);
          color: var(--text);
        }

        .rfp-surprise-section {
          margin-bottom: 2rem;
        }

        .rfp-surprise-heading {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-3);
          margin: 0 0 0.6rem 0;
        }

        .rfp-surprise-card {
          border: 1px solid var(--border-light);
          border-radius: 7px;
          padding: 1rem 1.25rem;
          background: var(--surface);
        }
      `}</style>

      <div className="rfp-page">
        <div className="rfp-header">
          <button className="rfp-back-btn" onClick={() => setCurrentPage('landing')}>
            ← Back
          </button>
          <h1>Recipe Finder</h1>
        </div>

        <div className="rfp-filter-box">
          <div className="rfp-filter-box-header">
            <h2>Filters</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="rfp-surprise-btn" onClick={handleSurpriseMe}>Surprise Me</button>
              <button className="rfp-clear-btn" onClick={clearAllFilters}>Clear All</button>
            </div>
          </div>

          <div className="rfp-filter-grid">
            <div className="rfp-filter-group">
              <label className="rfp-filter-label">Meal Type</label>
              <FilterDropdown
                label="All types"
                options={mealTypes}
                selectedValues={selectedMealTypes}
                onToggle={toggle(setSelectedMealTypes)}
                onClear={() => setSelectedMealTypes([])}
                isOpen={openFilter === 'mealType'}
                onOpen={() => setOpenFilter('mealType')}
                onClose={() => setOpenFilter(null)}
              />
            </div>

            <div className="rfp-filter-group">
              <label className="rfp-filter-label">Protein</label>
              <FilterDropdown
                label="All proteins"
                options={proteins}
                selectedValues={selectedProteins}
                onToggle={toggle(setSelectedProteins)}
                onClear={() => setSelectedProteins([])}
                isOpen={openFilter === 'protein'}
                onOpen={() => setOpenFilter('protein')}
                onClose={() => setOpenFilter(null)}
              />
            </div>

            <div className="rfp-filter-group">
              <label className="rfp-filter-label">Cuisine</label>
              <FilterDropdown
                label="All cuisines"
                options={cuisines}
                selectedValues={selectedCuisines}
                onToggle={toggle(setSelectedCuisines)}
                onClear={() => setSelectedCuisines([])}
                isOpen={openFilter === 'cuisine'}
                onOpen={() => setOpenFilter('cuisine')}
                onClose={() => setOpenFilter(null)}
              />
            </div>

            <div className="rfp-filter-group">
              <label className="rfp-filter-label">Tags</label>
              <FilterDropdown
                label="All tags"
                options={tags}
                selectedValues={selectedTags}
                onToggle={toggle(setSelectedTags)}
                onClear={() => setSelectedTags([])}
                isOpen={openFilter === 'tags'}
                onOpen={() => setOpenFilter('tags')}
                onClose={() => setOpenFilter(null)}
              />
            </div>
          </div>
        </div>

        <ExcludeIngredientsPanel
          excludedIngredients={excludedIngredients}
          toggleExcluded={toggleExcluded}
          clearExcluded={clearExcluded}
        />

        {surpriseRecipe && (
          <div className="rfp-surprise-section">
            <p className="rfp-surprise-heading">Surprise Pick</p>
            <div className="rfp-surprise-card">
              <div className="recipe-card-row">
                <button
                  className="rfp-recipe-title-btn"
                  onClick={() => openRecipeDetail(surpriseRecipe)}
                >
                  {surpriseRecipe.title}
                </button>
                <button
                  className={`fav-btn${favorites.some(r => r.id === surpriseRecipe.id) ? ' fav-btn--on' : ''}`}
                  onClick={() => toggleFavorite(surpriseRecipe)}
                  title={favorites.some(r => r.id === surpriseRecipe.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {favorites.some(r => r.id === surpriseRecipe.id) ? '★' : '☆'}
                </button>
              </div>
              <p className="rfp-recipe-meta">
                {surpriseRecipe.mealType} &middot; {surpriseRecipe.protein} &middot; {surpriseRecipe.cuisine}
                {surpriseRecipe.tags.length > 0 && <> &middot; {surpriseRecipe.tags.join(', ')}</>}
              </p>
            </div>
          </div>
        )}

        {selectedMealTypes.length === 0 &&
         selectedProteins.length === 0 &&
         selectedCuisines.length === 0 &&
         selectedTags.length === 0 ? (
          <p className="rfp-empty-msg">Select at least one filter to see matching recipes.</p>
        ) : (
          <>
            <h2 className="rfp-results-heading">
              Matching Recipes ({visibleRecipes.length})
            </h2>

            <div className="rfp-recipe-list">
              {visibleRecipes.length === 0 ? (
                <p className="rfp-empty-msg">No recipes match the selected filters.</p>
              ) : (
                visibleRecipes.map((recipe) => (
                  <div key={recipe.id} className="rfp-recipe-card">
                    <div className="recipe-card-row">
                      <button
                        className="rfp-recipe-title-btn"
                        onClick={() => openRecipeDetail(recipe)}
                      >
                        {recipe.title}
                      </button>
                      <button
                        className={`fav-btn${favorites.some(r => r.id === recipe.id) ? ' fav-btn--on' : ''}`}
                        onClick={() => toggleFavorite(recipe)}
                        title={favorites.some(r => r.id === recipe.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {favorites.some(r => r.id === recipe.id) ? '★' : '☆'}
                      </button>
                    </div>
                    <p className="rfp-recipe-meta">
                      {recipe.mealType} &middot; {recipe.protein} &middot; {recipe.cuisine}
                      {recipe.tags.length > 0 && <> &middot; {recipe.tags.join(', ')}</>}
                    </p>
                    </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default RecipeFinderPage;
