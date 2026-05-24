'use strict';

const MAX_LEVELS = 5;
const BASE_GUNMAN_TIME = 0.80;
const MIN_WAIT = 1500;
const MAX_WAIT = 4000;
const SCALE = 3;
const SCREEN_W = 800;

const CHARACTERS = Object.freeze([
    { id: 1, cls: 'char-1', name: 'The Bandit', walkSpeed: 5000 },
    { id: 2, cls: 'char-2', name: 'The Deputy', walkSpeed: 4500 },
    { id: 3, cls: 'char-3', name: 'Quick Draw', walkSpeed: 3500 },
    { id: 4, cls: 'char-4', name: 'El Sombrero', walkSpeed: 5500 },
    { id: 5, cls: 'char-5', name: 'The Sheriff', walkSpeed: 4000 },
]);

const CHAR_POSES = Object.freeze({
    'char-1': { walk:{w:33,h:65}, stand:{w:35,h:65}, ready:{w:35,h:65}, shoot:{w:34,h:65}, death:{w:97,h:65}  },
    'char-2': { walk:{w:33,h:76}, stand:{w:33,h:76}, ready:{w:26,h:76}, shoot:{w:29,h:76}, death:{w:69,h:76}  },
    'char-3': { walk:{w:27,h:60}, stand:{w:31,h:60}, ready:{w:31,h:60}, shoot:{w:31,h:60}, death:{w:73,h:60}  },
    'char-4': { walk:{w:32,h:68}, stand:{w:34,h:68}, ready:{w:33,h:68}, shoot:{w:33,h:68}, death:{w:70,h:68}  },
    'char-5': { walk:{w:32,h:72}, stand:{w:34,h:72}, ready:{w:31,h:72}, shoot:{w:35,h:72}, death:{w:108,h:72} },
});

const INITIAL_STATE = Object.freeze({
    level: 1,
    score: 0,
    phase: 'menu',
    character: CHARACTERS[0],
    gunmanShootTime: BASE_GUNMAN_TIME,
    fireTimestamp: null,
    timers: [],
});

const calcGunmanTime = level  => Math.max(0.30, parseFloat((BASE_GUNMAN_TIME - (level - 1) * 0.10).toFixed(2)));
const calcRoundScore = (level, sec) => Math.max(50, Math.round((1 / sec) * level * 100));
const calcCenterLeft = (cls)  => (SCREEN_W - CHAR_POSES[cls].stand.w * SCALE) / 2;
const getRandomWait = ()     => Math.floor(Math.random() * (MAX_WAIT - MIN_WAIT) + MIN_WAIT);
const getRandomCharacter = (currentId) =>
    CHARACTERS.filter(c => c.id !== currentId)[
        Math.floor(Math.random() * (CHARACTERS.length - 1))
    ];

const withTimers = (state, timers) => ({ ...state, timers });
const addTimer = (state, t) => withTimers(state, [...state.timers, t]);
const clearTimers = (state) => withTimers(state, []);
const withPhase = (state, phase) => ({ ...state, phase });
const withCharacter = (state, character) => ({ ...state, character });
const withScore = (state, score) => ({ ...state, score });
const withFire = (state, fireTimestamp) => ({ ...state, fireTimestamp });

const makeInitialState = () => ({ ...INITIAL_STATE, timers: [] });

const makeWalkingState = (prev) => ({
    ...prev,
    phase:          'walking',
    fireTimestamp:  null,
    timers:         [],
});

const makeNextLevelState = (prev) => ({
    ...prev,
    level:          prev.level + 1,
    phase:          'walking',
    gunmanShootTime: calcGunmanTime(prev.level + 1),
    fireTimestamp:  null,
    timers:         [],
});

// Audio ======================================================================
const createAudio = src => new Audio(src);
const sounds = {
    intro: createAudio('../assets/sfx/intro.m4a'),
    wait: createAudio('../assets/sfx/wait.m4a'),
    fire: createAudio('../assets/sfx/fire.m4a'),
    shot: createAudio('../assets/sfx/shot.m4a'),
    shotFall: createAudio('../assets/sfx/shot-fall.m4a'),
    death: createAudio('../assets/sfx/death.m4a'),
    win: createAudio('../assets/sfx/win.m4a'),
    foul: createAudio('../assets/sfx/foul.m4a'),
};
sounds.intro.loop = true;
sounds.wait.loop = true;

const playSound = s  => { s.currentTime = 0; s.play().catch(() => {}); };
const stopSound = s  => { s.pause(); s.currentTime = 0; };
const stopAllSounds = () => Object.values(sounds).forEach(stopSound);

