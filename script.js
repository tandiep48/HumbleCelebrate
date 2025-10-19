const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
let fireworks = [];
let particles = [];

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Utility to get a random value from a range
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Particle class for the explosion effect
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = random(1, 3);
        this.alpha = 1;
        this.friction = 0.97;
        this.gravity = 0.1;
        const angle = random(0, Math.PI * 2);
        const speed = random(1, 6);
        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.015;
        return this.alpha > 0;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
    }
}

// Firework class for the rising rocket
class Firework {
    constructor() {
        this.x = random(canvas.width * 0.2, canvas.width * 0.8);
        this.y = canvas.height;
        this.targetY = random(canvas.height * 0.2, canvas.height * 0.5);
        this.color = `hsl(${random(0, 360)}, 100%, 70%)`;
        this.trail = [];
    }

    update() {
        const dy = this.targetY - this.y;
        this.y += dy * 0.05; // Ease towards the target

        this.trail.push({ x: this.x, y: this.y, alpha: 1 });
        if (this.trail.length > 5) {
            this.trail.shift();
        }
        this.trail.forEach(p => p.alpha -= 0.1);

        return this.y > this.targetY + 1;
    }

    explode() {
        const particleCount = 80;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(this.x, this.y, this.color));
        }
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();

        this.trail.forEach(p => {
            ctx.beginPath();
            ctx.fillStyle = `hsla(${parseInt(this.color.match(/\d+/)[0])}, 100%, 70%, ${p.alpha})`;
            ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

let lastLaunchTime = 0;
function animate(currentTime) {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (currentTime - lastLaunchTime > random(400, 1000)) {
        fireworks.push(new Firework());
        lastLaunchTime = currentTime;
    }
    
    fireworks = fireworks.filter(fw => {
        fw.draw();
        const alive = fw.update();
        if (!alive) fw.explode();
        return alive;
    });

    particles = particles.filter(p => {
        p.draw();
        return p.update();
    });
}


// --- 3D TEXT SPHERE LOGIC ---
const texts = [
    'uoY evoL I', 'reveroF sruoY', 'etamluoS', 
    'syawlA', 'enihsnuS yM', 'eM & uoY'
];

const createTagCloud = (texts) => {
    const container = document.getElementById('tagcloud');
    if (!container) return;
    container.innerHTML = ''; 

    const innerRingContainer = document.createElement('div');
    innerRingContainer.className = 'inner-ring-container';
    const outerRingContainer = document.createElement('div');
    outerRingContainer.className = 'outer-ring-container';

    const containerSize = container.offsetWidth;
    const radius1 = containerSize * 0.27;
    const radius2 = containerSize * 0.45;
    
    const midPoint = Math.ceil(texts.length / 2);
    const firstHalfTexts = texts.slice(0, midPoint);
    const secondHalfTexts = texts.slice(midPoint);

    const innerText = firstHalfTexts.join(' • ');
    const innerChars = innerText.split('');
    innerChars.forEach((char, i) => {
        if (char === ' ') return;
        const charSpan = document.createElement('span');
        charSpan.className = 'tagcloud--char';
        charSpan.textContent = char;
        charSpan.style.color = '#ffffff';

        const angle = (i / innerChars.length) * 2 * Math.PI;
        const x = radius1 * Math.cos(angle);
        const z = radius1 * Math.sin(angle);
        
        charSpan.style.transform = `translate3d(${x}px, 0px, ${z}px) rotateY(${angle + Math.PI/2}rad) rotateX(90deg)`;
        innerRingContainer.appendChild(charSpan);
    });

    const outerText = secondHalfTexts.join(' • ');
    const outerChars = outerText.split('');
    outerChars.forEach((char, i) => {
        if (char === ' ') return;
        const charSpan = document.createElement('span');
        charSpan.className = 'tagcloud--char';
        charSpan.textContent = char;
        charSpan.style.color = '#ffffff';

        const angle = (i / outerChars.length) * 2 * Math.PI;
        const x = radius2 * Math.cos(angle);
        const z = radius2 * Math.sin(angle);
        
        charSpan.style.transform = `translate3d(${x}px, 0px, ${z}px) rotateY(${angle + Math.PI/2}rad) rotateX(90deg)`;
        outerRingContainer.appendChild(charSpan);
    });

    container.appendChild(innerRingContainer);
    container.appendChild(outerRingContainer);
};


// --- INITIALIZATION AND RESIZE HANDLING ---
document.addEventListener('DOMContentLoaded', () => {
    // Setup and start fireworks
    setupCanvas();
    animate(0);

    // Initial setup for text rings
    createTagCloud(texts);

    // Add a resize listener for both animations
    let resizeTimer;
    window.addEventListener('resize', () => {
        setupCanvas(); // Resize canvas immediately
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            createTagCloud(texts);
        }, 100); 
    });
});