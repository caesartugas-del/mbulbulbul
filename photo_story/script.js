/**
 * A STORY OF US — HIGH-END CINEMATIC & ROMANTIC ENGINE
 * Features:
 * - Romantic Background Music Player ("love u, i do.mp3") with Floating Controller & Equalizer
 * - Lush Flower Garden Interactive Rotating Background (Large Blooms & Garden Density)
 * - Multi-Flower Blooming Bouquet Animation (Intro Overlay & Closing Scene)
 * - Fast & Responsive HTML-Aware Typewriter Typing Animation (Optimized Flow)
 * - Polaroid 3D Tilt Parallax
 * - Final Memory Montage Slideshow
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundMusic();
  initBackgroundFlowersCanvas();
  initIntroFlowerOverlay();
  initScrollReveals();
  initMouseParallax();
  initMontagePlayer();
  initFlowerBloomingSection();
});

/* ==========================================================================
   0. ROMANTIC BACKGROUND MUSIC CONTROLLER (INFINITE SEAMLESS LOOP)
   ========================================================================== */
let globalMusicPlaying = false;

function initBackgroundMusic() {
  const bgMusic = document.getElementById('bg-music');
  const toggleBtn = document.getElementById('music-toggle-btn');
  const tooltip = document.querySelector('.music-title-tooltip');
  if (!bgMusic || !toggleBtn) return;

  bgMusic.volume = 0.65;
  bgMusic.loop = true; // Native HTML5 loop

  // Robust fallback listener: Ensure song loops forever on all browsers
  bgMusic.addEventListener('ended', function () {
    this.currentTime = 0;
    this.play().catch(() => {});
  });

  function playMusic() {
    bgMusic.play().then(() => {
      globalMusicPlaying = true;
      toggleBtn.classList.add('playing');
      if (tooltip) {
        tooltip.classList.add('show-briefly');
        setTimeout(() => { tooltip.classList.remove('show-briefly'); }, 3500);
      }
    }).catch(() => {
      // Handled on first user click
    });
  }

  function pauseMusic() {
    bgMusic.pause();
    globalMusicPlaying = false;
    toggleBtn.classList.remove('playing');
  }

  toggleBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });

  // Global first-click unlock
  const unlockAudio = () => {
    if (!globalMusicPlaying && !bgMusic.paused) return;
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };
  document.addEventListener('click', unlockAudio, { once: true });
  document.addEventListener('touchstart', unlockAudio, { once: true });

  window.playStoryMusic = playMusic;
}

/* ==========================================================================
   1. LUSH FLOWER GARDEN DYNAMIC LIVING BACKGROUND CANVAS
   ========================================================================== */
function initBackgroundFlowersCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let mouse = { x: -1000, y: -1000, active: false, vx: 0, vy: 0, lastX: 0, lastY: 0 };

  window.addEventListener('mousemove', (e) => {
    mouse.vx = (e.clientX - mouse.lastX) * 0.3;
    mouse.vy = (e.clientY - mouse.lastY) * 0.3;
    mouse.lastX = e.clientX;
    mouse.lastY = e.clientY;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Spawn blossoming flowers on click
  window.addEventListener('click', (e) => {
    if (e.target.closest('button, input, .music-control-btn')) return;
    for (let i = 0; i < 6; i++) {
      flowers.push(new GardenFlower(e.clientX + (Math.random() - 0.5) * 40, e.clientY + (Math.random() - 0.5) * 40, true));
    }
  });

  const FLOWER_COUNT = 58;
  const flowers = [];

  class GardenFlower {
    constructor(startX, startY, isSpawned = false) {
      this.isSpawned = isSpawned;
      this.reset(startX, startY);
    }

    reset(startX, startY) {
      this.x = startX !== undefined ? startX : Math.random() * width;
      this.y = startY !== undefined ? startY : Math.random() * height;
      
      const sizeTier = Math.random();
      if (sizeTier < 0.3) {
        this.size = Math.random() * 24 + 65; // Grand blooms (65px - 89px)
        this.alpha = Math.random() * 0.22 + 0.18;
      } else if (sizeTier < 0.7) {
        this.size = Math.random() * 20 + 44; // Medium blooms (44px - 64px)
        this.alpha = Math.random() * 0.3 + 0.25;
      } else {
        this.size = Math.random() * 16 + 28; // Small accent blossoms (28px - 44px)
        this.alpha = Math.random() * 0.35 + 0.3;
      }

      this.type = Math.floor(Math.random() * 11);
      
      // Gentle, calm multi-directional drift (slowed down)
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = -(Math.random() * 0.22 + 0.12); // Slow, gentle upward floating
      
      // Gentle rotation & spin animation
      this.angle = Math.random() * Math.PI * 2;
      this.spinSpeed = (Math.random() * 0.006 + 0.0025) * (Math.random() > 0.5 ? 1 : -1);
      
      // Smooth calm swaying physics
      this.wobbleX = Math.random() * Math.PI * 2;
      this.wobbleY = Math.random() * Math.PI * 2;
      this.wobbleSpeedX = Math.random() * 0.012 + 0.005;
      this.wobbleSpeedY = Math.random() * 0.009 + 0.004;
      
      // Gentle breathing petal pulse animation
      this.pulseAngle = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.014 + 0.006;

      this.decay = this.isSpawned ? 0.003 : 0;
      this.scale = this.isSpawned ? 0.1 : 1;
      this.targetScale = 1;
    }

    update() {
      if (this.scale < this.targetScale) {
        this.scale += 0.03;
      }

      // Continuous gentle movements
      this.angle += this.spinSpeed;
      this.wobbleX += this.wobbleSpeedX;
      this.wobbleY += this.wobbleSpeedY;
      this.pulseAngle += this.pulseSpeed;

      // Harmonic fluid floating path (soft & calm)
      this.x += this.vx + Math.sin(this.wobbleX) * 0.45 + Math.cos(this.wobbleY * 0.6) * 0.2;
      this.y += this.vy + Math.sin(this.wobbleY) * 0.18;

      // Interactive mouse breeze repulsion & swirl
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 180;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 3 + (mouse.vx || 0) * 0.12;
          this.y += Math.sin(angle) * force * 3 + (mouse.vy || 0) * 0.12;
          this.angle += this.spinSpeed * 2.2;
        }
      }

      if (this.isSpawned) {
        this.alpha -= this.decay;
        if (this.alpha <= 0) {
          const index = flowers.indexOf(this);
          if (index > -1) flowers.splice(index, 1);
        }
      } else {
        // Continuous screen looping
        if (this.y < -this.size - 30) this.reset(Math.random() * width, height + this.size + 30);
        if (this.x < -this.size - 30) this.x = width + this.size + 10;
        if (this.x > width + this.size + 30) this.x = -this.size - 10;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      // Apply dynamic breathing scale
      const breathingScale = this.scale * (1 + Math.sin(this.pulseAngle) * 0.07);
      ctx.scale(breathingScale, breathingScale);
      ctx.globalAlpha = Math.max(0, this.alpha);

      switch (this.type) {
        case 0: drawGrandGardenPeony(ctx, this.size); break;
        case 1: drawLushSunflower(ctx, this.size); break;
        case 2: drawLayeredEnglishRose(ctx, this.size); break;
        case 3: drawHydrangeaCluster(ctx, this.size); break;
        case 4: drawWildSakuraBloom(ctx, this.size); break;
        case 5: drawSwirlingGardenPetals(ctx, this.size); break;
        case 6: drawBlueGardenChrysanthemum(ctx, this.size); break;
        case 7: drawBlueHydrangeaCluster(ctx, this.size); break;
        case 8: drawBlueEnglishRose(ctx, this.size); break;
        case 9: drawBlueSakuraBloom(ctx, this.size); break;
        case 10: drawBlueSwirlingPetals(ctx, this.size); break;
      }

      ctx.restore();
    }
  }

  function drawGrandGardenPeony(c, s) {
    for (let i = 0; i < 12; i++) {
      c.save();
      c.rotate((i * Math.PI * 2) / 12);
      c.beginPath();
      c.ellipse(0, -s * 0.48, Math.max(0.1, s * 0.28), Math.max(0.1, s * 0.44), 0, 0, Math.PI * 2);
      c.fillStyle = 'rgba(254, 235, 185, 0.75)';
      c.shadowColor = 'rgba(212, 175, 55, 0.35)';
      c.shadowBlur = 8;
      c.fill();
      c.restore();
    }
    for (let i = 0; i < 8; i++) {
      c.save();
      c.rotate((i * Math.PI * 2) / 8 + Math.PI / 8);
      c.beginPath();
      c.ellipse(0, -s * 0.28, Math.max(0.1, s * 0.22), Math.max(0.1, s * 0.28), 0, 0, Math.PI * 2);
      c.fillStyle = 'rgba(255, 247, 215, 0.9)';
      c.fill();
      c.restore();
    }
    c.beginPath();
    c.arc(0, 0, Math.max(0.1, s * 0.2), 0, Math.PI * 2);
    const grad = c.createRadialGradient(0, 0, Math.max(0.1, s * 0.02), 0, 0, Math.max(0.2, s * 0.2));
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#ffe066');
    grad.addColorStop(1, '#d4af37');
    c.fillStyle = grad;
    c.shadowColor = 'rgba(212, 175, 55, 0.6)';
    c.shadowBlur = 10;
    c.fill();
  }

  function drawLushSunflower(c, s) {
    const petals = 16;
    for (let i = 0; i < petals; i++) {
      c.save();
      c.rotate((i * Math.PI * 2) / petals);
      c.beginPath();
      c.ellipse(0, -s * 0.52, Math.max(0.1, s * 0.13), Math.max(0.1, s * 0.48), 0, 0, Math.PI * 2);
      c.fillStyle = 'rgba(255, 222, 115, 0.85)';
      c.shadowColor = 'rgba(230, 160, 40, 0.3)';
      c.shadowBlur = 6;
      c.fill();
      c.restore();
    }
    c.beginPath();
    c.arc(0, 0, Math.max(0.1, s * 0.28), 0, Math.PI * 2);
    c.fillStyle = '#e5a038';
    c.fill();
    c.beginPath();
    c.arc(0, 0, Math.max(0.1, s * 0.15), 0, Math.PI * 2);
    c.fillStyle = '#b87514';
    c.fill();
  }

  function drawLayeredEnglishRose(c, s) {
    for (let i = 0; i < 8; i++) {
      c.save();
      c.rotate((i * Math.PI * 2) / 8);
      c.beginPath();
      c.arc(0, -s * 0.42, Math.max(0.1, s * 0.32), 0, Math.PI * 2);
      c.fillStyle = 'rgba(255, 218, 175, 0.72)';
      c.fill();
      c.restore();
    }
    for (let i = 0; i < 6; i++) {
      c.save();
      c.rotate((i * Math.PI * 2) / 6 + Math.PI / 6);
      c.beginPath();
      c.arc(0, -s * 0.24, Math.max(0.1, s * 0.22), 0, Math.PI * 2);
      c.fillStyle = 'rgba(255, 240, 210, 0.9)';
      c.fill();
      c.restore();
    }
    c.beginPath();
    c.arc(0, 0, Math.max(0.1, s * 0.14), 0, Math.PI * 2);
    c.fillStyle = '#d49b28';
    c.fill();
  }

  function drawHydrangeaCluster(c, s) {
    const offsets = [
      { ox: 0, oy: -s * 0.25 },
      { ox: -s * 0.22, oy: s * 0.12 },
      { ox: s * 0.22, oy: s * 0.12 },
      { ox: 0, oy: s * 0.05 }
    ];

    offsets.forEach((off) => {
      c.save();
      c.translate(off.ox, off.oy);
      for (let p = 0; p < 4; p++) {
        c.save();
        c.rotate((p * Math.PI * 2) / 4);
        c.beginPath();
        c.ellipse(0, -s * 0.2, Math.max(0.1, s * 0.1), Math.max(0.1, s * 0.16), 0, 0, Math.PI * 2);
        c.fillStyle = 'rgba(248, 226, 175, 0.8)';
        c.fill();
        c.restore();
      }
      c.beginPath();
      c.arc(0, 0, Math.max(0.1, s * 0.05), 0, Math.PI * 2);
      c.fillStyle = '#ffffff';
      c.fill();
      c.restore();
    });
  }

  function drawWildSakuraBloom(c, s) {
    const petals = 5;
    for (let i = 0; i < petals; i++) {
      c.save();
      c.rotate((i * Math.PI * 2) / petals);
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(-s * 0.42, -s * 0.35, -s * 0.35, -s * 0.9, 0, -s * 0.9);
      c.bezierCurveTo(s * 0.35, -s * 0.9, s * 0.42, -s * 0.35, 0, 0);
      c.fillStyle = 'rgba(255, 230, 160, 0.8)';
      c.shadowColor = 'rgba(212, 175, 55, 0.35)';
      c.shadowBlur = 6;
      c.fill();
      c.restore();
    }
    c.beginPath();
    c.arc(0, 0, Math.max(0.1, s * 0.18), 0, Math.PI * 2);
    c.fillStyle = '#d4af37';
    c.fill();
  }

  function drawSwirlingGardenPetals(c, s) {
    for (let i = 0; i < 3; i++) {
      c.save();
      c.rotate((i * Math.PI * 2) / 3);
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(-s * 0.3, -s * 0.6, 0, -s * 0.85);
      c.quadraticCurveTo(s * 0.3, -s * 0.6, 0, 0);
      c.fillStyle = 'rgba(252, 232, 165, 0.78)';
      c.fill();
      c.restore();
    }
  }

  /* --- BLUE GARDEN BACKGROUND FLOWER VARIETIES --- */

  function drawBlueGardenChrysanthemum(c, s) {
    const petals = 18;
    for (let i = 0; i < petals; i++) {
      c.save();
      c.rotate((i * Math.PI * 2) / petals);
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(-s * 0.12, -s * 0.35, 0, -s * 0.52);
      c.quadraticCurveTo(s * 0.12, -s * 0.35, 0, 0);
      c.fillStyle = 'rgba(147, 197, 253, 0.82)'; // light cerulean blue
      c.shadowColor = 'rgba(37, 99, 235, 0.45)';
      c.shadowBlur = 7;
      c.fill();
      c.restore();
    }
    for (let i = 0; i < 12; i++) {
      c.save();
      c.rotate((i * Math.PI * 2) / 12 + Math.PI / 12);
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(-s * 0.10, -s * 0.25, 0, -s * 0.36);
      c.quadraticCurveTo(s * 0.10, -s * 0.25, 0, 0);
      c.fillStyle = 'rgba(191, 219, 254, 0.9)'; // pastel ice blue
      c.fill();
      c.restore();
    }
    c.beginPath();
    c.arc(0, 0, Math.max(0.1, s * 0.16), 0, Math.PI * 2);
    const grad = c.createRadialGradient(0, 0, Math.max(0.1, s * 0.02), 0, 0, Math.max(0.2, s * 0.16));
    grad.addColorStop(0, '#fef08a'); // golden stamen center
    grad.addColorStop(0.6, '#38bdf8');
    grad.addColorStop(1, '#1e40af');
    c.fillStyle = grad;
    c.shadowColor = 'rgba(56, 189, 248, 0.6)';
    c.shadowBlur = 8;
    c.fill();
  }

  function drawBlueHydrangeaCluster(c, s) {
    const offsets = [
      { ox: 0, oy: -s * 0.25 },
      { ox: -s * 0.22, oy: s * 0.12 },
      { ox: s * 0.22, oy: s * 0.12 },
      { ox: 0, oy: s * 0.05 }
    ];

    offsets.forEach((off) => {
      c.save();
      c.translate(off.ox, off.oy);
      for (let p = 0; p < 4; p++) {
        c.save();
        c.rotate((p * Math.PI * 2) / 4);
        c.beginPath();
        c.ellipse(0, -s * 0.2, Math.max(0.1, s * 0.1), Math.max(0.1, s * 0.16), 0, 0, Math.PI * 2);
        c.fillStyle = 'rgba(186, 230, 253, 0.85)'; // pastel ice blue
        c.shadowColor = 'rgba(59, 130, 246, 0.35)';
        c.shadowBlur = 6;
        c.fill();
        c.restore();
      }
      c.beginPath();
      c.arc(0, 0, Math.max(0.1, s * 0.05), 0, Math.PI * 2);
      c.fillStyle = '#ffffff';
      c.fill();
      c.restore();
    });
  }

  function drawBlueEnglishRose(c, s) {
    for (let i = 0; i < 8; i++) {
      c.save();
      c.rotate((i * Math.PI * 2) / 8);
      c.beginPath();
      c.arc(0, -s * 0.42, Math.max(0.1, s * 0.32), 0, Math.PI * 2);
      c.fillStyle = 'rgba(147, 197, 253, 0.72)'; // soft cerulean blue
      c.shadowColor = 'rgba(30, 58, 138, 0.3)';
      c.shadowBlur = 6;
      c.fill();
      c.restore();
    }
    for (let i = 0; i < 6; i++) {
      c.save();
      c.rotate((i * Math.PI * 2) / 6 + Math.PI / 6);
      c.beginPath();
      c.arc(0, -s * 0.24, Math.max(0.1, s * 0.22), 0, Math.PI * 2);
      c.fillStyle = 'rgba(219, 234, 254, 0.9)'; // light frost blue
      c.fill();
      c.restore();
    }
    c.beginPath();
    c.arc(0, 0, Math.max(0.1, s * 0.14), 0, Math.PI * 2);
    c.fillStyle = '#2563eb'; // sapphire core
    c.fill();
  }

  function drawBlueSakuraBloom(c, s) {
    const petals = 5;
    for (let i = 0; i < petals; i++) {
      c.save();
      c.rotate((i * Math.PI * 2) / petals);
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(-s * 0.42, -s * 0.35, -s * 0.35, -s * 0.9, 0, -s * 0.9);
      c.bezierCurveTo(s * 0.35, -s * 0.9, s * 0.42, -s * 0.35, 0, 0);
      c.fillStyle = 'rgba(186, 230, 253, 0.82)'; // light cyan/powder blue
      c.shadowColor = 'rgba(59, 130, 246, 0.35)';
      c.shadowBlur = 6;
      c.fill();
      c.restore();
    }
    c.beginPath();
    c.arc(0, 0, Math.max(0.1, s * 0.18), 0, Math.PI * 2);
    c.fillStyle = '#fde047'; // bright gold stamen
    c.fill();
  }

  function drawBlueSwirlingPetals(c, s) {
    for (let i = 0; i < 3; i++) {
      c.save();
      c.rotate((i * Math.PI * 2) / 3);
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(-s * 0.3, -s * 0.6, 0, -s * 0.85);
      c.quadraticCurveTo(s * 0.3, -s * 0.6, 0, 0);
      c.fillStyle = 'rgba(147, 197, 253, 0.78)';
      c.shadowColor = 'rgba(37, 99, 235, 0.3)';
      c.shadowBlur = 5;
      c.fill();
      c.restore();
    }
  }

  for (let i = 0; i < FLOWER_COUNT; i++) {
    flowers.push(new GardenFlower());
  }

  function animateFlowers() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < flowers.length; i++) {
      flowers[i].update();
      flowers[i].draw();
    }
    requestAnimationFrame(animateFlowers);
  }

  animateFlowers();
}

