import { useEffect, useState } from "react";
import styled from "styled-components";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

// The "X" is already on screen when the intro starts; these are the letters
// that type in after it.
const REST = "plorem";

// The word emerges out of the mark's colour and resolves into near-white —
// mixed from the palette rather than hardcoded, so it follows the tokens.
function letterColor(index) {
  const stop = Math.round((index / (REST.length - 1)) * 100);
  return `color-mix(in oklab, var(--color-brand-bright), var(--color-ink) ${stop}%)`;
}

// One timeline, in ms, so the CSS delays below and the unmount timers can't
// drift apart.
const MARK_IN = 900; // X fades up and scales out
const TYPE_START = 1100;
const TYPE_STEP = 165;
const HOLD = 1000; // a full beat on the finished wordmark before lifting
const FADE = 700;

const TYPE_END = TYPE_START + REST.length * TYPE_STEP;
const LEAVE_AT = TYPE_END + HOLD;

const PLAYED_KEY = "xplorem:intro-played";

// Once per tab, not once per navigation: a splash that replays on every refresh
// stops being a flourish and starts being a toll. Storage is wrapped because
// Safari's private mode throws on access, and an intro is not worth a crash.
function shouldPlay() {
  try {
    return !sessionStorage.getItem(PLAYED_KEY);
  } catch {
    return true;
  }
}

function markPlayed() {
  try {
    sessionStorage.setItem(PLAYED_KEY, "1");
  } catch {
    // Nothing to do — worst case the intro plays again next load.
  }
}

function StartupAnimation() {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Read once, at mount. Reading during render instead of in an effect keeps
  // the overlay from flashing in and straight back out on a repeat visit.
  const [play] = useState(shouldPlay);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  const skip = !play || prefersReducedMotion;

  useEffect(() => {
    if (skip) return;

    markPlayed();

    // The app is already mounted and fetching behind this overlay, so the
    // intro costs nothing but its own duration — it's covering work that had
    // to happen anyway.
    const leave = setTimeout(() => setLeaving(true), LEAVE_AT);
    const end = setTimeout(() => setDone(true), LEAVE_AT + FADE);

    return () => {
      clearTimeout(leave);
      clearTimeout(end);
    };
  }, [skip]);

  // A splash you can't scroll past shouldn't let you scroll behind it either.
  // Keyed on `done` rather than living in the timer effect above: this
  // component finishes by rendering null, not by unmounting, so an unmount-only
  // cleanup would never run and the page would stay frozen for the whole
  // session — no scrolling to anything below the hero.
  useEffect(() => {
    if (skip || done) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [skip, done]);

  if (skip || done) return null;

  return (
    <Screen $leaving={leaving} aria-hidden="true">
      <div className="wordmark">
        <span className="mark">X</span>
        <span className="rest">
          {/* Hidden copy of the finished word, reserving its full width. The
              typed letters are absolutely positioned over it, so the lockup
              stays put instead of the X sliding left six times as the
              centred line grows one character at a time. */}
          <span className="sizer">{REST}</span>
          <span className="typed">
            {REST.split("").map((letter, index) => (
              <span
                key={index}
                className="letter"
                style={{
                  animationDelay: `${TYPE_START + index * TYPE_STEP}ms`,
                  color: letterColor(index),
                }}
              >
                {letter}
              </span>
            ))}
            <span className="caret" />
          </span>
        </span>
      </div>
    </Screen>
  );
}

const Screen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Black, per the design — not --color-canvas. The slight lift from black to
     the app's near-black navy is part of the reveal. */
  background: #000;
  opacity: ${(props) => (props.$leaving ? 0 : 1)};
  transition: opacity ${FADE}ms ease;
  /* Stop the fading overlay from swallowing a click on the app underneath. */
  pointer-events: ${(props) => (props.$leaving ? "none" : "auto")};

  .wordmark {
    /* nowrap because the letters are separate spans and would otherwise be
       free to break mid-word on a narrow screen. */
    white-space: nowrap;
    font-size: clamp(2.75rem, 11vw, 5.5rem);
    line-height: 1;
  }

  /* The lettermark: big, bold, brand-coloured. */
  .mark {
    display: inline-block;
    font-family: var(--font-sora);
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--color-brand);
    transform-origin: center;
    animation: mark-in ${MARK_IN}ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  /* Set as a lockup rather than a continuation of the line: the word is half
     the size, in the body face, and lifted off the baseline to centre on the
     mark's cap height (roughly 0.36em above the baseline for the X, 0.19em for
     the smaller text — the difference is the offset). Tucked a hair left so it
     nests into the X instead of floating beside it. */
  .rest {
    position: relative;
    display: inline-block;
    top: -0.17em;
    margin-left: -0.04em;
    font-family: var(--font-hanken);
    /* 400, not 300 — the stylesheet only imports 400/500/600/700, and a weight
       that isn't there gets synthesised into a blurry approximation. */
    font-weight: 400;
    font-size: 0.52em;
    letter-spacing: 0.04em;
  }

  .sizer {
    visibility: hidden;
  }

  .typed {
    position: absolute;
    left: 0;
    top: 0;
    white-space: nowrap;
  }

  /* Clipped to zero width until its turn, then snapped open — a max-width
     larger than any single glyph gets a real per-character reveal without
     measuring text. Fading alone would make the word develop in place, and the
     caret would sit at the far end the whole time instead of walking along
     behind the letters.

     The clip is clip-path rather than overflow:hidden on purpose: overflow
     moves an inline-block's baseline to its bottom margin edge, which would
     drop these letters out of line with each other. clip-path is a paint-time
     operation and leaves the baseline alone. */
  .letter {
    display: inline-block;
    max-width: 0;
    clip-path: inset(0);
    animation: letter-in 1ms linear both;
  }

  /* An empty inline-block baselines on its bottom edge, so this sits on the
     text baseline and rises from it, the way a real caret does. Warm against
     an otherwise entirely blue lockup. */
  .caret {
    display: inline-block;
    width: 0.08em;
    height: 0.8em;
    margin-left: 0.08em;
    background: var(--color-star);
    animation: caret-blink 900ms steps(2, end) infinite;
  }

  @keyframes mark-in {
    0% {
      opacity: 0;
      transform: scale(0.72);
    }
    60% {
      opacity: 1;
      transform: scale(1.06);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes letter-in {
    to {
      max-width: 1.5em;
    }
  }

  @keyframes caret-blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;

export default StartupAnimation;
