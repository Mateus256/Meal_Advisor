import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

document.addEventListener('mousedown', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  btn.classList.remove('chop');
  void btn.offsetWidth; // force reflow so re-clicking replays the animation
  btn.classList.add('chop');
  btn.addEventListener('animationend', () => btn.classList.remove('chop'), { once: true });
}, true);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)