/* ==========================================================================
   2. SLENDER & ELEGANT LIVING FLORIST BOUQUET ENGINE (GOLD & BLUE CHRYSANTHEMUMS)
   ========================================================================== */
const CHRYSANTHEMUM_THEMES = {
  gold: {
    outer: ['#a16207', '#d97706', '#fde047', '#fef9c3'],
    mid: ['#c2410c', '#f59e0b', '#fef08a', '#ffffff'],
    inner: ['#ea580c', '#fef08a', '#ffffff'],
    core: ['#713f12', '#a16207', '#eab308'],
    stamen: '#fef9c3',
    shadow: 'rgba(161, 98, 7, 0.35)',
    coreGlow: 'rgba(161, 98, 7, 0.6)'
  },
  sapphire_blue: {
    outer: ['#1e3a8a', '#2563eb', '#60a5fa', '#dbeafe'],
    mid: ['#1d4ed8', '#3b82f6', '#93c5fd', '#ffffff'],
    inner: ['#2563eb', '#93c5fd', '#ffffff'],
    core: ['#0f172a', '#1e40af', '#38bdf8'],
    stamen: '#fef08a',
    shadow: 'rgba(30, 58, 138, 0.45)',
    coreGlow: 'rgba(37, 99, 235, 0.65)'
  },
  cerulean_blue: {
    outer: ['#1d4ed8', '#3b82f6', '#93c5fd', '#eff6ff'],
    mid: ['#2563eb', '#60a5fa', '#bfdbfe', '#ffffff'],
    inner: ['#3b82f6', '#bfdbfe', '#ffffff'],
    core: ['#1e3a8a', '#2563eb', '#67e8f9'],
    stamen: '#fef9c3',
    shadow: 'rgba(37, 99, 235, 0.38)',
    coreGlow: 'rgba(56, 189, 248, 0.65)'
  },
  ice_blue: {
    outer: ['#2563eb', '#60a5fa', '#bae6fd', '#f0f9ff'],
    mid: ['#38bdf8', '#93c5fd', '#e0f2fe', '#ffffff'],
    inner: ['#60a5fa', '#dbeafe', '#ffffff'],
    core: ['#1e40af', '#38bdf8', '#bae6fd'],
    stamen: '#fde047',
    shadow: 'rgba(56, 189, 248, 0.35)',
    coreGlow: 'rgba(147, 197, 253, 0.6)'
  }
};

