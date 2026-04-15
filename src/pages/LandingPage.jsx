import OptionButton from '../components/OptionButton';

function LandingPage({ setCurrentPage }) {
  return (
    <main>
      <h1>Meal Advisor</h1>
      <p>Choose how you want to find a recipe.</p>

      <OptionButton
        label="Recipe Finder"
        onClick={() => setCurrentPage('recipe')}
      />

      <OptionButton
        label="What's in My Kitchen"
        onClick={() => setCurrentPage('kitchen')}
      />
    </main>
  );
}

export default LandingPage;