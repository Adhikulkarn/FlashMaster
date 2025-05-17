document.addEventListener('DOMContentLoaded', function() {
    const addCardBtn = document.getElementById('addCardBtn');
    const addCardModal = document.getElementById('addCardModal');
    const cardForm = document.getElementById('cardForm');
    const cancelAddBtn = document.getElementById('cancelAdd');
    const cardsGrid = document.getElementById('cardsGrid');
    const slideModeBtn = document.getElementById('slideMode');
    const revisionModeBtn = document.getElementById('revisionMode');

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
        cardForm.addEventListener("submit", handleFormSubmit);
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

    if (cardForm) {
        cardForm.addEventListener('submit', (e) => {
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

    if (slideModeBtn) {
        slideModeBtn.addEventListener('click', () => switchMode('slide'));
    }
    
    if (revisionModeBtn) {
        revisionModeBtn.addEventListener('click', () => switchMode('revision'));
    }

    
    let isFlipped = false;

    function handleFormSubmit(e) {
        e.preventDefault();
        
        
        frontDisplay.textContent = questionInput.value;
        backDisplay.textContent = answerInput.value;
        
        
        cardForm.reset();
        
        
        if (isFlipped) {
            flipCard();
        }
    }

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

    function addNewCard(question, answer) {
        if (!cardsGrid || !addCardBtn) return;
        
        console.log('Adding new card:', { question, answer });
        
        const card = {
            id: Date.now(),
            question,
            answer
        };
        
        cards.push(card);
        
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
                <div class="card-front">${escapeHtml(card.question)}</div>
                <div class="card-back">${escapeHtml(card.answer)}</div>
            </div>
        `;
        
        cardDiv.addEventListener('click', () => flipCard(cardDiv));
        
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
});
