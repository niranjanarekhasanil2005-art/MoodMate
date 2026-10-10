/* ==========================================================
   MoodMate — Predict My Mood Logic
   Simple, pure JavaScript for recognizing emotions
   ========================================================== */

// 1. Mood Dictionary & Supportive Messages
const MOOD_DATA = {
  happy: {
    name: "Happy",
    emoji: "😊",
    message: "Your positive energy is glowing! Hold on to this radiant warmth and keep spreading your sunshine.",
    color: "#9333EA",
    bgColor: "linear-gradient(135deg, rgba(254, 240, 138, 0.4) 0%, rgba(253, 230, 138, 0.25) 100%)",
    keywords: [
      "happy", "joy", "joyful", "glad", "cheerful", "delighted", "smile", "smiling",
      "wonderful", "fantastic", "great", "good", "blessed", "bliss", "love", "loving",
      "awesome", "sunny", "pleased", "grateful", "content", "laugh", "laughing"
    ]
  },
  sad: {
    name: "Sad",
    emoji: "🥺",
    message: "It is completely okay to feel down. Give yourself gentle grace today—soft, brighter days are ahead.",
    color: "#3B82F6",
    bgColor: "linear-gradient(135deg, rgba(219, 234, 254, 0.5) 0%, rgba(191, 219, 254, 0.3) 100%)",
    keywords: [
      "sad", "down", "sorrow", "crying", "cry", "unhappy", "heartbroken", "grief",
      "tear", "tears", "lonely", "missed", "hurts", "gloomy", "depressed", "blue",
      "bummed", "despair", "hopeless", "weeping", "miserable"
    ]
  },
  angry: {
    name: "Angry",
    emoji: "😤",
    message: "Your feelings are valid. Take three slow, deep breaths and give yourself room to release that tension.",
    color: "#E11D48",
    bgColor: "linear-gradient(135deg, rgba(254, 205, 211, 0.5) 0%, rgba(253, 164, 175, 0.3) 100%)",
    keywords: [
      "angry", "mad", "furious", "pissed", "annoyed", "irritated", "rage", "hate",
      "resent", "outraged", "boiling", "frustrated", "frustration", "infuriated",
      "bitter", "fuming", "agitated"
    ]
  },
  anxious: {
    name: "Anxious",
    emoji: "😰",
    message: "Breathe in peace, breathe out worry. You are safe right now, you are capable, and you can take this one step at a time.",
    color: "#8B5CF6",
    bgColor: "linear-gradient(135deg, rgba(237, 233, 254, 0.6) 0%, rgba(221, 214, 254, 0.35) 100%)",
    keywords: [
      "anxious", "anxiety", "worried", "nervous", "panic", "stress", "stressed",
      "stressful", "fear", "scared", "tense", "uneasy", "dread", "jittery",
      "overwhelmed", "freaked", "shaky", "pressure"
    ]
  },
  excited: {
    name: "Excited",
    emoji: "🤩",
    message: "That energy is electrifying! Channel that wonderful spark and celebrate this thrilling momentum!",
    color: "#EC4899",
    bgColor: "linear-gradient(135deg, rgba(252, 231, 243, 0.6) 0%, rgba(244, 114, 182, 0.25) 100%)",
    keywords: [
      "excited", "thrilled", "pumped", "eager", "hype", "hyped", "enthusiastic",
      "amazed", "stoked", "energetic", "ecstatic", "buzzing", "can't wait", "woohoo", "celebrate"
    ]
  },
  tired: {
    name: "Tired",
    emoji: "🥱",
    message: "You have worked so hard. Honor your body, rest your mind, and treat yourself to a peaceful, cozy recharge.",
    color: "#64748B",
    bgColor: "linear-gradient(135deg, rgba(241, 245, 249, 0.7) 0%, rgba(226, 232, 240, 0.4) 100%)",
    keywords: [
      "tired", "exhausted", "sleepy", "drained", "fatigue", "fatigued", "weary",
      "burned out", "burnout", "low energy", "yawn", "sleep", "worn out", "wiped out",
      "spent", "heavy"
    ]
  }
};

