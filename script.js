const visor = document.getElementById('visor');
const robotHead = document.getElementById('robotHead');

const expressions = ['normal', 'happy', 'sad', 'angry', 'surprised'];
let currentExpression = 'normal';
let sleepTimer = null;
let mouseIdleTimer = null;
let isTrackingMouse = false;

// -------------------------------------------------------------
// WEB AUDIO API - Penjanaan Bunyi Robotik (Wall-E / Emo Pet)
// -------------------------------------------------------------
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(emotion) {
  initAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (emotion === 'happy') {
    // Chirp melompat naik gembira
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);

  } else if (emotion === 'sad') {
    // Nada perlahan menurun merajuk
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.4);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);

  } else if (emotion === 'angry') {
    // Bip kasar & bergetar cepat
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(160, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);

  } else if (emotion === 'surprised') {
    // Pitch tinggi mendadak
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);

  } else if (emotion === 'normal') {
    // Bip pendek berkembar
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.setValueAtTime(900, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);

  } else if (emotion === 'wake') {
    // Power up chime
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1050, now + 0.25);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);

  } else if (emotion === 'sleep') {
    // Dengkuran robotik berayun lembut
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.6);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    osc.start(now);
    osc.stop(now + 0.6);
  }
}

// -------------------------------------------------------------
// LOGIK TUKAR EMOSI & KAWALAN WIDGET
// -------------------------------------------------------------
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
