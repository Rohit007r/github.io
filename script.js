const API_KEY = "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"; // Your OpenRouter key
let chatHistory = [
  {
    role: "system",
    content: "You are HNIT Help Bot, assisting with technical queries like VPN, internet, devices, emails, and IT issues. Give short, helpful, and clear replies."
  }
];

async function sendMessage() {
  const input = document.getElementById("userInput").value.trim();
  if (!input) return;

  showMessage(input, "user");
  chatHistory.push({ role: "user", content: input });
  document.getElementById("userInput").value = "";
  showMessage("Typing...", "bot", true);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openchat/openchat-7b:free", // Free and good quality
        messages: chatHistory
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "Sorry, I didn't get that.";
    updateLastBotMessage(reply);
    chatHistory.push({ role: "assistant", content: reply });
  } catch (error) {
    updateLastBotMessage("Error: " + error.message);
  }
}

function showMessage(text, sender, isTemporary = false) {
  const message = document.createElement("div");
  message.className = "bubble " + sender;
  message.textContent = text;
  if (isTemporary) message.id = "temp";
  document.getElementById("messages").appendChild(message);
}

function updateLastBotMessage(text) {
  const temp = document.getElementById("temp");
  if (temp) {
    temp.textContent = text;
    temp.id = "";
  }
}