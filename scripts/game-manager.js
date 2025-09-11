// Utility functions for game management
class GameManager {
    static loadGameData(gameName) {
        return new Promise((resolve, reject) => {
            // Check if the data is already loaded in window object
            const data = window[`${gameName.replace('-', '')}Data`];
            if (data) {
                resolve(data);
            } else {
                // If not loaded, create a script element to load it
                const script = document.createElement('script');
                script.src = `../data/${gameName}.js`;
                script.onload = () => {
                    const loadedData = window[`${gameName.replace('-', '')}Data`];
                    if (loadedData) {
                        resolve(loadedData);
                    } else {
                        reject(new Error(`Failed to load ${gameName} data`));
                    }
                };
                script.onerror = () => reject(new Error(`Failed to load ${gameName} data script`));
                document.head.appendChild(script);
            }
        });
    }

    static getRandomItem(array) {
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