function renderBloomingBouquet(ctx, width, height, progress, time = 0) {
  ctx.clearRect(0, 0, width, height);
  const cx = width / 2;
  const cy = height / 2 - 15;
  const baseStemX = cx;
  const baseStemY = cy + 225;

  // Gentle wind sway offset for the whole bouquet crown
  const crownSwayX = Math.sin(time * 1.2) * 2.2;
  const crownSwayY = Math.cos(time * 0.8) * 1.0;

  // 1. SLENDER ORGANIC BACK WRAPPING PAPER & SHADOW LAYER
  if (progress > 0.03) {
    const wrapP = Math.min((progress - 0.03) / 0.35, 1);
    drawSlenderBackWrapper(ctx, cx, cy, baseStemY, wrapP, time);
  }

  // 2. STEMS & BOTANICAL STEM ARCHITECTURE (SLENDER VERTICAL POISE)
  const bouquetTargets = [
    // Center & Focal: Grand Sunshine Gold Chrysanthemum (Matching her real bouquet)
    { x: cx + crownSwayX, y: cy - 20 + crownSwayY, delay: 0.28, type: 'chrysanthemum_gold', size: 70, swayOffset: 0 },
    
    // Flanking Mid Blooms: Vibrant Sapphire Royal Blue Chrysanthemums
    { x: cx - 55 + crownSwayX * 0.8, y: cy - 15 + crownSwayY, delay: 0.22, type: 'chrysanthemum_sapphire_blue', size: 56, swayOffset: 1.2 },
    { x: cx + 55 + crownSwayX * 0.8, y: cy - 10 + crownSwayY, delay: 0.24, type: 'chrysanthemum_sapphire_blue', size: 56, swayOffset: 2.1 },
    
    // Upper Layer: Golden Sunshine & Soft Cerulean Ice-Blue Chrysanthemums
    { x: cx - 38 + crownSwayX * 1.1, y: cy - 85 + crownSwayY * 1.1, delay: 0.35, type: 'chrysanthemum_gold', size: 56, swayOffset: 3.4 },
    { x: cx + 40 + crownSwayX * 1.1, y: cy - 80 + crownSwayY * 1.1, delay: 0.38, type: 'chrysanthemum_cerulean_blue', size: 56, swayOffset: 4.2 },
    
    // Crown Apex: Golden Sunshine Chrysanthemum
    { x: cx + crownSwayX * 1.3, y: cy - 142 + crownSwayY * 1.3, delay: 0.44, type: 'chrysanthemum_top', size: 50, swayOffset: 0.8 },
    
    // Lower Side Blooms: Soft Cerulean & Sapphire Blue Chrysanthemums
    { x: cx - 76 + crownSwayX * 0.7, y: cy + 30 + crownSwayY * 0.7, delay: 0.18, type: 'chrysanthemum_cerulean_blue', size: 48, swayOffset: 1.8 },
    { x: cx + 78 + crownSwayX * 0.7, y: cy + 35 + crownSwayY * 0.7, delay: 0.20, type: 'chrysanthemum_gold', size: 48, swayOffset: 2.7 },
    
    // Upper Outer Accents: Soft Sky Blue & Sapphire Chrysanthemums
    { x: cx - 68 + crownSwayX * 0.9, y: cy - 55 + crownSwayY * 0.9, delay: 0.26, type: 'chrysanthemum_ice_blue', size: 42, swayOffset: 3.1 },
    { x: cx + 70 + crownSwayX * 0.9, y: cy - 50 + crownSwayY * 0.9, delay: 0.28, type: 'chrysanthemum_cerulean_blue', size: 42, swayOffset: 4.5 },
    
    // Delicate Botanical Sprigs & Baby's Breath Accents (Blue & White Mist)
    { x: cx - 92 + crownSwayX * 0.6, y: cy - 25 + crownSwayY * 0.6, delay: 0.16, type: 'babys_breath_blue', size: 28, swayOffset: 5.1 },
    { x: cx + 92 + crownSwayX * 0.6, y: cy - 20 + crownSwayY * 0.6, delay: 0.18, type: 'babys_breath', size: 28, swayOffset: 1.5 },
    { x: cx - 22 + crownSwayX * 1.4, y: cy - 168 + crownSwayY * 1.4, delay: 0.46, type: 'babys_breath_blue', size: 25, swayOffset: 2.8 },
    { x: cx + 25 + crownSwayX * 1.4, y: cy - 165 + crownSwayY * 1.4, delay: 0.48, type: 'babys_breath', size: 25, swayOffset: 3.9 }
  ];

  // Draw Slender Arching Stems
  bouquetTargets.forEach((target) => {
    const stemProgress = Math.min(progress / (target.delay + 0.18), 1);
    if (stemProgress > 0) {
      const curX = baseStemX + (target.x - baseStemX) * stemProgress;
      const curY = (baseStemY - 12) + (target.y - (baseStemY - 12)) * stemProgress;
      const midX = (baseStemX + target.x) / 2 + (target.x - cx) * 0.12 + Math.sin(time + target.swayOffset) * 1.2;
      const midY = (baseStemY + target.y) / 2 + 25;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(baseStemX, baseStemY - 12);
      ctx.quadraticCurveTo(midX, midY, curX, curY);
      
      const stemGrad = ctx.createLinearGradient(baseStemX, baseStemY, curX, curY);
      stemGrad.addColorStop(0, '#324a18');
      stemGrad.addColorStop(0.6, '#4f7526');
      stemGrad.addColorStop(1, '#669131');
      ctx.strokeStyle = stemGrad;
      ctx.lineWidth = target.size > 50 ? 4.5 : 3.0;
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(38, 56, 17, 0.22)';
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.restore();
    }
  });

  // 3. EUCALYPTUS FOLIAGE & BOTANICAL SAGE LEAVES (Slender Poise)
  if (progress > 0.12) {
    const foliageP = Math.min((progress - 0.12) / 0.4, 1);
    drawSlenderEucalyptusSprigs(ctx, cx, cy, foliageP, time);
  }

  // 4. INNER DELICATE BILLOWING TISSUE PAPER LINING
  if (progress > 0.14) {
    const tissueP = Math.min((progress - 0.14) / 0.35, 1);
    drawSlenderTissueLiner(ctx, cx, cy, baseStemY, tissueP, time);
  }

  // 5. BLOOMING LIVING CHRYSANTHEMUMS (Gold + Blue Harmonic Variation)
  bouquetTargets.forEach((target) => {
    if (progress > target.delay) {
      const bloomP = Math.min((progress - target.delay) / (1 - target.delay), 1);
      ctx.save();
      ctx.translate(target.x, target.y);

      switch (target.type) {
        case 'chrysanthemum_gold':
        case 'chrysanthemum_top':
          drawOrganicChrysanthemum(ctx, target.size, bloomP, time, target.swayOffset, 'gold');
          break;
        case 'chrysanthemum_sapphire_blue':
          drawOrganicChrysanthemum(ctx, target.size, bloomP, time, target.swayOffset, 'sapphire_blue');
          break;
        case 'chrysanthemum_cerulean_blue':
          drawOrganicChrysanthemum(ctx, target.size, bloomP, time, target.swayOffset, 'cerulean_blue');
          break;
        case 'chrysanthemum_ice_blue':
          drawOrganicChrysanthemum(ctx, target.size, bloomP, time, target.swayOffset, 'ice_blue');
          break;
        case 'babys_breath':
          drawOrganicBabysBreath(ctx, target.size, bloomP, time, target.swayOffset, false);
          break;
        case 'babys_breath_blue':
          drawOrganicBabysBreath(ctx, target.size, bloomP, time, target.swayOffset, true);
          break;
      }
      ctx.restore();
    }
  });

  // 6. FRONT OVERLAPPING SLENDER FLORIST WRAPPER & FOLD CREASES
  if (progress > 0.16) {
    const frontWrapP = Math.min((progress - 0.16) / 0.35, 1);
    drawSlenderFrontWrapper(ctx, cx, cy, baseStemY, frontWrapP, time);
  }

  // 7. REALISTIC SATIN RIBBON BOW & FLUTTERING TAILS
  if (progress > 0.24) {
    const ribP = Math.min((progress - 0.24) / 0.35, 1);
    drawSlenderSatinRibbon(ctx, cx, baseStemY - 24, ribP, time);
  }

  // 8. LUXURIOUS AMBIENT GLOW & DUAL GOLD/BLUE PARTICLES
  if (progress > 0.60) {
    const magicP = (progress - 0.60) / 0.40;
    const sparkleCount = 24;
    for (let i = 0; i < sparkleCount; i++) {
      const angle = i * (Math.PI * 2 / sparkleCount) + progress * 1.8 + time * 0.3;
      const radius = (130 + (i % 5) * 22 + Math.sin(time + i) * 5) * magicP;
      const px = cx + Math.cos(angle) * (radius * 0.85);
      const py = (cy - 30) + Math.sin(angle) * (radius * 0.95);
      const dotSize = (1.6 + (i % 3) * 1.2 + Math.sin(time * 2 + i) * 0.35) * magicP;
      const isBlueSparkle = i % 2 === 0;

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, Math.max(0.5, dotSize), 0, Math.PI * 2);
      ctx.fillStyle = isBlueSparkle ? `rgba(147, 197, 253, ${0.85 * magicP})` : `rgba(255, 235, 130, ${0.85 * magicP})`;
      ctx.shadowColor = isBlueSparkle ? '#60a5fa' : '#ffd700';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    }
  }
}

/* --- SLENDER & ELEGANT BOTANICAL DRAWING HELPERS --- */

