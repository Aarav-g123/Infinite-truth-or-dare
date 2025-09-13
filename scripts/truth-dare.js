// scripts/truth-dare.js
document.addEventListener('DOMContentLoaded', async function() {
    const questionElement = document.getElementById('truth-dare-question');
    const truthBtn = document.getElementById('truth-btn');
    const dareBtn = document.getElementById('dare-btn');
    const nextBtn = document.getElementById('next-btn');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    let gameData = null;
    let currentCategory = 'all';

    // Set initial button states
    truthBtn.disabled = true;
    dareBtn.disabled = true;
    nextBtn.disabled = true;
    questionElement.textContent = "Loading game data...";
    questionElement.classList.remove('error');
    questionElement.classList.add('loading');

    try {
        // Load game data
        gameData = await GameManager.loadGameData('truth-dare');
        console.log('Truth or Dare data loaded successfully:', gameData);
        
        if (!gameData || (!gameData.truth && !gameData.dare)) {
            throw new Error('Loaded data is invalid or empty');
        }
        
        questionElement.textContent = "Choose Truth or Dare to start playing!";
        questionElement.classList.remove('loading');
        questionElement.classList.remove('error');
        truthBtn.disabled = false;
        dareBtn.disabled = false;
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

    // Event listeners
    truthBtn.addEventListener('click', () => {
        if (!gameData || !gameData.truth || gameData.truth.length === 0) {
            questionElement.textContent = "Truth data not available";
            return;
        }
        const randomTruth = GameManager.getRandomItem(gameData.truth);
        questionElement.textContent = randomTruth;
    });

    dareBtn.addEventListener('click', () => {
        if (!gameData || !gameData.dare || gameData.dare.length === 0) {
            questionElement.textContent = "Dare data not available";
            return;
        }
        const randomDare = GameManager.getRandomItem(gameData.dare);
        questionElement.textContent = randomDare;
    });

    nextBtn.addEventListener('click', () => {
        questionElement.textContent = "Choose Truth or Dare for your next challenge!";
    });

    // Category selection
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.getAttribute('data-category');
        });
    });
});