const express = require('express');
const router = express.Router();
const { isCareerQuery, determineModifiers, buildSystemPrompt } = require('../utils/personality');
const { callGroqAPI } = require('../services/llm');
const { addMessage, getHistory, extractAndStorePreferences, getUserPreferences } = require('../memory/store');

router.post('/', async (req, res) => {
    try {
        const { message, userId = 'default_user' } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // 1. Save user message to history
        addMessage(userId, { role: 'user', content: message });

        // 2. Classify Message
        const isCareer = isCareerQuery(message);

        // 3. Extract and store preferences (Long-term memory bonus)
        extractAndStorePreferences(userId, message);
        const preferences = getUserPreferences(userId);

        // 4. Determine Random Modifiers
        const modifiers = determineModifiers();

        // 5. Build dynamic system prompt
        const systemPrompt = buildSystemPrompt(isCareer, modifiers, preferences);

        // 6. Get Context History (Includes the new user message)
        const history = getHistory(userId); 

        // 7. Call LLM API
        const botResponse = await callGroqAPI(systemPrompt, history);

        // 8. Save bot response to history
        addMessage(userId, { role: 'assistant', content: botResponse });

        // 9. Return response
        res.json({ response: botResponse });

    } catch (error) {
        console.error('Error in /chat endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
