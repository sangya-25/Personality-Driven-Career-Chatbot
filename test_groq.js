require('dotenv').config();
const { callGroqAPI } = require('./services/llm');

async function test() {
    try {
        const result = await callGroqAPI('You are a test bot', [{role: 'user', content: 'hello'}]);
        console.log('SUCCESS:', result);
    } catch (e) {
        console.error('FAILED:', e.response?.data || e.message);
    }
}
test();
