import { useEffect, useState } from "react";
import styled from "styled-components";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

const PLAYED_KEY = "xplorem:intro-played";
const INTRO_END = 2600;
const FADE = 520;

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
    // The intro is non-essential; replaying is the safest fallback.
  }
}

const stars = [
  { x: "13%", y: "28%", delay: "0ms", size: "3px" },
  { x: "21%", y: "67%", delay: "420ms", size: "2px" },
  { x: "31%", y: "19%", delay: "760ms", size: "2px" },
  { x: "72%", y: "24%", delay: "220ms", size: "3px" },
  { x: "81%", y: "63%", delay: "620ms", size: "2px" },
  { x: "88%", y: "39%", delay: "960ms", size: "2px" },
  { x: "67%", y: "79%", delay: "340ms", size: "3px" },
  { x: "35%", y: "82%", delay: "840ms", size: "2px" },
];

function StartupAnimation() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [play] = useState(shouldPlay);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  const skip = !play || prefersReducedMotion;

  useEffect(() => {
    if (skip) return undefined;

    markPlayed();
    const leave = setTimeout(() => setLeaving(true), INTRO_END);
    const end = setTimeout(() => setDone(true), INTRO_END + FADE);

    return () => {
      clearTimeout(leave);
      clearTimeout(end);
    };
  }, [skip]);

  useEffect(() => {
    if (skip || done) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [skip, done]);

  if (skip || done) return null;

  return (
    <Screen $leaving={leaving} aria-hidden="true">
      <div className="scene">
        <div className="topline">
          <span>XPLOREM / 001</span>
          <span>Signal acquired</span>
        </div>

        <div className="field">
          {stars.map((star, index) => (
            <span
              className="star"
              key={index}
              style={{
                "--x": star.x,
                "--y": star.y,
                "--delay": star.delay,
                "--size": star.size,
              }}
            />
          ))}
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <span className="orbit orbit-three" />
          <span className="crosshair crosshair-top" />
          <span className="crosshair crosshair-bottom" />
          <span className="scan" />
          <div className="core">
            <span className="core-ring" />
            <span className="mark">X</span>
          </div>
        </div>

        <div className="wordmark">
          <span className="wordmark-x">X</span>
          <span className="wordmark-rest">plorem</span>
        </div>
        <p className="caption">A personal cinema vault</p>

        <div className="bottomline">
          <span>DISCOVER / SAVE / REMEMBER</span>
          <span className="status"><i /> Ready to explore</span>
        </div>
      </div>
    </Screen>
  );
}

