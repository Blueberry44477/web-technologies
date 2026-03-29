class Lamp {
    constructor(name, colorTemperature, canDim) {
        this.name = name;
        this.colorTemperature = colorTemperature;
        this.canDim = canDim;
        this.brightness = 100;
        this.isOn = false;
    }

    toggle() {
        this.isOn = !this.isOn;
        return this.isOn;
    }

    setBrightness(value) {
        if (this.canDim) {
            this.brightness = Math.min(Math.max(value, 0), 100);
        }
    }
}

const configs = {
    normal: { name: "normal", temp: 2700, dim: false },
    led: { name: "led", temp: 4000, dim: false },
    pwm: { name: "pwm", temp: 4000, dim: true }
};

function getKelvinToRGB(kelvin) {
    if (kelvin < 3000) 
        return "rgb(255, 94, 0)"; 
    else if (kelvin < 6000) 
        return "rgb(173, 211, 255)";
    else return "rgb(244, 0, 150)"; 
}

function updateUI() {
    lampElement.classList.toggle('lamp--on', currentLamp.isOn);

    if (currentLamp.isOn) {
        const color = getKelvinToRGB(currentLamp.colorTemperature);
        lampElement.style.setProperty('--lamp-color', color);
        
        const intensity = currentLamp.canDim ? currentLamp.brightness / 100 : 1;
        lampElement.style.setProperty('--lamp-intensity', intensity);
    }
}

const lampElement = document.getElementById("lamp");
const lampTypeSelector = document.getElementById("lampType");

let currentLamp = new Lamp(configs.normal.name, configs.normal.temp, configs.normal.dim);

document.getElementById('lampToggle').addEventListener('click', () => {
    currentLamp.toggle();
    updateUI();
});

lampTypeSelector.addEventListener('change', (e) => {
    const config = configs[e.target.value];
    const wasOn = currentLamp.isOn;
    
    currentLamp = new Lamp(config.name, config.temp, config.dim);
    currentLamp.isOn = wasOn;
    
    updateUI();
});


document.getElementById('lampBrightness').addEventListener('click', () => {
    if (!currentLamp.canDim) {
        alert("This lamp cannot change brightness!");
        return;
    }
    const input = prompt("Enter brightness (0-100):", currentLamp.brightness);
    
    if (input !== null && !isNaN(input)) {
        currentLamp.setBrightness(Number(input));
        updateUI();
    }
});