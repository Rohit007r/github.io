async function askAI() {
  const userInput = document.getElementById("user").value;
  const chat = document.getElementById("chat");

  if (!userInput.trim()) return;

  // Show user input
  chat.innerHTML += `<p class="user"><b>You:</b> ${userInput}</p>`;

  // Show loading
  chat.innerHTML += `<p class="bot" id="loading"><b>Bot:</b> Thinking...</p>`;
  chat.scrollTop = chat.scrollHeight;

  try {
    const response = await fetch("https://hf.space/embed/mistralai/Mistral-7B-Instruct-v0.1/+/api/predict/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: [userInput]
      })
    });

    const data = await response.json();
    const botReply = data.data[0] || "Sorry, I couldn't get a response.";

    document.getElementById("loading").remove();
    chat.innerHTML += `<p class="bot"><b>Bot:</b> ${botReply}</p>`;
    document.getElementById("user").value = "";
    chat.scrollTop = chat.scrollHeight;
  } catch (error) {
    document.getElementById("loading").remove();
    chat.innerHTML += `<p class="bot"><b>Bot:</b> Error connecting to AI.</p>`;
  }
}