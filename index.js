const amounts = [100, 50, 200, 99.99, 88.88, 123.456];
const envelopes = document.querySelectorAll('.envelope');
const resultModal = document.getElementById('resultModal');
let isGameOver = false;
let isSelected = false;

function initializeEnvelopes() {
    envelopes.forEach(envelope => {
        const randomIndex = Math.floor(Math.random() * amounts.length);
        envelope.dataset.value = amounts[randomIndex];
    });
}

function handleEnvelopeClick(event) {
    if (isGameOver) return;
    
    const clickedEnvelope = event.currentTarget;
    
    if (!isSelected) {
        // First click - Select envelope
        isSelected = true;
        
        // Disable other envelopes
        envelopes.forEach(env => {
            if (env !== clickedEnvelope) {
                env.style.opacity = '0';
                env.style.pointerEvents = 'none';
            }
        });
        
        // Center the clicked envelope
        clickedEnvelope.classList.add('selected');
    } else {
        // Second click - Open envelope
        isGameOver = true;
        clickedEnvelope.classList.add('opening');
        createSparkles(clickedEnvelope);
        
        setTimeout(() => {
            const value = parseFloat(clickedEnvelope.dataset.value);
            showModal(value);
        }, 1000);
    }
}

function showModal(value) {
    const modalAmount = resultModal.querySelector('.amount');
    modalAmount.textContent = `${value.toLocaleString('vi-VN')} nghìn đồng`;
    resultModal.classList.add('show');
}

function createSparkles(element) {
    for (let i = 0; i < 50; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 2 + 's';
        element.appendChild(sparkle);
    }
}

// Event Listeners
envelopes.forEach(envelope => {
    envelope.addEventListener('click', handleEnvelopeClick);
});

// Initialize game
initializeEnvelopes();
