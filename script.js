async function askAI() {
  const userInput = document.getElementById("user").value;
  document.getElementById("chat").innerHTML += `<p><b>You:</b> ${userInput}</p>`;

  const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-base", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: userInput
    })
  });

  const data = await response.json();
  const botReply = data[0]?.generated_text || "Sorry, couldn't get a response.";
  document.getElementById("chat").innerHTML += `<p><b>Bot:</b> ${botReply}</p>`;
  document.getElementById("user").value = "";
}