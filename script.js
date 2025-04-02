const cards = [
    '🍎', '🍎', '🍊', '🍊',
    '🍇', '🍇', '🍉', '🍉',
    '🍋', '🍋', '🍓', '🍓'
];

let flippedCards = [];
let attempts = 0;
let score = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createGameBoard() {
    const gameBoard = document.getElementById('game-board');
    const shuffledCards = shuffleArray([...cards]);
    
    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.value = card;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.textContent = this.dataset.value;
        flippedCards.push(this);
        attempts++;
        document.getElementById('attempts').textContent = attempts;
        
        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.value === card2.dataset.value) {
        score += 10;
        document.getElementById('score').textContent = score;
        flippedCards = [];
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
            flippedCards = [];
        }, 1000);
    }
}

function restartGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    flippedCards = [];
    attempts = 0;
    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('attempts').textContent = attempts;
    createGameBoard();
}

document.getElementById('restart-btn').addEventListener('click', restartGame);

// Start the game
createGameBoard();