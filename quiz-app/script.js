// Quiz App - Static Version for GitHub Pages
class QuizApp {
    constructor() {
        console.log('QuizApp constructor called');
        this.currentScreen = 'setup';
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.timeStarted = null;
        this.timeFinished = null;
        this.timer = null;
        this.timeLeft = 30;
        
        this.initializeElements();
        this.bindEvents();
        this.loadLeaderboard();
        console.log('QuizApp initialized successfully');
    }

    decodeHtml(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    initializeElements() {
        // Screens
        this.screens = {
            setup: document.getElementById('setup-screen'),
            game: document.getElementById('game-screen'),
            results: document.getElementById('results-screen'),
            leaderboard: document.getElementById('leaderboard-screen')
        };

        // Setup elements
        this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
        this.categorySelect = document.getElementById('category-select');
        this.questionCountSlider = document.getElementById('question-count');
        this.questionCountValue = document.getElementById('question-count-value');
        this.startQuizBtn = document.getElementById('start-quiz-btn');
        this.startBtnText = document.getElementById('start-btn-text');
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.errorMessage = document.getElementById('error-message');

        // Game elements
        this.difficultyBadge = document.getElementById('difficulty-badge');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsSpan = document.getElementById('total-questions');
        this.timerElement = document.getElementById('timer');
        this.progressBar = document.getElementById('progress-bar');
        this.currentScoreSpan = document.getElementById('current-score');
        this.questionText = document.getElementById('question-text');
        this.answersContainer = document.getElementById('answers-container');
        this.answerResult = document.getElementById('answer-result');
        this.resultContent = document.getElementById('result-content');

        // Results elements
        this.performanceIcon = document.getElementById('performance-icon');
        this.performanceMessage = document.getElementById('performance-message');
        this.finalScore = document.getElementById('final-score');
        this.totalQuestionsFinal = document.getElementById('total-questions-final');
        this.finalPercentage = document.getElementById('final-percentage');
        this.finalTime = document.getElementById('final-time');
        this.difficultyStats = document.getElementById('difficulty-stats');
        this.saveScoreSection = document.getElementById('save-score-section');
        this.saveScorePrompt = document.getElementById('save-score-prompt');
        this.nameInputSection = document.getElementById('name-input-section');
        this.playerNameInput = document.getElementById('player-name');
        this.confirmSaveBtn = document.getElementById('confirm-save-btn');
        this.cancelSaveBtn = document.getElementById('cancel-save-btn');
        this.scoreSavedMessage = document.getElementById('score-saved-message');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.showLeaderboardBtn = document.getElementById('show-leaderboard-btn');

    initializeElements() {
        console.log('Initializing elements...');
        
        // Screens
        this.screens = {
            setup: document.getElementById('setup-screen'),
            game: document.getElementById('game-screen'),
            results: document.getElementById('results-screen'),
            leaderboard: document.getElementById('leaderboard-screen')
        };

        // Setup elements
        this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
        this.categorySelect = document.getElementById('category-select');
        this.questionCountSlider = document.getElementById('question-count');
        this.questionCountValue = document.getElementById('question-count-value');
        this.startQuizBtn = document.getElementById('start-quiz-btn');
        this.startBtnText = document.getElementById('start-btn-text');
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.errorMessage = document.getElementById('error-message');

        console.log('Elements found:');
        console.log('setup screen:', this.screens.setup);
        console.log('difficulty buttons:', this.difficultyButtons.length);
        console.log('category select:', this.categorySelect);
        console.log('question count slider:', this.questionCountSlider);
        console.log('start quiz button:', this.startQuizBtn);
        console.log('start btn text:', this.startBtnText);
        console.log('loading spinner:', this.loadingSpinner);
        console.log('error message:', this.errorMessage);

        // Game elements
        this.difficultyBadge = document.getElementById('difficulty-badge');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsSpan = document.getElementById('total-questions');
        this.timerElement = document.getElementById('timer');
        this.progressBar = document.getElementById('progress-bar');
        this.currentScoreSpan = document.getElementById('current-score');
        this.questionText = document.getElementById('question-text');
        this.answersContainer = document.getElementById('answers-container');
        this.answerResult = document.getElementById('answer-result');
        this.resultContent = document.getElementById('result-content');

        // Results elements
        this.performanceIcon = document.getElementById('performance-icon');
        this.performanceMessage = document.getElementById('performance-message');
        this.finalScore = document.getElementById('final-score');
        this.totalQuestionsFinal = document.getElementById('total-questions-final');
        this.finalPercentage = document.getElementById('final-percentage');
        this.finalTime = document.getElementById('final-time');
        this.difficultyStats = document.getElementById('difficulty-stats');
        this.saveScoreSection = document.getElementById('save-score-section');
        this.saveScorePrompt = document.getElementById('save-score-prompt');
        this.nameInputSection = document.getElementById('name-input-section');
        this.playerNameInput = document.getElementById('player-name');
        this.confirmSaveBtn = document.getElementById('confirm-save-btn');
        this.cancelSaveBtn = document.getElementById('cancel-save-btn');
        this.scoreSavedMessage = document.getElementById('score-saved-message');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.showLeaderboardBtn = document.getElementById('show-leaderboard-btn');

        // Leaderboard elements
        this.leaderboardStats = document.getElementById('leaderboard-stats');
        this.leaderboardList = document.getElementById('leaderboard-list');
        this.emptyLeaderboard = document.getElementById('empty-leaderboard');
        this.backToSetupBtn = document.getElementById('back-to-setup-btn');
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Setup events
        console.log('Difficulty buttons found:', this.difficultyButtons.length);
        this.difficultyButtons.forEach(btn => {
            btn.addEventListener('click', () => this.selectDifficulty(btn));
        });

        console.log('Question count slider:', this.questionCountSlider);
        this.questionCountSlider.addEventListener('input', (e) => {
            this.questionCountValue.textContent = e.target.value;
        });

        console.log('Start quiz button:', this.startQuizBtn);
        this.startQuizBtn.addEventListener('click', () => this.startQuiz());

        // Results events
        this.saveScoreBtn = document.getElementById('save-score-btn');
        this.saveScoreBtn.addEventListener('click', () => this.showNameInput());
        this.confirmSaveBtn.addEventListener('click', () => this.saveScore());
        this.cancelSaveBtn.addEventListener('click', () => this.hideNameInput());
        this.playAgainBtn.addEventListener('click', () => this.playAgain());
        this.showLeaderboardBtn.addEventListener('click', () => this.showLeaderboard());

        // Leaderboard events
        this.backToSetupBtn.addEventListener('click', () => this.backToSetup());
        
        console.log('Events bound successfully');
    }

    selectDifficulty(selectedBtn) {
        this.difficultyButtons.forEach(btn => btn.classList.remove('active'));
        selectedBtn.classList.add('active');
    }

    async startQuiz() {
        console.log('startQuiz called');
        const difficulty = document.querySelector('.difficulty-btn.active').dataset.difficulty;
        const category = this.categorySelect.value;
        const amount = this.questionCountSlider.value;

        console.log('Quiz parameters:', { difficulty, category, amount });

        this.startQuizBtn.disabled = true;
        this.startBtnText.textContent = 'Loading...';
        this.loadingSpinner.classList.remove('hidden');
        this.hideError();

        try {
            let url = `https://opentdb.com/api.php?amount=${amount}&category=${category}`;
            if (difficulty !== 'mixed') {
                url += `&difficulty=${difficulty}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.response_code === 0 && data.results.length > 0) {
                this.questions = data.results;
                this.currentQuestionIndex = 0;
                this.score = 0;
                this.answers = [];
                this.timeStarted = Date.now();
                console.log('Quiz started at:', this.timeStarted);
                this.showScreen('game');
                this.startQuestion();
            } else {
                this.showError('Could not load questions. Please try again.');
            }
        } catch (error) {
            this.showError('Error connecting to server. Please check your internet connection.');
        } finally {
            this.startQuizBtn.disabled = false;
            this.startBtnText.textContent = 'Begin Assessment';
            this.loadingSpinner.classList.add('hidden');
        }
    }

    startQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        // Update UI
        this.difficultyBadge.textContent = this.getDifficultyLabel(question.difficulty);
        this.difficultyBadge.className = `difficulty-badge ${this.getDifficultyClass(question.difficulty)}`;
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        this.totalQuestionsSpan.textContent = this.questions.length;
        this.currentScoreSpan.textContent = this.score;
        
        // Update progress
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressBar.style.width = `${progress}%`;
        
        // Set question (decode HTML entities)
        this.questionText.textContent = this.decodeHtml(question.question);
        
        // Create answers
        this.createAnswers(question);
        
        // Start timer
        this.startTimer();
    }

    createAnswers(question) {
        const allAnswers = [question.correct_answer, ...question.incorrect_answers]
            .sort(() => Math.random() - 0.5);

        this.answersContainer.innerHTML = '';
        
        allAnswers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.innerHTML = `
                <div class="answer-letter">${String.fromCharCode(65 + index)}</div>
                <div class="answer-text">${this.decodeHtml(answer)}</div>
            `;
            button.addEventListener('click', () => this.selectAnswer(answer, question.correct_answer));
            this.answersContainer.appendChild(button);
        });
    }

    startTimer() {
        this.timeLeft = 30;
        this.updateTimer();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    updateTimer() {
        this.timerElement.textContent = this.timeLeft;
        this.timerElement.className = this.timeLeft <= 10 ? 'timer warning' : 'timer';
    }

    selectAnswer(selectedAnswer, correctAnswer) {
        if (this.timer) {
            clearInterval(this.timer);
        }

        const isCorrect = selectedAnswer === correctAnswer;
        if (isCorrect) {
            this.score++;
            console.log('Correct answer! Score:', this.score);
        } else {
            console.log('Incorrect answer. Score:', this.score);
        }

        this.answers.push({
            question: this.questions[this.currentQuestionIndex].question,
            userAnswer: selectedAnswer,
            correctAnswer: correctAnswer,
            isCorrect: isCorrect
        });

        this.showAnswerResult(selectedAnswer, correctAnswer, isCorrect);
        
        // Disable all answer buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.add('disabled');
            btn.disabled = true;
        });

        // Highlight correct/incorrect answers
        document.querySelectorAll('.answer-btn').forEach(btn => {
            const answerText = btn.querySelector('.answer-text').textContent;
            if (answerText === correctAnswer) {
                btn.classList.add('correct');
            } else if (answerText === selectedAnswer && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        // Auto-advance after 2 seconds
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    showAnswerResult(selectedAnswer, correctAnswer, isCorrect) {
        this.resultContent.textContent = isCorrect 
            ? 'Correct!' 
            : `Incorrect. The correct answer is: ${this.decodeHtml(correctAnswer)}`;
        this.resultContent.className = `result-content ${isCorrect ? 'correct' : 'incorrect'}`;
        this.answerResult.classList.remove('hidden');
    }

    timeUp() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        const correctAnswer = this.questions[this.currentQuestionIndex].correct_answer;
        
        // Add incorrect answer to answers array
        this.answers.push({
            question: this.questions[this.currentQuestionIndex].question,
            userAnswer: '',
            correctAnswer: correctAnswer,
            isCorrect: false
        });
        
        this.showAnswerResult('', correctAnswer, false);
        
        // Disable all answer buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.add('disabled');
            btn.disabled = true;
        });

        // Highlight correct answer
        document.querySelectorAll('.answer-btn').forEach(btn => {
            const answerText = btn.querySelector('.answer-text').textContent;
            if (answerText === correctAnswer) {
                btn.classList.add('correct');
            }
        });

        // Auto-advance after 2 seconds
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.questions.length) {
            this.startQuestion();
        } else {
            this.finishQuiz();
        }
    }

    finishQuiz() {
        this.timeFinished = Date.now();
        console.log('Quiz finished at:', this.timeFinished);
        this.showScreen('results');
        this.displayResults();
    }

    displayResults() {
        const totalQuestions = this.questions.length;
        const percentage = Math.round((this.score / totalQuestions) * 100);
        const timeSpent = (this.timeFinished - this.timeStarted) / 1000;
        const minutes = Math.floor(timeSpent / 60);
        const seconds = Math.floor(timeSpent % 60);

        // Debug logs
        console.log('Quiz Results Debug:');
        console.log('Score:', this.score);
        console.log('Total Questions:', totalQuestions);
        console.log('Percentage:', percentage);
        console.log('Time Started:', this.timeStarted);
        console.log('Time Finished:', this.timeFinished);
        console.log('Time Spent (seconds):', timeSpent);

        // Check if elements exist
        console.log('Elements check:');
        console.log('performanceIcon:', this.performanceIcon);
        console.log('performanceMessage:', this.performanceMessage);
        console.log('finalScore:', this.finalScore);
        console.log('totalQuestionsFinal:', this.totalQuestionsFinal);
        console.log('finalPercentage:', this.finalPercentage);
        console.log('finalTime:', this.finalTime);
        console.log('difficultyStats:', this.difficultyStats);

        if (!this.performanceIcon || !this.performanceMessage || !this.finalScore || !this.totalQuestionsFinal || !this.finalPercentage || !this.finalTime || !this.difficultyStats) {
            console.error('ERROR: Some elements not found!');
            return;
        }

        // Performance message
        const performance = this.getPerformanceMessage(percentage);
        this.performanceIcon.innerHTML = this.getPerformanceIcon(performance.icon);
        this.performanceMessage.textContent = performance.message;
        this.performanceMessage.className = `performance-message ${performance.class}`;

        // Stats
        console.log('Setting final score:', this.score);
        console.log('Setting total questions:', totalQuestions);
        console.log('Setting percentage:', percentage);
        console.log('Setting time:', `${minutes}:${seconds.toString().padStart(2, '0')}`);
        
        this.finalScore.textContent = this.score;
        this.totalQuestionsFinal.textContent = totalQuestions;
        this.finalPercentage.textContent = `${percentage}%`;
        this.finalTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        console.log('Elements after setting:');
        console.log('finalScore.textContent:', this.finalScore.textContent);
        console.log('totalQuestionsFinal.textContent:', this.totalQuestionsFinal.textContent);
        console.log('finalPercentage.textContent:', this.finalPercentage.textContent);
        console.log('finalTime.textContent:', this.finalTime.textContent);

        // Difficulty breakdown
        this.displayDifficultyBreakdown();

        // Reset save score section
        this.saveScorePrompt.classList.remove('hidden');
        this.nameInputSection.classList.add('hidden');
        this.scoreSavedMessage.classList.add('hidden');
    }

    getPerformanceMessage(percentage) {
        if (percentage >= 90) return { message: 'Outstanding Performance', icon: 'star', class: 'excellent' };
        if (percentage >= 80) return { message: 'Excellent Work', icon: 'star', class: 'good' };
        if (percentage >= 70) return { message: 'Good Performance', icon: 'star', class: 'good' };
        if (percentage >= 60) return { message: 'Satisfactory', icon: 'star', class: 'average' };
        return { message: 'Needs Improvement', icon: 'star', class: 'poor' };
    }

    getPerformanceIcon(iconType) {
        const icons = {
            star: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
            </svg>`,
            check: `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
        };
        return icons[iconType] || icons.star;
    }

    displayDifficultyBreakdown() {
        const difficultyCounts = this.questions.reduce((acc, q) => {
            acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
            return acc;
        }, {});

        console.log('Difficulty counts:', difficultyCounts);
        console.log('difficultyStats element:', this.difficultyStats);

        if (!this.difficultyStats) {
            console.error('ERROR: difficultyStats element not found!');
            return;
        }

        this.difficultyStats.innerHTML = '';
        
        Object.entries(difficultyCounts).forEach(([difficulty, count]) => {
            const statDiv = document.createElement('div');
            statDiv.className = 'difficulty-stat';
            statDiv.innerHTML = `
                <div class="difficulty-stat-icon">${this.getDifficultyEmoji(difficulty)}</div>
                <div class="difficulty-stat-label">${this.getDifficultyLabel(difficulty)}</div>
                <div class="difficulty-stat-count">${count} questions</div>
            `;
            this.difficultyStats.appendChild(statDiv);
        });
    }

    getDifficultyLabel(difficulty) {
        const labels = {
            easy: 'Beginner',
            medium: 'Intermediate',
            hard: 'Advanced'
        };
        return labels[difficulty] || 'Mixed';
    }

    getDifficultyClass(difficulty) {
        const classes = {
            easy: 'easy',
            medium: 'medium',
            hard: 'hard'
        };
        return classes[difficulty] || 'mixed';
    }

    getDifficultyEmoji(difficulty) {
        const icons = {
            easy: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
            medium: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
            hard: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
        };
        return icons[difficulty] || icons.easy;
    }

    showNameInput() {
        this.saveScorePrompt.classList.add('hidden');
        this.nameInputSection.classList.remove('hidden');
        this.playerNameInput.focus();
    }

    hideNameInput() {
        this.saveScorePrompt.classList.remove('hidden');
        this.nameInputSection.classList.add('hidden');
        this.playerNameInput.value = '';
    }

    saveScore() {
        const name = this.playerNameInput.value.trim();
        if (!name) return;

        const timeSpent = (this.timeFinished - this.timeStarted) / 1000;
        const difficulty = this.questions[0]?.difficulty || 'medium';
        
        const entry = {
            id: Date.now().toString(),
            name: name,
            score: this.score,
            totalQuestions: this.questions.length,
            difficulty: difficulty,
            timeSpent: timeSpent,
            date: new Date().toLocaleDateString('en-US')
        };

        this.addToLeaderboard(entry);
        
        this.nameInputSection.classList.add('hidden');
        this.scoreSavedMessage.classList.remove('hidden');
    }

    addToLeaderboard(entry) {
        let leaderboard = this.getLeaderboard();
        leaderboard.push(entry);
        leaderboard.sort((a, b) => b.score - a.score || a.timeSpent - b.timeSpent);
        leaderboard = leaderboard.slice(0, 10); // Keep top 10
        
        localStorage.setItem('quiz-leaderboard', JSON.stringify(leaderboard));
    }

    getLeaderboard() {
        const stored = localStorage.getItem('quiz-leaderboard');
        return stored ? JSON.parse(stored) : [];
    }

    loadLeaderboard() {
        // This will be called when showing leaderboard
    }

    showLeaderboard() {
        this.showScreen('leaderboard');
        this.displayLeaderboard();
    }

    displayLeaderboard() {
        const leaderboard = this.getLeaderboard();
        
        if (leaderboard.length === 0) {
            this.emptyLeaderboard.classList.remove('hidden');
            this.leaderboardList.classList.add('hidden');
            this.leaderboardStats.classList.add('hidden');
            return;
        }

        this.emptyLeaderboard.classList.add('hidden');
        this.leaderboardList.classList.remove('hidden');
        this.leaderboardStats.classList.remove('hidden');

        // Display stats
        this.displayLeaderboardStats(leaderboard);
        
        // Display entries
        this.displayLeaderboardEntries(leaderboard);
    }

    displayLeaderboardStats(leaderboard) {
        const totalGames = leaderboard.length;
        const bestPercentage = Math.round((leaderboard[0].score / leaderboard[0].totalQuestions) * 100);
        const bestTime = this.formatTime(leaderboard[0].timeSpent);

        this.leaderboardStats.innerHTML = `
            <div class="leaderboard-stat">
                <div class="leaderboard-stat-value">${totalGames}</div>
                <div class="leaderboard-stat-label">Assessments Completed</div>
                <div class="leaderboard-stat-sublabel">total attempts</div>
            </div>
            <div class="leaderboard-stat">
                <div class="leaderboard-stat-value">${bestPercentage}%</div>
                <div class="leaderboard-stat-label">Highest Score</div>
                <div class="leaderboard-stat-sublabel">percentage achieved</div>
            </div>
            <div class="leaderboard-stat">
                <div class="leaderboard-stat-value">${bestTime}</div>
                <div class="leaderboard-stat-label">Fastest Time</div>
                <div class="leaderboard-stat-sublabel">quickest completion</div>
            </div>
        `;
    }

    displayLeaderboardEntries(leaderboard) {
        this.leaderboardList.innerHTML = '';
        
        leaderboard.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = `leaderboard-entry ${index < 3 ? 'top-3' : ''}`;
            
            const rankEmoji = this.getRankEmoji(index);
            const difficultyTag = this.getDifficultyTag(entry.difficulty);
            const percentage = Math.round((entry.score / entry.totalQuestions) * 100);
            
            entryDiv.innerHTML = `
                <div class="leaderboard-entry-content">
                    <div class="leaderboard-entry-left">
                        <div class="leaderboard-rank">${rankEmoji}</div>
                        <div class="leaderboard-entry-info">
                            <div class="leaderboard-name">
                                ${entry.name}
                                <span class="difficulty-tag ${entry.difficulty}">${this.getDifficultyLabel(entry.difficulty)}</span>
                            </div>
                            <div class="leaderboard-details">
                                <div class="leaderboard-detail">
                                    <span>📊</span>
                                    <span>${entry.score}/${entry.totalQuestions} (${percentage}%)</span>
                                </div>
                                <div class="leaderboard-detail">
                                    <span>⏱️</span>
                                    <span>${this.formatTime(entry.timeSpent)}</span>
                                </div>
                                <div class="leaderboard-detail">
                                    <span>📅</span>
                                    <span>${entry.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="leaderboard-entry-right">
                        <div class="leaderboard-score">${entry.score}</div>
                        <div class="leaderboard-score-label">score</div>
                    </div>
                </div>
            `;
            
            this.leaderboardList.appendChild(entryDiv);
        });
    }

    getRankEmoji(index) {
        switch (index) {
            case 0: return '🥇';
            case 1: return '🥈';
            case 2: return '🥉';
            default: return `#${index + 1}`;
        }
    }

    getDifficultyTag(difficulty) {
        return difficulty.toLowerCase();
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    playAgain() {
        this.showScreen('setup');
        this.resetQuiz();
    }

    backToSetup() {
        this.showScreen('setup');
    }

    resetQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.timeStarted = null;
        this.timeFinished = null;
        this.timeLeft = 30;
        
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        this.screens[screenName].classList.add('active');
        this.currentScreen = screenName;
        
        // Debug: Check if elements are found when showing results screen
        if (screenName === 'results') {
            console.log('Showing results screen - Elements check:');
            console.log('finalScore:', this.finalScore);
            console.log('totalQuestionsFinal:', this.totalQuestionsFinal);
            console.log('finalPercentage:', this.finalPercentage);
            console.log('finalTime:', this.finalTime);
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});
