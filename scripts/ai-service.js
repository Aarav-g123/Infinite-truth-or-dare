class AIService {
    constructor() {
        // Initialize with some default training data based on existing questions
        this.truthTrainingData = [
            { question: "What's the most embarrassing thing you've ever done in front of a crush?", rating: 8 },
            { question: "What's the weirdest dream you've ever had?", rating: 7 },
            { question: "What's your biggest insecurity?", rating: 6 }
        ];
        
        this.dareTrainingData = [
            { question: "Do your best impression of a famous person until someone guesses who you are", rating: 8 },
            { question: "Let the group choose an embarrassing photo of you to post online", rating: 7 },
            { question: "Sing a song of the group's choosing at the top of your lungs", rating: 6 }
        ];
        
        this.initializeOpenAI();
    }

    initializeOpenAI() {
        try {
            // This would typically be set from environment variables
            // For now, we'll check if the API key is available
            if (typeof process !== 'undefined' && process.env && process.env.OPENAI_API_KEY) {
                const { OpenAI } = require('openai');
                this.openai = new OpenAI({
                    apiKey: process.env.OPENAI_API_KEY,
                    dangerouslyAllowBrowser: true
                });
                console.log('OpenAI initialized successfully');
            } else {
                console.warn('OpenAI API key not found. AI features will be limited to fallback questions.');
                this.openai = null;
            }
        } catch (error) {
            console.error('Error initializing OpenAI:', error);
            this.openai = null;
        }
    }

    async generateQuestion(type, rating = null, previousQuestions = []) {
        console.log(`Generating ${type} question with rating ${rating} and context:`, previousQuestions);
        
        // If OpenAI is not available, use fallback questions
        if (!this.openai) {
            console.log('Using fallback question generation');
            return this.getFallbackQuestion(type);
        }

        try {
            const prompt = this.buildPrompt(type, rating, previousQuestions);
            console.log('Generated prompt:', prompt);
            
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a creative Truth or Dare game AI. Generate engaging, appropriate questions and dares for a party game."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 100,
                temperature: 0.8
            });

            const newQuestion = completion.choices[0].message.content.trim();
            console.log('AI generated question:', newQuestion);
            
            return { question: newQuestion, type: 'ai' };
        } catch (error) {
            console.error('AI Service Error:', error);
            return this.getFallbackQuestion(type);
        }
    }

    buildPrompt(type, rating, previousQuestions) {
        let prompt = `Generate a new ${type} question for a Truth or Dare party game. `;
        
        if (rating !== null && previousQuestions.length > 0) {
            prompt += `The user rated similar questions ${rating}/10. `;
            
            if (rating >= 7) {
                prompt += `Create questions similar to these highly-rated ones: ${previousQuestions.slice(0, 3).join(', ')}. `;
            } else if (rating <= 3) {
                prompt += `Avoid questions like these low-rated ones: ${previousQuestions.slice(0, 3).join(', ')}. `;
            }
        }
        
        prompt += "Make it fun, engaging, and appropriate for various age groups. Keep it concise and under 120 characters.";
        return prompt;
    }

    getFallbackQuestion(type) {
        console.log(`Getting fallback question for ${type}`);
        
        const fallbackQuestions = {
            truth: [
                "What's something you've never told anyone?",
                "If you could switch lives with anyone for a day, who would it be?",
                "What's your most embarrassing childhood memory?",
                "What's the biggest risk you've ever taken?",
                "What's your most irrational fear?"
            ],
            dare: [
                "Do your best impression of a famous person",
                "Post a silly selfie on social media",
                "Try to lick your elbow",
                "Do 10 pushups right now",
                "Sing the chorus of your favorite song"
            ]
        };
        
        const randomQuestion = fallbackQuestions[type][Math.floor(Math.random() * fallbackQuestions[type].length)];
        console.log(`Selected fallback question: ${randomQuestion}`);
        
        return { question: randomQuestion, type: 'ai' };
    }

    addTrainingData(type, question, rating) {
        console.log(`Adding training data: type=${type}, question=${question}, rating=${rating}`);
        
        if (type === 'truth') {
            this.truthTrainingData.push({ question, rating });
            // Keep only the most recent 100 items
            if (this.truthTrainingData.length > 100) this.truthTrainingData.shift();
        } else {
            this.dareTrainingData.push({ question, rating });
            if (this.dareTrainingData.length > 100) this.dareTrainingData.shift();
        }
        
        console.log(`Updated ${type} training data:`, type === 'truth' ? this.truthTrainingData : this.dareTrainingData);
    }

    getHighRatedQuestions(type) {
        const data = type === 'truth' ? this.truthTrainingData : this.dareTrainingData;
        const highRated = data.filter(item => item.rating >= 7).map(item => item.question);
        console.log(`High rated ${type} questions:`, highRated);
        return highRated;
    }

    getLowRatedQuestions(type) {
        const data = type === 'truth' ? this.truthTrainingData : this.dareTrainingData;
        const lowRated = data.filter(item => item.rating <= 3).map(item => item.question);
        console.log(`Low rated ${type} questions:`, lowRated);
        return lowRated;
    }
}

// Create a global instance
window.AIService = new AIService();