function drawSlenderBackWrapper(ctx, cx, cy, baseStemY, p, time) {
  ctx.save();
  ctx.beginPath();
  const wave1 = Math.sin(time * 1.2) * 1.5;
  const wave2 = Math.cos(time * 1.1) * 1.5;

  // Slender V-shape silhouette
  ctx.moveTo(cx - (110 + wave1) * p, cy - 105);
  ctx.bezierCurveTo(cx - 95 * p, cy - 45, cx - 80 * p, cy + 20, cx - 72 * p, cy + 65);
  ctx.bezierCurveTo(cx - 50 * p, cy + 125, cx - 30 * p, baseStemY + 10, cx - 22 * p, baseStemY + 40);
  ctx.lineTo(cx + 22 * p, baseStemY + 40);
  ctx.bezierCurveTo(cx + 30 * p, baseStemY + 10, cx + 50 * p, cy + 125, cx + 72 * p, cy + 65);
  ctx.bezierCurveTo(cx + 80 * p, cy + 20, cx + 95 * p, cy - 45, cx + (110 + wave2) * p, cy - 105);
  ctx.quadraticCurveTo(cx, cy - 120, cx - (110 + wave1) * p, cy - 105);
  ctx.closePath();

  const wrapGrad = ctx.createLinearGradient(cx - 100, cy - 105, cx + 100, baseStemY);
  wrapGrad.addColorStop(0, '#d9cfc5');
  wrapGrad.addColorStop(0.35, '#bfb2a6');
  wrapGrad.addColorStop(0.75, '#a19286');
  wrapGrad.addColorStop(1, '#7f7165');
  ctx.fillStyle = wrapGrad;
  ctx.shadowColor = 'rgba(30, 20, 15, 0.28)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;
  ctx.fill();
  ctx.restore();
}

function drawSlenderTissueLiner(ctx, cx, cy, baseStemY, p, time) {
  ctx.save();
  ctx.beginPath();
  const tWave = Math.sin(time * 1.5) * 1.4;

  ctx.moveTo(cx - 95 * p, cy - 50);
  ctx.bezierCurveTo(cx - 110 * p, cy - 70, cx - 100 * p, cy - 95, cx - (105 + tWave) * p, cy - 85);
  ctx.quadraticCurveTo(cx - 70 * p, cy - 65, cx - 48 * p, cy - 65);
  ctx.bezierCurveTo(cx - 25 * p, cy - 75, cx - 8 * p, cy - 88, cx, cy - 78);
  ctx.bezierCurveTo(cx + 8 * p, cy - 88, cx + 25 * p, cy - 75, cx + 48 * p, cy - 65);
  ctx.quadraticCurveTo(cx + 70 * p, cy - 65, cx + (105 - tWave) * p, cy - 85);
  ctx.bezierCurveTo(cx + 100 * p, cy - 95, cx + 110 * p, cy - 70, cx + 95 * p, cy - 50);
  ctx.bezierCurveTo(cx + 68 * p, cy + 45, cx + 28 * p, baseStemY, cx + 18 * p, baseStemY + 20);
  ctx.lineTo(cx - 18 * p, baseStemY + 20);
  ctx.bezierCurveTo(cx - 28 * p, baseStemY, cx - 68 * p, cy + 45, cx - 95 * p, cy - 50);
  ctx.closePath();

  const tissueGrad = ctx.createLinearGradient(cx - 80, cy - 78, cx + 80, baseStemY);
  tissueGrad.addColorStop(0, 'rgba(255, 254, 250, 0.96)');
  tissueGrad.addColorStop(0.5, 'rgba(249, 244, 235, 0.92)');
  tissueGrad.addColorStop(1, 'rgba(235, 226, 212, 0.88)');
  ctx.fillStyle = tissueGrad;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();
}

function drawSlenderFrontWrapper(ctx, cx, cy, baseStemY, p, time) {
  ctx.save();
  // Left Slender Front Flap
  ctx.beginPath();
  ctx.moveTo(cx - 88 * p, cy + 45);
  ctx.bezierCurveTo(cx - 65 * p, cy + 78, cx - 38 * p, cy + 110, cx - 14 * p, cy + 128);
  ctx.bezierCurveTo(cx - 16 * p, cy + 155, cx - 18 * p, baseStemY + 15, cx - 20 * p, baseStemY + 36);
  ctx.bezierCurveTo(cx - 42 * p, baseStemY + 10, cx - 60 * p, cy + 90, cx - 88 * p, cy + 45);
  ctx.closePath();

  const leftGrad = ctx.createLinearGradient(cx - 88, cy + 45, cx, baseStemY);
  leftGrad.addColorStop(0, '#cec3b7');
  leftGrad.addColorStop(0.5, '#b5a79a');
  leftGrad.addColorStop(1, '#8e8073');
  ctx.fillStyle = leftGrad;
  ctx.shadowColor = 'rgba(40, 30, 25, 0.22)';
  ctx.shadowBlur = 12;
  ctx.fill();

  // Right Slender Overlapping Flap (Chic Diagonal Fold)
  ctx.beginPath();
  ctx.moveTo(cx + 85 * p, cy + 40);
  ctx.bezierCurveTo(cx + 52 * p, cy + 82, cx + 12 * p, cy + 115, cx - 22 * p, cy + 132);
  ctx.bezierCurveTo(cx - 6 * p, cy + 155, cx + 12 * p, baseStemY + 15, cx + 16 * p, baseStemY + 36);
  ctx.bezierCurveTo(cx + 42 * p, baseStemY + 10, cx + 65 * p, cy + 85, cx + 85 * p, cy + 40);
  ctx.closePath();

  const rightGrad = ctx.createLinearGradient(cx + 85, cy + 40, cx - 22, baseStemY);
  rightGrad.addColorStop(0, '#e5dacf');
  rightGrad.addColorStop(0.4, '#c8bbb0');
  rightGrad.addColorStop(1, '#9e9083');
  ctx.fillStyle = rightGrad;
  ctx.shadowColor = 'rgba(25, 18, 12, 0.32)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetX = -5;
  ctx.shadowOffsetY = 5;
  ctx.fill();

  // Organic Paper Crease Accent Line
  ctx.beginPath();
  ctx.moveTo(cx + 70 * p, cy + 55);
  ctx.quadraticCurveTo(cx + 28 * p, cy + 98, cx - 10 * p, cy + 130);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  ctx.restore();
}

