const visor = document.getElementById('visor');
let currentExpression = 'normal';

// Fungsi tukar ekspresi guna butang
function setExpression(exp) {
  currentExpression = exp;
  visor.className = 'visor ' + (exp === 'normal' ? '' : exp);
}

// Logik Kelip Mata Automatik (Blink)
setInterval(() => {
  if (currentExpression !== 'sleep') {
    visor.classList.add('blink');
    setTimeout(() => {
      visor.classList.remove('blink');
    }, 180);
  }
}, 3500);

// Animasi Mata Ikut Tetikus (Mouse Tracking Effect)
document.addEventListener('mousemove', (e) => {
  if (currentExpression === 'normal') {
    const eyes = document.querySelectorAll('.eye');
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    eyes.forEach(eye => {
      eye.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
});
