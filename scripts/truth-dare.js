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

    try {
        // Load game data
        gameData = await GameManager.loadGameData('truth-dare');
        console.log('Truth or Dare data loaded successfully');
        questionElement.textContent = "Choose Truth or Dare to start playing!";
        truthBtn.disabled = false;
        dareBtn.disabled = false;
        nextBtn.disabled = false;
    } catch (error) {
        console.error('Error loading game data:', error);
        questionElement.textContent = 'Failed to load game data. Please refresh and try again.';
        return;
    }

    // Event listeners
    truthBtn.addEventListener('click', () => {
        const randomTruth = GameManager.getRandomItem(gameData.truth);
        questionElement.textContent = randomTruth;
    });

    dareBtn.addEventListener('click', () => {
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