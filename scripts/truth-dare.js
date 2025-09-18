document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM Content Loaded - Initializing Truth or Dare game');
    
    const questionElement = document.getElementById('truth-dare-question');
    const truthBtn = document.getElementById('truth-btn');
    const dareBtn = document.getElementById('dare-btn');
    const nextBtn = document.getElementById('next-btn');
    const ratingContainer = document.getElementById('rating-container');
    const ratingButtons = document.querySelectorAll('.rating-btn');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    let gameData = null;
    let currentCategory = 'all';
    let currentQuestion = null;
    let currentQuestionType = null;
    let aiQuestions = { truth: [], dare: [] };

    // Set initial button states
    truthBtn.disabled = true;
    dareBtn.disabled = true;
    nextBtn.disabled = true;
    ratingContainer.style.display = 'none';
    questionElement.textContent = "Loading game data...";
    questionElement.classList.remove('error');
    questionElement.classList.add('loading');

    try {
        console.log('Loading game data...');
        gameData = await GameManager.loadGameData('truth-dare');
        console.log('Game data loaded successfully:', gameData);
        
        if (!gameData || (!gameData.truth && !gameData.dare)) {
            throw new Error('Loaded data is invalid or empty');
        }
        
        questionElement.textContent = "Choose Truth or Dare to start playing!";
        questionElement.classList.remove('loading');
        questionElement.classList.remove('error');
        truthBtn.disabled = false;
        dareBtn.disabled = false;
        nextBtn.disabled = false;
        
        // Load AI questions from localStorage
        const savedAIQuestions = GameManager.loadFromLocalStorage('ai_questions');
        if (savedAIQuestions) {
            console.log('Loaded AI questions from localStorage:', savedAIQuestions);
            aiQuestions = savedAIQuestions;
        } else {
            console.log('No AI questions found in localStorage');
        }
    } catch (error) {
        console.error('Error loading game data:', error);
        questionElement.textContent = 'Error: Failed to load game data. Please check console for details.';
        questionElement.classList.remove('loading');
        questionElement.classList.add('error');
        
        if (!document.getElementById('retry-btn')) {
            const retryBtn = document.createElement('button');
            retryBtn.id = 'retry-btn';
            retryBtn.className = 'btn';
            retryBtn.textContent = 'Retry Loading';
            retryBtn.addEventListener('click', () => {
                console.log('Retry button clicked - reloading page');
                window.location.reload();
            });
            questionElement.parentNode.insertBefore(retryBtn, questionElement.nextSibling);
        }
        
        return;
    }

    function getRandomQuestion(type) {
        console.log(`Getting random ${type} question`);
        
        // Filter questions based on category
        let staticQuestions = [];
        if (currentCategory === 'all' || currentCategory === type) {
            staticQuestions = gameData[type] || [];
        }
        
        const aiGeneratedQuestions = aiQuestions[type] || [];
        const allQuestions = [
            ...staticQuestions.map(q => ({ question: q, type: 'static' })),
            ...aiGeneratedQuestions
        ];
        
        console.log(`Available ${type} questions:`, allQuestions);
        
        if (allQuestions.length === 0) {
            console.warn(`No ${type} questions available`);
            return { question: `No ${type} questions available`, type: 'error' };
        }
        
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        const selectedQuestion = allQuestions[randomIndex];
        console.log(`Selected question:`, selectedQuestion);
        
        return selectedQuestion;
    }

    function displayQuestion(questionObj, type) {
        console.log(`Displaying ${type} question:`, questionObj);
        
        currentQuestion = questionObj.question;
        currentQuestionType = type;
        
        let displayText = questionObj.question;
        if (questionObj.type === 'ai') {
            displayText += ' 🤖'; // AI indicator
            questionElement.classList.add('ai-generated');
        } else {
            questionElement.classList.remove('ai-generated');
        }
        
        questionElement.textContent = displayText;
        ratingContainer.style.display = 'flex';
        
        console.log(`Question displayed: ${displayText}`);
    }

    truthBtn.addEventListener('click', async () => {
        console.log('Truth button clicked');
        
        if (!gameData || !gameData.truth || gameData.truth.length === 0) {
            console.warn('Truth data not available');
            questionElement.textContent = "Truth data not available";
            return;
        }
        
        const question = getRandomQuestion('truth');
        displayQuestion(question, 'truth');
    });

    dareBtn.addEventListener('click', async () => {
        console.log('Dare button clicked');
        
        if (!gameData || !gameData.dare || gameData.dare.length === 0) {
            console.warn('Dare data not available');
            questionElement.textContent = "Dare data not available";
            return;
        }
        
        const question = getRandomQuestion('dare');
        displayQuestion(question, 'dare');
    });

    nextBtn.addEventListener('click', () => {
        console.log('Next button clicked');
        questionElement.textContent = "Choose Truth or Dare for your next challenge!";
        ratingContainer.style.display = 'none';
        currentQuestion = null;
        currentQuestionType = null;
    });

    ratingButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const rating = parseInt(button.getAttribute('data-rating'));
            console.log(`Rating ${rating} clicked for question: ${currentQuestion}`);
            
            if (currentQuestion && currentQuestionType) {
                console.log(`Adding training data: type=${currentQuestionType}, question=${currentQuestion}, rating=${rating}`);
                AIService.addTrainingData(currentQuestionType, currentQuestion, rating);
                
                if (rating >= 7) {
                    console.log('High rating detected, generating new AI question');
                    try {
                        const highRatedQuestions = AIService.getHighRatedQuestions(currentQuestionType);
                        console.log('High rated questions for context:', highRatedQuestions);
                        
                        const newAIQuestion = await AIService.generateQuestion(
                            currentQuestionType, 
                            rating, 
                            highRatedQuestions
                        );
                        
                        console.log('New AI question generated:', newAIQuestion);
                        
                        if (!aiQuestions[currentQuestionType]) {
                            aiQuestions[currentQuestionType] = [];
                        }
                        
                        aiQuestions[currentQuestionType].push(newAIQuestion);
                        GameManager.saveToLocalStorage('ai_questions', aiQuestions);
                        console.log('AI questions saved to localStorage:', aiQuestions);
                        
                        questionElement.textContent = "Generated new AI question based on your preference!";
                    } catch (error) {
                        console.error('Error generating AI question:', error);
                        questionElement.textContent = "Error generating AI question. Please check console.";
                    }
                } else {
                    questionElement.textContent = "Thanks for your rating! Choose another question.";
                }
            } else {
                console.warn('No current question to rate');
            }
            
            ratingContainer.style.display = 'none';
        });
    });

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            console.log(`Category button clicked: ${category}`);
            
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = category;
            
            console.log(`Current category set to: ${currentCategory}`);
        });
    });

    console.log('Truth or Dare game initialized successfully');
});