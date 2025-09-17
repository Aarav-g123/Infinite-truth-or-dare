// scripts/would-you-rather.js
document.addEventListener('DOMContentLoaded', async function() {
    const questionElement = document.getElementById('wyr-question');
    const optionABtn = document.getElementById('option-a-btn');
    const optionBBtn = document.getElementById('option-b-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let gameData = null;
    let currentQuestion = null;

    // Set initial button states
    optionABtn.disabled = true;
    optionBBtn.disabled = true;
    nextBtn.disabled = true;
    questionElement.textContent = "Loading game data...";
    questionElement.classList.remove('error');
    questionElement.classList.add('loading');

    try {
        // Load game data
        gameData = await GameManager.loadGameData('would-you-rather');
        console.log('Would You Rather data loaded successfully:', gameData);
        
        if (!gameData || !gameData.questions || gameData.questions.length === 0) {
            throw new Error('Loaded data is invalid or empty');
        }
        
        loadNewQuestion();
        questionElement.classList.remove('loading');
        questionElement.classList.remove('error');
        optionABtn.disabled = false;
        optionBBtn.disabled = false;
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
        
        currentQuestion = GameManager.getRandomItem(gameData.questions);
        questionElement.textContent = `Would you rather...`;
        optionABtn.textContent = currentQuestion.optionA;
        optionBBtn.textContent = currentQuestion.optionB;
        
        // Reset button styles
        optionABtn.classList.remove('selected');
        optionBBtn.classList.remove('selected');
    }

    // Event listeners
    optionABtn.addEventListener('click', () => {
        optionABtn.classList.add('selected');
        optionBBtn.classList.remove('selected');
    });

    optionBBtn.addEventListener('click', () => {
        optionBBtn.classList.add('selected');
        optionABtn.classList.remove('selected');
    });

    nextBtn.addEventListener('click', () => {
        loadNewQuestion();
    });
});