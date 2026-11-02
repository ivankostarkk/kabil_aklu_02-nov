/* ==========================================================
   Project: For Aklu with love from Kabi
   Soft Lavender Theme: Ambient 3D Petals, Touch & Responsive
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------
     1. THREE.JS 3D FLOATING LAVENDER HEART PARTICLES
     (Gentle heart shapes drifting upwards like sweet dreams)
     -------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 60;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Generate Heart Texture dynamically
  function createHeartTexture() {
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 64;
    texCanvas.height = 64;
    const ctx = texCanvas.getContext('2d');

    // Draw cute smooth heart
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    const d = 30;
    const k = 32;
    ctx.moveTo(k, k + d / 4);
    ctx.bezierCurveTo(k, k, k - d / 2, k, k - d / 2, k + d / 4);
    ctx.bezierCurveTo(k - d / 2, k + d / 2, k, k + d * 0.75, k, k + d);
    ctx.bezierCurveTo(k, k + d * 0.75, k + d / 2, k + d / 2, k + d / 2, k + d / 4);
    ctx.bezierCurveTo(k + d / 2, k, k, k, k, k + d / 4);
    ctx.fill();

    return new THREE.CanvasTexture(texCanvas);
  }

  const heartTexture = createHeartTexture();
  const heartCount = window.innerWidth < 768 ? 28 : 45; // gentle, non-distracting count

  const group = new THREE.Group();
  scene.add(group);

  const hearts = [];
  const lavenderColors = [0x8a73be, 0xb8a7db, 0xa391c7, 0xdcd4ee];

  for (let i = 0; i < heartCount; i++) {
    const mat = new THREE.SpriteMaterial({
      map: heartTexture,
      color: lavenderColors[Math.floor(Math.random() * lavenderColors.length)],
      transparent: true,
      opacity: Math.random() * 0.4 + 0.35,
      blending: THREE.NormalBlending
    });

    const sprite = new THREE.Sprite(mat);
    const scale = Math.random() * 2.2 + 1.8;
    sprite.scale.set(scale, scale, 1);

    sprite.position.x = (Math.random() - 0.5) * 75;
    sprite.position.y = (Math.random() - 0.5) * 80;
    sprite.position.z = (Math.random() - 0.5) * 40;

    // Custom floating properties
    sprite.userData = {
      speedY: Math.random() * 0.035 + 0.015,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      wobbleAmp: Math.random() * 0.02 + 0.01,
      initialX: sprite.position.x,
      timeOffset: Math.random() * 100
    };

    group.add(sprite);
    hearts.push(sprite);
  }

  // Mouse sway interaction
  let mouseTargetX = 0;
  let mouseTargetY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseTargetX = (e.clientX - window.innerWidth / 2) * 0.018;
    mouseTargetY = (e.clientY - window.innerHeight / 2) * 0.018;
  });

  // Window resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateMobileTransforms();
  });

  // Animation Loop
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Floating hearts drifting upwards with soft horizontal sway
    hearts.forEach(sprite => {
      sprite.position.y += sprite.userData.speedY;
      sprite.position.x = sprite.userData.initialX + Math.sin(elapsedTime * 1.5 + sprite.userData.timeOffset) * 1.8;

      // Wrap around from top to bottom
      if (sprite.position.y > 42) {
        sprite.position.y = -42;
        sprite.position.x = (Math.random() - 0.5) * 75;
        sprite.userData.initialX = sprite.position.x;
      }
    });

    // Gentle camera sway
    camera.position.x += (mouseTargetX - camera.position.x) * 0.02;
    camera.position.y += (-mouseTargetY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();


  /* --------------------------------------------------------
     2. AUDIO PLAYER CONTROLLER
     -------------------------------------------------------- */
  const loveAudio = document.getElementById('loveAudio');
  const musicPill = document.getElementById('musicPill');
  const playIcon = document.getElementById('playIcon');
  const musicDisc = document.getElementById('musicDisc');
  const musicStatus = document.getElementById('musicStatus');
  let isPlaying = false;

  function toggleMusic() {
    if (isPlaying) {
      loveAudio.pause();
      playIcon.classList.remove('fa-pause');
      playIcon.classList.add('fa-play');
      musicDisc.classList.remove('active');
      musicStatus.textContent = 'Paused';
      isPlaying = false;
    } else {
      loveAudio.play().then(() => {
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
        musicDisc.classList.add('active');
        musicStatus.textContent = 'Playing for Aklu 💜';
        isPlaying = true;
      }).catch(() => {
        console.log('Autoplay waiting for user gesture.');
      });
    }
  }

  musicPill.addEventListener('click', toggleMusic);


  /* --------------------------------------------------------
     3. INTERACTIVE LAVENDER LOVE ENVELOPE
     -------------------------------------------------------- */
  const envelope = document.getElementById('envelope');
  let envelopeOpen = false;

  envelope.addEventListener('click', () => {
    envelopeOpen = !envelopeOpen;
    envelope.classList.toggle('open', envelopeOpen);

    if (envelopeOpen) {
      triggerLavenderConfetti();
      if (!isPlaying) {
        toggleMusic();
      }
    }
  });


  /* --------------------------------------------------------
     4. 3D CAROUSEL (RESPONSIVE TOUCH & BUTTON SWIPES)
     -------------------------------------------------------- */
  const carousel = document.getElementById('carousel3D');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const cards = document.querySelectorAll('.carousel-card');
  let currentAngle = 0;
  const totalCards = cards.length; // 6 cards
  const angleStep = 360 / totalCards; // 60 deg each

  function updateActiveCard() {
    // Calculate which card index is facing front
    const normalizedIndex = Math.round((-currentAngle % 360 + 360) / angleStep) % totalCards;
    cards.forEach((card, idx) => {
      if (idx === normalizedIndex) {
        card.classList.add('active');
        card.style.zIndex = '10';
      } else {
        card.classList.remove('active');
        card.style.zIndex = '1';
      }
    });
  }

  function updateCarousel() {
    carousel.style.transform = `rotateY(${currentAngle}deg)`;
    updateActiveCard();
  }

  function updateMobileTransforms() {
    const isMobile = window.innerWidth <= 768;
    // Generous radius for 6-card polygon so they never overlap
    const translateZ = isMobile ? '250px' : '330px';
    cards.forEach((card, index) => {
      card.style.transform = `rotateY(${index * angleStep}deg) translateZ(${translateZ})`;
    });
    updateActiveCard();
  }
  updateMobileTransforms();

  nextBtn.addEventListener('click', () => {
    currentAngle -= angleStep;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    currentAngle += angleStep;
    updateCarousel();
  });

  // Touch Swipe for Mobile phones
  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        currentAngle += angleStep;
      } else {
        currentAngle -= angleStep;
      }
      updateCarousel();
    }
  }, { passive: true });

  // Mouse drag support for laptop/desktop
  let isDragging = false;
  let mouseStartX = 0;
  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    mouseStartX = e.clientX;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const diff = e.clientX - mouseStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        currentAngle += angleStep;
      } else {
        currentAngle -= angleStep;
      }
      updateCarousel();
      isDragging = false;
    }
  });


  /* --------------------------------------------------------
     5. 3D FLIP CARDS
     -------------------------------------------------------- */
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      createMiniLavenderBurst(card);
    });
  });


  /* --------------------------------------------------------
     6. RUNAWAY "NO" BUTTON & "YES" CELEBRATION
     -------------------------------------------------------- */
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const runawayHint = document.getElementById('runawayHint');
  const celebrationModal = document.getElementById('celebrationModal');
  const closeModal = document.getElementById('closeModal');
  const moreHeartsBtn = document.getElementById('moreHeartsBtn');
  const interactiveArea = document.querySelector('.interactive-btns');

  const runawayPhrases = [
    "Aklu, you can't click No! 💜",
    "Nope! Kabi won't allow that option! 🥰",
    "Nice try! Catch me if you can! 🌸",
    "Every road leads to YES with Kabi! ✨",
    "Error 404: 'No' does not exist for Aklu! 💜"
  ];

  let runawayCount = 0;

  // Pre-calculated safe safe spots for the "No" button so it never collides with text or Yes button
  const safePositions = [
    { left: '80%', top: '25%' },
    { left: '78%', top: '75%' },
    { left: '85%', top: '50%' },
    { left: '75%', top: '15%' },
    { left: '82%', top: '85%' },
    { left: '68%', top: '50%' }
  ];

  function moveNoButton() {
    const nextPos = safePositions[runawayCount % safePositions.length];
    noBtn.style.left = nextPos.left;
    noBtn.style.top = nextPos.top;
    noBtn.style.transform = 'translate(-50%, -50%)';

    runawayHint.textContent = runawayPhrases[runawayCount % runawayPhrases.length];
    runawayCount++;

    // Gently scale Yes button while keeping it perfectly aligned at its position
    const currentScale = 1 + Math.min(runawayCount * 0.05, 0.25);
    yesBtn.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
  }

  noBtn.addEventListener('mouseenter', moveNoButton);
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
  });
  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
  });

  // YES Button Clicked
  yesBtn.addEventListener('click', () => {
    celebrationModal.classList.add('show');
    triggerLavenderConfetti();
    if (!isPlaying) {
      toggleMusic();
    }
  });

  closeModal.addEventListener('click', () => {
    celebrationModal.classList.remove('show');
  });

  moreHeartsBtn.addEventListener('click', () => {
    triggerLavenderConfetti();
  });


  /* --------------------------------------------------------
     7. LAVENDER & PEARL CONFETTI FX
     -------------------------------------------------------- */
  function triggerLavenderConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#b8a7db', '#8a73be', '#dcd4ee', '#ffffff', '#6d599c']
      });

      confetti({
        particleCount: 25,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#b8a7db', '#8a73be', '#ffffff']
      });

      confetti({
        particleCount: 25,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#b8a7db', '#8a73be', '#ffffff']
      });
    }
  }

  function createMiniLavenderBurst(element) {
    const rect = element.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 16,
        spread: 40,
        origin: { x: x, y: y },
        colors: ['#b8a7db', '#ffffff', '#8a73be'],
        ticks: 100,
        gravity: 0.9
      });
    }
  }

  // Floating soft lavender heart on screen tap
  window.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('.flip-card') || e.target.closest('.envelope')) return;

    const heart = document.createElement('div');
    heart.innerHTML = '💜';
    heart.style.position = 'fixed';
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;
    heart.style.fontSize = `${Math.random() * 14 + 14}px`;
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.transition = 'all 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)';
    heart.style.opacity = '0.9';
    heart.style.transform = 'translate(-50%, -50%) scale(1)';

    document.body.appendChild(heart);

    requestAnimationFrame(() => {
      heart.style.transform = `translate(-50%, -${Math.random() * 60 + 40}px) scale(1.4)`;
      heart.style.opacity = '0';
    });

    setTimeout(() => {
      heart.remove();
    }, 900);
  });

});
