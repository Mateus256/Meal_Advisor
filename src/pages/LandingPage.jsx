import { useRef } from 'react';
import OptionButton from '../components/OptionButton';

function LandingPage({ setCurrentPage }) {
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
          justify-content: center;
          min-height: 100vh;
          padding: 2rem;
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
          border: 1px solid #ccc;
          background: #fff;
          transition: background 0.15s, border-color 0.15s;
        }

        .landing-button-group button:hover {
          background: #f5f5f5;
          border-color: #999;
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
        </div>
      </main>
    </>
  );
}

export default LandingPage;