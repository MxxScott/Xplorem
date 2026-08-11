import styled from "styled-components";

// Where each cube flies in from (x/y) and where it lands (left/top). Arbitrary
// values from the original snippet, kept as data so the CSS below doesn't need
// eight near-identical position blocks.
const boxes = [
  { x: -220, y: -120, left: 58, top: 108 },
  { x: -260, y: 120, left: 25, top: 120 },
  { x: 120, y: -190, left: 58, top: 64 },
  { x: 280, y: -40, left: 91, top: 120 },
  { x: 60, y: 200, left: 58, top: 132 },
  { x: -220, y: -120, left: 25, top: 76 },
  { x: -260, y: 120, left: 91, top: 76 },
  { x: -240, y: 200, left: 58, top: 87 },
];

// Each cube runs the same two animations as the one before it, shifted along
// the timeline by a fixed step — so the 16 keyframe blocks are generated rather
// than hand-written.
const STAGGER = 4;

function timings() {
  return boxes
    .map((_, index) => {
      const shift = index * STAGGER;
      const land = 12 + shift;
      const settle = 25 + shift;
      const scaleFrom = 6 + shift;
      const scaleTo = 14 + shift;

      return `
        .box:nth-child(${index + 1}) {
          animation-name: box-move-${index};
        }

        .box:nth-child(${index + 1}) > div {
          animation-name: box-scale-${index};
        }

        @keyframes box-move-${index} {
          ${land}% { transform: translate(var(--x), var(--y)); }
          ${settle}%, 52% { transform: translate(0, 0); }
          80% { transform: translate(0, -32px); }
          90%, 100% { transform: translate(0, 188px); }
        }

        @keyframes box-scale-${index} {
          ${scaleFrom}% { transform: var(--tilt) scale(0); }
          ${scaleTo}%, 100% { transform: var(--tilt) scale(1); }
        }
      `;
    })
    .join("\n");
}

function PageLoader({ label = "Loading" }) {
  return (
    <StyledWrapper role="status" aria-live="polite">
      <div className="loader" aria-hidden="true">
        {boxes.map((box, index) => (
          <div
            key={index}
            className="box"
            style={{
              "--x": `${box.x}px`,
              "--y": `${box.y}px`,
              left: `${box.left}px`,
              top: `${box.top}px`,
            }}
          >
            <div />
          </div>
        ))}
        <div className="ground">
          <div />
        </div>
      </div>
      <span className="sr-only">{label}</span>
    </StyledWrapper>
  );
}
const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  width: 100%;

  .loader {
    --duration: 3s;
    --tilt: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg);
    /* Pulled from the design tokens instead of hardcoded blues, so the loader
       moves with the palette. */
    --primary: var(--color-brand-bright);
    --primary-light: var(--color-brand);
    --primary-rgba: color-mix(in srgb, var(--color-brand-bright) 0%, transparent);
    width: 200px;
    height: 320px;
    position: relative;
    transform-style: preserve-3d;
  }

  @media (max-width: 480px) {
    .loader {
      zoom: 0.44;
    }
  }

  /* These two wedges mask the cubes as they drop, so they have to match the
     page behind them — hardcoding a light grey here is what would show as two
     pale triangles on a dark page. Tracking --color-canvas means it stays
     correct if the palette or theme changes. */
  .loader:before,
  .loader:after {
    --r: 20.5deg;
    content: "";
    width: 320px;
    height: 140px;
    position: absolute;
    right: 32%;
    bottom: -11px;
    background: var(--color-canvas);
    transform: translateZ(200px) rotate(var(--r));
    animation: mask var(--duration) linear forwards infinite;
  }

  .loader:after {
    --r: -20.5deg;
    right: auto;
    left: 32%;
  }

  .ground {
    position: absolute;
    left: -50px;
    bottom: -120px;
    transform-style: preserve-3d;
    transform: var(--tilt) scale(1);
  }

  .ground > div {
    transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px)
      translateZ(100px) scale(0);
    width: 200px;
    height: 200px;
    background: linear-gradient(
      45deg,
      var(--primary) 0%,
      var(--primary) 50%,
      var(--primary-light) 50%,
      var(--primary-light) 100%
    );
    transform-style: preserve-3d;
    animation: ground var(--duration) linear forwards infinite;
  }

  .ground > div:before,
  .ground > div:after {
    --rx: 90deg;
    --ry: 0deg;
    --x: 44px;
    --y: 162px;
    --z: -50px;
    content: "";
    width: 156px;
    height: 300px;
    opacity: 0;
    background: linear-gradient(var(--primary), var(--primary-rgba));
    position: absolute;
    transform: rotateX(var(--rx)) rotateY(var(--ry))
      translate(var(--x), var(--y)) translateZ(var(--z));
    animation: ground-shine var(--duration) linear forwards infinite;
  }

  .ground > div:after {
    --rx: 90deg;
    --ry: 90deg;
    --x: 0;
    --y: 177px;
    --z: 150px;
  }

  .box {
    --x: 0;
    --y: 0;
    position: absolute;
    animation: var(--duration) linear forwards infinite;
    transform: translate(var(--x), var(--y));
  }

  .box > div {
    background-color: var(--primary);
    width: 48px;
    height: 48px;
    position: relative;
    transform-style: preserve-3d;
    animation: var(--duration) ease forwards infinite;
    transform: var(--tilt) scale(0);
  }

  /* The two visible side faces of each cube, lit slightly differently so the
     shape reads as 3D. */
  .box > div:before,
  .box > div:after {
    --rx: 90deg;
    --ry: 0deg;
    --z: 24px;
    --y: -24px;
    --x: 0;
    content: "";
    position: absolute;
    background-color: inherit;
    width: inherit;
    height: inherit;
    transform: rotateX(var(--rx)) rotateY(var(--ry))
      translate(var(--x), var(--y)) translateZ(var(--z));
    filter: brightness(var(--b, 1.2));
  }

  .box > div:after {
    --rx: 0deg;
    --ry: 90deg;
    --x: 24px;
    --y: 0;
    --b: 1.4;
  }

  ${timings()}

  @keyframes ground {
    0%,
    65% {
      transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px)
        translateZ(100px) scale(0);
    }
    75%,
    90% {
      transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px)
        translateZ(100px) scale(1);
    }
    100% {
      transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px)
        translateZ(100px) scale(0);
    }
  }

  @keyframes ground-shine {
    0%,
    70% {
      opacity: 0;
    }
    75%,
    87% {
      opacity: 0.2;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes mask {
    0%,
    65% {
      opacity: 0;
    }
    66%,
    100% {
      opacity: 1;
    }
  }

  /* Eight cubes tumbling through 3D space is a lot of motion — hold the
     assembled stack still instead. */
  @media (prefers-reduced-motion: reduce) {
    .box,
    .box > div,
    .ground > div,
    .loader:before,
    .loader:after {
      animation: none;
    }

    .box > div {
      transform: var(--tilt) scale(1);
    }
  }
`;

export default PageLoader;
