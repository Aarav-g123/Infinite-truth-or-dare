// scripts/most-likely.js
document.addEventListener('DOMContentLoaded', function() {
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

    // Load game data
    GameManager.loadGameData('most-likely')
        .then(data => {
            gameData = data;
            console.log('Most Likely To data loaded successfully');
            nextBtn.disabled = false;
        })
        .catch(error => {
            console.error('Error loading game data:', error);
            questionElement.textContent = 'Failed to load game data. Please try again later.';
        });

    // Event listeners
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

    // Functions
    function updatePlayersList() {
        playersList.innerHTML = '';
        players.forEach((player, index) => {
            const playerItem = document.createElement('div');
            playerItem.className = 'player-item';
            playerItem.innerHTML = `
                <span>${player}</span>
                <button class="btn" onclick="removePlayer(${index})">Remove</button>
            `;
            playersList.appendChild(playerItem);
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
        
        // Add event listeners to vote buttons
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const playerName = e.target.getAttribute('data-player');
                alert(`You voted for ${playerName}!`);
            });
        });
    }

    function showQuestion() {
        if (!gameData) return;
        const randomQuestion = GameManager.getRandomItem(gameData);
        questionElement.textContent = `Who is most likely to ${randomQuestion}?`;
    }

    // Global function for player removal
    window.removePlayer = function(index) {
        players.splice(index, 1);
        updatePlayersList();
        
        if (players.length < 2) {
            startGameBtn.style.display = 'none';
        }
    };
});