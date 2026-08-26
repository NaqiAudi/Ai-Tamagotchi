const petFace = document.getElementById('petFace');
const dialogBox = document.getElementById('dialogBox');
const apiKeyInput = document.getElementById('apiKeyInput');

async function interact(action) {
  const apiKey = apiKeyInput.value.trim();

  if (!apiKey) {
    dialogBox.innerText = "Sila masukkan Gemini API Key dulu!";
    return;
  }

  setEmotionUI(action.toLowerCase());
  dialogBox.innerText = "Tengah fikir...";

  let promptText = "";
  if (action === 'HAPPY') promptText = "Tuan kamu menyapa/membelai kamu. Jawab pendek (bawah 10 perkataan) dengan gaya comel dan gembira.";
  if (action === 'FEED') promptText = "Tuan kamu memberi kamu makan. Jawab pendek (bawah 10 perkataan) menunjukkan kamu kenyang dan suka.";
  if (action === 'ANGRY') promptText = "Tuan kamu mengusik/mengacau kamu. Jawab pendek (bawah 10 perkataan) dengan gaya merajuk atau marah comel.";

  try {
    const reply = await callGeminiAPI(apiKey, promptText);
    dialogBox.innerText = reply;
  } catch (error) {
    console.error(error);
    dialogBox.innerText = "Ralat pada API! Semak Key anda.";
  }
}

function setEmotionUI(emotionClass) {
  petFace.className = 'pet-face ' + emotionClass;
  setTimeout(() => {
    petFace.className = 'pet-face';
  }, 3000);
}

// Fungsi dipanggil menggunakan model gemini-1.5-flash
async function callGeminiAPI(key, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: "Bertindak sebagai peliharaan digital Tamagotchi yang comel. Sentiasa beri respon ringkas dalam Bahasa Melayu: " + prompt }]
      }]
    })
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("Gemini Error Detail:", err);
    throw new Error("API Request Failed");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
