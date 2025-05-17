document.addEventListener('DOMContentLoaded', function() {
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
                    <div class="card-content">${escapeHtml(card.question)}</div>
                </div>
                <div class="card-back">
                    <button class="delete-btn" aria-label="Delete card">×</button>
                    <div class="card-content">${escapeHtml(card.answer)}</div>
                </div>
            </div>
        `;
        
        cardDiv.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-btn')) {
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
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    updateCardCount();
});
