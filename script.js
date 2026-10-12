// script.js

const socket = io();

// 1. Minta nama, jika kosong panggil "Panda" 🐼
let username = prompt("Siapa nama panggilan lucumu?") || "Panda";
document.getElementById('my-name').textContent = username;

// MENGGUNAKAN API DICEBEAR UNTUK AVATAR EMOJI LUCU!
document.getElementById('my-avatar').src = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${username}&backgroundColor=ffb8d1`;

const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');
const clearBtn = document.getElementById('clear-btn');

function getTime() {
    return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function appendMessage(type, data) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);

    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('bubble');

    if (type === 'other') {
        const nameSpan = document.createElement('span');
        nameSpan.classList.add('sender-name');
        nameSpan.textContent = data.sender;
        bubbleDiv.appendChild(nameSpan);
    }

    const textNode = document.createTextNode(data.text);
    bubbleDiv.appendChild(textNode);

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('timestamp');
    timeSpan.textContent = data.time;
    bubbleDiv.appendChild(timeSpan);

    messageDiv.appendChild(bubbleDiv);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (text === '') return; 

    const msgData = {
        sender: username,
        text: text,
        time: getTime()
    };

    appendMessage('me', msgData);
    socket.emit('chat message', msgData);

    messageInput.value = '';
    messageInput.focus();
    socket.emit('stop typing');
}

socket.on('chat message', (data) => {
    appendMessage('other', data);
    
    // Suara "pop" lucu saat pesan masuk
    const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-30.mp3');
    audio.play().catch(() => {}); 
});

socket.on('typing', (namaOrang) => {
    typingIndicator.innerHTML = `✨ ${namaOrang} lagi ngetik...`;
    typingIndicator.style.color = '#ff6b81'; // Berubah pink saat mengetik
});

socket.on('stop typing', () => {
    typingIndicator.innerHTML = '✨ Online';
    typingIndicator.style.color = '#7bed9f'; 
});

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

let typingTimer;
messageInput.addEventListener('input', () => {
    socket.emit('typing', username);
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        socket.emit('stop typing');
    }, 1500);
});

clearBtn.addEventListener('click', () => {
    chatBox.innerHTML = '';
});