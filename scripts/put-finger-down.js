// scripts/put-finger-down.js
document.addEventListener('DOMContentLoaded', async function() {
    const statementElement = document.getElementById('statement');
    const putFingerBtn = document.getElementById('put-finger-btn');
    const nextBtn = document.getElementById('next-btn');
    const resetBtn = document.getElementById('reset-btn');
    const fingers = document.querySelectorAll('.finger');
    
    let gameData = null;
    let fingersDown = 0;

    putFingerBtn.disabled = true;
    nextBtn.disabled = true;
    resetBtn.disabled = true;
    statementElement.textContent = "Loading game data...";
    statementElement.classList.remove('error');
    statementElement.classList.add('loading');

    try {
        gameData = await GameManager.loadGameData('put-finger-down');
        console.log('Put a Finger Down data loaded successfully:', gameData);
        
        if (!gameData || gameData.length === 0) {
            throw new Error('Loaded data is invalid or empty');
        }
        
        statementElement.textContent = "Click next to get your first statement!";
        statementElement.classList.remove('loading');
        statementElement.classList.remove('error');
        nextBtn.disabled = false;
        putFingerBtn.disabled = false;
        resetBtn.disabled = false;
    } catch (error) {
        console.error('Error loading game data:', error);
        statementElement.textContent = 'Failed to load game data. Please try again later.';
        statementElement.classList.remove('loading');
        statementElement.classList.add('error');
        

        if (!document.getElementById('retry-btn')) {
            const retryBtn = document.createElement('button');
            retryBtn.id = 'retry-btn';
            retryBtn.className = 'btn';
            retryBtn.textContent = 'Retry Loading';
            retryBtn.addEventListener('click', () => {
                window.location.reload();
            });
            statementElement.parentNode.insertBefore(retryBtn, statementElement.nextSibling);
        }
    }


    nextBtn.addEventListener('click', () => {
        if (!gameData || gameData.length === 0) {
            statementElement.textContent = "No statements available";
            return;
        }
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