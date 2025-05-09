let inactivityTimer;
const maxMessages = 20;
const inactivityTimeout = 5 * 60 * 1000; // 5 min

function initChatWidget() {
    const chatButton = document.getElementById('chat-button');
    const chatWindow = document.getElementById('chat-window');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-user-input');
    const sendButton = document.getElementById('send-chat');
    const minimizeButton = document.getElementById('minimize-chat');
    const closeButton = document.getElementById('close-chat');

    chatButton.addEventListener('click', () => openChat(chatWindow));
    minimizeButton.addEventListener('click', () => minimizeChat(chatWindow));
    closeButton.addEventListener('click', () => closeChat(chatWindow, chatMessages));
    sendButton.addEventListener('click', () => sendMessage(chatInput, chatMessages));
    chatInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage(chatInput, chatMessages);
    });
}

function openChat(chatWindow) {
    chatWindow.style.display = 'flex';
    resetInactivityTimer();
}

function minimizeChat(chatWindow) {
    chatWindow.style.display = 'none';
}

function closeChat(chatWindow, chatMessages) {
    chatWindow.style.display = 'none';
    chatMessages.innerHTML = '<div class="chat-message bot">Hello, I\'m your AI assistance. Please put your question in the chat prompt.</div>';
    clearTimeout(inactivityTimer);
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = '<div class="chat-message bot">Session expired. Please refresh to start again.</div>';
    }, inactivityTimeout);
}

function appendMessage(text, sender, chatMessages) {
    const msg = document.createElement('div');
    msg.classList.add('chat-message', sender);
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const msgs = chatMessages.querySelectorAll('.chat-message');
    if (msgs.length > maxMessages) {
        chatMessages.removeChild(msgs[0]);
    }
}

function sendMessage(chatInput, chatMessages) {
    const userInput = chatInput.value.trim();
    if (!userInput) return;

    appendMessage(userInput, 'user', chatMessages);
    chatInput.value = '';
    resetInactivityTimer();

    fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: userInput})
    })
    .then(response => response.json())
    .then(data => {
        appendMessage(data.reply || 'No response from server.', 'bot', chatMessages);
    })
    .catch(() => {
        appendMessage('Error contacting server.', 'bot', chatMessages);
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initChatWidget);

