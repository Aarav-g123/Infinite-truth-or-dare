class GameManager {
    static getBasePath() {
        if (window.location.protocol === 'file:') {
            const path = window.location.pathname;
            const segments = path.split('/');
            segments.pop();
            return segments.join('/');
        } else {
            return window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
        }
    }

    static async loadGameData(gameName) {
        try {
            const basePath = this.getBasePath();
            const dataPath = `data/${gameName}.json`;
            const fullPath = `${basePath}/${dataPath}`;
            
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

    static async generateAIQuestion(type, context = "") {
        try {
            const response = await fetch('/api/generate-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type, context })
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate AI question');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error generating AI question:', error);
            return null;
        }
    }

    static getQuestionsByRating(type, minRating = 7) {
        try {
            const aiQuestions = this.loadFromLocalStorage('ai_questions') || { truth: [], dare: [] };
            const ratedQuestions = aiQuestions[type].filter(q => q.rating >= minRating);
            return ratedQuestions;
        } catch (error) {
            console.error('Error getting questions by rating:', error);
            return [];
        }
    }
}