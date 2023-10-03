// Função para enviar uma mensagem
function sendMessage() {
  const numberInput = document.getElementById("number");
  const messageInput = document.getElementById("message");
  const number = numberInput.value;
  const message = messageInput.value;
  console.log(message);

  if (number.trim() !== "" && message.trim() !== "") {
    appendMessage("Usuário: " + message);
    console.log(numberInput);
    console.log(messageInput);
    numberInput.value = "";
    messageInput.value = "";

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var data = JSON.stringify({
      id: number,
      text: message,
    });
    console.log(data);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: data,
    };
    console.log(requestOptions);
    fetch("http://localhost:3333/message/text?key=2801", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }
}
// Função para receber uma resposta da API (simulada)
function getResponseFromAPI() {
  const response = "Cliente: Olá! Como posso ajudá-lo?";
  appendMessage(response);
}

// Função para adicionar mensagens ao chat
function appendMessage(message) {
  const chat = document.getElementById("chat");
  const messageDiv = document.createElement("div");
  messageDiv.textContent = message;
  chat.appendChild(messageDiv);
  chat.scrollTop = chat.scrollHeight;
}

getResponseFromAPI();
