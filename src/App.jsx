import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import RecipeFinderPage from './pages/RecipeFinderPage';
import KitchenPage from './pages/KitchenPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ShoppingListPage from './pages/ShoppingListPage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [dark, setDark] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [excludedIngredients, setExcludedIngredients] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  function toggleFavorite(recipe) {
    setFavorites(prev =>
      prev.some(r => r.id === recipe.id)
        ? prev.filter(r => r.id !== recipe.id)
        : [...prev, recipe]
    );
  }

  function toggleExcluded(ingredient) {
    setExcludedIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  }

  function clearExcluded() {
    setExcludedIngredients([]);
  }

  function addToShoppingList(ingredients) {
    setShoppingList(prev => [...new Set([...prev, ...ingredients])]);
  }

  function removeFromShoppingList(ingredient) {
    setShoppingList(prev => prev.filter(i => i !== ingredient));
  }

  function clearShoppingList() {
    setShoppingList([]);
  }

  function openRecipeDetail(recipe) {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(r => r.id !== recipe.id);
      return [recipe, ...filtered].slice(0, 8);
    });
    setSelectedRecipe(recipe);
    setCurrentPage('detail');
  }

  function clearRecentlyViewed() {
    setRecentlyViewed([]);
  }

  return (
    <>
      <button className="theme-toggle" onClick={() => setDark(d => !d)}>
        {dark ? '☀ Light' : '☾ Dark'}
      </button>

      {currentPage === 'recipe' && (
        <RecipeFinderPage
          setCurrentPage={setCurrentPage}
          openRecipeDetail={openRecipeDetail}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          excludedIngredients={excludedIngredients}
          toggleExcluded={toggleExcluded}
          clearExcluded={clearExcluded}
        />
      )}
      {currentPage === 'kitchen' && (
        <KitchenPage
          setCurrentPage={setCurrentPage}
          openRecipeDetail={openRecipeDetail}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          addToShoppingList={addToShoppingList}
          excludedIngredients={excludedIngredients}
          toggleExcluded={toggleExcluded}
          clearExcluded={clearExcluded}
        />
      )}
      {currentPage === 'detail' && (
        <RecipeDetailPage
          setCurrentPage={setCurrentPage}
          selectedRecipe={selectedRecipe}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      )}
      {currentPage === 'favorites' && (
        <FavoritesPage
          setCurrentPage={setCurrentPage}
          openRecipeDetail={openRecipeDetail}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      )}
      {currentPage === 'shopping' && (
        <ShoppingListPage
          setCurrentPage={setCurrentPage}
          shoppingList={shoppingList}
          removeFromShoppingList={removeFromShoppingList}
          clearShoppingList={clearShoppingList}
        />
      )}
      {currentPage === 'landing' && (
        <LandingPage
          setCurrentPage={setCurrentPage}
          favoritesCount={favorites.length}
          shoppingListCount={shoppingList.length}
          recentlyViewed={recentlyViewed}
          clearRecentlyViewed={clearRecentlyViewed}
          openRecipeDetail={openRecipeDetail}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      )}
    </>
  );
}

export default App;
