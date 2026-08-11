import styled from "styled-components";

// Every dimension in the loader derives from --size, so the variants only need
// to set that one value.
const sizes = {
  sm: "12px",
  md: "20px",
  lg: "32px",
};

function LoadingSpinner({ size = "md", label = "Loading", className = "" }) {
  return (
    <StyledWrapper
      role="status"
      aria-live="polite"
      $size={sizes[size] || sizes.md}
      className={className}
    >
      <div className="boxes" aria-hidden="true">
        {[0, 1, 2, 3].map((box) => (
          <div className="box" key={box}>
            <div />
            <div />
            <div />
            <div />
          </div>
        ))}
      </div>
      <span className="sr-only">{label}</span>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  --size: ${(props) => props.$size};
  --duration: 800ms;

  /* The cubes are rotated out of their layout box, so reserve room for the
     rendered bounds instead of the untransformed ones — the original snippet
     used a negative margin here, which made the loader overlap whatever sat
     above it. */
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(var(--size) * 4);

  /* Retinted from the snippet's raw blues onto the palette so the spinner
     matches the rest of the UI. */
  --face-front: var(--color-brand-bright);
  --face-right: var(--color-brand-deep);
  --face-top: var(--color-brand);
  /* The hidden underside — sits against the page, so it tracks the canvas. */
  --face-base: var(--color-canvas);

  .boxes {
    height: calc(var(--size) * 2);
    width: calc(var(--size) * 3);
    position: relative;
    transform-style: preserve-3d;
    transform-origin: 50% 50%;
    transform: rotateX(60deg) rotateZ(45deg) rotateY(0deg) translateZ(0px);
  }

  .boxes .box {
    width: var(--size);
    height: var(--size);
    top: 0;
    left: 0;
    position: absolute;
    transform-style: preserve-3d;
  }

  .boxes .box:nth-child(1) {
    transform: translate(100%, 0);
    animation: box1 var(--duration) linear infinite;
  }

  .boxes .box:nth-child(2) {
    transform: translate(0, 100%);
    animation: box2 var(--duration) linear infinite;
  }

  .boxes .box:nth-child(3) {
    transform: translate(100%, 100%);
    animation: box3 var(--duration) linear infinite;
  }

  .boxes .box:nth-child(4) {
    transform: translate(200%, 0);
    animation: box4 var(--duration) linear infinite;
  }

  .boxes .box > div {
    --background: var(--face-front);
    --top: auto;
    --right: auto;
    --bottom: auto;
    --left: auto;
    --translateZ: calc(var(--size) / 2);
    --rotateY: 0deg;
    --rotateX: 0deg;
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--background);
    top: var(--top);
    right: var(--right);
    bottom: var(--bottom);
    left: var(--left);
    transform: rotateY(var(--rotateY)) rotateX(var(--rotateX))
      translateZ(var(--translateZ));
  }

  .boxes .box > div:nth-child(1) {
    --top: 0;
    --left: 0;
  }

  .boxes .box > div:nth-child(2) {
    --background: var(--face-right);
    --right: 0;
    --rotateY: 90deg;
  }

  .boxes .box > div:nth-child(3) {
    --background: var(--face-top);
    --rotateX: -90deg;
  }

  .boxes .box > div:nth-child(4) {
    --background: var(--face-base);
    --top: 0;
    --left: 0;
    --translateZ: calc(var(--size) * 3 * -1);
  }

  /* A looping 3D animation is a common migraine/vestibular trigger — fall back
     to a static stack when the user has asked for reduced motion. */
  @media (prefers-reduced-motion: reduce) {
    .boxes .box {
      animation: none;
    }
  }

  @keyframes box1 {
    0%,
    50% {
      transform: translate(100%, 0);
    }
    100% {
      transform: translate(200%, 0);
    }
  }

  @keyframes box2 {
    0% {
      transform: translate(0, 100%);
    }
    50% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(100%, 0);
    }
  }

  @keyframes box3 {
    0%,
    50% {
      transform: translate(100%, 100%);
    }
    100% {
      transform: translate(0, 100%);
    }
  }

  @keyframes box4 {
    0% {
      transform: translate(200%, 0);
    }
    50% {
      transform: translate(200%, 100%);
    }
    100% {
      transform: translate(100%, 100%);
    }
  }
`;

export default LoadingSpinner;
