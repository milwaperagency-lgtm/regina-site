/**
 * Регина — сайт-признание
 * Анимации при скролле, таймер, 100 фраз про любовь
 */

// ============================================
// Эффект печати (typewriter) для Hero
// ============================================
const typewriterEl = document.getElementById('typewriter');
const cursorEl = document.querySelector('.hero-greeting .cursor');
if (typewriterEl) {
  const text = 'Регина...';
  let i = 0;
  function type() {
    if (i < text.length) {
      typewriterEl.textContent += text.charAt(i);
      i++;
      setTimeout(type, 120);
    } else {
      // Убираем курсор через полсекунды после окончания
      setTimeout(() => { if (cursorEl) cursorEl.style.opacity = '0'; }, 600);
    }
  }
  setTimeout(type, 400);
}

// ============================================
// Меняющиеся комплименты (каждые 3 секунды)
// ============================================
const compliments = [
  'невероятная', 'прекрасная', 'удивительная', 'единственная', 'чудесная',
  'солнечная', 'тёплая', 'родная', 'любимая', 'драгоценная', 'бесценная',
  'неповторимая', 'волшебная', 'смешная', 'искренняя', 'честная',
  'умная', 'добрая', 'нежная', 'сильная', 'красивая', 'яркая',
  'настоящая', 'живая', 'своя', 'моя', 'особенная', 'неотразимая',
  'загадочная', 'обаятельная', 'очаровательная', 'восхитительная',
  'безумная', 'весёлая', 'грустная', 'серьёзная', 'шаловливая',
  'мечтательная', 'решительная', 'упрямая', 'трогательная'
];

const complimentEl = document.getElementById('rotatingCompliment');
if (complimentEl) {
  let i = 0;
  complimentEl.textContent = compliments[0];
  setInterval(() => {
    complimentEl.classList.add('fade-out');
    setTimeout(() => {
      i = (i + 1) % compliments.length;
      complimentEl.textContent = compliments[i];
      complimentEl.classList.remove('fade-out');
    }, 300);
  }, 3000);
}

// ============================================
// Видео — воспроизведение со звуком по клику
// ============================================
document.querySelectorAll('.video-wrap').forEach(wrap => {
  const video = wrap.querySelector('video');
  const overlay = wrap.querySelector('.video-overlay');
  const btn = wrap.querySelector('.video-play-btn');
  const fullscreenBtn = wrap.querySelector('.video-fullscreen-btn');
  const errorMsg = wrap.querySelector('.video-error-msg');

  if (!video || !overlay) return;

  function getFullscreenEl() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
  }

  function requestFullscreen(el) {
    if (el.requestFullscreen) return el.requestFullscreen();
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
    if (el.mozRequestFullScreen) return el.mozRequestFullScreen();
    if (el.msRequestFullscreen) return el.msRequestFullscreen();
    return Promise.reject(new Error('Fullscreen not supported'));
  }

  function exitFullscreen() {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
    if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
    if (document.msExitFullscreen) return document.msExitFullscreen();
    return Promise.resolve();
  }

  function isFullscreen() {
    return getFullscreenEl() === wrap;
  }

  function updateFullscreenButton() {
    if (!fullscreenBtn) return;
    const icon = fullscreenBtn.querySelector('.fullscreen-icon');
    if (isFullscreen()) {
      fullscreenBtn.setAttribute('aria-label', 'Выйти из полноэкранного режима');
      fullscreenBtn.setAttribute('title', 'Выйти из полноэкранного режима');
      if (icon) icon.textContent = '✕';
    } else {
      fullscreenBtn.setAttribute('aria-label', 'На весь экран');
      fullscreenBtn.setAttribute('title', 'На весь экран');
      if (icon) icon.textContent = '⛶';
    }
    wrap.classList.toggle('video-fullscreen', isFullscreen());
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isFullscreen()) {
        exitFullscreen();
      } else {
        requestFullscreen(wrap).catch(() => {});
      }
    });
  }

  document.addEventListener('fullscreenchange', updateFullscreenButton);
  document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
  document.addEventListener('mozfullscreenchange', updateFullscreenButton);
  document.addEventListener('MSFullscreenChange', updateFullscreenButton);

  function showError(text) {
    if (errorMsg) {
      errorMsg.textContent = text;
      errorMsg.classList.add('visible');
    }
  }

  function hideError() {
    if (errorMsg) {
      errorMsg.textContent = '';
      errorMsg.classList.remove('visible');
    }
  }

  video.addEventListener('error', () => {
    showError('Видео не загрузилось. Конвертируй IMG_9808.MOV в MP4 (онлайн или convert-video-to-mp4.bat) и сохрани как assets/videos/IMG_9808.mp4');
  });

  video.addEventListener('loadeddata', hideError);

  function playWithSound() {
    hideError();
    video.muted = false;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => showError('Воспроизведение недоступно. Попробуй MP4 вместо MOV.'));
    });
    wrap.classList.add('playing');
  }

  function pauseVideo() {
    video.pause();
    wrap.classList.remove('playing');
  }

  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (wrap.classList.contains('playing')) {
        pauseVideo();
      } else {
        playWithSound();
      }
    });
  }

  wrap.addEventListener('click', (e) => {
    if (btn && e.target.closest('.video-play-btn')) return;
    if (fullscreenBtn && e.target.closest('.video-fullscreen-btn')) return;
    if (e.target.closest('.video-error-msg')) return;
    if (wrap.classList.contains('playing')) {
      pauseVideo();
    } else {
      playWithSound();
    }
  });

  video.addEventListener('pause', () => {
    wrap.classList.remove('playing');
  });
});

