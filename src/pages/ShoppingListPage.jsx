function ShoppingListPage({ setCurrentPage, shoppingList, removeFromShoppingList, clearShoppingList }) {
  return (
    <>
      <style>{`
        .sl-page {
          max-width: 680px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          box-sizing: border-box;
        }

        .sl-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .sl-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          flex: 1;
        }

        .sl-back-btn {
          padding: 0.4rem 0.9rem;
          font-size: 0.9rem;
          border: 1px solid var(--border);
          border-radius: 5px;
          background: var(--bg);
          color: var(--text);
          white-space: nowrap;
        }

        .sl-back-btn:hover {
          background: var(--surface-hover);
          border-color: var(--border-hover);
        }

        .sl-clear-btn {
          padding: 0.4rem 0.9rem;
          font-size: 0.85rem;
          border: 1px solid var(--border);
          border-radius: 5px;
          background: var(--bg);
          color: var(--text-2);
          white-space: nowrap;
        }

        .sl-clear-btn:hover {
          background: var(--surface-hover);
          border-color: var(--border-hover);
        }

        .sl-empty-msg {
          color: var(--text-2);
          font-size: 0.95rem;
          margin: 0;
        }

        .sl-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .sl-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.55rem 0.85rem;
          border: 1px solid var(--border-light);
          border-radius: 6px;
          background: var(--bg);
          font-size: 0.95rem;
          color: var(--text);
          gap: 0.75rem;
        }

        .sl-remove-btn {
          background: none;
          border: none;
          font-size: 1rem;
          color: var(--text-3);
          padding: 0;
          line-height: 1;
          flex-shrink: 0;
          transition: color 0.1s;
        }

        .sl-remove-btn:hover {
          color: var(--text);
        }
      `}</style>

      <div className="sl-page">
        <div className="sl-header">
          <button className="sl-back-btn" onClick={() => setCurrentPage('landing')}>
            ← Back
          </button>
          <h1>Shopping List</h1>
          {shoppingList.length > 0 && (
            <button className="sl-clear-btn" onClick={clearShoppingList}>
              Clear All
            </button>
          )}
        </div>

        {shoppingList.length === 0 ? (
          <p className="sl-empty-msg">
            Your shopping list is empty. Add missing ingredients from a recipe in "What's in My Kitchen".
          </p>
        ) : (
          <ul className="sl-list">
            {shoppingList.map((ingredient) => (
              <li key={ingredient} className="sl-item">
                <span>{ingredient}</span>
                <button
                  className="sl-remove-btn"
                  onClick={() => removeFromShoppingList(ingredient)}
                  title="Remove"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default ShoppingListPage;