const Screen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 46%, rgba(28, 54, 93, 0.48), transparent 25rem),
    var(--color-canvas);
  opacity: ${(props) => (props.$leaving ? 0 : 1)};
  transition: opacity ${FADE}ms cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: ${(props) => (props.$leaving ? "none" : "auto")};

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0.2;
    background:
      radial-gradient(circle at 50% 44%, rgba(163, 201, 255, 0.14), transparent 1px),
      radial-gradient(circle at 42% 56%, rgba(51, 153, 255, 0.12), transparent 2px),
      radial-gradient(circle at 58% 38%, rgba(163, 201, 255, 0.1), transparent 1px);
    background-size: 23rem 19rem, 31rem 27rem, 17rem 29rem;
    mask-image: radial-gradient(ellipse at center, black, transparent 72%);
  }

  .scene {
    position: relative;
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem clamp(1.5rem, 5vw, 5rem);
  }

  .topline,
  .bottomline {
    position: absolute;
    left: clamp(1.5rem, 5vw, 5rem);
    right: clamp(1.5rem, 5vw, 5rem);
    display: flex;
    justify-content: space-between;
    color: var(--color-ink-faint);
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .topline {
    top: 2rem;
    animation: interface-in 700ms 300ms both;
  }

  .bottomline {
    bottom: 2rem;
    animation: interface-in 700ms 1500ms both;
  }

  .field {
    position: relative;
    width: min(68vw, 31rem);
    aspect-ratio: 1;
    animation: field-in 1100ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .field::before,
  .field::after {
    position: absolute;
    content: "";
    border: 1px solid rgba(163, 201, 255, 0.18);
    border-radius: 50%;
    inset: 12%;
    animation: pulse 2200ms 600ms ease-out both;
  }

  .field::after {
    inset: 24%;
    border-color: rgba(51, 153, 255, 0.28);
    animation-delay: 800ms;
  }

  .star {
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background: var(--color-brand);
    box-shadow: 0 0 12px var(--color-brand-bright);
    animation: star-in 900ms var(--delay) both;
  }

  .orbit {
    position: absolute;
    left: 50%;
    top: 50%;
    border: 1px solid rgba(163, 201, 255, 0.35);
    border-radius: 50%;
    transform: translate(-50%, -50%) rotate(-22deg);
    animation: orbit-in 1100ms 300ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .orbit-one {
    width: 66%;
    height: 26%;
  }

  .orbit-two {
    width: 66%;
    height: 26%;
    transform: translate(-50%, -50%) rotate(58deg);
    border-color: rgba(51, 153, 255, 0.45);
  }

  .orbit-three {
    width: 82%;
    height: 82%;
    border-style: dashed;
    border-color: rgba(163, 201, 255, 0.12);
    animation-delay: 500ms;
  }

  .crosshair {
    position: absolute;
    left: 50%;
    width: 120%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(163, 201, 255, 0.22), transparent);
    transform: translateX(-50%);
  }

  .crosshair-top {
    top: 29%;
  }

  .crosshair-bottom {
    top: 71%;
  }

  .scan {
    position: absolute;
    left: 50%;
    top: 8%;
    width: 1px;
    height: 84%;
    background: linear-gradient(transparent, var(--color-brand), transparent);
    box-shadow: 0 0 24px 2px rgba(163, 201, 255, 0.6);
    transform-origin: center;
    animation: scan 1500ms 650ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .core {
    position: absolute;
    left: 50%;
    top: 50%;
    display: grid;
    width: clamp(5rem, 18vw, 8rem);
    aspect-ratio: 1;
    place-items: center;
    border: 1px solid var(--color-brand);
    border-radius: 50%;
    background: rgba(5, 10, 20, 0.76);
    box-shadow: 0 0 0 8px rgba(163, 201, 255, 0.06), 0 0 60px rgba(51, 153, 255, 0.4);
    transform: translate(-50%, -50%) scale(0);
    animation: core-in 900ms 950ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .core-ring {
    position: absolute;
    inset: 12%;
    border: 1px solid rgba(163, 201, 255, 0.34);
    border-radius: 50%;
    animation: rotate 8s linear infinite;
  }

  .mark,
  .wordmark-x {
    color: var(--color-brand);
    font-family: var(--font-sora);
    font-weight: 700;
    letter-spacing: -0.08em;
  }

  .mark {
    font-size: clamp(2.5rem, 8vw, 4rem);
    transform: translateX(-0.06em);
  }

  .wordmark {
    display: flex;
    align-items: baseline;
    margin-top: -1.25rem;
    color: var(--color-ink);
    font-family: var(--font-sora);
    font-size: clamp(2.25rem, 8vw, 4.5rem);
    font-weight: 700;
    letter-spacing: -0.08em;
    line-height: 1;
    clip-path: inset(0 100% 0 0);
    animation: wordmark-reveal 950ms 1350ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .wordmark-rest {
    color: var(--color-ink);
    font-size: 0.68em;
    font-weight: 500;
    letter-spacing: -0.06em;
  }

  .caption {
    margin-top: 1.2rem;
    color: var(--color-ink-subtle);
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    animation: interface-in 700ms 1750ms both;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .status i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-brand-bright);
    box-shadow: 0 0 10px var(--color-brand-bright);
  }

  @keyframes field-in {
    from { opacity: 0; transform: scale(0.72) rotate(-8deg); }
    to { opacity: 1; transform: scale(1) rotate(0); }
  }

  @keyframes star-in {
    from { opacity: 0; transform: scale(0); }
    60% { opacity: 1; transform: scale(1.8); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes orbit-in {
    from { opacity: 0; transform: translate(-50%, -50%) rotate(-22deg) scale(0.4); }
    to { opacity: 1; transform: translate(-50%, -50%) rotate(-22deg) scale(1); }
  }

  @keyframes scan {
    from { opacity: 0; transform: translateX(-50%) scaleY(0); }
    20% { opacity: 1; }
    to { opacity: 0.6; transform: translateX(-50%) scaleY(1); }
  }

  @keyframes core-in {
    0% { transform: translate(-50%, -50%) scale(0); }
    70% { transform: translate(-50%, -50%) scale(1.12); }
    100% { transform: translate(-50%, -50%) scale(1); }
  }

  @keyframes pulse {
    from { opacity: 0; transform: scale(0.6); }
    35% { opacity: 1; }
    to { opacity: 0; transform: scale(1.08); }
  }

  @keyframes wordmark-reveal {
    from { opacity: 0; clip-path: inset(0 100% 0 0); transform: translateY(0.3em); }
    to { opacity: 1; clip-path: inset(0); transform: translateY(0); }
  }

  @keyframes interface-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes rotate {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 520px) {
    .topline,
    .bottomline {
      font-size: 0.5rem;
      letter-spacing: 0.1em;
    }

    .bottomline span:first-child {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .field,
    .star,
    .orbit,
    .field::before,
    .field::after,
    .scan,
    .core,
    .wordmark,
    .topline,
    .bottomline,
    .caption {
      animation: none;
    }

    .field,
    .star,
    .orbit,
    .field::before,
    .field::after,
    .scan,
    .core,
    .wordmark,
    .topline,
    .bottomline,
    .caption {
      opacity: 1;
    }

    .core {
      transform: translate(-50%, -50%);
    }

    .orbit {
      transform: translate(-50%, -50%) rotate(-22deg);
    }

    .wordmark {
      clip-path: inset(0);
    }
  }
`;

export default StartupAnimation;
