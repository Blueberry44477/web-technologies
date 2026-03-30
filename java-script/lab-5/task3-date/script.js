function updateClock() {
    const now = new Date();
    
    document.getElementById('hours').innerText = String(now.getHours()).padStart(2, '0');
    document.getElementById('minutes').innerText = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('seconds').innerText = String(now.getSeconds()).padStart(2, '0');
}

updateClock();
setInterval(updateClock, 1000);

let countdownInterval;

document.getElementById('btn-start-timer').addEventListener('click', () => {
    const targetInput = document.getElementById('timer-input').value;

    if (!targetInput) 
        return alert('Choose date and time!');

    const targetDate = new Date(targetInput).getTime();
    
    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('timer-display').innerText = "Time is up!";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('timer-display').innerText = 
            `${days}d : ${hours}h : ${minutes}min : ${seconds}sec`;
    }, 1000);
});

// Countdown. //
let bdayInterval;

document.getElementById('bday-input').addEventListener('change', (e) => {
    const bdayInput = e.target.value; // "YYYY-MM-DD"

    if (!bdayInput) 
        return;

    clearInterval(bdayInterval);

    bdayInterval = setInterval(() => {
        const now = new Date();
        const birthDate = new Date(bdayInput);
        
        let nextBday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        
        if (now > nextBday) {
            nextBday.setFullYear(now.getFullYear() + 1);
        }

        let monthsDiff = nextBday.getMonth() - now.getMonth();
        if (monthsDiff < 0)
            monthsDiff += 12;

        let tempDate = new Date(now.getFullYear(), now.getMonth() + monthsDiff, now.getDate());
        if (tempDate > nextBday) {
            monthsDiff--;

            if (monthsDiff < 0) 
                monthsDiff += 12;

            tempDate = new Date(now.getFullYear(), now.getMonth() + monthsDiff, now.getDate());
        }

        let msDiff = nextBday - tempDate;

        const days = Math.floor(msDiff / (1000 * 60 * 60 * 24));
        msDiff -= days * (1000 * 60 * 60 * 24);
        
        const hours = Math.floor(msDiff / (1000 * 60 * 60));
        msDiff -= hours * (1000 * 60 * 60);
        
        const minutes = Math.floor(msDiff / (1000 * 60));
        msDiff -= minutes * (1000 * 60);
        
        const seconds = Math.floor(msDiff / 1000);

        document.getElementById('bday-display').innerText = 
            `${monthsDiff} months, ${days} days, ${hours} h, ${minutes} min, ${seconds} sec`;

    }, 1000);
});