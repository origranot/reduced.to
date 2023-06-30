import confetti from 'canvas-confetti';

export const confettiAnimate = () => {
  confetti({
    particleCount: 120,
    spread: 100,
    origin: {
      x: 0,
      y: 0.8,
    },
  });

  confetti({
    particleCount: 120,
    spread: 100,
    origin: {
      x: 1,
      y: 0.8,
    },
  });
};
