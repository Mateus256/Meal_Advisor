import { useState, useRef, useEffect } from 'react';
import recipes from '../data/recipes.json';
import filterRecipes from '../logic/filterRecipes';
import getUniqueValues from '../logic/getUniqueValues';
import getAllTags from '../logic/getAllTags';

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

function RecipeFinderPage({ setCurrentPage, setSelectedRecipe }) {
  const [selectedMealTypes, setSelectedMealTypes] = useState([]);
  const [selectedProteins, setSelectedProteins] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [openFilter, setOpenFilter] = useState(null);

  const clearAllFilters = () => {
    setSelectedMealTypes([]);
    setSelectedProteins([]);
    setSelectedCuisines([]);
    setSelectedTags([]);
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
          border: 1px solid #ccc;
          border-radius: 5px;
          background: #fff;
          white-space: nowrap;
        }

        .rfp-back-btn:hover { background: #f5f5f5; }

        .rfp-filter-box {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 2rem;
          background: #fafafa;
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
          color: #444;
        }

        .rfp-clear-btn {
          padding: 0.35rem 0.8rem;
          font-size: 0.85rem;
          cursor: pointer;
          border: 1px solid #ccc;
          border-radius: 5px;
          background: #fff;
          color: #555;
        }

        .rfp-clear-btn:hover { background: #f5f5f5; }

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
          color: #555;
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
          border: 1px solid #ccc;
          border-radius: 5px;
          background: #fff;
          cursor: pointer;
          box-sizing: border-box;
          text-align: left;
        }

        .fdd-trigger:hover { border-color: #999; }

        .fdd-trigger--open {
          border-color: #999;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .fdd-trigger-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #1a1a1a;
        }

        .fdd-arrow {
          font-size: 0.7rem;
          color: #888;
          margin-left: 0.5rem;
          flex-shrink: 0;
        }

        .fdd-panel {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 200;
          background: #fff;
          border: 1px solid #999;
          border-top: none;
          border-radius: 0 0 5px 5px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
          color: #1a1a1a;
        }

        .fdd-option:hover { background: #f5f5f5; }

        .fdd-option--selected { background: #edfaeb; }

        .fdd-option--selected:hover { background: #dff5dc; }

        .fdd-checkbox {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1rem;
          height: 1rem;
          border: 1px solid #ccc;
          border-radius: 3px;
          font-size: 0.65rem;
          flex-shrink: 0;
          background: #fff;
          color: #2a7a2a;
        }

        .fdd-option--selected .fdd-checkbox {
          background: #c6f0c2;
          border-color: #7dc97a;
        }

        .fdd-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.4rem 0.75rem;
          border-top: 1px solid #eee;
          gap: 0.5rem;
        }

        .fdd-clear {
          font-size: 0.8rem;
          color: #888;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.2rem 0.4rem;
        }

        .fdd-clear:hover { color: #555; }

        .fdd-done {
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.3rem 0.9rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
        }

        .fdd-done:hover { background: #f5f5f5; }

        /* ── Results ── */

        .rfp-empty-msg {
          color: #888;
          font-size: 0.95rem;
          margin: 0;
        }

        .rfp-results-heading {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
        }

        .rfp-recipe-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .rfp-recipe-card {
          border: 1px solid #e0e0e0;
          border-radius: 7px;
          padding: 1rem 1.25rem;
          background: #fff;
        }

        .rfp-recipe-title-btn {
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

        .rfp-recipe-title-btn:hover { color: #555; }

        .rfp-recipe-meta {
          margin: 0;
          font-size: 0.875rem;
          color: #555;
          line-height: 1.7;
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
            <button className="rfp-clear-btn" onClick={clearAllFilters}>Clear All</button>
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

        {selectedMealTypes.length === 0 &&
         selectedProteins.length === 0 &&
         selectedCuisines.length === 0 &&
         selectedTags.length === 0 ? (
          <p className="rfp-empty-msg">Select at least one filter to see matching recipes.</p>
        ) : (
          <>
            <h2 className="rfp-results-heading">
              Matching Recipes ({filteredRecipes.length})
            </h2>

            <div className="rfp-recipe-list">
              {filteredRecipes.length === 0 ? (
                <p className="rfp-empty-msg">No recipes match the selected filters.</p>
              ) : (
                filteredRecipes.map((recipe) => (
                  <div key={recipe.id} className="rfp-recipe-card">
                    <button
                      className="rfp-recipe-title-btn"
                      onClick={() => {
                        setSelectedRecipe(recipe);
                        setCurrentPage('detail');
                      }}
                    >
                      {recipe.title}
                    </button>
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
