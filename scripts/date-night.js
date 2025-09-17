// scripts/date-night.js
document.addEventListener('DOMContentLoaded', async function() {
    const questionElement = document.getElementById('date-night-question');
    const nextBtn = document.getElementById('next-btn');
    
    let gameData = null;

    // Set initial button states
    nextBtn.disabled = true;
    questionElement.textContent = "Loading game data...";
    questionElement.classList.remove('error');
    questionElement.classList.add('loading');

    try {
        // Load game data
        gameData = await GameManager.loadGameData('date-night');
        console.log('Date Night data loaded successfully:', gameData);
        
        if (!gameData || !gameData.questions || gameData.questions.length === 0) {
            throw new Error('Loaded data is invalid or empty');
        }
        
        loadNewQuestion();
        questionElement.classList.remove('loading');
        questionElement.classList.remove('error');
        nextBtn.disabled = false;
    } catch (error) {
        console.error('Error loading game data:', error);
        questionElement.textContent = 'Error: Failed to load game data. Please check console for details.';
        questionElement.classList.remove('loading');
        questionElement.classList.add('error');
        
        // Add retry button dynamically
        if (!document.getElementById('retry-btn')) {
            const retryBtn = document.createElement('button');
            retryBtn.id = 'retry-btn';
            retryBtn.className = 'btn';
            retryBtn.textContent = 'Retry Loading';
            retryBtn.addEventListener('click', () => {
                window.location.reload();
            });
            questionElement.parentNode.insertBefore(retryBtn, questionElement.nextSibling);
        }
        
        return;
    }

    function loadNewQuestion() {
        if (!gameData || !gameData.questions || gameData.questions.length === 0) {
            questionElement.textContent = "No questions available";
            return;
        }
        
        const randomQuestion = GameManager.getRandomItem(gameData.questions);
        questionElement.textContent = randomQuestion;
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        loadNewQuestion();
    });
});