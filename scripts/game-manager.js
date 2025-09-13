// scripts/game-manager.js
class GameManager {
    static async loadGameData(gameName) {
        try {
            // Use absolute path to avoid relative path issues
            const basePath = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
            const dataPath = `${basePath}/data/${gameName}.json`;
            
            console.log(`Loading game data from: ${dataPath}`);
            
            const response = await fetch(dataPath, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading game data:', error);
            throw new Error(`Could not load data for ${gameName}: ${error.message}`);
        }
    }

    static getRandomItem(array) {
        if (!array || array.length === 0) {
            return "No questions available";
        }
        return array[Math.floor(Math.random() * array.length)];
    }

    static saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    static loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }
}