function drawSlenderSatinRibbon(ctx, cx, cy, p, time) {
  if (p <= 0.01) return;
  ctx.save();
  ctx.translate(cx, cy);

  // Dynamic Fluttering Ribbon Tails (Slender & Long)
  const tailSway1 = Math.sin(time * 2.2) * 4 * p;
  const tailSway2 = Math.cos(time * 2.0) * 4 * p;

  // Left Ribbon Tail
  ctx.beginPath();
  ctx.moveTo(-6, 4);
  ctx.bezierCurveTo(-26 * p + tailSway1, 35 * p, -10 * p + tailSway1 * 1.5, 65 * p, -22 * p + tailSway1 * 2, 95 * p);
  ctx.lineTo(-14 * p + tailSway1 * 2, 95 * p);
  ctx.bezierCurveTo(-4 * p + tailSway1 * 1.5, 65 * p, -18 * p + tailSway1, 35 * p, 0, 4);
  ctx.fillStyle = '#c99a2a';
  ctx.fill();

  // Right Ribbon Tail
  ctx.beginPath();
  ctx.moveTo(6, 4);
  ctx.bezierCurveTo(26 * p + tailSway2, 35 * p, 10 * p + tailSway2 * 1.5, 65 * p, 22 * p + tailSway2 * 2, 93 * p);
  ctx.lineTo(14 * p + tailSway2 * 2, 93 * p);
  ctx.bezierCurveTo(4 * p + tailSway2 * 1.5, 65 * p, 18 * p + tailSway2, 35 * p, 0, 4);
  ctx.fillStyle = '#b8861b';
  ctx.fill();

  // Left Ribbon Loop (Proportional Slender Size)
  const loopBreath = 1 + Math.sin(time * 1.5) * 0.04;
  const loopRadiusX = Math.max(0.1, 20 * p * loopBreath);
  const loopRadiusY = Math.max(0.1, 11 * p);

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(-18 * p * loopBreath, -3, loopRadiusX, loopRadiusY, -Math.PI / 6.5, 0, Math.PI * 2);
  const leftLoopGrad = ctx.createRadialGradient(-18 * p, -3, Math.max(0.1, 1 * p), -18 * p, -3, Math.max(0.2, 20 * p));
  leftLoopGrad.addColorStop(0, '#fff59d');
  leftLoopGrad.addColorStop(0.45, '#eab308');
  leftLoopGrad.addColorStop(1, '#92400e');
  ctx.fillStyle = leftLoopGrad;
  ctx.shadowColor = 'rgba(146, 64, 14, 0.45)';
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();

  // Right Ribbon Loop
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(18 * p * loopBreath, -3, loopRadiusX, loopRadiusY, Math.PI / 6.5, 0, Math.PI * 2);
  const rightLoopGrad = ctx.createRadialGradient(18 * p, -3, Math.max(0.1, 1 * p), 18 * p, -3, Math.max(0.2, 20 * p));
  rightLoopGrad.addColorStop(0, '#fff59d');
  rightLoopGrad.addColorStop(0.45, '#eab308');
  rightLoopGrad.addColorStop(1, '#92400e');
  ctx.fillStyle = rightLoopGrad;
  ctx.shadowColor = 'rgba(146, 64, 14, 0.45)';
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();

  // Center Ribbon Knot
  ctx.beginPath();
  ctx.ellipse(0, 0, Math.max(0.1, 8.5 * p), Math.max(0.1, 7.5 * p), 0, 0, Math.PI * 2);
  const knotGrad = ctx.createRadialGradient(0, -2 * p, Math.max(0.1, 0.5 * p), 0, 0, Math.max(0.2, 8.5 * p));
  knotGrad.addColorStop(0, '#fffbeb');
  knotGrad.addColorStop(0.4, '#eab308');
  knotGrad.addColorStop(1, '#78350f');
  ctx.fillStyle = knotGrad;
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 5;
  ctx.fill();

  ctx.restore();
}

function drawOrganicChrysanthemum(ctx, size, p, time = 0, swayOffset = 0, themeKey = 'gold') {
  if (p <= 0.01) return;
  const theme = CHRYSANTHEMUM_THEMES[themeKey] || CHRYSANTHEMUM_THEMES.gold;

  // Breathing scale pulse
  const breath = 1 + Math.sin(time * 1.6 + swayOffset) * 0.035;
  const currentSize = size * breath;

  // Layer 1: Outer Radiating Lush Petals with organic variation & natural wave
  const outerPetals = 26;
  for (let i = 0; i < outerPetals; i++) {
    const angle = (i * Math.PI * 2) / outerPetals + Math.sin(time + i + swayOffset) * 0.02;
    const petalLen = Math.max(0.1, currentSize * (0.94 + Math.sin(i * 3.7) * 0.08) * p);
    const petalWidth = Math.max(0.1, currentSize * (0.15 + Math.cos(i * 2.3) * 0.02) * p);
    const curveJitter = Math.sin(i * 1.7) * 4;

    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-petalWidth + curveJitter, -petalLen * 0.55, 0, -petalLen);
    ctx.quadraticCurveTo(petalWidth + curveJitter, -petalLen * 0.55, 0, 0);
    
    const petalGrad = ctx.createLinearGradient(0, 0, 0, -petalLen);
    petalGrad.addColorStop(0, theme.outer[0]);
    petalGrad.addColorStop(0.3, theme.outer[1]);
    petalGrad.addColorStop(0.7, theme.outer[2]);
    petalGrad.addColorStop(1, theme.outer[3]);
    ctx.fillStyle = petalGrad;
    ctx.shadowColor = theme.shadow;
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();
  }

  // Layer 2: Mid-Dense Petals
  const midPetals = 20;
  for (let i = 0; i < midPetals; i++) {
    const angle = (i * Math.PI * 2) / midPetals + Math.PI / midPetals + Math.cos(time + i + swayOffset) * 0.02;
    const petalLen = Math.max(0.1, currentSize * (0.72 + Math.sin(i * 2.9) * 0.06) * p);
    const petalWidth = Math.max(0.1, currentSize * (0.14 + Math.cos(i * 1.8) * 0.02) * p);

    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-petalWidth, -petalLen * 0.45, 0, -petalLen);
    ctx.quadraticCurveTo(petalWidth, -petalLen * 0.45, 0, 0);
    
    const midGrad = ctx.createLinearGradient(0, 0, 0, -petalLen);
    midGrad.addColorStop(0, theme.mid[0]);
    midGrad.addColorStop(0.35, theme.mid[1]);
    midGrad.addColorStop(0.85, theme.mid[2]);
    midGrad.addColorStop(1, theme.mid[3]);
    ctx.fillStyle = midGrad;
    ctx.fill();
    ctx.restore();
  }

  // Layer 3: Inner Blooming Petals
  const innerPetals = 16;
  for (let i = 0; i < innerPetals; i++) {
    const angle = (i * Math.PI * 2) / innerPetals + 0.25;
    const petalLen = Math.max(0.1, currentSize * (0.50 + Math.sin(i * 4.1) * 0.05) * p);
    const petalWidth = Math.max(0.1, currentSize * 0.12 * p);

    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-petalWidth, -petalLen * 0.35, 0, -petalLen);
    ctx.quadraticCurveTo(petalWidth, -petalLen * 0.35, 0, 0);
    
    const inGrad = ctx.createLinearGradient(0, 0, 0, -petalLen);
    inGrad.addColorStop(0, theme.inner[0]);
    inGrad.addColorStop(0.65, theme.inner[1]);
    inGrad.addColorStop(1, theme.inner[2]);
    ctx.fillStyle = inGrad;
    ctx.fill();
    ctx.restore();
  }

  // Layer 4: Center Dense Florets & Golden Stamens
  const coreRadius = Math.max(0.2, currentSize * 0.24 * p);
  ctx.beginPath();
  ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
  const coreGrad = ctx.createRadialGradient(0, 0, Math.max(0.1, 0.5 * p), 0, 0, coreRadius);
  coreGrad.addColorStop(0, theme.core[0]);
  coreGrad.addColorStop(0.5, theme.core[1]);
  coreGrad.addColorStop(1, theme.core[2]);
  ctx.fillStyle = coreGrad;
  ctx.shadowColor = theme.coreGlow;
  ctx.shadowBlur = 10 * p;
  ctx.fill();

  // Golden Stamen Dots
  const stamenCount = 10;
  for (let s = 0; s < stamenCount; s++) {
    const sAng = s * (Math.PI * 2 / stamenCount) + time * 0.2;
    const sDist = currentSize * 0.14 * p;
    ctx.beginPath();
    ctx.arc(Math.cos(sAng) * sDist, Math.sin(sAng) * sDist, Math.max(0.1, 1.6 * p), 0, Math.PI * 2);
    ctx.fillStyle = theme.stamen;
    ctx.fill();
  }
}

