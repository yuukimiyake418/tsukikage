// --- 1. 文字を一文字ずつ出す処理 ---
const title = document.querySelector('.hero-title');
const text = title.textContent;
title.textContent = '';
[...text].forEach((char, index) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.animationDelay = `${index * 0.15 + 0.5}s`; // 遅延を設定
    title.appendChild(span);
});

// --- 2. スクロール時のフェードイン処理 (Intersection Observer) ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // 少しずつずらして表示させる（stagger effect）
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 150); 
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up, .product-card').forEach(el => {
    observer.observe(el);
});

// --- 3. 煙のアニメーション (Canvas) ---
const canvas = document.getElementById('smoke-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100; // 画面下からスタート
        this.vx = (Math.random() - 0.5) * 0.5; // 横揺れ
        this.vy = -Math.random() * 1 - 0.5;   // 上昇速度（ゆったり）
        this.size = Math.random() * 50 + 50;  // 煙の大きさ
        this.alpha = 0;
        this.life = Math.random() * 500 + 500;
        this.maxAlpha = Math.random() * 0.2 + 0.1; // 透明度低め（上品に）
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        
        // ゆらぎ
        this.vx += (Math.random() - 0.5) * 0.02;

        // フェードイン・アウト
        if (this.life > 800) {
            if (this.alpha < this.maxAlpha) this.alpha += 0.005;
        } else if (this.life < 200) {
            this.alpha -= 0.005;
        }

        if (this.life <= 0 || this.alpha <= 0) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        // 煙のようなグラデーション
        let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.alpha})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < 40; i++) { // パーティクル数（多すぎると重い）
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

initParticles();
animate();

