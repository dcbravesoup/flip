import { useState, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip-enhanced';
import './FlipBookV4.css';

const IMAGES = ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.jpg', '/6.jpg', '/7.jpg'];

export default function FlipBookV4() {
  const bookRef = useRef(null);
  const [page, setPage] = useState(0);

  const onFlip = (e) => setPage(e.data);

  const goNext = () => bookRef.current?.pageFlip().flipNext('bottom');
  const goPrev = () => bookRef.current?.pageFlip().flipPrev('bottom');

  return (
    <div className="fb4-root">
      <HTMLFlipBook
        ref={bookRef}
        width={window.innerWidth}
        height={window.innerHeight}
        size="fixed"
        minWidth={window.innerWidth}
        maxWidth={window.innerWidth}
        minHeight={window.innerHeight}
        maxHeight={window.innerHeight}
        showCover={false}
        flippingTime={800}
        useMouseEvents={false}
        onFlip={onFlip}
        className="fb4-book"
        singlePage={true}
      >
        {IMAGES.map((src, i) => (
          <div key={i} className="fb4-page">
            <img src={src} draggable={false} className="fb4-img" />
          </div>
        ))}
      </HTMLFlipBook>

      {/* Click zones */}
      <div className="fb4-zone fb4-zone--left"  onClick={goPrev} />
      <div className="fb4-zone fb4-zone--right" onClick={goNext} />

      {/* Controls */}
      <div className="fb4-controls">
        <button onClick={goPrev} disabled={page === 0}>← Prev</button>
        <span className="fb4-count">{page + 1} / {IMAGES.length}</span>
        <button onClick={goNext} disabled={page === IMAGES.length - 1}>Next →</button>
      </div>
    </div>
  );
}
