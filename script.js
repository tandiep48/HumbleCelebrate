// --- 3D Tag Cloud Initialization ---
document.addEventListener('DOMContentLoaded', function() {
    const texts = [
        'Wishing Maika happiness and success on Vietnamese Women\'s Day',
        'Chúc Quế Ngân có một ngày Phụ nữ Việt Nam thật bình an, hạnh phúc và nhiều thật nhiều niềm vui ^^.',
    ];

    const options = {
        radius: 250, // Increased radius to give text more space
        maxSpeed: 'fast',
        initSpeed: 'fast',
        direction: 135,
        keep: true
    };

    TagCloud('.tagcloud', texts, options);


    // --- Fireworks Animation ---
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    function Particle(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 1;
        this.vx = Math.random() * 4 - 2;
        this.vy = Math.random() * 4 - 2;
        this.life = 100;
    }

    Particle.prototype.update = function(index) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 1;
        if (this.life <= 0) {
            particles.splice(index, 1);
            return false; // Indicate that the particle was removed
        }
        return true; // Indicate that the particle is still alive
    };

    Particle.prototype.draw = function() {
        ctx.globalAlpha = this.life / 100;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    };

    function createFirework() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const color = `hsl(${Math.random() * 360}, 100%, 70%)`; // Random bright color

        for (let i = 0; i < 50; i++) {
            particles.push(new Particle(x, y, color));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const isAlive = particles[i].update(i);
            
            if (isAlive) {
                particles[i].draw();
            }
        }
        requestAnimationFrame(animate);
    }

    // Create fireworks periodically
    setInterval(createFirework, 2000);
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});

