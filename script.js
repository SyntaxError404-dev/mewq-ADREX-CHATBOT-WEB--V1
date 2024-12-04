document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const userIdSpan = document.getElementById('userId');

    const userId = Math.floor(Math.random() * 1000000);
    userIdSpan.textContent = `User ID: ${userId}`;

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        userInput.value = '';

        showTypingIndicator();

        try {
            const response = await fetch(`https://adrex-chat-bot-v1-by-nzr.onrender.com/adrex?ask=${encodeURIComponent(message)}&id=${userId}`);
            if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
            const textResponse = await response.text();

            setTimeout(() => {
                hideTypingIndicator();
                processResponse(textResponse);
            }, 1000 + Math.random() * 1000);
        } catch (error) {
            console.error('Error processing request:', error);
            hideTypingIndicator();
            addMessage(`Sorry, there was an error processing your request: ${error.message}`, 'bot');
        }
    }

    function processResponse(response) {
        const imageLinkMatch = response.match(/!\[Generated Image for (.*?)\]\((.*?)\)/);
        
        if (imageLinkMatch) {
            const promptText = imageLinkMatch[1];
            const imageUrl = imageLinkMatch[2];
            downloadAndDisplayImage(imageUrl, promptText, 'bot');
        } else {
            addMessage('No image found in the response.', 'bot');
        }
    }

    async function downloadAndDisplayImage(url, promptText, sender) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to download image: ${response.statusText}`);
            
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            messageDiv.innerHTML = `<div class="message-content"><strong>Generated Image for ${promptText}:</strong><br><img src="${imageUrl}" alt="Image" class="chat-image"/></div>`;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            messageDiv.querySelector('.message-content').style.animation = 'fadeIn 0.5s forwards';
            messageDiv.querySelector('.chat-image').addEventListener('click', () => showImagePreview(imageUrl));
        } catch (error) {
            addMessage('Failed to load image.', sender);
        }
    }

    function formatText(text) {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\s*\n/g, '<br><br>');
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        messageDiv.querySelector('.message-content').style.animation = 'fadeIn 0.5s forwards';
    }

    function showImagePreview(imageUrl) {
        const previewContainer = document.createElement('div');
        previewContainer.className = 'image-preview';
        previewContainer.innerHTML = `<img src="${imageUrl}" alt="Preview"><span class="close-preview">&times;</span>`;
        document.body.appendChild(previewContainer);
        previewContainer.style.display = 'flex';

        previewContainer.querySelector('.close-preview').addEventListener('click', () => {
            document.body.removeChild(previewContainer);
        });
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    setTimeout(() => {
        addMessage("Hello! I'm Adrex. How can I assist you today?", 'bot');
    }, 1000);
});
