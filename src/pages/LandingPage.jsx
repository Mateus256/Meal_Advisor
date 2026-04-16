import { useRef } from 'react';
import OptionButton from '../components/OptionButton';

function LandingPage({ setCurrentPage, favoritesCount, shoppingListCount, recentlyViewed, clearRecentlyViewed, openRecipeDetail, favorites, toggleFavorite }) {
  const audioCtxRef = useRef(null);

  function playKnifeSharpening() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const duration = 0.18;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // High-pass to remove low rumble, leaving metallic scrape
    const hpf = ctx.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.value = 3500;

    // Narrow bandpass for the metallic "zing" resonance
    const bpf = ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.value = 7200;
    bpf.Q.value = 4;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    source.connect(hpf);
    hpf.connect(bpf);
    bpf.connect(gain);
    gain.connect(ctx.destination);

    source.start(now);
    source.stop(now + duration);
  }

  return (
    <>
      <style>{`
        .landing-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          padding: 4rem 2rem 3rem;
          box-sizing: border-box;
        }

        .landing-main h1 {
          font-size: 3rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.5px;
        }

        .landing-main p {
          font-size: 1.1rem;
          color: #666;
          margin: 0 0 2.5rem 0;
        }

        .landing-button-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          max-width: 320px;
        }

        .landing-button-group button {
          width: 100%;
          padding: 0.9rem 1.5rem;
          font-size: 1.05rem;
          cursor: pointer;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          transition: background 0.15s, border-color 0.15s;
        }

        .landing-button-group button:hover {
          background: var(--surface-hover);
          border-color: var(--border-hover);
        }

        .landing-recent {
          width: 100%;
          max-width: 480px;
          margin-top: 3rem;
        }

        .landing-recent-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .landing-recent-label {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-3);
        }

        .landing-recent-clear {
          font-size: 0.8rem;
          padding: 0.2rem 0.55rem;
          border: 1px solid var(--border);
          border-radius: 4px;
          background: var(--bg);
          color: var(--text-2);
        }

        .landing-recent-clear:hover {
          background: var(--surface-hover);
          border-color: var(--border-hover);
        }

        .landing-recent-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .landing-recent-card {
          border: 1px solid var(--border-light);
          border-radius: 7px;
          padding: 0.7rem 1rem;
          background: var(--bg);
        }

        .landing-recent-title-btn {
          display: block;
          text-align: left;
          padding: 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text);
          background: none;
          border: none;
          text-decoration: underline;
          text-underline-offset: 2px;
          flex: 1;
          min-width: 0;
        }

        .landing-recent-title-btn:hover { color: var(--text-2); }

        .landing-recent-meta {
          margin: 0;
          font-size: 0.825rem;
          color: var(--text-2);
          line-height: 1.6;
        }
      `}</style>

      <main className="landing-main">
        <h1>Meal Advisor</h1>
        <p>Choose how you want to find a recipe.</p>

        <div className="landing-button-group">
          <div onMouseEnter={playKnifeSharpening}>
            <OptionButton
              label="Recipe Finder"
              onClick={() => setCurrentPage('recipe')}
            />
          </div>

          <div onMouseEnter={playKnifeSharpening}>
            <OptionButton
              label="What's in My Kitchen"
              onClick={() => setCurrentPage('kitchen')}
            />
          </div>

          <div onMouseEnter={playKnifeSharpening}>
            <OptionButton
              label={favoritesCount > 0 ? `Favorites (${favoritesCount})` : 'Favorites'}
              onClick={() => setCurrentPage('favorites')}
            />
          </div>

          <div onMouseEnter={playKnifeSharpening}>
            <OptionButton
              label={shoppingListCount > 0 ? `Shopping List (${shoppingListCount})` : 'Shopping List'}
              onClick={() => setCurrentPage('shopping')}
            />
          </div>
        </div>

        {recentlyViewed.length > 0 && (
          <div className="landing-recent">
            <div className="landing-recent-header">
              <span className="landing-recent-label">Recently Viewed</span>
              <button className="landing-recent-clear" onClick={clearRecentlyViewed}>
                Clear
              </button>
            </div>
            <div className="landing-recent-list">
              {recentlyViewed.map(recipe => (
                <div key={recipe.id} className="landing-recent-card">
                  <div className="recipe-card-row">
                    <button
                      className="landing-recent-title-btn"
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
                  <p className="landing-recent-meta">
                    {recipe.mealType} &middot; {recipe.protein} &middot; {recipe.cuisine}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default LandingPage;