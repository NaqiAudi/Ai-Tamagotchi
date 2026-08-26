const visor = document.getElementById('visor');
const robotHead = document.getElementById('robotHead');

const expressions = ['normal', 'happy', 'sad', 'angry', 'surprised'];
let currentExpression = 'normal';
let sleepTimer = null;
let mouseIdleTimer = null;
let isTrackingMouse = false;

// -------------------------------------------------------------
// WEB AUDIO API - Penjanaan Bunyi Robotik
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
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);

  } else if (emotion === 'sad') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.4);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);

  } else if (emotion === 'angry') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(160, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);

  } else if (emotion === 'surprised') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);

  } else if (emotion === 'normal') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.setValueAtTime(900, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);

  } else if (emotion === 'wake') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1050, now + 0.25);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);

  } else if (emotion === 'sleep') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.6);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    osc.start(now);
    osc.stop(now + 0.6);
  }
}

// Mengemaskini pemasa automatik 1 minit supaya bunyi sentiasa dimainkan
setInterval(() => {
  if (currentExpression !== 'sleep' && !isTrackingMouse) {
    const nextExp = expressions[Math.floor(Math.random() * expressions.length)];
    setExpression(nextExp, true); // Pastikan parameter kedua adalah true
  }
}, 60000);

// -------------------------------------------------------------
// LOGIK TUKAR EMOSI & KAWALAN WIDGET
// -------------------------------------------------------------
function setExpression(exp, playCustomSound = true) {
  currentExpression = exp;

  // Reset kedudukan mata anak panah
  const eyes = document.querySelectorAll('.eye');
  eyes.forEach(eye => eye.style.transform = '');

  visor.className = 'visor ' + (exp === 'normal' ? '' : exp);

  if (playCustomSound) {
    playSound(exp);
  }

  resetInactivityTimer();
}

// Penjejakan Tetikus (Mouse Tracking)
document.addEventListener('mousemove', (e) => {
  if (currentExpression === 'sleep') return;

  isTrackingMouse = true;
  visor.className = 'visor'; 

  const eyes = document.querySelectorAll('.eye');
  // Nisbah jarak mata diselaraskan dengan saiz muka baharu
  const x = (e.clientX / window.innerWidth - 0.5) * 45;
  const y = (e.clientY / window.innerHeight - 0.5) * 32;

  eyes.forEach(eye => {
    eye.style.transform = `translate(${x}px, ${y}px)`;
  });

  resetInactivityTimer();

  clearTimeout(mouseIdleTimer);
  mouseIdleTimer = setTimeout(() => {
    isTrackingMouse = false;
    const nextExp = expressions[Math.floor(Math.random() * expressions.length)];
    setExpression(nextExp);
  }, 15000);
});

// 2. Sentuh / Klik Muka Robot
robotHead.addEventListener('click', (e) => {
  e.stopPropagation();

  if (currentExpression === 'sleep') {
    setExpression('normal', false); // Kembalikan paparan mata biasa
    playSound('wake'); // Mainkan bunyi bangun
  } else {
    isTrackingMouse = false;
    const randomExp = expressions[Math.floor(Math.random() * expressions.length)];
    setExpression(randomExp);
  }
});

// 3. Tukar Emosi Automatik Setiap 30 Saat
setInterval(() => {
  if (currentExpression !== 'sleep' && !isTrackingMouse) {
    const nextExp = expressions[Math.floor(Math.random() * expressions.length)];
    setExpression(nextExp);
  }
}, 30000); // <-- 30000 bermaksud 30 saat

// 4. Auto-Blink & Jeling Automatik
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

// 5. Pemasa Mod Tidur (15 Minit Tanpa Aktiviti)
function resetInactivityTimer() {
  clearTimeout(sleepTimer);
  sleepTimer = setTimeout(() => {
    isTrackingMouse = false;
    currentExpression = 'sleep';
    visor.className = 'visor sleep';
    playSound('sleep');
  }, 900000);
}

resetInactivityTimer();
