import { useState } from 'react';
import './FlipBookV1.css';

const IMAGES = ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.jpg', '/6.jpg', '/7.jpg'];

// Renders an image positioned to show either the left or right half of the page
function Img({ src, half = 'full' }) {
  return (
    <img
      src={src}
      draggable={false}
      style={{
        position: 'absolute',
        top: 0,
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
        // 'full'  → width 100%, left 0    (fills full container)
        // 'left'  → width 200%, left 0    (shows left half of image)
        // 'right' → width 200%, left -100% (shows right half of image)
        width: half === 'full' ? '100%' : '200%',
        left: half === 'right' ? '-100%' : 0,
      }}
    />
  );
}

export default function FlipBookV1() {
  const [page, setPage] = useState(0);
  const [anim, setAnim] = useState(null); // { from, to, dir }

  const flip = (dir) => {
    if (anim) return;
    const to = dir === 'next' ? page + 1 : page - 1;
    if (to < 0 || to >= IMAGES.length) return;
    setAnim({ from: page, to, dir });
  };

  const onDone = () => {
    setPage(anim.to);
    setAnim(null);
  };

  const isNext = anim?.dir === 'next';

  return (
    <div className="fb-root">
      <div className="fb-frame">

        {/* ── Static (no animation) ── */}
        {!anim && (
          <div className="fb-page">
            <Img src={IMAGES[page]} half="full" />
          </div>
        )}

        {/* ── During flip ── */}
        {anim && (
          <>
            {/* Bottom layer: destination page */}
            <div className="fb-page">
              <Img src={IMAGES[anim.to]} half="full" />
            </div>

            {/* Middle layer: the half of the current page that does NOT flip */}
            <div className={`fb-half ${isNext ? 'fb-half--left' : 'fb-half--right'}`}>
              <Img src={IMAGES[anim.from]} half={isNext ? 'left' : 'right'} />
            </div>

            {/* Top layer: the flipping panel */}
            <div
              className={`fb-panel fb-panel--${anim.dir}`}
              onAnimationEnd={onDone}
            >
              <div className="fb-face fb-face--front">
                <Img src={IMAGES[anim.from]} half={isNext ? 'right' : 'left'} />
              </div>
              <div className="fb-face fb-face--back">
                <Img src={IMAGES[anim.to]} half={isNext ? 'left' : 'right'} />
              </div>
            </div>
          </>
        )}

        {/* Click zones — left half goes prev, right half goes next */}
        <div className="fb-zone fb-zone--left"  onClick={() => flip('prev')} />
        <div className="fb-zone fb-zone--right" onClick={() => flip('next')} />

        {/* Controls — overlaid inside the frame */}
        <div className="fb-controls">
          <button onClick={() => flip('prev')} disabled={page === 0 || !!anim}>← Prev</button>
          <span className="fb-count">{page + 1} / {IMAGES.length}</span>
          <button onClick={() => flip('next')} disabled={page === IMAGES.length - 1 || !!anim}>Next →</button>
        </div>

      </div>
    </div>
  );
}
