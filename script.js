const API_KEY = "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";

async function sendMessage() {
  const input = document.getElementById("userInput").value.trim();
  if (!input) return;

  showMessage(input, "user");
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
        model: "google/gemma-7b-it",
        messages: [
          { role: "system", content: "You are HNIT Help Bot, an assistant for tech and IT queries." },
          { role: "user", content: input }
        ]
      })
    });

    if (!response.ok) {
      const errMsg = `Error: ${response.status} ${response.statusText}`;
      updateLastBotMessage(errMsg);
      return;
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (reply && reply.trim() !== "") {
      updateLastBotMessage(reply);
    } else {
      updateLastBotMessage("Sorry, I didn't quite understand that. Can you try asking differently?");
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