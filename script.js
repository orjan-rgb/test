// Slot machine game
const symbols = ['🍒', '🍊', '🍇', '💎', '7'];
let balance = 1000;
let currentBet = 10;
const reels = document.querySelectorAll('.reel');
const spinButton = document.getElementById('spinButton');
const betUpButton = document.getElementById('betUp');
const betDownButton = document.getElementById('betDown');
const balanceDisplay = document.getElementById('balance');
const currentBetDisplay = document.getElementById('currentBet');

// Premie struktur basert på emoji
const symbolPayouts = {
    '💎': 10,  // Diamond gir 10 ganger bettet
    '7': 7,    // 7 gir 7 ganger bettet
    '🍇': 4,   // Grape gir 4 ganger bettet
    '🍊': 3,   // Orange gir 3 ganger bettet
    '🍒': 2    // Cherry gir 2 gang bettet
};

// Update display function
function updateDisplay() {
    balanceDisplay.textContent = `Balance: ${balance}`;
    currentBetDisplay.textContent = `Bet: ${currentBet}`;
}

// Function to update reel content
function updateReel(reel, symbol) {
    const reelContent = reel.querySelector('.reel-content');
    reelContent.textContent = symbol;
}

// Function to animate reel
function animateReel(reel, symbol) {
    const reelContent = reel.querySelector('.reel-content');
    
    // Snur i 3 sekunder
    const duration = 3000;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Beregn vinkel basert på progress
        const angle = progress * 360 * 10; // Snurr 10 ganger
        
        // Vis et tilfeldig symbol mens det snurrer
        if (progress < 0.9) { // Snurr i 90% av tiden
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            reelContent.textContent = randomSymbol;
            reelContent.style.transform = `rotate(${angle}deg)`;
        } else { // De siste 10% av tiden, vis endeposisjonen
            reelContent.textContent = symbol;
            reelContent.style.transform = 'rotate(0deg)';
        }
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// Check win function
function checkWin(symbols) {
    const uniqueSymbols = [...new Set(symbols)];
    
    if (uniqueSymbols.length === 1) { // Alle tre symboler er like
        return { type: 'win', symbol: symbols[0] };
    } else if (uniqueSymbols.length === 2) { // To symboler er like
        const symbolCounts = {};
        symbols.forEach(symbol => {
            symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
        });
        const winningSymbol = Object.keys(symbolCounts).find(symbol => symbolCounts[symbol] === 2);
        return { type: 'partial', symbol: winningSymbol };
    } else { // Alle symboler er ulike
        return { type: 'lose' };
    }
}

// Spin function
function spin() {
    if (balance < currentBet) {
        return;
    }

    // Trekk bet
    balance -= currentBet;
    updateDisplay();

    // Generer tilfeldige symboler
    const randomSymbols = Array(3).fill().map(() => 
        symbols[Math.floor(Math.random() * symbols.length)]
    );

    // Animer reeler
    reels.forEach((reel, index) => {
        setTimeout(() => {
            animateReel(reel, randomSymbols[index]);
        }, index * 500);
    });

    // Sjekk vinn
    const result = checkWin(randomSymbols);
    
    if (result.type === 'win') {
        const multiplier = symbolPayouts[result.symbol];
        const winAmount = currentBet * multiplier;
        balance += winAmount;
    } else if (result.type === 'partial') {
        const multiplier = symbolPayouts[result.symbol];
        const winAmount = Math.floor((currentBet * multiplier) / 2);
        balance += winAmount;
    }

    updateDisplay();
}

// Event listeners
spinButton.addEventListener('click', spin);

betUpButton.addEventListener('click', () => {
    if (currentBet < 100) {
        currentBet += 10;
        updateDisplay();
    }
});

betDownButton.addEventListener('click', () => {
    if (currentBet > 10) {
        currentBet -= 10;
        updateDisplay();
    }
});

// Initialize
updateDisplay();