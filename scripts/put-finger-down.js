// scripts/put-finger-down.js
document.addEventListener('DOMContentLoaded', function() {
    const statementElement = document.getElementById('statement');
    const putFingerBtn = document.getElementById('put-finger-btn');
    const nextBtn = document.getElementById('next-btn');
    const resetBtn = document.getElementById('reset-btn');
    const fingers = document.querySelectorAll('.finger');
    
    let gameData = null;
    let fingersDown = 0;

    // Load game data
    GameManager.loadGameData('put-finger-down')
        .then(data => {
            gameData = data;
            console.log('Put a Finger Down data loaded successfully');
            statementElement.textContent = "Click next to get your first statement!";
            nextBtn.disabled = false;
            putFingerBtn.disabled = false;
            resetBtn.disabled = false;
        })
        .catch(error => {
            console.error('Error loading game data:', error);
            statementElement.textContent = 'Failed to load game data. Please try again later.';
        });

    // Event listeners
    nextBtn.addEventListener('click', () => {
        if (!gameData) return;
        const randomStatement = GameManager.getRandomItem(gameData);
        statementElement.textContent = randomStatement;
    });

    putFingerBtn.addEventListener('click', () => {
        if (fingersDown < 10) {
            fingers[fingersDown].classList.add('down');
            fingersDown++;
            
            if (fingersDown === 10) {
                statementElement.textContent = "All fingers down! You're out!";
                putFingerBtn.disabled = true;
            }
        }
    });

    resetBtn.addEventListener('click', () => {
        fingers.forEach(finger => finger.classList.remove('down'));
        fingersDown = 0;
        putFingerBtn.disabled = false;
        statementElement.textContent = "Fingers reset! Click next for a new statement.";
    });
});