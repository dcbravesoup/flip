import { useState, useRef, useEffect } from 'react';
import './FlipBookV3.css';

const IMAGES = ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.jpg', '/6.jpg', '/7.jpg'];

const N        = 40;    // strip count — more = smoother cylinder curve
const CYL      = 0.18;  // fraction of page width occupied by the visible roll curve
const DURATION = 700;   // ms

function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Compute per-strip rotateY angle for a given roll progress (0→1)
// rollProgress 0 = roll hasn't started, 1 = roll complete
function computeAngles(rollProgress, dir) {
  // rollFront: position of the leading edge of the roll (0=left, 1=right)
  // For 'next': starts at right (1.0), sweeps to left (0.0)
  // For 'prev': starts at left (0.0), sweeps to right (1.0)
  const rollFront = dir === 'next' ? 1 - rollProgress : rollProgress;

  return Array.from({ length: N }, (_, i) => {
    const norm = (i + 0.5) / N; // normalized center of strip

    // dist: signed distance from this strip to the roll's leading edge
    // For 'next': positive dist = strip is AHEAD of roll (not yet reached = flat)
    //             negative dist = strip is BEHIND roll (already rolled = edge-on)
    const dist = dir === 'next' ? norm - rollFront : rollFront - norm;

    let angle;
    if (dist > 0) {
      // Not yet reached by roll: flat
      angle = 0;
    } else if (dist < -CYL) {
      // Already fully rolled past: edge-on (invisible — destination shows through)
      angle = dir === 'next' ? -90 : 90;
    } else {
      // In the roll curve: dist goes from 0 (leading edge) to -CYL (trailing edge)
      // t=0 at leading edge (angle = ±90°), t=1 at trailing edge (angle = 0°)
      const t = dist / -CYL;
      angle = dir === 'next' ? -90 * (1 - t) : 90 * (1 - t);
    }

    return angle;
  });
}

export default function FlipBookV3() {
  const [page, setPage]       = useState(0);
  const [anim, setAnim]       = useState(null);
  const [angles, setAngles]   = useState(null);

  const rafRef    = useRef(null);
  const startRef  = useRef(null);
  const animRef   = useRef(null); // mirror of anim for use inside RAF closure

  const flip = (dir) => {
    if (anim) return;
    const to = dir === 'next' ? page + 1 : page - 1;
    if (to < 0 || to >= IMAGES.length) return;

    const newAnim = { from: page, to, dir };
    setAnim(newAnim);
    animRef.current = newAnim;
    setAngles(computeAngles(0, dir));
    startRef.current = null;

    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const t = Math.min((ts - startRef.current) / DURATION, 1);
      const eased = easeInOut(t);

      setAngles(computeAngles(eased, animRef.current.dir));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Animation complete — commit page change
        setPage(animRef.current.to);
        setAnim(null);
        animRef.current = null;
        setAngles(null);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  // Clean up RAF on unmount
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const stripW = 100 / N; // each strip's width as % of frame

  return (
    <div className="fb-root">
      <div className="fb-frame">

        {/* Base layer: destination page (or current when idle) — always rendered */}
        <div className="fb-page">
          <img
            src={IMAGES[anim ? anim.to : page]}
            draggable={false}
            style={{
              position: 'absolute', top: 0, height: '100%', width: '100%',
              objectFit: 'cover', display: 'block', userSelect: 'none', pointerEvents: 'none',
            }}
          />
        </div>

        {/* Rolling strips — source page breaking into segments during animation */}
        {anim && angles && angles.map((angle, i) => {
          const left        = i * stripW;
          // Image positioning: each strip shows only its slice of the full image
          const imgWidthPct = (100 / stripW) * 100;       // e.g. 4000% for N=40
          const imgLeft     = -(left / stripW) * 100;     // correct horizontal offset

          // Shadow deepens as strip approaches edge-on (simulates 3D cylinder depth)
          const shadow = Math.abs(angle) / 90 * 0.65;

          return (
            <div
              key={i}
              style={{
                position:        'absolute',
                top:             0,
                left:            `${left}%`,
                width:           `${stripW}%`,
                height:          '100%',
                overflow:        'hidden',
                transformOrigin: anim.dir === 'next' ? 'left center' : 'right center',
                transform:       `rotateY(${angle}deg)`,
                backfaceVisibility:       'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {/* Image slice */}
              <img
                src={IMAGES[anim.from]}
                draggable={false}
                style={{
                  position: 'absolute', top: 0, height: '100%',
                  width: `${imgWidthPct}%`, left: `${imgLeft}%`,
                  objectFit: 'cover', display: 'block',
                  userSelect: 'none', pointerEvents: 'none',
                }}
              />
              {/* Depth shadow */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: `rgba(0,0,0,${shadow})`,
              }} />
            </div>
          );
        })}

        {/* Click zones — left half goes prev, right half goes next */}
        <div className="fb-zone fb-zone--left"  onClick={() => flip('prev')} />
        <div className="fb-zone fb-zone--right" onClick={() => flip('next')} />

        {/* Controls */}
        <div className="fb-controls">
          <button onClick={() => flip('prev')} disabled={page === 0 || !!anim}>← Prev</button>
          <span className="fb-count">{page + 1} / {IMAGES.length}</span>
          <button onClick={() => flip('next')} disabled={page === IMAGES.length - 1 || !!anim}>Next →</button>
        </div>

      </div>
    </div>
  );
}
