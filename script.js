const petFace = document.getElementById('petFace');
const dialogBox = document.getElementById('dialogBox');
const emojiText = document.getElementById('emojiText');
const hungerStatus = document.getElementById('hungerStatus');
const cleanStatus = document.getElementById('cleanStatus');

let idleTimer;
let minuteTimer;
let isSleeping = false;

// 10+ Senarai Reaksi & Dialogue Sentuhan
const touchReactions = [
  { emoji: "(≧◡≦)", text: "Geli lah! Hehehe...", pitch: 1.8, freq: 600 },
  { emoji: "(๑&gt;ᴗ&lt;๑)", text: "Saya sayang anda!", pitch: 1.6, freq: 750 },
  { emoji: "( ͠° ͟ʖ ͡°)", text: "Jangan kacau muka saya...", pitch: 0.9, freq: 300 },
  { emoji: "٩(◕‿◕｡)۶", text: "Yayy! Belai lagi!", pitch: 1.7, freq: 800 },
  { emoji: "(￣▽￣)", text: "Rasa selesa sangat~", pitch: 1.3, freq: 500 },
  { emoji: "(｡♥‿♥｡)", text: "Muahhh!", pitch: 1.9, freq: 900 },
  { emoji: "( ﾟoﾟ)", text: "Eh? Terkejut saya!", pitch: 1.5, freq: 400 },
  { emoji: "(─‿─)", text: "Ehem... tumpang lalu.", pitch: 1.1, freq: 450 },
  { emoji: "(¬_¬)", text: "Boring lah asyik tekan je.", pitch: 0.8, freq: 350 },
  { emoji: "(^人^)", text: "Terima kasih sebab beri perhatian!", pitch: 1.6, freq: 650 }
];

// Senarai Reaksi Minit Berbeza (Auto-Change Every Minute)
const minuteReactions = [
  { emoji: "(◕‿◕)", text: "Tengah tengok sekeliling..." },
  { emoji: "(⊙_⊙)", text: "Ada orang perhatikan kita ke?" },
  { emoji: "(￣ρ￣)", text: "Rasa mengantuk sikit pulak..." },
  { emoji: "(o_O)", text: "Dengar bunyi sesuatu di luar!" },
  { emoji: "(─‿‿─)", text: "Menikmati suasana tenang..." }
];

// Sound Synthesizer (Kesan Bunyi Beep Robotik Tanpa Fail Audio)
function playSound(freq = 600, type = 'sine', duration = 0.15) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e) { console.log(e); }
}

// Suara Teks (Speech Synthesis)
function speak(text, pitch = 1.4) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = 'id-ID';
    ut.pitch = pitch;
    ut.rate = 1.1;
    window.speechSynthesis.speak(ut);
  }
}

// Reset Pemasa Tidur (2 Minit Tak Diganggu)
function resetIdleTimer() {
  clearTimeout(idleTimer);
  if (isSleeping) {
    isSleeping = false;
    petFace.classList.remove('sleeping');
  }

  idleTimer = setTimeout(() => {
    // Masuk Mod Tidur
    isSleeping = true;
    petFace.className = 'pet-face sleeping';
    emojiText.innerText = "(zzZ)";
    dialogBox.innerText = "Matcha dah tertidur... (zzZ)";
    playSound(200, 'sine', 0.5);
    speak("Zzz... zzz...");
  }, 120000); // 120,000ms = 2 Minit
}

// 1. REAKSI BILA PEGANG/SENTUH MUKA
function touchPet() {
  resetIdleTimer();
  const res = touchReactions[Math.floor(Math.random() * touchReactions.length)];
  
  petFace.className = 'pet-face happy';
  emojiText.innerText = res.emoji;
  dialogBox.innerText = res.text;
  
  playSound(res.freq, 'triangle', 0.2);
  speak(res.text, res.pitch);

  setTimeout(() => { if(!isSleeping) petFace.className = 'pet-face'; }, 2000);
}

// 2. BUTANG MAKAN
function feedPet() {
  resetIdleTimer();
  petFace.className = 'pet-face eating';
  emojiText.innerText = "(๑❛ڡ❛๑)";
  dialogBox.innerText = "Nyum3! Sedapnya pizza ni!";
  hungerStatus.innerText = "Lapar: Kenyang!";
  hungerStatus.style.color = "#8ac926";

  playSound(800, 'square', 0.1);
  setTimeout(() => playSound(1000, 'square', 0.15), 150);
  speak("Nyum nyum! Sedapnya!");

  setTimeout(() => { if(!isSleeping) petFace.className = 'pet-face'; }, 2500);
}

// 3. BUTANG MANDI
function bathPet() {
  resetIdleTimer();
  petFace.className = 'pet-face happy';
  emojiText.innerText = "🚿 (♪♪)";
  dialogBox.innerText = "Segarnya mandi! Dah bersih!";
  cleanStatus.innerText = "Kebersihan: Bersih!";
  cleanStatus.style.color = "#4cc9f0";

  playSound(500, 'sine', 0.3);
  speak("Segarnya mandi!");

  setTimeout(() => { if(!isSleeping) petFace.className = 'pet-face'; }, 2500);
}

// 4. BUTANG MAIN
function playPet() {
  resetIdleTimer();
  petFace.className = 'pet-face happy';
  emojiText.innerText = "٩(🔥∀🔥)۶";
  dialogBox.innerText = "Seronoknya main sama-sama!";

  playSound(700, 'sine', 0.1);
  setTimeout(() => playSound(900, 'sine', 0.1), 100);
  setTimeout(() => playSound(1200, 'sine', 0.2), 200);
  speak("Yayy! Seronoknya!");

  setTimeout(() => { if(!isSleeping) petFace.className = 'pet-face'; }, 2500);
}

// 5. PENUKARAN REAKSI SETIAP MINIT AUTOMATIK
setInterval(() => {
  if (!isSleeping) {
    const res = minuteReactions[Math.floor(Math.random() * minuteReactions.length)];
    emojiText.innerText = res.emoji;
    dialogBox.innerText = res.text;
    playSound(400, 'sine', 0.1);
  }
}, 60000); // 60,000ms = Setiap 1 Minit

// Mulakan timer bila page dibuka
resetIdleTimer();
