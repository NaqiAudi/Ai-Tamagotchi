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
  if (action === 'HAPPY') promptText = "Tuan kamu menyapa kamu. Jawab pendek bawah 8 perkataan dengan gaya comel gembira.";
  if (action === 'FEED') promptText = "Tuan kamu memberi kamu makan. Jawab pendek bawah 8 perkataan menunjukkan kamu kenyang.";
  if (action === 'ANGRY') promptText = "Tuan kamu mengusik kamu. Jawab pendek bawah 8 perkataan dengan gaya merajuk comel.";

  try {
    const reply = await callGeminiAPI(apiKey, promptText);
    dialogBox.innerText = reply;
    speak(reply);
  } catch (error) {
    console.error("Error Detail:", error);
    dialogBox.innerText = "Ralat Sambungan! Semak API Key atau Console.";
  }
}

function setEmotionUI(emotionClass) {
  petFace.className = 'pet-face ' + emotionClass;
  setTimeout(() => {
    petFace.className = 'pet-face';
  }, 3500);
}

// Gunakan model gemini-2.5-flash yang sokong direct request
async function callGeminiAPI(key, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: "Kamu ialah Tamagotchi. Jawab dalam Bahasa Melayu ringkas: " + prompt }]
      }]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("API Error Response:", data);
    throw new Error(data.error?.message || "Ralat API");
  }

  return data.candidates[0].content.parts[0].text;
}

// Suara Tamagotchi
function speak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.pitch = 1.5;
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  }
}

}
