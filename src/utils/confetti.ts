
// A simple confetti effect
const confetti = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#F9DC5C'];
  
  // Create confetti elements
  for (let i = 0; i < 100; i++) {
    createConfettiPiece(colors);
  }
};

const createConfettiPiece = (colors: string[]) => {
  const confetti = document.createElement('div');
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  confetti.style.position = 'fixed';
  confetti.style.top = '-10px';
  confetti.style.zIndex = '1000';
  confetti.style.width = `${Math.random() * 10 + 5}px`;
  confetti.style.height = `${Math.random() * 5 + 5}px`;
  confetti.style.backgroundColor = color;
  confetti.style.borderRadius = '50%';
  confetti.style.opacity = '0.7';
  
  // Random starting position
  confetti.style.left = `${Math.random() * window.innerWidth}px`;
  
  document.body.appendChild(confetti);
  
  // Animate the confetti
  const animation = confetti.animate(
    [
      { 
        transform: `translate(${Math.random() * 100 - 50}px, 0)`,
        opacity: 1 
      },
      { 
        transform: `translate(${Math.random() * 400 - 200}px, ${window.innerHeight}px) rotate(${Math.random() * 1000}deg)`,
        opacity: 0 
      }
    ],
    {
      duration: Math.random() * 3000 + 2000,
      easing: 'cubic-bezier(0.1, 0.8, 0.9, 1)'
    }
  );
  
  // Remove the element when the animation is complete
  animation.onfinish = () => {
    confetti.remove();
  };
};

export default confetti;
