const visor = document.getElementById('visor');
const robotHead = document.getElementById('robotHead');

const expressions = ['normal', 'happy', 'sad', 'angry', 'surprised'];
let currentExpression = 'normal';
let sleepTimer = null;
let mouseIdleTimer = null;
let isTrackingMouse = false;

// Pautan Fail Audio (Sedia untuk dimuat naik ke folder 'sounds/' di GitHub)
const sounds = {
  normal: new Audio('sounds/normal.mp3'),
  happy: new Audio('sounds/happy.mp3'),
  sad: new Audio('sounds/sad.mp3'),
  angry: new Audio('sounds/angry.mp3'),
  surprised: new Audio('sounds/surprised.mp3'),
  sleep: new Audio('sounds/sleep.mp3'),
  wake: new Audio('sounds/wake.mp3')
};

function playSound(name) {
  if (sounds[name]) {
    sounds[name].currentTime = 0;
    sounds[name].play().catch(() => {}); // Elak error jika audio belum sedia
  }
}

function setExpression(exp) {
  currentExpression = exp;
  // Reset sebarang pergerakan jelingan mata tetikus
  const eyes = document.querySelectorAll('.eye');
  eyes.forEach(eye => eye.style.transform = '');

  visor.className = 'visor ' + (exp === 'normal' ? '' : exp);
  playSound(exp);
  resetInactivityTimer();
}

// 1. Logik Tetikus Ikut Anak Panah (Mouse Tracking) & Pemasa 15 Saat
document.addEventListener('mousemove', (e) => {
  // Jika robot sedang tidur, tetikus tidak mengganggunya (perlu klik untuk bangun)
  if (currentExpression === 'sleep') return;

  isTrackingMouse = true;
  visor.className = 'visor'; // Reset ke mod biasa untuk penjejakan mata

  const eyes = document.querySelectorAll('.eye');
  // Kira kedudukan relatif anak panah tetikus berbanding skrin
  const x = (e.clientX / window.innerWidth - 0.5) * 35; // Jarak pergerakan X
  const y = (e.clientY / window.innerHeight - 0.5) * 25; // Jarak pergerakan Y

  eyes.forEach(eye => {
    eye.style.transform = `translate(${x}px, ${y}px)`;
  });

  resetInactivityTimer();

  // Reset pemasa 15 saat setiap kali tetikus digerakkan
  clearTimeout(mouseIdleTimer);
  mouseIdleTimer = setTimeout(() => {
    isTrackingMouse = false;
    // Selepas 15 saat tetikus tidak bergerak, jalankan emosi automatik semula
    const nextExp = expressions[Math.floor(Math.random() * expressions.length)];
    setExpression(nextExp);
  }, 15000); // 15 saat = 15,000ms
});

// 2. Sentuh / Klik Muka Robot
robotHead.addEventListener('click', (e) => {
  e.stopPropagation(); // Elak konflik dengan mousemove
  if (currentExpression === 'sleep') {
    setExpression('normal');
    playSound('wake');
  } else {
    isTrackingMouse = false;
    const randomExp = expressions[Math.floor(Math.random() * expressions.length)];
    setExpression(randomExp);
  }
});

// 3. Tukar Emosi Automatik Setiap 1 Minit (Hanya berjalan jika tetikus tidak aktif)
setInterval(() => {
  if (currentExpression !== 'sleep' && !isTrackingMouse) {
    const nextExp = expressions[Math.floor(Math.random() * expressions.length)];
    setExpression(nextExp);
  }
}, 60000);

// 4. Auto-Blink & Jeling Automatik (Hanya berjalan jika tetikus tidak aktif)
setInterval(() => {
  if (currentExpression !== 'sleep' && !isTrackingMouse) {
    const action = Math.random();
    
    if (action < 0.6) {
      visor.classList.add('blink');
      setTimeout(() => visor.classList.remove('blink'), 180);
    } else if (action < 0.8) {
      visor.classList.add('look-left');
      setTimeout(() => visor.classList.remove('look-left'), 1200);
    } else {
      visor.classList.add('look-right');
      setTimeout(() => visor.classList.remove('look-right'), 1200);
    }
  }
}, 4000);

// 5. Pemasa 15 Minit Tanpa Sentuhan/Pergerakan (Mod Tidur)
function resetInactivityTimer() {
  clearTimeout(sleepTimer);
  sleepTimer = setTimeout(() => {
    isTrackingMouse = false;
    currentExpression = 'sleep';
    visor.className = 'visor sleep';
    playSound('sleep');
  }, 900000); // 15 minit = 900,000ms
}

resetInactivityTimer();