const el = selector => document.querySelector(selector);
const dom = {
    menu: el('.game-menu'),
    wrapper: el('.wrapper'),
    panels: el('.game-panels'),
    gameScreen: el('.game-screen'),
    winScreen: el('.win-screen'),
    gunmanWrap: el('.gunman-wrap'),
    gunman: el('.gunman'),
    message: el('.message'),
    timeYou: el('.time-panel__you'),
    timeGunman: el('.time-panel__gunman'),
    scoreNum: el('.score-panel__score_num'),
    levelDisplay: el('.score-panel__level'),
    finalScore: el('.win-screen__final-score'),
    btnStart: el('.button-start-game'),
    btnRestart: el('.button-restart'),
    btnNextLevel: el('.button-next-level'),
    btnPlayAgain: el('.win-screen__play-again'),
};

const showEl = e => { e.style.display = 'block'; };
const hideEl = e => { e.style.display = 'none';  };

const renderHUD = (score, level, youTime, gunTime) => {
    dom.scoreNum.textContent     = score;
    dom.levelDisplay.textContent = `Level ${level}`;
    dom.timeYou.textContent      = youTime;
    dom.timeGunman.textContent   = gunTime;
};

const renderMessage = (text, cssClass) => {
    dom.message.className   = `message ${cssClass}`;
    dom.message.textContent = cssClass.includes('fire') ? '' : text;
};
const clearMessage = () => { dom.message.className = 'message'; dom.message.textContent = ''; };

const renderGunmanPose = (cls, pose) => {
    dom.gunmanWrap.className = `gunman-wrap ${cls} ${pose}`;
    dom.gunman.className = `gunman ${cls} ${pose}`;
};

const renderGameScreen = () => {
    hideEl(dom.menu);
    hideEl(dom.winScreen);
    showEl(dom.wrapper);
    showEl(dom.panels);
    showEl(dom.gameScreen);
    dom.btnRestart.style.display = 'none';
    dom.btnNextLevel.style.display = 'none';
    dom.gameScreen.classList.remove('game-screen--death');
};

const renderWinScreen = (score) => {
    hideEl(dom.wrapper);
    showEl(dom.winScreen);
    dom.finalScore.textContent = score;
};

const renderDeathScreen = () => {
    clearMessage();
    renderMessage('YOU LOSE', 'message--dead');
    dom.gameScreen.classList.add('game-screen--death');
    dom.btnRestart.style.display = 'block';
};

const renderVictory = (roundScore, isLastLevel) => {
    renderMessage(`+$${roundScore}`, 'message--win');
    if (!isLastLevel) dom.btnNextLevel.style.display = 'block';
};

const scheduleTimer = (fn, delay, currentState) => {
    const t = setTimeout(fn, delay);
    return addTimer(currentState, t);
};

const cancelAllTimers = (currentState) => {
    currentState.timers.forEach(clearTimeout);
    return clearTimers(currentState);
};

const startGunmanWalk = (cls, walkSpeed) => {
    dom.gunmanWrap.style.transition = 'none';
    dom.gunmanWrap.style.left       = '900px';
    renderGunmanPose(cls, 'walk');
    void dom.gunmanWrap.offsetLeft; // force reflow
    dom.gunmanWrap.style.transition = `left ${walkSpeed}ms linear`;
    dom.gunmanWrap.style.left       = calcCenterLeft(cls) + 'px';
};

let state = makeInitialState();
const setState = newState => { state = newState; };

function startGame() {
    const s0 = cancelAllTimers(state);
    stopAllSounds();
    const s1 = { ...makeInitialState(), phase: 'walking' };
    renderGameScreen();
    clearMessage();
    renderHUD(s1.score, s1.level, '0.00', s1.gunmanShootTime.toFixed(2));
    setState(s1);
    moveGunman();
}

function restartGame() {
    const s0 = cancelAllTimers(state);
    stopAllSounds();
    const s1 = makeWalkingState(s0);
    dom.btnRestart.style.display   = 'none';
    dom.btnNextLevel.style.display = 'none';
    dom.gameScreen.classList.remove('game-screen--death');
    clearMessage();
    renderHUD(s1.score, s1.level, '0.00', s1.gunmanShootTime.toFixed(2));
    setState(s1);
    moveGunman();
}

function nextLevel() {
    const s0 = cancelAllTimers(state);
    stopAllSounds();
    if (s0.level + 1 > MAX_LEVELS) { showWinScreen(); return; }
    const s1 = makeNextLevelState(s0);
    dom.btnNextLevel.style.display = 'none';
    dom.gameScreen.classList.remove('game-screen--death');
    clearMessage();
    renderHUD(s1.score, s1.level, '0.00', s1.gunmanShootTime.toFixed(2));
    setState(s1);
    moveGunman();
}

