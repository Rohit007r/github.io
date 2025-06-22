const API_KEY = "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";

// Full chat history for context
let chatHistory = [
  { role: "system", content: "You are HNIT Help Bot, an assistant for tech and IT queries like VPN, laptop, internet, etc. Give simple and helpful replies." }
];

async function sendMessage() {
  const input = document.getElementById("userInput").value.trim();
  if (!input) return;

  showMessage(input, "user");
  chatHistory.push({ role: "user", content: input });
  document.getElementById("userInput").value = "";
  showMessage("Thinking...", "bot", true);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-7b-it", // You can try "openchat/openchat-7b" if needed
        messages: chatHistory
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (reply && reply.trim() !== "") {
      updateLastBotMessage(reply);
      chatHistory.push({ role: "assistant", content: reply }); // Add AI reply to history
    } else {
      updateLastBotMessage("Sorry, I didn't quite understand that.");
    }

  } catch (error) {
    updateLastBotMessage("Error: " + error.message);
  }
}

function showMessage(text, sender, isTemporary = false) {
  const messageElem = document.createElement("div");
  messageElem.className = "bubble " + sender;
  messageElem.textContent = text;
  if (isTemporary) messageElem.id = "temp";
  document.getElementById("messages").appendChild(messageElem);
}

function updateLastBotMessage(text) {
  const temp = document.getElementById("temp");
  if (temp) {
    temp.textContent = text;
    temp.id = "";
  }
}