// ============================================
// Сердечки при тапе
// ============================================
const heartsContainer = document.getElementById('heartsContainer');
const heartSymbols = ['♥', '❤', '♡', '💕'];

document.addEventListener('click', (e) => {
  if (!heartsContainer) return;
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  heart.style.left = e.clientX - 14 + 'px';
  heart.style.top = e.clientY - 14 + 'px';
  heartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 1500);
});

// Поддержка touch для мобильных
document.addEventListener('touchend', (e) => {
  if (!heartsContainer || e.target.closest('button, a')) return;
  const touch = e.changedTouches[0];
  if (!touch) return;
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  heart.style.left = touch.clientX - 14 + 'px';
  heart.style.top = touch.clientY - 14 + 'px';
  heartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 1500);
});

// ============================================
// Секретное послание (двойной тап / долгое нажатие)
// ============================================
const secretOverlay = document.getElementById('secretOverlay');
const secretClose = document.getElementById('secretClose');

let lastTap = 0;
let pressTimer;
let wasLongPress = false;

document.addEventListener('touchstart', (e) => {
  if (e.target.closest('button, a')) return;
  wasLongPress = false;
  pressTimer = setTimeout(() => {
    wasLongPress = true;
    if (secretOverlay) {
      secretOverlay.classList.add('visible');
      secretOverlay.setAttribute('aria-hidden', 'false');
    }
  }, 800);
});

document.addEventListener('touchend', () => {
  clearTimeout(pressTimer);
});

document.addEventListener('click', (e) => {
  if (e.target.closest('button, a')) return;
  const now = Date.now();
  if (now - lastTap < 400) {
    if (secretOverlay) {
      secretOverlay.classList.add('visible');
      secretOverlay.setAttribute('aria-hidden', 'false');
    }
  }
  lastTap = now;
});

if (secretClose && secretOverlay) {
  secretClose.addEventListener('click', () => {
    secretOverlay.classList.remove('visible');
    secretOverlay.setAttribute('aria-hidden', 'true');
  });
}

// ============================================
// Плейлист — ссылки на Spotify / Яндекс.Музыку
// ============================================
let activeMusicService = 'spotify'; // или 'yandex'

document.querySelectorAll('.music-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.music-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeMusicService = btn.dataset.service;
  });
});

document.querySelectorAll('.track-item').forEach(track => {
  track.addEventListener('click', (e) => {
    e.preventDefault();
    const query = encodeURIComponent(track.dataset.track || '');
    let url;
    if (activeMusicService === 'yandex') {
      url = `https://music.yandex.ru/search?text=${query}`;
    } else {
      url = `https://open.spotify.com/search/${query}`;
    }
    window.open(url, '_blank', 'noopener');
  });
});

