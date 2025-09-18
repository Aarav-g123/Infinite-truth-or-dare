# Infinite Truth-or-Dare - Setup Instructions

## Prerequisites
1. **Node.js** (v14 or higher)  
2. **An OpenAI API key**

---

## Installation Steps

### 1. Clone the repository:
```bash
git clone https://github.com/Aarav-g123/Infinite-truth-or-dare.git
cd Infinite-truth-or-dare
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Set up environment variables:
- Copy the `.env.example` file to `.env`  
- Add your OpenAI API key to the `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run the application:

#### Option 1: Direct File Access *(Limited Functionality)*
Open `index.html` directly in your browser.  
⚠️ Some features may not work due to browser security restrictions.  

#### Option 2: Local Server *(Recommended)*
Run a local server using one of these methods:

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js:**
```bash
npx http-server
```

**Using PHP:**
```bash
php -S localhost:8000
```

Then open your browser and navigate to:  
👉 [http://localhost:8000](http://localhost:8000)

---

## AI Features Setup
The AI functionality requires:
1. A valid **OpenAI API key** in your `.env` file  
2. Running the application through a **local server** (not direct file access)  
3. **Internet connection** for API calls  

---

## Troubleshooting
1. If buttons aren’t working, check the **browser console** for error messages  
2. Ensure your **OpenAI API key** is valid and has available credits  
3. Make sure you’re running the application through a **local server**, not directly opening HTML files  

---

## Data Format
Questions are stored in JSON files in the `data/` directory with the following structure:

```json
{
  "truth": [
    "Question 1",
    "Question 2"
  ],
  "dare": [
    "Dare 1",
    "Dare 2"
  ]
}
```

AI-generated questions are saved to **localStorage** and persist between sessions.
