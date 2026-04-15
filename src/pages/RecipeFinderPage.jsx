import { useState } from 'react';
import recipes from '../data/recipes.json';
import SingleSelectFilter from '../components/SingleSelectFilter';
import MultiSelectFilter from '../components/MultiSelectFilter';
import filterRecipes from '../logic/filterRecipes';
import getUniqueValues from '../logic/getUniqueValues';
import getAllTags from '../logic/getAllTags';

function RecipeFinderPage({ setCurrentPage, setSelectedRecipe }) {
  const [selectedMealType, setSelectedMealType] = useState('');
  const [showMealTypeOptions, setShowMealTypeOptions] = useState(false);

  const [selectedProteins, setSelectedProteins] = useState([]);
  const [showProteinOptions, setShowProteinOptions] = useState(false);

  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [showCuisineOptions, setShowCuisineOptions] = useState(false);

  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagOptions, setShowTagOptions] = useState(false);

  const clearAllFilters = () => {
    setSelectedMealType('');
    setSelectedProteins([]);
    setSelectedCuisines([]);
    setSelectedTags([]);
  };

  const mealTypes = getUniqueValues(recipes, 'mealType');
  const proteins = getUniqueValues(recipes, 'protein');
  const cuisines = getUniqueValues(recipes, 'cuisine');
  const tags = getAllTags(recipes);

  const filteredRecipes = filterRecipes(
    recipes,
    selectedMealType,
    selectedProteins,
    selectedCuisines,
    selectedTags
  );

  return (
    <div>
      <h1>Recipe Finder Page</h1>

      <button onClick={() => setCurrentPage('landing')}>
        Back
      </button>

      <h2>Filters</h2>

      <button onClick={clearAllFilters}>Clear All Filters</button>

      <SingleSelectFilter
        label="Meal Type"
        selectedValue={selectedMealType}
        showOptions={showMealTypeOptions}
        setShowOptions={setShowMealTypeOptions}
        options={mealTypes}
        onSelect={setSelectedMealType}
        onClear={() => setSelectedMealType('')}
      />

      <MultiSelectFilter
        label="Protein"
        selectedValues={selectedProteins}
        showOptions={showProteinOptions}
        setShowOptions={setShowProteinOptions}
        options={proteins}
        onToggle={(protein) => {
          if (selectedProteins.includes(protein)) {
            setSelectedProteins(
              selectedProteins.filter((item) => item !== protein)
            );
          } else {
            setSelectedProteins([...selectedProteins, protein]);
          }
        }}
        onClear={() => setSelectedProteins([])}
      />

      <MultiSelectFilter
        label="Cuisine"
        selectedValues={selectedCuisines}
        showOptions={showCuisineOptions}
        setShowOptions={setShowCuisineOptions}
        options={cuisines}
        onToggle={(cuisine) => {
          if (selectedCuisines.includes(cuisine)) {
            setSelectedCuisines(
              selectedCuisines.filter((item) => item !== cuisine)
            );
          } else {
            setSelectedCuisines([...selectedCuisines, cuisine]);
          }
        }}
        onClear={() => setSelectedCuisines([])}
      />

      <MultiSelectFilter
        label="Tags"
        selectedValues={selectedTags}
        showOptions={showTagOptions}
        setShowOptions={setShowTagOptions}
        options={tags}
        onToggle={(tag) => {
          if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((item) => item !== tag));
          } else {
            setSelectedTags([...selectedTags, tag]);
          }
        }}
        onClear={() => setSelectedTags([])}
      />

      <h2>Available Recipes</h2>

      {filteredRecipes.map((recipe) => (
        <div key={recipe.id}>
          <button
            onClick={() => {
              setSelectedRecipe(recipe);
              setCurrentPage('detail');
            }}
          >
            {recipe.title}
          </button>

          <p>Meal Type: {recipe.mealType}</p>
          <p>Protein: {recipe.protein}</p>
          <p>Cuisine: {recipe.cuisine}</p>
          <p>Tags: {recipe.tags.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default RecipeFinderPage;