const fs = require('fs');
const path = require('path');

// In-memory store for short-term conversation context (Last 8 messages)
const memoryStore = {};

// Simple file-based key-value store for long-term memory (user preferences)
const LONG_TERM_MEMORY_FILE = path.join(__dirname, 'long_term_memory.json');

function initLongTermMemory() {
    if (!fs.existsSync(LONG_TERM_MEMORY_FILE)) {
        fs.writeFileSync(LONG_TERM_MEMORY_FILE, JSON.stringify({}));
    }
}
initLongTermMemory();

function getLongTermMemory() {
    const data = fs.readFileSync(LONG_TERM_MEMORY_FILE, 'utf8');
    return JSON.parse(data || '{}');
}

function saveLongTermMemory(data) {
    fs.writeFileSync(LONG_TERM_MEMORY_FILE, JSON.stringify(data, null, 2));
}

function addMessage(userId, messageObj) {
    if (!memoryStore[userId]) {
        memoryStore[userId] = [];
    }
    
    memoryStore[userId].push(messageObj);

    // Keep only the last 14 messages (approx 7 conversation turns)
    if (memoryStore[userId].length > 14) {
        memoryStore[userId] = memoryStore[userId].slice(-14);
    }
}

function getHistory(userId) {
    return memoryStore[userId] || [];
}

// Very basic extraction logic for long-term preferences
function extractAndStorePreferences(userId, message) {
    const lowerMsg = message.toLowerCase();
    let memoryUpdated = false;

    const data = getLongTermMemory();
    if (!data[userId]) {
        data[userId] = { goals: [] };
    }

    if (lowerMsg.includes('i want to') || lowerMsg.includes('my goal is')) {
        data[userId].goals.push(message);
        memoryUpdated = true;
    }

    if (memoryUpdated) {
        const uniqueGoals = [...new Set(data[userId].goals)].slice(-5); // Keep max 5 distinct entries
        data[userId].goals = uniqueGoals;
        saveLongTermMemory(data);
    }
}

function getUserPreferences(userId) {
    initLongTermMemory();
    const data = getLongTermMemory();
    if (data[userId] && data[userId].goals) {
        return data[userId].goals;
    }
    return [];
}

module.exports = {
    addMessage,
    getHistory,
    extractAndStorePreferences,
    getUserPreferences
};
