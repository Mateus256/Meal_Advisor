import { useState } from 'react';
import recipes from '../data/recipes.json';
import getAllIngredients from '../logic/getAllIngredients';

const allIngredients = getAllIngredients(recipes);

function ExcludeIngredientsPanel({ excludedIngredients, toggleExcluded, clearExcluded }) {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = searchTerm.trim()
    ? allIngredients
        .filter(
          ing =>
            ing.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !excludedIngredients.includes(ing)
        )
        .slice(0, 15)
    : [];

  return (
    <>
      <style>{`
        .eip-box {
          border: 1px solid var(--border-md);
          border-radius: 8px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 2rem;
          background: var(--surface);
        }

        .eip-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .eip-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-2);
        }

        .eip-clear-btn {
          padding: 0.35rem 0.8rem;
          font-size: 0.85rem;
          border: 1px solid var(--border);
          border-radius: 5px;
          background: var(--bg);
          color: var(--text-2);
        }

        .eip-clear-btn:hover {
          background: var(--surface-hover);
          border-color: var(--border-hover);
        }

        .eip-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.85rem;
        }

        .eip-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.5rem 0.3rem 0.7rem;
          font-size: 0.85rem;
          border: 1px solid #e8a0a0;
          border-radius: 20px;
          background: #fdf0f0;
          color: #c0392b;
        }

        html.dark .eip-pill {
          background: #2a1515;
          border-color: #5a2a2a;
          color: #e87070;
        }

        .eip-pill-remove {
          background: none;
          border: none;
          padding: 0;
          font-size: 1rem;
          line-height: 1;
          color: inherit;
          opacity: 0.6;
        }

        .eip-pill-remove:hover { opacity: 1; }

        .eip-search {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 0.9rem;
          border: 1px solid var(--border);
          border-radius: 5px;
          box-sizing: border-box;
          background: var(--bg);
          color: var(--text);
        }

        .eip-search:focus {
          outline: none;
          border-color: var(--border-hover);
        }

        .eip-results {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.75rem;
        }

        .eip-result-btn {
          padding: 0.3rem 0.75rem;
          font-size: 0.85rem;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--bg);
          color: var(--text);
        }

        .eip-result-btn:hover {
          background: #fdf0f0;
          border-color: #e8a0a0;
          color: #c0392b;
        }

        html.dark .eip-result-btn:hover {
          background: #2a1515;
          border-color: #5a2a2a;
          color: #e87070;
        }
      `}</style>

      <div className="eip-box">
        <div className="eip-header">
          <h2>
            Exclude Ingredients
            {excludedIngredients.length > 0 && ` (${excludedIngredients.length})`}
          </h2>
          {excludedIngredients.length > 0 && (
            <button className="eip-clear-btn" onClick={clearExcluded}>Clear</button>
          )}
        </div>

        {excludedIngredients.length > 0 && (
          <div className="eip-pills">
            {excludedIngredients.map(ing => (
              <span key={ing} className="eip-pill">
                {ing}
                <button
                  className="eip-pill-remove"
                  onClick={() => toggleExcluded(ing)}
                  title="Remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <input
          className="eip-search"
          type="text"
          placeholder="Search ingredients to exclude..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        {searchResults.length > 0 && (
          <div className="eip-results">
            {searchResults.map(ing => (
              <button
                key={ing}
                className="eip-result-btn"
                onClick={() => {
                  toggleExcluded(ing);
                  setSearchTerm('');
                }}
              >
                {ing}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ExcludeIngredientsPanel;
