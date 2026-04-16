function FavoritesPage({ setCurrentPage, openRecipeDetail, favorites, toggleFavorite }) {
  return (
    <>
      <style>{`
        .fp-page {
          max-width: 720px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          box-sizing: border-box;
        }

        .fp-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .fp-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .fp-back-btn {
          padding: 0.4rem 0.9rem;
          font-size: 0.9rem;
          border: 1px solid var(--border);
          border-radius: 5px;
          background: var(--bg);
          color: var(--text);
          white-space: nowrap;
        }

        .fp-back-btn:hover {
          background: var(--surface-hover);
          border-color: var(--border-hover);
        }

        .fp-empty-msg {
          color: var(--text-2);
          font-size: 0.95rem;
          margin: 0;
        }

        .fp-recipe-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .fp-recipe-card {
          border: 1px solid var(--border-light);
          border-radius: 7px;
          padding: 1rem 1.25rem;
          background: var(--bg);
        }

        .fp-recipe-title-btn {
          display: block;
          width: 100%;
          text-align: left;
          padding: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
          background: none;
          border: none;
          text-decoration: underline;
          text-underline-offset: 2px;
          flex: 1;
          min-width: 0;
        }

        .fp-recipe-title-btn:hover { color: var(--text-2); }

        .fp-recipe-meta {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-2);
          line-height: 1.7;
        }
      `}</style>

      <div className="fp-page">
        <div className="fp-header">
          <button className="fp-back-btn" onClick={() => setCurrentPage('landing')}>
            ← Back
          </button>
          <h1>Favorites</h1>
        </div>

        {favorites.length === 0 ? (
          <p className="fp-empty-msg">No favorites yet. Star a recipe to save it here.</p>
        ) : (
          <div className="fp-recipe-list">
            {favorites.map((recipe) => (
              <div key={recipe.id} className="fp-recipe-card">
                <div className="recipe-card-row">
                  <button
                    className="fp-recipe-title-btn"
                    onClick={() => openRecipeDetail(recipe)}
                  >
                    {recipe.title}
                  </button>
                  <button
                    className="fav-btn fav-btn--on"
                    onClick={() => toggleFavorite(recipe)}
                    title="Remove from favorites"
                  >
                    ★
                  </button>
                </div>
                <p className="fp-recipe-meta">
                  {recipe.mealType} &middot; {recipe.protein} &middot; {recipe.cuisine}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default FavoritesPage;
