function updateCountdown() {
    const now = new Date();
    const diff = revealDate - now;

    // Stop the timer if the date is in the past and send call to API
    if (diff <= 1000) {
        clearInterval(timer);
        setTimeout(fetchGenderUponReveal, diff);
        return;
    }

    const timeUnits = getTimeUnits(diff);
    document.getElementById('countdown-timer').innerHTML = `${timeUnits.days} days, ${timeUnits.hours} hours, ${timeUnits.minutes} minutes, ${timeUnits.seconds} seconds`;
}

function getTimeUnits(ms) {
    const seconds = Math.floor(ms / 1000 % 60);
    const minutes = Math.floor(ms / 1000 / 60 % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60 % 24);
    const days = Math.floor(ms / 1000 / 60 / 60 / 24);
    return { days, hours, minutes, seconds };
}

function fetchGenderUponReveal() {
    fetch(`/api/genderReveal`).then(res => res.json()).then((data) => {
        console.log(JSON.stringify(data));
        document.getElementById('countdown-timer').innerHTML = `It's a ${data.genderName}!`;
        document.getElementById('body').style.backgroundColor = data.backgroundColor;
        document.getElementById('body').style.fontSize = '50px';
    }).catch(err => console.log(err));
}

// Update the countdown every 1 second (1000 milliseconds)
const timer = setInterval(updateCountdown, 1000);

// Initialize the countdown
updateCountdown();