document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('prompt-input');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const chatHistory = document.getElementById('chat-history');
    const statusOverlay = document.getElementById('status-overlay');
    const statusText = document.getElementById('status-text');
    const currentJobId = document.getElementById('current-job-id');
    const template = document.getElementById('message-template');
    
    // Stats
    const statInputTokens = document.getElementById('stat-input-tokens');
    const statOutputTokens = document.getElementById('stat-output-tokens');
    let totalInput = 0;
    let totalOutput = 0;

    // Chat context state
    let messages = [];

    // Setup Textarea auto-resize
    input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if(this.value.trim() === "") {
            this.style.height = 'auto'; // reset
        }
    });

    // Handle Enter key (Shift+Enter for new line)
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.value.trim() !== '') {
                form.dispatchEvent(new Event('submit'));
            }
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const prompt = input.value.trim();
        if (!prompt) return;

        // Reset input
        input.value = '';
        input.style.height = 'auto';
        
        // Add User Message to UI
        appendMessage('user', prompt);

        // Prepare request
        const requestBody = {
            prompt: prompt,
            messages: messages.length > 0 ? messages : undefined
        };

        // Disable input
        setLoading(true);

        try {
            // 1. Gửi câu hỏi (Tạo Job)
            const res = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!res.ok) throw new Error(`API Error: ${res.status}`);
            const data = await res.json();
            
            if (data.jobId) {
                // 2. Bắt đầu Polling
                await pollJob(data.jobId, prompt);
            } else {
                throw new Error("No Job ID returned");
            }
        } catch (error) {
            console.error(error);
            appendMessage('system-message', `Error: ${error.message}`);
            setLoading(false);
        }
    });

    async function pollJob(jobId, originalPrompt) {
        currentJobId.textContent = jobId;
        statusOverlay.classList.remove('hidden');
        statusText.textContent = "Waiting in queue...";

        const pollInterval = setInterval(async () => {
            try {
                const res = await fetch(`/api/job/${jobId}`);
                if (!res.ok) throw new Error(`Polling Error: ${res.status}`);
                const data = await res.json();

                if (data.status === 'active') {
                    statusText.textContent = "AI is thinking...";
                } else if (data.status === 'completed') {
                    clearInterval(pollInterval);
                    handleSuccess(data.result, originalPrompt);
                } else if (data.status === 'failed') {
                    clearInterval(pollInterval);
                    handleFailure(data.reason || "Job failed");
                }
            } catch (error) {
                clearInterval(pollInterval);
                console.error(error);
                handleFailure(error.message);
            }
        }, 2000); // Poll mỗi 2 giây
    }

    function handleSuccess(result, originalPrompt) {
        statusOverlay.classList.add('hidden');
        setLoading(false);

        // Cập nhật history gửi đi lần sau
        messages.push({ role: 'user', content: originalPrompt });
        messages.push({ role: 'assistant', content: result.answer });

        // Cập nhật UI
        appendMessage('assistant', result.answer, {
            fromCache: result.fromCache,
            toolNames: result.toolNames,
            inputTokens: result.inputTokens,
            outputTokens: result.outputTokens
        });

        // Cập nhật Stats
        if (result.inputTokens) {
            totalInput += result.inputTokens;
            statInputTokens.textContent = totalInput.toLocaleString();
        }
        if (result.outputTokens) {
            totalOutput += result.outputTokens;
            statOutputTokens.textContent = totalOutput.toLocaleString();
        }
    }

    function handleFailure(reason) {
        statusOverlay.classList.add('hidden');
        setLoading(false);
        appendMessage('system-message', `Job Failed: ${reason}`);
    }

    function appendMessage(role, text, metadata = null) {
        if (role === 'system-message') {
            const div = document.createElement('div');
            div.className = 'message system-message';
            div.innerHTML = `<div class="message-content">${text}</div>`;
            chatHistory.appendChild(div);
        } else {
            const clone = template.content.cloneNode(true);
            const msgDiv = clone.querySelector('.message');
            msgDiv.classList.add(role);
            
            clone.querySelector('.role').textContent = role === 'user' ? 'You' : 'AI Assistant';
            clone.querySelector('.message-content').textContent = text; // Ngừa XSS

            if (metadata && role === 'assistant') {
                const metaDiv = clone.querySelector('.message-metadata');
                metaDiv.classList.remove('hidden');

                if (metadata.fromCache) {
                    clone.querySelector('.cache-badge').classList.remove('hidden');
                }
                
                if (metadata.toolNames && metadata.toolNames.length > 0) {
                    const toolBadge = clone.querySelector('.tool-badge');
                    toolBadge.classList.remove('hidden');
                    toolBadge.querySelector('.tool-names').textContent = metadata.toolNames.join(', ');
                }

                if (metadata.inputTokens !== null && metadata.outputTokens !== null) {
                    clone.querySelector('.token-count').textContent = 
                        `${metadata.inputTokens} in / ${metadata.outputTokens} out`;
                } else {
                    clone.querySelector('.tokens-badge').classList.add('hidden');
                }
            }

            chatHistory.appendChild(clone);
        }

        // Auto scroll to bottom
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function setLoading(isLoading) {
        input.disabled = isLoading;
        submitBtn.disabled = isLoading;
        if (isLoading) {
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');
        } else {
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
            input.focus();
        }
    }
});
