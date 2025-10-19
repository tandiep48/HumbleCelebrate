// --- 3D Tag Cloud Initialization ---
document.addEventListener('DOMContentLoaded', function() {
    const texts = [
        'Wishing Maika happiness and success on Vietnamese Women\'s Day',
        'Chúc Quế Ngân có một ngày Phụ nữ Việt Nam thật bình an, hạnh phúc và nhiều thật nhiều niềm vui ^^.',
    ];
    
    // --- Responsive Radius Calculation ---
    // This function checks the screen width and sets an appropriate radius
    // for the TagCloud, ensuring it looks good on both mobile and desktop.
    const getRadius = () => {
        // Use a smaller radius for mobile screens (e.g., less than 768px wide)
        if (window.innerWidth < 768) {
            return 120; // Smaller radius for phones
        }
        // Use a larger radius for tablets and desktops
        return 450; // Larger radius for bigger screens
    };

    const options = {
        radius: getRadius(), // Set the radius dynamically
        maxSpeed: 'fast',
        initSpeed: 'fast',
        direction: 110,
        keep: true
    };

    // Initialize the TagCloud
    let myTagCloud = TagCloud('.tagcloud', texts, options);

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
        this.size = Math.random() * 2.5;
        this.vx = Math.random() * 4 - 1;
        this.vy = Math.random() * 4 - 1;
        this.life = 100;
    }

    Particle.prototype.update = function(index) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 1;
        if (this.life <= 0) {
            particles.splice(index, 1);
            return false;
        }
        return true;
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
        const color = `hsl(${Math.random() * 360}, 100%, 70%)`;

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

    setInterval(createFirework, 2000);
    animate();
    
    // --- Window Resize Handling ---
    // This will resize the canvas and also update the TagCloud radius
    // if the user resizes their browser window.
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Update the TagCloud with the new radius on resize
        const newOptions = {
            radius: getRadius()
        };
        myTagCloud.update(newOptions);
    });
});

