import React, { useRef, useState, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip-enhanced';
import './FlipBook.css';

const Page = React.forwardRef((props, ref) => (
  <div className="page" ref={ref}>
    <img src={props.src} alt={`Page ${props.number}`} draggable={false} />
  </div>
));
Page.displayName = 'Page';

function FlipBook() {
  const book = useRef();
  const [page, setPage]   = useState(0);
  const [total, setTotal] = useState(0);

  // onFlip fires on every page turn — e.object is the PageFlip instance
  const onFlip = useCallback((e) => {
    setPage(e.object.getCurrentPageIndex());
  }, []);

  // onInit fires once the book is ready
  const onInit = useCallback((e) => {
    setTotal(e.object.getPageCount());
    setPage(e.object.getCurrentPageIndex());
  }, []);

  // onChangeState fires when animation finishes ('read') — final sync
  const onChangeState = useCallback((e) => {
    if (e.data === 'read') {
      setPage(e.object.getCurrentPageIndex());
    }
  }, []);

  return (
    <div className="container">
      <div className="book-wrapper">
        <HTMLFlipBook
          ref={book}
          width={800}
          height={600}
          size="stretch"
          minWidth={300}
          maxWidth={1400}
          minHeight={200}
          maxHeight={1050}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={false}
          singlePage={true}
          onFlip={onFlip}
          onInit={onInit}
          onChangeState={onChangeState}
        >
          <Page number={1} src="/1.jpg" />
          <Page number={2} src="/2.jpg" />
          <Page number={3} src="/3.jpg" />
          <Page number={4} src="/4.jpg" />
          <Page number={5} src="/5.jpg" />
          <Page number={6} src="/6.jpg" />
          <Page number={7} src="/7.jpg" />
        </HTMLFlipBook>
      </div>

      <div className="controls">
        <button
          onClick={() => book.current.pageFlip().flipPrev('bottom')}
          disabled={page === 0}
        >
          ← Prev
        </button>
        <span className="page-num">{page + 1} / {total}</span>
        <button
          onClick={() => book.current.pageFlip().flipNext('bottom')}
          disabled={page >= total - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default FlipBook;