// Fallback when feelings are neutral or words aren't matched
const DEFAULT_MOOD = {
  name: "Thoughtful & Calm",
  emoji: "🌸",
  message: "You seem reflective and at ease. Every emotion has its purpose—take a gentle moment just for yourself.",
  color: "#7C3AED",
  bgColor: "linear-gradient(135deg, rgba(245, 238, 255, 0.85) 0%, rgba(254, 235, 246, 0.85) 100%)"
};

// 2. DOM Elements
const moodInput = document.getElementById("moodInput");
const predictBtn = document.getElementById("predictBtn");
const charCount = document.getElementById("charCount");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");
const resultSection = document.getElementById("resultSection");
const moodEmoji = document.getElementById("moodEmoji");
const moodName = document.getElementById("moodName");
const moodMessage = document.getElementById("moodMessage");
const chipButtons = document.querySelectorAll(".chip-btn");

// 3. Helper: Count matching keywords for each mood
function detectMood(text) {
  // Convert text to lowercase and clean punctuation
  const cleanText = text.toLowerCase().replace(/[^a-z0-9\s']/g, " ");
  const words = cleanText.split(/\s+/).filter(Boolean);

  let bestMoodKey = null;
  let highestScore = 0;

  // Check each mood category
  for (const [moodKey, data] of Object.entries(MOOD_DATA)) {
    let score = 0;

    data.keywords.forEach((keyword) => {
      // Check multi-word keywords (e.g. "burned out", "can't wait", "low energy")
      if (keyword.includes(" ")) {
        if (cleanText.includes(keyword)) {
          score += 2;
        }
      } else {
        // Check single words
        if (words.includes(keyword)) {
          score += 1;
        } else if (cleanText.includes(keyword) && keyword.length > 4) {
          // Partial match for longer words
          score += 0.8;
        }
      }
    });

    if (score > highestScore) {
      highestScore = score;
      bestMoodKey = moodKey;
    }
  }

  // Return matched mood, or default calm/thoughtful state
  if (bestMoodKey && highestScore > 0) {
    return MOOD_DATA[bestMoodKey];
  }
  return DEFAULT_MOOD;
}

// 4. Action: Predict and update UI
function handlePredict() {
  const text = moodInput.value.trim();

  // Handle empty input gracefully
  if (!text) {
    showAlert("Please share a sentence or a few words about how you're feeling first! 💭");
    resultSection.classList.add("hidden");
    moodInput.focus();
    return;
  }

  // Hide any existing warning
  hideAlert();

  // Detect mood
  const detected = detectMood(text);

  // Update Result Card
  moodEmoji.textContent = detected.emoji;
  moodName.textContent = detected.name;
  moodName.style.color = detected.color;
  moodMessage.textContent = detected.message;

  const resultCard = resultSection.querySelector(".result-card");
  if (resultCard) {
    resultCard.style.background = detected.bgColor;
  }

  // Restart bounce animation on emoji
  moodEmoji.style.animation = "none";
  void moodEmoji.offsetWidth; // Trigger reflow
  moodEmoji.style.animation = "bounceEmoji 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

  // Show result
  resultSection.classList.remove("hidden");
}

// 5. Alert Helpers
function showAlert(message) {
  alertMessage.textContent = message;
  alertBox.classList.remove("hidden");
}

function hideAlert() {
  alertBox.classList.add("hidden");
}

// 6. Character Count & Typing Listener
moodInput.addEventListener("input", () => {
  const length = moodInput.value.length;
  charCount.textContent = `${length} / 300`;

  if (length > 0) {
    hideAlert();
  }
});

// 7. Event Listeners
predictBtn.addEventListener("click", handlePredict);

// Allow Enter key to trigger prediction (Shift+Enter for newline)
moodInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handlePredict();
  }
});

// Quick Example Chips
chipButtons.forEach((chip) => {
  chip.addEventListener("click", () => {
    const exampleText = chip.getAttribute("data-text");
    moodInput.value = exampleText;
    charCount.textContent = `${exampleText.length} / 300`;
    hideAlert();
    handlePredict();
  });
});