// ============================================
// 100 фраз про любовь к Регине
// ============================================
const lovePhrases = [
  'Я люблю тебя.',
  'Ты — моё счастье.',
  'Ты невероятная.',
  'Я скучаю по тебе каждый день.',
  'Ты делаешь мою жизнь ярче.',
  'Ты — мой человек.',
  'Спасибо, что ты есть.',
  'Ты самая красивая.',
  'Я горжусь тобой.',
  'Ты — лучшее, что со мной случилось.',
  'Я думаю о тебе постоянно.',
  'Ты вдохновляешь меня.',
  'Мне повезло, что я тебя встретил.',
  'Ты — моя опора.',
  'Я тебя обожаю.',
  'Ты уникальная.',
  'Твой смех — моя любимая мелодия.',
  'Ты понимаешь меня как никто.',
  'Я верю в нас.',
  'Ты — мой дом.',
  'Я люблю твою улыбку.',
  'Ты — мой лучший друг.',
  'С тобой я чувствую себя собой.',
  'Ты — мой свет.',
  'Я тебя ценю.',
  'Ты — моя мечта, которая сбылась.',
  'Я люблю наш внутренний юмор.',
  'Ты — самая тёплая.',
  'Я хочу быть рядом с тобой всегда.',
  'Ты заставляешь меня становиться лучше.',
  'Ты — моя Регина.',
  'Я люблю тебя больше вчерашнего дня.',
  'Ты — мой тыл.',
  'С тобой даже грустные дни становятся светлее.',
  'Ты — моя удача.',
  'Я люблю наши разговоры.',
  'Ты — самая настоящая.',
  'Ты моя и точка.',
  'Я счастлив, что ты в моей жизни.',
  'Ты — мой компас.',
  'Я люблю тебя несмотря ни на что.',
  'Ты — моё вдохновение.',
  'Ты всегда поддерживаешь.',
  'Ты — моя самая важная.',
  'Я люблю твой характер.',
  'Ты — моя опора в мире.',
  'Ты умеешь делать меня счастливым.',
  'Ты — моё сердце.',
  'Я люблю тебя всё сильнее.',
  'Ты — моя половинка.',
  'С тобой я дома.',
  'Ты — самая родная.',
  'Я люблю наши шутки.',
  'Ты — моя защита.',
  'Ты делаешь обычные дни особенными.',
  'Ты — моя радость.',
  'Я тебя никогда не отпущу.',
  'Ты — моё всё.',
  'Я люблю тебя по-настоящему.',
  'Ты — моя гордость.',
  'Ты умеешь согревать душу.',
  'Ты — моя самая любимая.',
  'Я благодарен за каждый день с тобой.',
  'Ты — моя мечта.',
  'Я люблю тебя больше слов.',
  'Ты — моя сила.',
  'Ты понимаешь меня без слов.',
  'Ты — моя тихая гавань.',
  'Я люблю тебя безусловно.',
  'Ты — моя звезда.',
  'Ты делаешь меня счастливее.',
  'Ты — моя настоящая любовь.',
  'Я верю в наше будущее.',
  'Ты — моя муза.',
  'Я люблю тебя каждой клеткой.',
  'Ты — моя судьба.',
  'Ты — самая важная в моей жизни.',
  'Ты — моя радость каждое утро.',
  'Я люблю твою искренность.',
  'Ты — моё сокровище.',
  'Ты умеешь быть рядом.',
  'Ты — моя поддержка.',
  'Я люблю тебя больше жизни.',
  'Ты — моя любовь.',
  'Ты — самая родная душа.',
  'Я счастлив, что ты моя.',
  'Ты — моя принцесса.',
  'Я люблю тебя всем сердцем.',
  'Ты — моя надежда.',
  'Ты — моё солнце.',
  'Я люблю тебя, Регина.',
  'Ты — моя верная.',
  'Ты — моя единственная.',
  'Я люблю тебя до луны и обратно.',
  'Ты — моя радость жизни.',
  'Ты — моя любовь навсегда.',
  'Я люблю тебя больше всего.',
  'Ты — моя самая лучшая.',
  'Ты — моё счастье и покой.',
  'Я люблю тебя каждый миг.',
  'Ты — моя судьба и выбор.',
  'Ты — моя драгоценность.',
  'Я люблю тебя без границ.',
  'Ты — моя душа.',
  'Ты — моя опора и крыло.',
  'Я люблю тебя вечно.',
  'Ты — моя мечта и реальность.',
  'Ты — моя самая желанная.',
  'Я люблю тебя, моя Регина.',
  'Ты — моё счастье в одном лице.',
  'Ты — моя жизнь.',
  'Я люблю тебя сильнее с каждым днём.',
  'Ты — моя любовь и мой дом.',
  'Ты — моя радость и покой.',
  'Я люблю тебя, и это навсегда.',
];

// Дата отсчёта: 14 августа 2025, 23:59
const START_DATE = new Date('2025-08-14T23:59:00');

// ============================================
// Анимации при скролле (Intersection Observer)
// ============================================
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -80px 0px', // элемент виден чуть раньше
  threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
};

