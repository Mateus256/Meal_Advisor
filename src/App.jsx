import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import RecipeFinderPage from './pages/RecipeFinderPage';
import KitchenPage from './pages/KitchenPage';
import RecipeDetailPage from './pages/RecipeDetailPage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  if (currentPage === 'recipe') {
    return (
      <RecipeFinderPage
        setCurrentPage={setCurrentPage}
        setSelectedRecipe={setSelectedRecipe}
      />
    );
  }

  if (currentPage === 'kitchen') {
    return (
  <KitchenPage
    setCurrentPage={setCurrentPage}
    setSelectedRecipe={setSelectedRecipe}
  />
);
  }

  if (currentPage === 'detail') {
    return (
      <RecipeDetailPage
        setCurrentPage={setCurrentPage}
        selectedRecipe={selectedRecipe}
      />
    );
  }

  return <LandingPage setCurrentPage={setCurrentPage} />;
}

export default App;