function drawSlenderEucalyptusSprigs(ctx, cx, cy, p, time = 0) {
  if (p <= 0.01) return;
  const leaves = [
    { x: cx - 62, y: cy + 40, rx: 22, ry: 11, rot: -0.65, sway: 0.8 },
    { x: cx + 62, y: cy + 45, rx: 22, ry: 11, rot: 0.65, sway: 1.5 },
    { x: cx - 92, y: cy - 10, rx: 24, ry: 12, rot: -0.80, sway: 2.3 },
    { x: cx + 92, y: cy - 5, rx: 24, ry: 12, rot: 0.80, sway: 3.1 },
    { x: cx - 60, y: cy - 80, rx: 20, ry: 10, rot: -0.45, sway: 4.2 },
    { x: cx + 60, y: cy - 75, rx: 20, ry: 10, rot: 0.45, sway: 5.0 },
    { x: cx, y: cy - 125, rx: 18, ry: 9, rot: 0, sway: 0.3 }
  ];

  leaves.forEach((leaf) => {
    const leafSway = Math.sin(time * 1.5 + leaf.sway) * 0.06;
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(leaf.rot + leafSway);

    // Leaf Body with Realistic Botanical Sage Gradient
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.max(0.1, leaf.rx * p), Math.max(0.1, leaf.ry * p), 0, 0, Math.PI * 2);
    const leafGrad = ctx.createLinearGradient(-leaf.rx * p, 0, leaf.rx * p, 0);
    leafGrad.addColorStop(0, '#3f5d22');
    leafGrad.addColorStop(0.5, '#5d8032');
    leafGrad.addColorStop(1, '#7a9f43');
    ctx.fillStyle = leafGrad;
    ctx.shadowColor = 'rgba(30, 48, 12, 0.28)';
    ctx.shadowBlur = 6;
    ctx.fill();

    // Central Leaf Vein
    ctx.beginPath();
    ctx.moveTo(-leaf.rx * p * 0.82, 0);
    ctx.lineTo(leaf.rx * p * 0.82, 0);
    ctx.strokeStyle = 'rgba(230, 250, 195, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
  });
}

function drawOrganicBabysBreath(ctx, size, p, time = 0, swayOffset = 0, isBlue = false) {
  if (p <= 0.01) return;
  const breathSway = Math.sin(time * 1.8 + swayOffset) * 0.08;
  const florets = [
    { ox: 0, oy: -size * 0.45 },
    { ox: -size * 0.4, oy: -size * 0.12 },
    { ox: size * 0.4, oy: -size * 0.12 },
    { ox: -size * 0.25, oy: size * 0.3 },
    { ox: size * 0.25, oy: size * 0.3 }
  ];

  ctx.save();
  ctx.rotate(breathSway);

  // Fine green stems
  florets.forEach((f) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(f.ox * p, f.oy * p);
    ctx.strokeStyle = '#4e6d24';
    ctx.lineWidth = 1.3;
    ctx.stroke();
  });

  // Delicate glowing florets (White or Blue Mist)
  florets.forEach((f, idx) => {
    const floretPulse = 1 + Math.sin(time * 2 + idx + swayOffset) * 0.12;
    const floretR = Math.max(0.2, size * 0.14 * p * floretPulse);
    ctx.beginPath();
    ctx.arc(f.ox * p, f.oy * p, floretR, 0, Math.PI * 2);
    const floretGrad = ctx.createRadialGradient(f.ox * p, f.oy * p, Math.max(0.1, 0.3 * p), f.ox * p, f.oy * p, floretR);
    
    if (isBlue) {
      floretGrad.addColorStop(0, '#ffffff');
      floretGrad.addColorStop(0.6, '#bae6fd');
      floretGrad.addColorStop(1, '#60a5fa');
      ctx.shadowColor = 'rgba(96, 165, 250, 0.9)';
    } else {
      floretGrad.addColorStop(0, '#ffffff');
      floretGrad.addColorStop(0.65, '#fef9c3');
      floretGrad.addColorStop(1, '#fde047');
      ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
    }

    ctx.fillStyle = floretGrad;
    ctx.shadowBlur = 7;
    ctx.fill();
  });
  ctx.restore();
}

/* ==========================================================================
   3. INTRO OVERLAY INITIALIZATION (CONTINUOUS LIVING LOOP)
   ========================================================================== */
function initIntroFlowerOverlay() {
  const overlay = document.getElementById('intro-bloom-overlay');
  const canvas = document.getElementById('intro-flower-canvas');
  const btn = document.getElementById('btn-open-story');
  const content = document.querySelector('.intro-content');

  if (!overlay || !canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = 620;
  canvas.height = 620;

  let progress = 0;
  let time = 0;
  let animationFrameId;
  let opened = false;

  function animateIntroBloom() {
    time += 0.025;
    if (progress < 1) {
      progress += 0.0075;
      if (progress >= 0.75 && content && !content.classList.contains('show')) {
        content.classList.add('show');
      }
    }
    try {
      renderBloomingBouquet(ctx, canvas.width, canvas.height, Math.min(progress, 1), time);
    } catch (e) {
      console.warn('Canvas render caught error:', e);
      if (content) content.classList.add('show');
    }
    animationFrameId = requestAnimationFrame(animateIntroBloom);
  }

  animateIntroBloom();

  function openStory() {
    if (opened) return;
    opened = true;
    overlay.classList.add('fade-out');
    if (window.playStoryMusic) window.playStoryMusic();

    setTimeout(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      overlay.style.display = 'none';
      const hero = document.querySelector('.hero-section');
      if (hero) hero.scrollIntoView({ behavior: 'smooth' });
      triggerHeroTyping();
    }, 400);
  }

  if (btn) {
    btn.addEventListener('click', openStory);
  }

  // Backup tap on entire overlay
  overlay.addEventListener('click', (e) => {
    if (progress >= 0.4) {
      openStory();
    }
  });
}

/* ==========================================================================
   4. FAST & CRISP TYPEWRITER ENGINE (MODERATE-FAST SATISFYING TEMPO)
   ========================================================================== */
function typeWriter(element, speed = 11, onComplete = null) {
  if (!element || element.dataset.typingDone === 'true') {
    if (onComplete) onComplete();
    return;
  }
  if (element.dataset.isTyping === 'true') return;
  element.dataset.isTyping = 'true';

  const originalHtml = element.dataset.originalHtml || element.innerHTML.trim();
  element.dataset.originalHtml = originalHtml;
  element.innerHTML = '';
  element.style.opacity = '1';
  element.style.visibility = 'visible';
  element.classList.add('typing-active', 'visible');

  const tokens = [];
  let i = 0;
  while (i < originalHtml.length) {
    if (originalHtml[i] === '<') {
      const closeIdx = originalHtml.indexOf('>', i);
      if (closeIdx !== -1) {
        tokens.push({ type: 'tag', content: originalHtml.slice(i, closeIdx + 1) });
        i = closeIdx + 1;
        continue;
      }
    }
    if (originalHtml[i] === '&') {
      const semiIdx = originalHtml.indexOf(';', i);
      if (semiIdx !== -1 && semiIdx - i < 10) {
        tokens.push({ type: 'char', content: originalHtml.slice(i, semiIdx + 1) });
        i = semiIdx + 1;
        continue;
      }
    }
    tokens.push({ type: 'char', content: originalHtml[i] });
    i++;
  }

  let tokenIdx = 0;
  let accumulated = '';

  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  cursor.textContent = '|';
  element.appendChild(cursor);

  function step() {
    if (tokenIdx < tokens.length) {
      const token = tokens[tokenIdx];
      accumulated += token.content;
      element.innerHTML = accumulated;
      element.appendChild(cursor);
      tokenIdx++;

      let delay = speed;
      if (token.type === 'char') {
        if (token.content === '.' || token.content === '!' || token.content === '?') {
          delay = speed * 1.5;
        } else if (token.content === ',' || token.content === ';') {
          delay = speed * 1.2;
        } else {
          delay = speed;
        }
      } else {
        delay = 0;
      }

      setTimeout(step, delay);
    } else {
      element.dataset.typingDone = 'true';
      element.dataset.isTyping = 'false';
      element.classList.remove('typing-active');

      setTimeout(() => {
        if (cursor.parentNode) {
          cursor.classList.add('fade-cursor');
          setTimeout(() => {
            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
          }, 300);
        }
      }, 400);

      if (onComplete) onComplete();
    }
  }

  step();
}

function runSequentialTypewriter(elements, speed = 11, defaultDelay = 90, onComplete = null) {
  let currentIndex = 0;

  function next() {
    if (currentIndex < elements.length) {
      const el = elements[currentIndex];
      const pause = parseInt(el.dataset.pause || (currentIndex === 0 ? 10 : defaultDelay));
      const effectivePause = Math.min(pause, 140);

      setTimeout(() => {
        typeWriter(el, speed, () => {
          currentIndex++;
          next();
        });
      }, effectivePause);
    } else {
      if (onComplete) onComplete();
    }
  }

  next();
}