function moveGunman() {
    const character = getRandomCharacter(state.character.id);
    const s1 = withCharacter(state, character);
    renderMessage(character.name, 'message--win');
    startGunmanWalk(character.cls, character.walkSpeed);
    playSound(sounds.wait);
    dom.timeYou.textContent    = '0.00';
    dom.timeGunman.textContent = state.gunmanShootTime.toFixed(2);
    const s2 = scheduleTimer(clearMessage, 1500, s1);
    const s3 = scheduleTimer(prepareForDuel, character.walkSpeed, s2);
    setState(s3);
}

function prepareForDuel() {
    stopSound(sounds.wait);
    renderGunmanPose(state.character.cls, 'stand');
    const s1 = withPhase(state, 'waiting');
    const s2 = scheduleTimer(timeCounter, getRandomWait(), s1);
    setState(s2);
}

function timeCounter() {
    const s1 = { ...withPhase(state, 'duel'), fireTimestamp: Date.now() };
    renderGunmanPose(s1.character.cls, 'ready');
    renderMessage('', 'message--fire');
    playSound(sounds.fire);
    dom.timeGunman.textContent = s1.gunmanShootTime.toFixed(2);
    const s2 = scheduleTimer(gunmanShootsPlayer, s1.gunmanShootTime * 1000, s1);
    setState(s2);
}

function gunmanShootsPlayer() {
    if (state.phase !== 'duel') return;
    const s1 = withPhase(cancelAllTimers(state), 'result');
    renderGunmanPose(s1.character.cls, 'shoot');
    playSound(sounds.shot);
    const s2 = scheduleTimer(() => {
        stopSound(sounds.shot);
        playSound(sounds.death);
        renderDeathScreen();
    }, 400, s1);
    setState(s2);
}

function playerShootsGunman() {
    if (state.phase !== 'duel') return;
    const reactionMs  = Date.now() - state.fireTimestamp;
    const reactionSec = parseFloat((reactionMs / 1000).toFixed(2));
    const s1 = withPhase(cancelAllTimers(state), 'result');
    renderGunmanPose(s1.character.cls, 'death');
    stopAllSounds();
    playSound(sounds.shotFall);
    clearMessage();
    dom.timeYou.textContent = reactionSec.toFixed(2);
    const s2 = scheduleTimer(() => scoreCount(reactionSec), 3500, s1);
    setState(s2);
}

function scoreCount(reactionSec) {
    const roundScore  = calcRoundScore(state.level, reactionSec);
    const newScore    = state.score + roundScore;
    const isLastLevel = state.level >= MAX_LEVELS;
    const s1 = withScore(state, newScore);
    dom.scoreNum.textContent = newScore;
    playSound(sounds.win);
    renderVictory(roundScore, isLastLevel);
    if (isLastLevel) {
        const s2 = scheduleTimer(showWinScreen, 2500, s1);
        setState(s2);
    } else {
        setState(s1);
    }
}

function showWinScreen() {
    stopAllSounds();
    renderWinScreen(state.score);
    playSound(sounds.win);
}

function handleEarlyClick() {
    if (state.phase !== 'waiting') return;
    const s1 = withPhase(cancelAllTimers(state), 'result');
    stopAllSounds();
    renderMessage('TOO EARLY!', 'message--dead');
    playSound(sounds.foul);
    dom.btnRestart.style.display = 'block';
    setState(s1);
}

dom.btnStart.addEventListener('click',     () => { stopAllSounds(); startGame(); });
dom.btnRestart.addEventListener('click',   restartGame);
dom.btnNextLevel.addEventListener('click', nextLevel);
dom.btnPlayAgain.addEventListener('click', startGame);

dom.gunman.addEventListener('click', e => {
    e.stopPropagation();
    if (state.phase === 'waiting') handleEarlyClick();
    else playerShootsGunman();
});
dom.gameScreen.addEventListener('click', () => {
    if (state.phase === 'waiting') handleEarlyClick();
});

const startIntroMusic = () => {
    if (state.phase === 'menu' && sounds.intro.paused) {
        sounds.intro.play().catch(() => {});
    }
    document.removeEventListener('click',   startIntroMusic);
    document.removeEventListener('keydown', startIntroMusic);
};
document.addEventListener('click',   startIntroMusic);
document.addEventListener('keydown', startIntroMusic);
