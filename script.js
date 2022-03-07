const formContiner = document.getElementById('countdownForm');
const cdForm = document.getElementById('cdForm');
const dateEl = document.getElementById('eventTime');
const countdownEl = document.getElementById('countdown');
const completeEl = document.getElementById('complete');
const cdTitleEl = document.getElementById('cdTitle');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const resetBttn= document.getElementById('resetCd');
const newCdBttn = document.getElementById('newCd');
let savedCd;
let cdInterval;

// Set minimum value of datetime input to now

// Returns the date with the local offset as an ISO String
function calcDateWithTimezoneOffset(date) {
    let timezoneOffset = date.getTimezoneOffset() / 60;
    if (timezoneOffset < 0) {
        timezoneOffset = timezoneOffset * -1;
    }
    let time2Set = date.getTime() + (timezoneOffset * 60 * 60 * 1000);
    return new Date(time2Set).toISOString();
}
function setCurrentTimeAsMinVal(){
    let currentDateTime = new Date();
    let nowIsISO = calcDateWithTimezoneOffset(currentDateTime);
    let minValue = nowIsISO.substring(0, (nowIsISO.indexOf("T") | 0) + 6 | 0);
    dateEl.setAttribute('min', minValue);    
    dateEl.setAttribute('value', '');
}

setCurrentTimeAsMinVal();

function countDownFinished() {
    formContiner.classList.add('hideme');
    formContiner.classList.remove('shown');
    countdownEl.classList.add('hideme');
    countdownEl.classList.remove('shown');
    completeEl.classList.remove('hideme');
    completeEl.classList.add('shown');
    localStorage.removeItem('countdown');
}

// update countdown UI 


// Reset all values - hide countdown, show cdForm
function resetCountDown() {
    formContiner.classList.remove('hideme');
    formContiner.classList.add('shown');
    completeEl.classList.remove('shown');
    completeEl.classList.add('hideme');
    countdownEl.classList.remove('shown');
    countdownEl.classList.add('hideme');
    setCurrentTimeAsMinVal();
    document.getElementById('eventTitle').value='';
    document.getElementById('eventTime').value ='';
    clearInterval(cdInterval);
    cdTitleEl.textContent = '';
    localStorage.removeItem('countdown');
}


// Calculate time diff and count down 
function calcTime4Cd(timeInput) {
    cdInterval = setInterval(function () {
        let currentTime4Diff = new Date().getTime();
        let time2Count2 = new Date(timeInput).getTime();
        let diff = time2Count2 - currentTime4Diff;
        daysEl.innerHTML = Math.floor(diff / (1000 * 60 * 60 * 24));
        hoursEl.innerHTML = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutesEl.innerHTML = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        secondsEl.innerHTML = Math.floor((diff % (1000 * 60)) / 1000);
        if (diff <= 0) {
            clearInterval(cdInterval);
            countDownFinished();
        }

    }, 1000);
    setTimeout(() => {
        formContiner.classList.remove('shown');
        formContiner.classList.add('hideme');
        completeEl.classList.remove('shown');
        completeEl.classList.add('hideme');
        countdownEl.classList.remove('hideme');
        countdownEl.classList.add('shown');
    }, 300);
}


// Form Submit - get input values 
function startCountdown(e) {
    e.preventDefault();
    let title = document.getElementById('eventTitle').value;
    let dateInput = document.getElementById('eventTime').value;
    savedCd = {
        title: title,
        date: dateInput
    };
    localStorage.setItem('countdown', JSON.stringify(savedCd));
    cdTitleEl.textContent = `${title}`;
    calcTime4Cd(dateInput);
}

// get Stored Counddown if available
function getStoredCd(){
    if(localStorage.getItem('countdown')){
        savedCd = JSON.parse(localStorage.getItem('countdown'));
        let storedTitle = savedCd.title;
        let storedDate = savedCd.date; 
        cdTitleEl.textContent = `${storedTitle}`;
        calcTime4Cd(storedDate);
    }
}


cdForm.addEventListener('submit', startCountdown);

resetBttn.addEventListener('click', resetCountDown);

newCdBttn.addEventListener('click', resetCountDown);

getStoredCd();