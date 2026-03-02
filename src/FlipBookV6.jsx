
import React, { useRef, useEffect, useCallback } from "react";
import HTMLFlipBook from "react-pageflip-enhanced";
import inputAudio from "./input2.wav";

const NARRATION_DATA = [
  { word: "In", start: 0.0, end: 0.38 },
  { word: "a", start: 0.38, end: 0.52 },
  { word: "cozy", start: 0.52, end: 1.02 },
  { word: "little", start: 1.02, end: 1.38 },
  { word: "home", start: 1.38, end: 1.74 },
  { word: "under", start: 1.74, end: 2.2 },
  { word: "a", start: 2.2, end: 2.4 },
  { word: "bright", start: 2.4, end: 2.8 },
  { word: "night", start: 2.8, end: 3.24 },
  { word: "sky,", start: 3.24, end: 3.8 },

  { word: "Pat,", start: 4.56, end: 4.72 },
  { word: "a", start: 5.08, end: 5.18 },
  { word: "young", start: 5.18, end: 5.44 },
  { word: "girl,", start: 5.44, end: 5.84 },
  { word: "is", start: 6.04, end: 6.26 },
  { word: "ready", start: 6.26, end: 6.6 },
  { word: "to", start: 6.6, end: 6.84 },
  { word: "give", start: 6.84, end: 7.02 },
  { word: "being", start: 7.02, end: 7.36 },
  { word: "brave", start: 7.36, end: 7.72 },
  { word: "a", start: 7.72, end: 8.0 },
  { word: "try.", start: 8.0, end: 8.3 },

  { word: "I", start: 9.0, end: 9.42 },
  { word: "want", start: 9.42, end: 9.7 },
  { word: "to", start: 9.7, end: 9.88 },
  { word: "be", start: 9.88, end: 10.02 },
  { word: "brave.", start: 10.02, end: 10.4 },
  { word: "Pat", start: 10.86, end: 11.02 },
  { word: "says,", start: 11.02, end: 11.5 },
  { word: "eager", start: 11.8, end: 12.02 },
  { word: "to", start: 12.02, end: 12.24 },
  { word: "be,", start: 12.24, end: 12.5 },

  { word: "to", start: 13.06, end: 13.24 },
  { word: "face", start: 13.24, end: 13.6 },
  { word: "fears,", start: 13.6, end: 14.16 },
  { word: "to", start: 14.54, end: 14.62 },
  { word: "grow,", start: 14.62, end: 14.96 },
  { word: "to", start: 15.44, end: 15.54 },
  { word: "be", start: 15.54, end: 15.82 },
  { word: "a", start: 15.82, end: 16.04 },
  { word: "stronger", start: 16.04, end: 16.74 },
  { word: "me.", start: 16.74, end: 17.1 }
];

const IMAGES = ["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg", "/5.jpg", "/6.jpg", "/7.jpg"];

function MyBook() {
  const audioRef = useRef(null);
  const wordRefs = useRef([]);
  const lastIndexRef = useRef(-1);

  // Direct DOM update — no React re-render, no lag
  const applyHighlight = useCallback((index) => {
    const prev = lastIndexRef.current;
    if (prev === index) return;

    // Remove highlight from previous word
    if (prev >= 0 && wordRefs.current[prev]) {
      const el = wordRefs.current[prev];
      el.style.color = "#fff";
      el.style.backgroundColor = "transparent";
      el.style.textShadow = "1px 1px 2px #000";
    }

    // Apply highlight to current word
    if (index >= 0 && wordRefs.current[index]) {
      const el = wordRefs.current[index];
      el.style.color = "#000";
      el.style.backgroundColor = "#f1c40f";
      el.style.textShadow = "none";
    }

    lastIndexRef.current = index;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let raf;

    const sync = () => {
      const time = audio.currentTime;
      let found = -1;

      for (let i = 0; i < NARRATION_DATA.length; i++) {
        const w = NARRATION_DATA[i];
        if (time >= w.start && time < w.end) {
          found = i;
          break;
        }
      }

      applyHighlight(found);
      raf = requestAnimationFrame(sync);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
    };

    const onSeeked = () => {
      // Clear the currently highlighted word's styles before resetting
      const prev = lastIndexRef.current;
      if (prev >= 0 && wordRefs.current[prev]) {
        const el = wordRefs.current[prev];
        el.style.color = "#fff";
        el.style.backgroundColor = "transparent";
        el.style.textShadow = "1px 1px 2px #000";
      }
      lastIndexRef.current = -1;

      // Immediately highlight the word at the new position
      const time = audio.currentTime;
      let found = -1;
      for (let i = 0; i < NARRATION_DATA.length; i++) {
        const w = NARRATION_DATA[i];
        if (time >= w.start && time < w.end) {
          found = i;
          break;
        }
      }
      applyHighlight(found);

      // Restart the rAF loop if still playing
      if (!audio.paused) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(sync);
      }
    };

    audio.addEventListener("play", start);
    audio.addEventListener("pause", stop);
    audio.addEventListener("ended", stop);
    audio.addEventListener("seeked", onSeeked);

    return () => {
      cancelAnimationFrame(raf);
      audio.removeEventListener("play", start);
      audio.removeEventListener("pause", stop);
      audio.removeEventListener("ended", stop);
      audio.removeEventListener("seeked", onSeeked);
    };
  }, [applyHighlight]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#111"
      }}
    >
      <div style={{ position: "relative" }}>
        <HTMLFlipBook width={1280} height={960} singlePage autoSize disableFlipByClick={true}>
          {IMAGES.map((src, i) => (
            <div key={i}>
              <img
                src={src}
                alt={`Page ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </HTMLFlipBook>

        {/* Text overlay sits above the flipbook, single instance with valid refs */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "85%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
            padding: "20px",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "12px",
            backdropFilter: "blur(4px)",
            pointerEvents: "none",
            zIndex: 10
          }}
        >
          {NARRATION_DATA.map((item, idx) => (
            <span
              key={idx}
              ref={(el) => { wordRefs.current[idx] = el; }}
              style={{
                fontSize: "2rem",
                fontFamily: "Georgia, serif",
                color: "#fff",
                backgroundColor: "transparent",
                padding: "2px 8px",
                borderRadius: "4px",
                transition: "all 0.06s linear",
                textShadow: "1px 1px 2px #000"
              }}
            >
              {item.word}
            </span>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "40px", zIndex: 100 }}>
        <audio
          ref={audioRef}
          src={inputAudio}
          controls
          style={{ width: "400px", filter: "invert(100%)" }}
        />
      </div>
    </div>
  );
}

export default MyBook;
