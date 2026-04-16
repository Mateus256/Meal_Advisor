function RecipeDetailPage({ setCurrentPage, selectedRecipe, favorites, toggleFavorite }) {
  if (!selectedRecipe) {
    return (
      <>
        <style>{`
          .rdp-empty {
            max-width: 680px;
            margin: 0 auto;
            padding: 2rem 1.5rem;
          }
        `}</style>
        <div className="rdp-empty">
          <h1>No recipe selected</h1>
          <button onClick={() => setCurrentPage('landing')}>Back</button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .rdp-page {
          max-width: 680px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
          box-sizing: border-box;
        }

        .rdp-back-btn {
          display: inline-block;
          padding: 0.4rem 0.9rem;
          font-size: 0.9rem;
          border: 1px solid var(--border);
          border-radius: 5px;
          background: var(--bg);
          color: var(--text);
          margin-bottom: 2rem;
          white-space: nowrap;
        }

        .rdp-back-btn:hover {
          background: var(--surface-hover);
          border-color: var(--border-hover);
        }

        .rdp-title {
          font-size: 2.2rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.4px;
          color: var(--text);
        }

        .rdp-meta {
          font-size: 0.9rem;
          color: var(--text-3);
          margin: 0 0 2.5rem 0;
        }

        .rdp-divider {
          border: none;
          border-top: 1px solid var(--border-light);
          margin: 0 0 2rem 0;
        }

        .rdp-section-heading {
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-2);
          margin: 0 0 1.1rem 0;
        }

        .rdp-ingredients {
          list-style: none;
          padding: 0;
          margin: 0 0 2.5rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .rdp-ingredients li {
          font-size: 0.975rem;
          padding: 0.5rem 0.75rem;
          background: var(--surface);
          border: 1px solid var(--border-light);
          border-radius: 5px;
          line-height: 1.4;
          color: var(--text);
        }

        .rdp-steps {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          counter-reset: step-counter;
        }

        .rdp-steps li {
          counter-increment: step-counter;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          font-size: 0.975rem;
          line-height: 1.65;
          color: var(--text);
        }

        .rdp-steps li::before {
          content: counter(step-counter);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
          background: var(--surface);
          border: 1px solid var(--border-light);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-2);
          margin-top: 0.05rem;
        }
      `}</style>

      <div className="rdp-page">
        <button className="rdp-back-btn" onClick={() => setCurrentPage('recipe')}>
          ← Back to Recipe Finder
        </button>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <h1 className="rdp-title" style={{ margin: 0, flex: 1 }}>{selectedRecipe.title}</h1>
          <button
            className={`fav-btn${favorites.some(r => r.id === selectedRecipe.id) ? ' fav-btn--on' : ''}`}
            style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}
            onClick={() => toggleFavorite(selectedRecipe)}
            title={favorites.some(r => r.id === selectedRecipe.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favorites.some(r => r.id === selectedRecipe.id) ? '★' : '☆'}
          </button>
        </div>
        <p className="rdp-meta">
          {selectedRecipe.mealType} &middot; {selectedRecipe.protein} &middot; {selectedRecipe.cuisine}
        </p>

        <hr className="rdp-divider" />

        <h2 className="rdp-section-heading">Ingredients</h2>
        <ul className="rdp-ingredients">
          {selectedRecipe.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>

        <hr className="rdp-divider" />

        <h2 className="rdp-section-heading">Steps</h2>
        <ol className="rdp-steps">
          {selectedRecipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </>
  );
}

export default RecipeDetailPage;
