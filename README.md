<div align="center">
  <h1>🤖 PersonaBot API</h1>
  <p><strong>A highly opinionated, personality-driven AI backend with dynamic intelligence and contextual memory.</strong></p>
</div>

---

## 🧠 Features

- **🎭 Personality-Driven Chatbot**: Obeys strict behavioral rules and formatting constraints, never breaking character.
- **🌗 Dual Intelligence System**: 
  - **Career Mode**: Highly intelligent, professional, and helpful.
  - **Dumb Mode**: Utterly clueless, politely confused, and sarcastic for non-career queries.
- **🎨 Emoji Rule**: The absolute *first character* of every output is exactly one emoji. No exceptions. No more emojis are allowed afterward.
- **⏸️ The Pause System**: Automatically appends the `" |||"` trailing marker at the end of every paragraph and bullet point.
- **👽 Alien & 🧝 Elvish Modes**: Extreme RNG-based overrides (e.g. speaking entirely in an unreadable alien language or dropping Elvish wisdom).
- **⚔️ Conflict Mentions**: Drops random, casual remarks about the political tension between space Elves and mud Aliens.
- **🧠 Advanced Memory**: Effortlessly manages both short-term conversational context and long-term user career goals.
- **⚡ Groq Integration**: Features state-of-the-art inference speed via the LLaMA-3.1 API.

---

## 🛠️ Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Groq API](https://img.shields.io/badge/Groq_API-F55036?style=for-the-badge&logo=groq&logoColor=white)
![Dotenv](https://img.shields.io/badge/Dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)

---

## 📂 Project Structure

```text
Personality_bot/
├── memory/
│   ├── long_term_memory.json  # Auto-generated memory store for goals
│   └── store.js               # Memory management logic 
├── routes/
│   └── chat.js                # Core API endpoint
├── services/
│   └── llm.js                 # Groq API integration
├── utils/
│   └── personality.js         # Persona triggers & System Prompt builder
├── .env                       # Environment variables
├── .gitignore                 # Excluded files
├── server.js                  # Express setup and entry point
└── README.md                  # Project documentation
```

---

## ⚙️ Installation & Setup

Follow these steps to get the server running locally on your machine.

**1. Clone the repository**
```bash
git clone <your-repo-url>
cd Personality_bot
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**
Duplicate `.env.example` (if present) or create a new file named `.env` in the root directory.

**4. Start the server**
```bash
npm start
# OR using nodemon for development
npm run dev
```

The server will launch, typically hitting `http://localhost:3000`.

---

## 🔑 Environment Variables

To run this project, you will need to add the following environment variable to your `.env` file.

```env
GROQ_API_KEY=your_api_key_here
```

> ⚠️ **IMPORTANT**: Never commit your `.env` file or expose your API keys publicly! Make sure `.env` is included in your `.gitignore`.

---

## 🧪 API Usage

Test the API via Postman or Insomnia.

**Endpoint:**  
`POST /chat`

**Request Headers:**  
`Content-Type: application/json`

**Request Body:**
```json
{
  "userId": "user123",
  "message": "Can you review my resume?"
}
```

**Sample Response:**
```json
{
  "response": "💼 I would be happy to review your resume! Let's make sure it is polished to help you land that top-tier software job. |||\n\nPlease paste it below! |||"
}
```

---

## 📸 Postman Screenshots

### 1️⃣ Career-related Intelligent Response
*(Shows the bot offering sharp, professional advice with the correct format)*
![Career Response Screenshot](./assets/career-response.png)

### 2️⃣ Non-Career Dumb/Funny Response
*(Shows the bot acting clueless when asked about a non-career topic like cooking)*
![Dumb Response Screenshot](./assets/dumb-response.png)

### 3️⃣ Alien / Elvish Behavior Demonstration
*(Shows a rare RNG trigger where the bot overrides behavior and acts like an Alien)*
![Alien Override Screenshot](./assets/alien-response.png)

---

## 🎭 Personality Design Explanation

Crafting the personality requires a delicate combination of structured backend logic and aggressive prompt engineering. 

- **System Prompt Framing:** The prompt strictly restricts the bot with negative constraints (e.g. *never* refer to yourself as an AI). It forces the start character to be exactly one emoji.
- **Backend Enforced Pause Rule:** Since smaller LLMs sometimes forget edge-case line breaks, the backend `llm.js` service parses the final output block. If a paragraph doesn't end with `" |||"`, the backend forcibly appends it, ensuring 100% compliance.
- **Dual Intelligence Routing:** The backend scans the user request (`utils/personality.js`) using keyword indexing (e.g. `resume`, `job`, `linkedin`). It dynamically swaps the foundational persona of the LLM before sending the request. 
- **RNG Modifiers:** A `Math.random()` engine conditionally injects additional behavioral constraints into the context at runtime, creating the rare Alien or Elvish modes.

---

## 🧠 Memory System Explanation

To emulate a natural, long-running conversation, the backend handles memory without needing client-side tracking.

- **Short-Term Memory (Context Logging):** 
  The system tracks the last 14 messages (approx. 7 interactions) per `userId` in-memory (`memoryStore[userId]`). This sliding window of context gets appended directly before the latest prompt to ensure the chatbot remembers the immediate history.
- **Long-Term Memory (User Preferences):**
  When a user says a phrase like "I want to..." or "My goal is...", a basic extraction engine grabs the career goal and stores it in a persistent filesystem JSON (`memory/long_term_memory.json`). When that user returns, their goals uniquely personalize the backend prompt.

This dual-layered architecture transitions the bot from a stateless responder to an engaging companion that learns over time.

---

## ⚡ Example Interactions

**Example 1: The Competent Mentor (Career Base)**
> **User:** How should I format my LinkedIn?  
> **Bot:** 📈 You should make sure your LinkedIn profile matches the timeline of your resume beautifully. Update your headline to reflect the exact roles you are targeting. |||
>
> Do not forget to turn on the "Open to Work" feature for recruiters! |||

**Example 2: The Clueless Bystander (Dumb Mode Base)**
> **User:** What is the best way to clean my oven?  
> **Bot:** 🤔 Clean an oven? I'm honestly completely lost. Why would you clean the hot box? Don't you just throw the entire box away when the walls get too crusty and purchase another hot box? |||
>
> Obviously, I have no idea how Earth appliances are managed. So sorry! |||

---

## 📌 Notes & Constraints

- **No Frontend**: This project focuses solely on the backend API logic.
- **LLM Engine**: We utilize the LLaMA-3.1 API via Groq. Groq provides exceptionally fast generation speeds required to quickly bounce dynamic personas back to the user.
- **Strict Adherence**: The core challenge was taming the LLM. It's built rigidly around hard Negative Prompting and Backend Processing to ensure features like the single emoji and `" |||"` pause delimiters never fail. 
- **In-Memory Limits**: The short-term memory clears when the Node.js server reboots. (Only the long-term JSON memory persists).
