const axios = require('axios');

async function callGroqAPI(systemPrompt, history) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error('GROQ_API_KEY is not defined in environment variables');
    }

    const messages = [
        { role: 'system', content: systemPrompt },
        ...history
    ];

    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.1-8b-instant',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1024
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        let content = response.data.choices[0].message.content;

        // Logical enforcement of the ||| break rule at natural pauses
        // Small LLMs often forget to put them on *every* paragraph.
        const paragraphs = content.split('\n\n');
        const processedParagraphs = paragraphs.map(p => {
            if (p.trim().length > 0 && !p.includes('|||')) {
                return p + ' |||';
            }
            return p;
        });

        return processedParagraphs.join('\n\n');
    } catch (error) {
        console.error('Error calling Groq API:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = { callGroqAPI };
