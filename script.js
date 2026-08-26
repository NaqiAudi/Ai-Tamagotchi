const visor = document.getElementById('visor');
let currentExpression = 'normal';

function setExpression(exp) {
  currentExpression = exp;
  visor.className = 'visor ' + (exp === 'normal' ? '' : exp);
}

// Logik Kelip Mata Automatik
setInterval(() => {
  if (currentExpression !== 'sleep') {
    visor.classList.add('blink');
    setTimeout(() => {
      visor.classList.remove('blink');
    }, 180);
  }
}, 3500);
