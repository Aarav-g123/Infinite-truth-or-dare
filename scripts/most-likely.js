// scripts/most-likely.js
document.addEventListener('DOMContentLoaded', async function() {
    const playerNameInput = document.getElementById('player-name');
    const addPlayerBtn = document.getElementById('add-player-btn');
    const playersList = document.getElementById('players-list');
    const startGameBtn = document.getElementById('start-game-btn');
    const setupSection = document.getElementById('setup-section');
    const gameSection = document.getElementById('game-section');
    const questionElement = document.getElementById('question');
    const votingPlayers = document.getElementById('voting-players');
    const nextBtn = document.getElementById('next-btn');
    
    let gameData = null;
    let players = [];

    nextBtn.disabled = true;
    startGameBtn.style.display = 'none';

    try {
        gameData = await GameManager.loadGameData('most-likely');
        console.log('Most Likely To data loaded successfully:', gameData);
        
        if (!gameData || gameData.length === 0) {
            throw new Error('Loaded data is invalid or empty');
        }
        
        nextBtn.disabled = false;
    } catch (error) {
        console.error('Error loading game data:', error);
        questionElement.textContent = 'Failed to load game data. Please try again later.';
        questionElement.classList.add('error');
        

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
    }


    addPlayerBtn.addEventListener('click', () => {
        const name = playerNameInput.value.trim();
        if (name) {
            players.push(name);
            updatePlayersList();
            playerNameInput.value = '';
            
            if (players.length >= 2) {
                startGameBtn.style.display = 'block';
            }
        }
    });

    startGameBtn.addEventListener('click', () => {
        setupSection.style.display = 'none';
        gameSection.style.display = 'block';
        updateVotingPlayersList();
        showQuestion();
    });

    nextBtn.addEventListener('click', showQuestion);


    function updatePlayersList() {
        playersList.innerHTML = '';
        players.forEach((player, index) => {
            const playerItem = document.createElement('div');
            playerItem.className = 'player-item';
            playerItem.innerHTML = `
                <span>${player}</span>
                <button class="btn remove-btn" data-index="${index}">Remove</button>
            `;
            playersList.appendChild(playerItem);
        });
        

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                removePlayer(index);
            });
        });
    }

    function updateVotingPlayersList() {
        votingPlayers.innerHTML = '';
        players.forEach((player) => {
            const playerItem = document.createElement('div');
            playerItem.className = 'player-item';
            playerItem.innerHTML = `
                <span>${player}</span>
                <button class="btn vote-btn" data-player="${player}">Vote</button>
            `;
            votingPlayers.appendChild(playerItem);
        });
        

        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const playerName = e.target.getAttribute('data-player');
                alert(`You voted for ${playerName}!`);
            });
        });
    }

    function showQuestion() {
        if (!gameData || gameData.length === 0) {
            questionElement.textContent = "No questions available";
            return;
        }
        const randomQuestion = GameManager.getRandomItem(gameData);
        questionElement.textContent = `Who is most likely to ${randomQuestion}?`;
    }

    function removePlayer(index) {
        players.splice(index, 1);
        updatePlayersList();
        
        if (players.length < 2) {
            startGameBtn.style.display = 'none';
        }
    }
});