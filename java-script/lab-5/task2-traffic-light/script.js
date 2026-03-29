const config = {
    red: 5000,
    yellow: 3000,
    green: 7000,
    blinkTime: 500
};

const states = ['red', 'yellow', 'green', 'blinking-yellow'];
let currentStateIndex = 0;

let timerId = null;
let blinkIntervalId = null;

const lights = {
    red: document.getElementById('light-red'),
    yellow: document.getElementById('light-yellow'),
    green: document.getElementById('light-green')
};
const stateText = document.getElementById('state-text');

function turnOffAllLights() {
    lights.red.classList.remove('active');
    lights.yellow.classList.remove('active');
    lights.green.classList.remove('active');
}

function runLight() {
    clearTimeout(timerId);
    clearInterval(blinkIntervalId);
    turnOffAllLights();

    const currentState = states[currentStateIndex];

    switch (currentState) {
        case 'red':
            stateText.innerText = "Поточний стан: Червоний";
            lights.red.classList.add('active');
            timerId = setTimeout(nextState, config.red);
            break;

        case 'yellow':
            stateText.innerText = "Поточний стан: Жовтий";
            lights.yellow.classList.add('active');
            timerId = setTimeout(nextState, config.yellow);
            break;

        case 'green':
            stateText.innerText = "Поточний стан: Зелений";
            lights.green.classList.add('active');
            timerId = setTimeout(nextState, config.green);
            break;

        case 'blinking-yellow':
            stateText.innerText = "Поточний стан: Миготливий жовтий";
            let flashes = 0;
            let isYellowOn = false;

            blinkIntervalId = setInterval(() => {
                isYellowOn = !isYellowOn;
                lights.yellow.classList.toggle('active', isYellowOn);
                
                flashes++;
                if (flashes >= 6) {
                    clearInterval(blinkIntervalId);
                    nextState();
                }
            }, config.blinkTime);
            break;
    }
}

function nextState() {
    currentStateIndex = (currentStateIndex + 1) % states.length; // Return to the first element after last.
    runLight();
}

// Events. //

document.getElementById('btn-next').addEventListener('click', () => {
    nextState();
});

document.getElementById('btn-settings').addEventListener('click', () => {
    const red = prompt("Введіть тривалість червоного (в секундах):", config.red / 1000);
    if (red && !isNaN(red)) 
        config.red = Number(red) * 1000;
    
    const yellow = prompt("Введіть тривалість жовтого (в секундах):", config.yellow / 1000);
    if (yellow && !isNaN(yellow)) 
        config.yellow = Number(yellow) * 1000;
    
    const green = prompt("Введіть тривалість зеленого (в секундах):", config.green / 1000);
    if (green && !isNaN(green)) 
        config.green = Number(green) * 1000;
    
    currentStateIndex = 0;
    runLight();
});

runLight();