document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    let messages = [];

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        // Add user message to chat
        addMessage('You: ' + userMessage, 'user');
        chatInput.value = '';

        // Add to messages for API
        messages.push({ role: 'user', content: userMessage });

        // Show loading
        const loadingDiv = document.createElement('div');
        loadingDiv.textContent = 'AI is thinking...';
        loadingDiv.className = 'loading';
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Call API
        fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer cEgo1cqyfWjfh6BktMdu3dBvUaVhsmPt'
            },
            body: JSON.stringify({
                model: 'mistral-large-latest',
                messages: messages,
                max_tokens: 500
            })
        })
        .then(response => response.json())
        .then(data => {
            // Remove loading
            chatMessages.removeChild(loadingDiv);

            if (data.choices && data.choices[0]) {
                const aiMessage = data.choices[0].message.content;
                addMessage('AI: ' + aiMessage, 'ai');
                messages.push({ role: 'assistant', content: aiMessage });
            } else {
                addMessage('AI: Sorry, I couldn\'t process your request.', 'ai');
            }
        })
        .catch(error => {
            // Remove loading
            chatMessages.removeChild(loadingDiv);
            addMessage('AI: Error connecting to AI service.', 'ai');
            console.error('Error:', error);
        });
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = text;
        messageDiv.className = sender;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Back to Top functionality
    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark');
        themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    });
});