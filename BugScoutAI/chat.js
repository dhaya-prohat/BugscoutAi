const chatBox = document.getElementById('chat-box');
const inputForm = document.getElementById('input-form');
const userInput = document.getElementById('user-input');

let isLoading = false;

inputForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const userMessage = userInput.value.trim();
    if (!userMessage || isLoading) return;

    addMessage('user', userMessage);
    userInput.value = '';

    showLoading();

    setTimeout(() => {
        fetch("http://127.0.0.1:8000/api/chat/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: userMessage }),
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Server response wasn't OK");
            }
            return res.json();
        })
        .then((data) => {
            hideLoading();
            addMessage('bot', data.reply); // use the correct key based on backend response
        })
        .catch((err) => {
            hideLoading();
            addMessage('bot', "Error: Unable to fetch response from server.");
            console.error("[FETCH ERROR]", err);
        });
    }, 1000);
});

function addMessage(role, text) {
    const message = document.createElement('div');
    message.classList.add('message', role);

    const icon = document.createElement('span');
    icon.classList.add(role === 'user' ? 'user-icon' : 'bot-icon');

    const content = document.createElement('div');
    content.classList.add('message-content');
    content.textContent = text;

    message.appendChild(icon);
    message.appendChild(content);

    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showLoading() {
    isLoading = true;
    
    const loadingMessage = document.createElement('div');
    loadingMessage.id = 'loading';
    loadingMessage.classList.add('message', 'bot', 'loading');

    loadingMessage.innerHTML = `
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    `;

    chatBox.appendChild(loadingMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideLoading() {
    isLoading = false;
    const loadingElement = document.getElementById('loading');
    if (loadingElement) loadingElement.remove();
}
