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

function createMultipleSnakes() {
    const colors = [
        '#ffd700', '#ffcc00', '#ffdb4d', 
        '#ff9900', '#ffb366', '#ff8533'
    ];

    // Giảm số lượng rắn xuống 8 con để giảm tải
    for (let i = 0; i < 8; i++) {
        const randomRadius = 100 + Math.random() * 150; // Giảm bán kính xuống
        const randomSegments = 10 + Math.floor(Math.random() * 8); // Giảm số đốt xuống 10-18
        const randomSpeed = 0.005 + Math.random() * 0.01; // Giảm tốc độ để mượt hơn
        const randomScale = 0.6 + Math.random() * 0.4; // Giảm biên độ scale
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;

        createSnake({
            segments: randomSegments,
            radius: randomRadius,
            speed: randomSpeed,
            scale: randomScale,
            baseColor: randomColor,
            startPosition: { x: startX, y: startY }
        });
    }
}

function createSnake(config) {
    const {segments, radius, speed, scale, baseColor, startPosition} = config;
    const snake = [];
    const positions = [];

    const snakeContainer = document.createElement('div');
    snakeContainer.className = 'snake';
    snakeContainer.style.willChange = 'transform';
    document.body.appendChild(snakeContainer);

    for (let i = 0; i < segments; i++) {
        const segment = document.createElement('div');
        segment.className = 'snake-segment';
        segment.style.opacity = 1 - (i / segments) * 0.7;
        segment.style.transform = `scale(${(1 - (i / segments) * 0.5) * scale})`;
        segment.style.animation = `snakeGlow 2s infinite ${i * 0.1}s`;
        segment.style.background = `radial-gradient(circle at 50% 50%, 
            ${baseColor},
            ${adjustColor(baseColor, -30)})`;
        segment.style.willChange = 'transform';
        snakeContainer.appendChild(segment);
        snake.push(segment);
        positions.push({ x: 0, y: 0 });
    }

    let currentX = startPosition.x;
    let currentY = startPosition.y;
    let angle = Math.random() * Math.PI * 2;
    let direction = Math.random() < 0.5 ? 1 : -1;
    let lastFrame = 0;

    function updateSnake(timestamp) {
        // Giới hạn FPS để tối ưu hiệu năng
        if (timestamp - lastFrame < 16) { // Khoảng 60fps
            requestAnimationFrame(updateSnake);
            return;
        }
        lastFrame = timestamp;

        angle += speed * direction;
        
        const centerX = startPosition.x;
        const centerY = startPosition.y;
        const targetX = centerX + Math.cos(angle) * radius;
        const targetY = centerY + Math.sin(angle) * radius;

        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;

        positions.unshift({ x: currentX, y: currentY });
        positions.pop();

        snake.forEach((segment, index) => {
            const pos = positions[index];
            // Sử dụng transform thay vì left/top để cải thiện hiệu năng
            segment.style.transform = `translate(${pos.x - (10 * scale)}px, ${pos.y - (10 * scale)}px) scale(${(1 - (index / segments) * 0.5) * scale})`;
        });

        requestAnimationFrame(updateSnake);
    }

    requestAnimationFrame(updateSnake);
}

// Hàm hỗ trợ điều chỉnh màu
function adjustColor(color, amount) {
    return color.replace(/[^,]+(?=\))/, (match) => {
        const num = parseInt(match.replace(/[^\d]/g, ''));
        return Math.max(0, Math.min(255, num + amount));
    });
}

// Khởi tạo nhiều con rắn
createMultipleSnakes();

// Thêm class Firework để quản lý pháo hoa
class Firework {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 2;
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
        this.particles = [];
        this.alive = true;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Kiểm tra xem pháo hoa đã đến đích chưa
        if (Math.abs(this.x - this.targetX) < 5 && Math.abs(this.y - this.targetY) < 5) {
            this.explode();
            this.alive = false;
        }
    }

    explode() {
        const particleCount = 100;
        const angleStep = (Math.PI * 2) / particleCount;
        const colors = ['#FFD700', '#FF0000', '#FF69B4', '#00FF00', '#FFA500', '#4169E1'];

        for (let i = 0; i < particleCount; i++) {
            const angle = angleStep * i;
            const color = colors[Math.floor(Math.random() * colors.length)];
            this.particles.push(new Particle(
                this.x,
                this.y,
                Math.cos(angle) * (1 + Math.random()),
                Math.sin(angle) * (1 + Math.random()),
                color
            ));
        }
    }

    draw(ctx) {
        if (this.alive) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#FFF';
            ctx.fill();
        }

        this.particles.forEach((particle, index) => {
            if (particle.alpha <= 0) {
                this.particles.splice(index, 1);
            } else {
                particle.update();
                particle.draw(ctx);
            }
        });
    }
}

class Particle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx * 3;
        this.vy = vy * 3;
        this.color = color;
        this.alpha = 1;
        this.decay = 0.015;
        this.gravity = 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

// Khởi tạo canvas cho pháo hoa
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '1000';
canvas.style.background = 'transparent';
document.body.appendChild(canvas);

// Điều chỉnh kích thước canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const ctx = canvas.getContext('2d');
const fireworks = [];

// Tự động bắn pháo hoa
function autoLaunchFirework() {
    const startX = Math.random() * canvas.width;
    const startY = canvas.height;
    const targetX = Math.random() * canvas.width;
    const targetY = canvas.height * 0.2 + (Math.random() * canvas.height * 0.5);
    
    fireworks.push(new Firework(startX, startY, targetX, targetY));
}

// Animation loop cho pháo hoa
function animateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw(ctx);
        
        if (!firework.alive && firework.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });

    requestAnimationFrame(animateFireworks);
}

// Bắt đầu animation
animateFireworks();

// Tự động bắn pháo hoa mỗi 2 giây
setInterval(autoLaunchFirework, 2000);

// Thêm pháo hoa khi click vào màn hình
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    fireworks.push(new Firework(
        Math.random() * canvas.width,
        canvas.height,
        x,
        y
    ));
});

