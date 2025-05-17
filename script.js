document.addEventListener('DOMContentLoaded', function() {
    // Clear all flashcard data from localStorage
    localStorage.removeItem('flashcards');
    
    const addCardBtn = document.getElementById('addCardBtn');
    const addCardModal = document.getElementById('addCardModal');
    const cardForm = document.getElementById('cardForm');
    const cancelAddBtn = document.getElementById('cancelAdd');
    const cardsGrid = document.getElementById('cardsGrid');
    const slideModeBtn = document.getElementById('slideMode');
    const revisionModeBtn = document.getElementById('revisionMode');

    const cardCount = document.querySelector('.card-count');
    const themeToggle = document.querySelector('.theme-toggle');
    const navBtns = document.querySelectorAll('.nav-btn');

    let cards = [];
    let currentCard = 0;
    let known = 0;
    let currentMode = 'grid'; 

    // Load saved cards from localStorage first
    loadCardsFromStorage();

    const sampleCards = [
        {
            id: 1,
            question: "What is the capital of France?",
            answer: "Paris"
        },
        {
            id: 2,
            question: "What is the largest planet in our solar system?",
            answer: "Jupiter"
        },
        {
            id: 3,
            question: "Who painted the Mona Lisa?",
            answer: "Leonardo da Vinci"
        },
        {
            id: 4,
            question: "What is the chemical symbol for gold?",
            answer: "Au"
        }
    ];

    // Function to load sample cards
    function loadSampleCards() {
        sampleCards.forEach(card => {
            addNewCard(card.question, card.answer);
        });
    }

    // Only load sample cards if no cards exist
    if (cards.length === 0) {
        loadSampleCards();
    }

    const questionInput = document.getElementById("questionInput");
    const answerInput = document.getElementById("answerInput");
    const cardList = document.getElementById("cardList");
    const homeView = document.getElementById("homeView");
    const reviseView = document.getElementById("reviseView");

    const flashcard = document.getElementById("flashcard");
    const frontDisplay = document.getElementById("front");
    const backDisplay = document.getElementById("back");
    const knowBtn = document.getElementById("knowBtn");
    const dontKnowBtn = document.getElementById("dontKnowBtn");
    const progress = document.getElementById("progress");

    const studyMode = document.getElementById('studyMode');
    const studyCard = document.getElementById('studyCard');
    const questionContent = document.getElementById('questionContent');
    const answerContent = document.getElementById('answerContent');
    const progressFill = document.getElementById('progressFill');
    const currentCardNumber = document.getElementById('currentCardNumber');
    const totalCards = document.getElementById('totalCards');
    const prevCardBtn = document.getElementById('prevCard');
    const nextCardBtn = document.getElementById('nextCard');
    const flipCardBtn = document.getElementById('flipCard');
    const hardBtn = document.getElementById('hardBtn');
    const mediumBtn = document.getElementById('mediumBtn');
    const easyBtn = document.getElementById('easyBtn');

    const multipleChoice = document.getElementById('multipleChoice');
    const quizQuestion = document.getElementById('quizQuestion');
    const quizOptions = document.getElementById('quizOptions');
    const quizFeedback = document.getElementById('quizFeedback');
    const nextQuestionBtn = document.getElementById('nextQuestion');
    const quizScore = document.getElementById('quizScore');
    const quizProgress = document.getElementById('quizProgress');
    const quizProgressFill = document.getElementById('quizProgressFill');

    const quizCompletionModal = document.getElementById('quizCompletionModal');
    const finalScore = document.getElementById('finalScore');
    const scorePercentage = document.getElementById('scorePercentage');
    const completionMessage = document.getElementById('completionMessage');
    const retryQuizBtn = document.getElementById('retryQuizBtn');
    const backToGridBtn = document.getElementById('backToGridBtn');
    const floatingNextBtn = document.getElementById('floatingNextBtn');
    const noCardsModal = document.getElementById('noCardsModal');
    const addCardsBtn = document.getElementById('addCardsBtn');
    const closeWarningBtn = document.getElementById('closeWarningBtn');

    console.log('Elements found:', {
        addCardBtn: !!addCardBtn,
        addCardModal: !!addCardModal,
        cardForm: !!cardForm,
        cancelAddBtn: !!cancelAddBtn,
        cardsGrid: !!cardsGrid
    });


    if (cardForm) {
        cardForm.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log('Form submitted');
            
            const questionInput = document.getElementById('questionInput');
            const answerInput = document.getElementById('answerInput');
            
            if (questionInput && answerInput) {
                const question = questionInput.value.trim();
                const answer = answerInput.value.trim();
                
                if (question && answer) {
                    addNewCard(question, answer);
                    closeModal();
                    cardForm.reset();
                }
            }
        });
    }
    
    if (flashcard) {
        flashcard.addEventListener("click", flipCard);
    }
    
    if (knowBtn) {
        knowBtn.addEventListener("click", () => handleResponse(true));
    }
    
    if (dontKnowBtn) {
        dontKnowBtn.addEventListener("click", () => handleResponse(false));
    }

    if (addCardBtn) {
        addCardBtn.addEventListener('click', () => {
            console.log('Add button clicked');
            openModal();
        });
    } else {
        console.error('Add Card Button not found!');
    }

    if (cancelAddBtn) {
        cancelAddBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    }

    if (addCardModal) {
        addCardModal.addEventListener('click', (e) => {
            if (e.target === addCardModal) {
                closeModal();
            }
        });
    }

    if (slideModeBtn) {
        slideModeBtn.addEventListener('click', () => switchMode('slide'));
    }
    
    if (revisionModeBtn) {
        revisionModeBtn.addEventListener('click', () => switchMode('revision'));
    }

    let isFlipped = false;

    function flipCard(cardElement) {
        if (!cardElement) return;
        cardElement.classList.toggle('flipped');
    }

    function handleResponse(knewAnswer) {
        if (isFlipped) {
            flipCard();
        }
        
        const message = knewAnswer ? "Great job!" : "Keep practicing!";
        console.log(message);
    }

    const reviseBtn = document.getElementById("reviseBtn");
    if (reviseBtn) {
        reviseBtn.addEventListener("click", () => {
            if (cards.length === 0) {
                alert("Please add some cards first!");
                return;
            }

            homeView.style.display = "none";
            reviseView.style.display = "block";
            currentCard = 0;
            known = 0;
            knowBtn.disabled = false;
            dontKnowBtn.disabled = false;
            updateCard();
        });
    }

    function updateCard() {
        const card = cards[currentCard];
        frontDisplay.textContent = card.front;
        backDisplay.textContent = card.back;
        flashcard.classList.remove("flipped");
        progress.textContent = `${currentCard + 1} / ${cards.length}`;
    }

    function nextCard() {
        currentCard++;
        if (currentCard < cards.length) {
            updateCard();
        } else {
            frontDisplay.textContent = "All done!";
            backDisplay.textContent = `You knew ${known} out of ${cards.length}`;
            flashcard.classList.remove("flipped");
            knowBtn.disabled = true;
            dontKnowBtn.disabled = true;
            progress.textContent = "Finished";
        }
    }

    function openModal() {
        if (!addCardModal) return;
        addCardModal.style.display = 'flex';
        setTimeout(() => {
            addCardModal.classList.add('active');
            const questionInput = document.getElementById('questionInput');
            if (questionInput) questionInput.focus();
        }, 10);
    }

    function closeModal() {
        if (!addCardModal) return;
        addCardModal.classList.remove('active');
        setTimeout(() => {
            addCardModal.style.display = 'none';
            if (cardForm) cardForm.reset();
        }, 300);
    }

    function deleteCard(cardId) {
        const cardElement = document.querySelector(`.card[data-id="${cardId}"]`);
        if (!cardElement) return;

        cardElement.classList.add('card-delete');

        cards = cards.filter(card => card.id !== cardId);
        updateCardCount(); 

        setTimeout(() => {
            cardElement.remove();
        }, 300); 
    }

    function addNewCard(question, answer) {
        if (!cardsGrid || !addCardBtn) return;
        
        console.log('Adding new card:', { question, answer });
        
        const card = {
            id: Date.now(),
            question,
            answer
        };
        
        cards.push(card);
        updateCardCount();
        saveCardsToStorage(); // Save cards to localStorage
        
        const cardElement = createCardElement(card);
        cardsGrid.insertBefore(cardElement, addCardBtn);
        
        requestAnimationFrame(() => {
            cardElement.classList.add('card-entrance');
        });
    }

    function createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.setAttribute('data-id', card.id);
        
        cardDiv.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <button class="delete-btn" aria-label="Delete card">×</button>
                    <div class="status-indicator"></div>
                    <div class="card-content">${escapeHtml(card.question)}</div>
                </div>
                <div class="card-back">
                    <button class="delete-btn" aria-label="Delete card">×</button>
                    <div class="card-content">${escapeHtml(card.answer)}</div>
                    <div class="card-buttons">
                        <button class="know-btn">I know</button>
                        <button class="dont-know-btn">I don't know</button>
                    </div>
                </div>
            </div>
        `;
        
        // Main card clicking to flip
        cardDiv.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-btn') && 
                !e.target.classList.contains('know-btn') && 
                !e.target.classList.contains('dont-know-btn')) {
                flipCard(cardDiv);
            }
        });

        const deleteButtons = cardDiv.querySelectorAll('.delete-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteCard(card.id);
            });
        });
        
        const knowBtn = cardDiv.querySelector('.know-btn');
        if (knowBtn) {
            knowBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const currentCard = e.target.closest('.card');
                if (currentCard) {
                    // Add indicator
                    const indicator = currentCard.querySelector('.status-indicator');
                    if (indicator) {
                        indicator.innerHTML = '✓'; // Checkmark
                        indicator.className = 'status-indicator known';
                    }
                    
                    showToast(`Great! You know "${card.question}"`, 'success');
                    setTimeout(() => currentCard.classList.remove('flipped'), 500);
                }
            });
        }
        
        const dontKnowBtn = cardDiv.querySelector('.dont-know-btn');
        if (dontKnowBtn) {
            dontKnowBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const currentCard = e.target.closest('.card');
                if (currentCard) {
                    // Add indicator
                    const indicator = currentCard.querySelector('.status-indicator');
                    if (indicator) {
                        indicator.innerHTML = '✗'; // X mark
                        indicator.className = 'status-indicator unknown';
                    }
                    
                    showToast(`Keep practicing "${card.question}"`, 'warning');
                    setTimeout(() => currentCard.classList.remove('flipped'), 500);
                }
            });
        }
        
        return cardDiv;
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function switchMode(mode) {
        if (cards.length === 0) {
            alert('Please add some cards first!');
            return;
        }
        
        currentMode = mode;
        
        if (mode === 'slide' || mode === 'revision') {
            alert('Mode switching will be implemented in the next version!');
        }
    }

    document.addEventListener('keydown', (e) => {
        if (addCardModal) {
            if (e.key === 'Escape' && addCardModal.classList.contains('active')) {
                closeModal();
            }
            if (e.key === 'n' && !addCardModal.classList.contains('active')) {
                e.preventDefault();
                openModal();
            }
        }
    });

    function updateCardCount() {
        cardCount.textContent = `${cards.length} Card${cards.length !== 1 ? 's' : ''}`;
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
            }
            const isDarkTheme = document.body.classList.contains('dark-theme');
            localStorage.setItem('darkTheme', isDarkTheme);
        });
        const savedTheme = localStorage.getItem('darkTheme');
        if (savedTheme === 'true') {
            document.body.classList.add('dark-theme');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
    }

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Nav button clicked:', btn.textContent.trim());
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.textContent.includes('Study Mode')) {
                if (cards.length === 0) {
                    showNoCardsWarning();
                    return;
                }
                startStudyMode();
            } else if (btn.textContent.includes('Grid View')) {
                exitStudyMode();
                exitQuizMode();
            } else if (btn.textContent.includes('Quiz Mode')) {
                console.log('Starting quiz mode...');
                if (cards.length === 0) {
                    showNoCardsWarning();
                    return;
                }
                startQuizMode();
            }
        });
    });

    let currentStudyIndex = 0;
    let studyCards = [];
    let cardScores = new Map();

    function startStudyMode() {
        cardsGrid.style.display = 'none';
        studyMode.style.display = 'block';
        studyCards = [...cards].sort(() => Math.random() - 0.5);
        currentStudyIndex = 0;
        updateStudyCard();
        updateProgress();
    }

    function exitStudyMode() {
        studyMode.style.display = 'none';
        cardsGrid.style.display = 'grid';
    }

    function updateStudyCard() {
        if (studyCards.length === 0) return;
        
        const card = studyCards[currentStudyIndex];
        questionContent.textContent = card.question;
        answerContent.textContent = card.answer;
        studyCard.classList.remove('flipped');
        
        prevCardBtn.disabled = currentStudyIndex === 0;
        nextCardBtn.disabled = currentStudyIndex === studyCards.length - 1;
        
        updateProgress();
    }

    function updateProgress() {
        const progress = ((currentStudyIndex + 1) / studyCards.length) * 100;
        progressFill.style.width = `${progress}%`;
        currentCardNumber.textContent = currentStudyIndex + 1;
        totalCards.textContent = studyCards.length;
    }

    if (flipCardBtn) {
        flipCardBtn.addEventListener('click', () => {
            studyCard.classList.toggle('flipped');
        });
    }

    if (prevCardBtn) {
        prevCardBtn.addEventListener('click', () => {
            if (currentStudyIndex > 0) {
                currentStudyIndex--;
                updateStudyCard();
            }
        });
    }

    if (nextCardBtn) {
        nextCardBtn.addEventListener('click', () => {
            if (currentStudyIndex < studyCards.length - 1) {
                currentStudyIndex++;
                updateStudyCard();
            }
        });
    }

    function handleConfidence(score) {
        const currentCard = studyCards[currentStudyIndex];
        cardScores.set(currentCard.id, score);
        
        const btn = score === 1 ? hardBtn : score === 2 ? mediumBtn : easyBtn;
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 500);

        if (currentStudyIndex < studyCards.length - 1) {
            setTimeout(() => {
                currentStudyIndex++;
                updateStudyCard();
            }, 500);
        } else {
            const averageScore = Array.from(cardScores.values()).reduce((a, b) => a + b, 0) / cardScores.size;
            const message = averageScore > 2.5 ? "Great job! You're mastering these cards! 🎉" :
                          averageScore > 1.5 ? "Good progress! Keep practicing! 💪" :
                          "Keep studying! You'll get there! 📚";
            
            setTimeout(() => {
                alert(message);
                exitStudyMode();
            }, 500);
        }
    }

    if (hardBtn) hardBtn.addEventListener('click', () => handleConfidence(1));
    if (mediumBtn) mediumBtn.addEventListener('click', () => handleConfidence(2));
    if (easyBtn) easyBtn.addEventListener('click', () => handleConfidence(3));

    updateCardCount();

    let currentQuizIndex = 0;
    let quizQuestions = [];
    let score = 0;
    const questionsPerQuiz = 10;

    console.log('Quiz Elements:', {
        multipleChoice: !!multipleChoice,
        quizQuestion: !!quizQuestion,
        quizOptions: !!quizOptions,
        quizFeedback: !!quizFeedback,
        nextQuestionBtn: !!nextQuestionBtn,
        quizScore: !!quizScore,
        quizProgress: !!quizProgress,
        quizProgressFill: !!quizProgressFill
    });

    function startQuizMode() {
        console.log('Starting quiz mode with', cards.length, 'cards');
        if (cards.length < 4) {
            alert('Please add at least 4 cards to start the quiz mode!');
            return;
        }

        cardsGrid.style.display = 'none';
        studyMode.style.display = 'none';
        multipleChoice.style.display = 'block';

        generateQuizQuestions();
        currentQuizIndex = 0;
        score = 0;
        updateQuizProgress();
        showQuestion();
    }

    function exitQuizMode() {
        if (multipleChoice) {
            multipleChoice.style.display = 'none';
        }
        cardsGrid.style.display = 'grid';
    }

    function generateQuizQuestions() {
        quizQuestions = [];
        const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
        console.log('Generating quiz questions from', shuffledCards.length, 'cards');
        
        for (let i = 0; i < Math.min(questionsPerQuiz, shuffledCards.length); i++) {
            const correctCard = shuffledCards[i];
            const otherCards = shuffledCards.filter(card => card.id !== correctCard.id);
            
            const isQuestionToAnswer = Math.random() > 0.5;
            
            const question = {
                prompt: isQuestionToAnswer ? correctCard.question : correctCard.answer,
                correctAnswer: isQuestionToAnswer ? correctCard.answer : correctCard.question,
                options: [isQuestionToAnswer ? correctCard.answer : correctCard.question],
                type: isQuestionToAnswer ? 'questionToAnswer' : 'answerToQuestion'
            };

            while (question.options.length < 4 && otherCards.length > 0) {
                const randomIndex = Math.floor(Math.random() * otherCards.length);
                const option = isQuestionToAnswer ? otherCards[randomIndex].answer : otherCards[randomIndex].question;
                
                if (!question.options.includes(option)) {
                    question.options.push(option);
                }
                otherCards.splice(randomIndex, 1);
            }

            question.options = question.options.sort(() => Math.random() - 0.5);
            quizQuestions.push(question);
        }
        console.log('Generated', quizQuestions.length, 'quiz questions');
    }

    function showQuestion() {
        if (!quizQuestions.length) {
            console.error('No quiz questions available');
            return;
        }

        const question = quizQuestions[currentQuizIndex];
        console.log('Showing question', currentQuizIndex + 1, 'of', quizQuestions.length);
        
        const questionType = question.type === 'questionToAnswer' ? 
            'What is the answer to this question?' : 
            'Which question matches this answer?';

        quizQuestion.textContent = `${questionType}\n\n${question.prompt}`;
        
        while (quizOptions.firstChild) {
            quizOptions.firstChild.remove();
        }

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;
            button.dataset.index = index;
            
            button.addEventListener('click', () => handleQuizAnswer(option));
            quizOptions.appendChild(button);
        });

        quizFeedback.classList.remove('active');
        floatingNextBtn.style.display = 'none';
        floatingNextBtn.classList.remove('visible');
    }

    function handleQuizAnswer(selectedAnswer) {
        const question = quizQuestions[currentQuizIndex];
        const isCorrect = selectedAnswer === question.correctAnswer;
        const options = quizOptions.querySelectorAll('.quiz-option');
        
        console.log('Answer selected:', {
            selected: selectedAnswer,
            correct: question.correctAnswer,
            isCorrect
        });

        options.forEach(option => {
            option.classList.add('disabled');
            
            if (option.textContent === question.correctAnswer) {
                option.classList.add('correct');
            } else if (option.textContent === selectedAnswer && !isCorrect) {
                option.classList.add('incorrect');
            }
        });

        const feedbackMessage = quizFeedback.querySelector('.feedback-message');
        if (isCorrect) {
            score++;
            feedbackMessage.textContent = '🎉 Correct! Well done!';
        } else {
            feedbackMessage.textContent = `❌ Incorrect. The correct answer was: ${question.correctAnswer}`;
        }

        quizFeedback.classList.add('active');
        updateQuizProgress();

        floatingNextBtn.style.display = 'flex';
        setTimeout(() => {
            floatingNextBtn.classList.add('visible');
        }, 10);
    }

    function showQuizCompletionModal(score, total) {
        const percentage = (score / total) * 100;
        let message = '';
        
        if (percentage === 100) {
            message = "🏆 Perfect score! You're a FlashMaster champion!";
        } else if (percentage >= 80) {
            message = "🌟 Excellent work! Keep it up!";
        } else if (percentage >= 60) {
            message = "👍 Good job! A bit more practice and you'll be a master!";
        } else {
            message = "📚 Keep practicing! You're learning with every attempt!";
        }

        finalScore.textContent = `${score}/${total}`;
        scorePercentage.textContent = `${Math.round(percentage)}%`;
        completionMessage.textContent = message;

        quizCompletionModal.style.display = 'flex';
        setTimeout(() => {
            quizCompletionModal.classList.add('active');
        }, 10);
    }

    function closeQuizCompletionModal() {
        quizCompletionModal.classList.remove('active');
        setTimeout(() => {
            quizCompletionModal.style.display = 'none';
        }, 300);
    }

    if (retryQuizBtn) {
        retryQuizBtn.addEventListener('click', () => {
            closeQuizCompletionModal();
            startQuizMode();
        });
    }

    if (backToGridBtn) {
        backToGridBtn.addEventListener('click', () => {
            closeQuizCompletionModal();
            exitQuizMode();
        });
    }

    if (floatingNextBtn) {
        floatingNextBtn.addEventListener('click', () => {
            currentQuizIndex++;
            
            if (currentQuizIndex < quizQuestions.length) {
                showQuestion();
            } else {
                showQuizCompletionModal(score, quizQuestions.length);
            }
        });
    }

    function updateQuizProgress() {
        if (!quizQuestions.length) return;
        
        const progress = ((currentQuizIndex + 1) / quizQuestions.length) * 100;
        quizProgressFill.style.width = `${progress}%`;
        quizScore.textContent = `Score: ${score}`;
        quizProgress.textContent = `Question ${currentQuizIndex + 1}/${quizQuestions.length}`;
    }

    function showNoCardsWarning() {
        if (!noCardsModal) return;
        noCardsModal.style.display = 'flex';
        setTimeout(() => {
            noCardsModal.classList.add('active');
        }, 10);
    }

    function closeNoCardsWarning() {
        if (!noCardsModal) return;
        noCardsModal.classList.remove('active');
        setTimeout(() => {
            noCardsModal.style.display = 'none';
        }, 300);
    }

    if (addCardsBtn) {
        addCardsBtn.addEventListener('click', () => {
            closeNoCardsWarning();
            openModal(); // Open the add card modal
        });
    }

    if (closeWarningBtn) {
        closeWarningBtn.addEventListener('click', closeNoCardsWarning);
    }

    function handleCardKnowledge(cardId, isKnown) {
        const card = cards.find(c => c.id === cardId);
        if (!card) return;
        
        const message = isKnown ? 
            `Great! You know "${card.question}"` : 
            `Keep practicing "${card.question}"`;
        
        const cardElement = document.querySelector(`.card[data-id="${cardId}"]`);
        if (cardElement) {
            showToast(message, isKnown ? 'success' : 'warning');
            
            setTimeout(() => {
                if (!cardElement.classList.contains('flipped')) {
                    cardElement.classList.add('flipped');
                }
                
                setTimeout(() => {
                    cardElement.classList.remove('flipped');
                }, 100);
            }, 300);
        }
    }

    function showToast(message, type = 'info') {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-message">${message}</div>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    function saveCardsToStorage() {
        localStorage.setItem('flashcards', JSON.stringify(cards));
    }

    function loadCardsFromStorage() {
        const savedCards = localStorage.getItem('flashcards');
        if (savedCards) {
            cards = JSON.parse(savedCards);
            
            cards.forEach(card => {
                if (card.hasOwnProperty('isKnown')) {
                    delete card.isKnown;
                }
            });
            
            saveCardsToStorage();
            
            const existingCards = document.querySelectorAll('.card:not(#addCardBtn)');
            existingCards.forEach(card => card.remove());
            
            cards.forEach(card => {
                const cardElement = createCardElement(card);
                if (cardsGrid && addCardBtn) {
                    cardsGrid.insertBefore(cardElement, addCardBtn);
                    
                    cardElement.classList.remove('card-known-status', 'card-unknown-status');
                    
                    requestAnimationFrame(() => {
                        cardElement.classList.add('card-entrance');
                    });
                }
            });
            updateCardCount();
        }
    }
});
