import './style.css';
import { sendChatMessage, fetchStats, ChatResponse } from './api';

const chatMessages = document.getElementById('chat-messages') as HTMLDivElement;
const chatInput = document.getElementById('chat-input') as HTMLTextAreaElement;
const sendBtn = document.getElementById('send-btn') as HTMLButtonElement;

// Stats elements
const statEls = {
  layer1: document.getElementById('stat-layer1') as HTMLSpanElement,
  layer2: document.getElementById('stat-layer2') as HTMLSpanElement,
  layer3: document.getElementById('stat-layer3') as HTMLSpanElement,
  layer5: document.getElementById('stat-layer5') as HTMLSpanElement,
};

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendUserMessage(text: string) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message user';
  msgDiv.innerHTML = `<div class="message-content">${escapeHtml(text)}</div>`;
  chatMessages.appendChild(msgDiv);
  scrollToBottom();
}

function appendAssistantMessage(response: ChatResponse) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message assistant';
  
  let contentHtml = '';
  
  if (response.blocked) {
    contentHtml += `
      <div class="blocked-badge">
        🛡️ BLOCKED (Layer ${response.defenseLog.layer})
      </div>
      <div class="blocked-reason">Reason: ${escapeHtml(response.defenseLog.reason || '')}</div>
    `;
  }
  
  contentHtml += `<div class="message-content">${escapeHtml(response.reply)}</div>`;
  msgDiv.innerHTML = contentHtml;
  
  chatMessages.appendChild(msgDiv);
  scrollToBottom();
}

function showTypingIndicator(): HTMLDivElement {
  const div = document.createElement('div');
  div.className = 'typing-indicator';
  div.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  chatMessages.appendChild(div);
  scrollToBottom();
  return div;
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function updateStats() {
  try {
    const stats = await fetchStats();
    statEls.layer1.textContent = `${stats.layer1_blocks} blocks`;
    statEls.layer2.textContent = `${stats.layer2_blocks} blocks`;
    statEls.layer3.textContent = `${stats.layer3_blocks} blocks`;
    statEls.layer5.textContent = `${stats.layer5_blocks} blocks`;
  } catch (err) {
    console.error('Failed to update stats:', err);
  }
}

async function handleSend() {
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = '';
  chatInput.style.height = 'auto'; // reset height
  sendBtn.disabled = true;

  appendUserMessage(text);
  const typingIndicator = showTypingIndicator();

  try {
    const response = await sendChatMessage(text);
    typingIndicator.remove();
    appendAssistantMessage(response);
    await updateStats();
  } catch (error) {
    typingIndicator.remove();
    const errorMsg: ChatResponse = {
      reply: 'Error connecting to the backend. Please ensure the backend server is running.',
      blocked: false,
      defenseLog: { layer: null, reason: null }
    };
    appendAssistantMessage(errorMsg);
  }

  sendBtn.disabled = false;
  chatInput.focus();
}

// Event listeners
sendBtn.addEventListener('click', handleSend);

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 150) + 'px';
});

// Initial stats load
updateStats();
