import { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip-enhanced';

const IMAGES = ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.jpg', '/6.jpg', '/7.jpg'];

function MyBook() {
    const flipBookRef = useRef(null);

    const goToPage = (pageNum) => {
        if (flipBookRef.current) {
            flipBookRef.current.pageFlip().turnToPage(pageNum);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#111'
        }}>
            <HTMLFlipBook
                ref={flipBookRef}
                width={1280}
                height={960}
                size="stretch"
                disableFlipByClick={false}
                usePortrait={false}
                singlePage={true}
                startZIndex={0}
                autoSize={true}
            >
                {IMAGES.map((src, i) => (
                    <div key={i} className="demoPage">
                        <img src={src} alt={`Page ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                ))}
            </HTMLFlipBook>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', zIndex: 10 }}>
                <button
                    onClick={() => goToPage(2)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'rgba(255,255,255,0.2)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                    }}
                >
                    Bookmark 1
                </button>
                <button
                    onClick={() => goToPage(5)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'rgba(255,255,255,0.2)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                    }}
                >
                    Bookmark 2
                </button>
            </div>
        </div>
    );
}

export default MyBook;