function triggerHeroTyping() {
  const heroBadge = document.querySelector('.hero-badge');
  const heroTitle = document.querySelector('.hero-title');
  const heroDesc = document.querySelector('.hero-description');

  if (heroBadge) {
    typeWriter(heroBadge, 11, () => {
      if (heroTitle) {
        typeWriter(heroTitle, 12, () => {
          if (heroDesc) typeWriter(heroDesc, 11);
        });
      }
    });
  } else if (heroTitle) {
    typeWriter(heroTitle, 12, () => {
      if (heroDesc) typeWriter(heroDesc, 11);
    });
  }
}

/* ==========================================================================
   5. SCROLL REVEALS & TIMED TYPEWRITER OBSERVERS FOR ALL SENTENCES
   ========================================================================== */
function initScrollReveals() {
  const allTypingTargets = document.querySelectorAll(
    '.hero-badge, .hero-title, .hero-description, .section-label, .story-line, .photo-caption-tag, .quote-highlight-box p, .montage-quote-line, .montage-caption, .flower-closing-message h2, .flower-closing-message p, .her-story-content h2, .memory-title, .expression-text-box h3, .us-featured-text-container h2, .montage-header h2'
  );
  allTypingTargets.forEach((el) => {
    el.dataset.originalHtml = el.innerHTML.trim();
  });

  // Photo Cards & Captions Reveal Observer
  const photoCards = document.querySelectorAll('.her-photo-card, .us-featured-photo-card');
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          const img = entry.target.querySelector('.story-img');
          if (img) img.classList.add('loaded');

          const caption = entry.target.querySelector('.photo-caption-tag');
          if (caption && !caption.dataset.typingInitiated) {
            caption.dataset.typingInitiated = 'true';
            setTimeout(() => { typeWriter(caption, 11); }, 180);
          }
        }
      });
    },
    { threshold: 0.12 }
  );
  photoCards.forEach((card) => cardObserver.observe(card));

  // Memory Blocks & Story Paragraphs Reveal Observer
  const textGroups = document.querySelectorAll('.her-story-content, .expression-card-item, .memory-block-item, .us-featured-block');
  const textObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.typingInitiated) {
          entry.target.dataset.typingInitiated = 'true';
          
          const heading = entry.target.querySelector('h2, h3');
          const lines = entry.target.querySelectorAll('.story-line');

          if (heading) {
            typeWriter(heading, 12, () => {
              if (lines.length > 0) {
                runSequentialTypewriter(lines, 11, 80);
              }
            });
          } else if (lines.length > 0) {
            runSequentialTypewriter(lines, 11, 80);
          }
        }
      });
    },
    { threshold: 0.12 }
  );
  textGroups.forEach((group) => textObserver.observe(group));

  // Section Labels Observer
  const sectionLabels = document.querySelectorAll('.section-label');
  const labelObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.typingInitiated) {
          entry.target.dataset.typingInitiated = 'true';
          typeWriter(entry.target, 11);
        }
      });
    },
    { threshold: 0.15 }
  );
  sectionLabels.forEach((label) => labelObserver.observe(label));

  // Highlight Quote Box Observer
  const quoteBoxes = document.querySelectorAll('.quote-highlight-box');
  const quoteBoxObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.typingInitiated) {
          entry.target.dataset.typingInitiated = 'true';
          const p = entry.target.querySelector('p');
          if (p) typeWriter(p, 11);
        }
      });
    },
    { threshold: 0.2 }
  );
  quoteBoxes.forEach((box) => quoteBoxObserver.observe(box));

  // Montage Final Quote Observer
  const quoteScreen = document.querySelector('.montage-final-quote-screen');
  if (quoteScreen) {
    const quoteObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !quoteScreen.dataset.typingInitiated) {
          quoteScreen.dataset.typingInitiated = 'true';
          const lines = quoteScreen.querySelectorAll('.montage-quote-line');
          runSequentialTypewriter(lines, 11, 100);
        }
      },
      { threshold: 0.2 }
    );
    quoteObserver.observe(quoteScreen);
  }

  // Closing Flower Section Observer
  const closingSection = document.querySelector('.flower-closing-message');
  if (closingSection) {
    const closeObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !closingSection.dataset.typingInitiated) {
          closingSection.dataset.typingInitiated = 'true';
          const h2 = closingSection.querySelector('h2');
          const p = closingSection.querySelector('p');
          if (h2) {
            typeWriter(h2, 12, () => {
              if (p) typeWriter(p, 11);
            });
          }
        }
      },
      { threshold: 0.2 }
    );
    closeObserver.observe(closingSection);
  }
}

/* ==========================================================================
   6. 3D MOUSE TILT PARALLAX EFFECT FOR POLAROID FRAMES
   ========================================================================== */
function initMouseParallax() {
  const cards = document.querySelectorAll('.her-photo-card, .us-featured-photo-card, .memory-block-item');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = (y / (rect.height / 2)) * -6;
      const tiltY = (x / (rect.width / 2)) * 6;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      const defaultTilt = card.dataset.tilt || '0deg';
      card.style.transform = `perspective(1000px) rotate(${defaultTilt}) scale(1)`;
    });
  });
}

/* ==========================================================================
   7. FINAL MONTAGE CINEMATIC SLIDESHOW (WITH DYNAMIC TYPEWRITER CAPTIONS)
   ========================================================================== */
function initMontagePlayer() {
  const montageStage = document.getElementById('montage-stage');
  if (!montageStage) return;

  const slides = montageStage.querySelectorAll('.montage-slide');
  if (!slides.length) return;

  let currentSlide = 0;
  let montageInterval;

  function showSlide(index) {
    slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add('active');
        const caption = slide.querySelector('.montage-caption');
        if (caption) {
          caption.dataset.typingDone = 'false';
          caption.dataset.isTyping = 'false';
          typeWriter(caption, 11);
        }
      } else {
        slide.classList.remove('active');
      }
    });
  }

  // Type first slide caption immediately
  const firstCaption = slides[0].querySelector('.montage-caption');
  if (firstCaption) typeWriter(firstCaption, 11);

  const montageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!montageInterval) {
            montageInterval = setInterval(() => {
              currentSlide = (currentSlide + 1) % slides.length;
              showSlide(currentSlide);
            }, 4000);
          }
        } else {
          if (montageInterval) {
            clearInterval(montageInterval);
            montageInterval = null;
          }
        }
      });
    },
    { threshold: 0.35 }
  );

  montageObserver.observe(montageStage);
}

/* ==========================================================================
   8. CLOSING BOUQUET BLOOMING SECTION
   ========================================================================== */
function initFlowerBloomingSection() {
  const canvas = document.getElementById('flower-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = 620;
  canvas.height = 620;

  let progress = 0;
  let time = 0;
  let isBlooming = false;
  let animId;

  function animateSectionBloom() {
    time += 0.025;
    if (progress < 1) {
      progress += 0.0055;
    }
    renderBloomingBouquet(ctx, canvas.width, canvas.height, progress, time);
    animId = requestAnimationFrame(animateSectionBloom);
  }

  const flowerSection = document.querySelector('.flower-blooming-section');
  if (flowerSection) {
    const flowerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isBlooming) {
          isBlooming = true;
          progress = 0;
          animateSectionBloom();
        } else if (!entry.isIntersecting && isBlooming) {
          isBlooming = false;
          if (animId) cancelAnimationFrame(animId);
        }
      });
    }, { threshold: 0.2 });
    flowerObserver.observe(flowerSection);
  }

  const replayBtn = document.getElementById('btn-replay-flower');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      progress = 0;
      isBlooming = false;
      if (animId) cancelAnimationFrame(animId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