let lastScrollY = window.scrollY;
let ticking = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const section = entry.target;
    
    if (entry.isIntersecting) {
      section.classList.add('visible');
      section.classList.remove('visible-up');
    } else {
      // При скролле вверх — мягко исчезает
      const rect = section.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        section.classList.remove('visible');
        section.classList.add('visible-up');
      }
    }
  });
}, observerOptions);

// Подключаем ко всем секциям с data-animate
document.querySelectorAll('[data-animate]').forEach((el) => {
  observer.observe(el);
});

// ============================================
// Таймер
// ============================================
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const lovePhraseEl = document.getElementById('lovePhrase');

let lastPhraseIndex = -1;

function pad(num, length = 2) {
  return String(num).padStart(length, '0');
}

function updateTimer() {
  const now = new Date();
  const diff = now - START_DATE;

  const totalSeconds = Math.abs(Math.floor(diff / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Плавное обновление цифр
  daysEl.textContent = pad(days, 3);
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);

  // Меняем фразу при каждом тике
  const phraseIndex = totalSeconds % lovePhrases.length;
  if (phraseIndex !== lastPhraseIndex) {
    lastPhraseIndex = phraseIndex;
    updateLovePhrase(lovePhrases[phraseIndex]);
  }
}

function updateLovePhrase(text) {
  lovePhraseEl.classList.add('fade');
  
  setTimeout(() => {
    lovePhraseEl.textContent = text;
    lovePhraseEl.classList.remove('fade');
  }, 200);
}

// Инициализация фразы
lovePhraseEl.textContent = lovePhrases[0];

// Запуск таймера
updateTimer();
setInterval(updateTimer, 1000);

// ============================================
// Сезонные эффекты (снег / лепестки / листья)
// ============================================
const seasonalEl = document.getElementById('seasonalEffects');
if (seasonalEl) {
  const month = new Date().getMonth(); // 0-11
  let particleCount = 25;
  let duration = 12;
  let particleType = 'none';

  if (month >= 11 || month <= 1) {
    particleType = 'snow';
  } else if (month >= 2 && month <= 4) {
    particleType = 'petals';
  } else if (month >= 8 && month <= 10) {
    particleType = 'leaves';
  } else if (month >= 5 && month <= 7) {
    particleType = 'petals'; // летом тоже лепестки — романтично
  }

  if (particleType !== 'none') {
    const colors = {
      snow: ['#fff', '#f0f8ff', '#e6f2ff'],
      petals: ['#e8c4c4', '#f5e1e1', '#e8b4b8', '#fadadd'],
      leaves: ['#c4a484', '#a67c52', '#8b7355', '#d4a574']
    };

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'season-particle';
      const size = particleType === 'snow' 
        ? 4 + Math.random() * 6 
        : 8 + Math.random() * 12;
      p.style.width = size + 'px';
      p.style.height = particleType === 'snow' ? size + 'px' : size * 1.5 + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = -(20 + Math.random() * 100) + 'px';
      p.style.animationDuration = (duration + Math.random() * 6) + 's';
      p.style.animationDelay = -Math.random() * duration + 's';
      p.style.borderRadius = particleType === 'snow' ? '50%' : '50% 50% 0 0';
      p.style.background = colors[particleType][Math.floor(Math.random() * colors[particleType].length)];
      p.style.opacity = 0.4 + Math.random() * 0.5;
      seasonalEl.appendChild(p);
    }
  }
}

// ============================================
// Конфетти при первом открытии
// ============================================
const confettiKey = 'regina_site_visited';
if (!sessionStorage.getItem(confettiKey)) {
  sessionStorage.setItem(confettiKey, '1');
  
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#e8c4c4', '#f5e1e1', '#c4a484', '#a67c52', '#e8b4b8'];
    const pieces = [];
    const count = 60;

    for (let i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20,
        w: 6 + Math.random() * 6,
        h: 6 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 2,
        vy: 2 + Math.random() * 4,
        rotate: Math.random() * 360
      });
    }

    let frame = 0;
    const maxFrames = 180;

    function drawConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allDone = true;

      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rotate += 2;
        if (p.y < canvas.height + 20) allDone = false;

        const alpha = frame > maxFrames - 30 ? 1 - (frame - (maxFrames - 30)) / 30 : 1;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotate * Math.PI / 180);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      frame++;
      if (frame < maxFrames && !allDone) {
        requestAnimationFrame(drawConfetti);
      } else {
        canvas.style.display = 'none';
      }
    }

    setTimeout(drawConfetti, 800);
  }
}
