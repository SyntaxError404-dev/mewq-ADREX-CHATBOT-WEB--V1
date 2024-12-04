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
        let textPart = response;
        let imageUrl = '';

        // Extract the image URL using a regular expression to find markdown image links
        const imageMatch = textPart.match(/!\[.*?\]\((https:\/\/[^\s)]+)\)/);
        if (imageMatch) {
            imageUrl = imageMatch[1];
            textPart = textPart.replace(imageMatch[0], '').trim(); // Remove the markdown link from the text
        }

        if (textPart) {
            const formattedText = formatText(textPart);
            addMessage(formattedText, 'bot');
        }

        if (imageUrl) {
            addImage(imageUrl);
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

    function addImage(url) {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'image-message';
        imageDiv.innerHTML = `<img src="${url}" alt="Generated Image" style="max-width: 100%;"/>`;
        chatMessages.appendChild(imageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
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
