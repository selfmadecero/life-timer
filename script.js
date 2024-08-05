const translations = {
    ko: {
        title: "라이프타임: 당신의 인생시계",
        age: "현재 나이:",
        lifeExpectancy: "예상 수명:",
        sleepTime: "어제 취침 시간:",
        wakeTime: "오늘 기상 시간:",
        calculate: "계산하기",
        yourLifeClock: "당신의 인생 시계",
        sleepWakeInfo: "어제 <strong>{sleepTime}</strong>에 잠들고, 오늘 <strong>{wakeTime}</strong>에 일어나셨군요.",
        lifeTimeConcept: "만약 오늘 일어난 시간을 태어난 순간이라고 생각하고,<br>매일 같은 시간에 잠들며 그때를 생의 마지막이라고 본다면...",
        currentLifeTime: "지금 당신의 인생 시간은 <strong>{time}</strong>입니다.",
        age: "나이",
        years: "세",
        dailySleepTime: "일일 수면 시간",
        hours: "시간",
        activeTime: "활동 시간",
        lifeProgressRate: "인생 진행률",
        motivationEarly: "인생은 아직 시작에 불과합니다. 당신의 잠재력을 믿으세요!",
        motivationMid: "인생의 절반을 향해 가고 있습니다. 지금이 변화의 기회입니다!",
        motivationLate: "인생의 황금기입니다. 매 순간을 소중히 여기세요!"
    },
    en: {
        title: "Lifetime: Your Life Clock",
        age: "Current Age:",
        lifeExpectancy: "Life Expectancy:",
        sleepTime: "Yesterday's Bedtime:",
        wakeTime: "Today's Wake-up Time:",
        calculate: "Calculate",
        yourLifeClock: "Your Life Clock",
        sleepWakeInfo: "You fell asleep at <strong>{sleepTime}</strong> yesterday and woke up at <strong>{wakeTime}</strong> today.",
        lifeTimeConcept: "If you consider your wake-up time as the moment of birth,<br>and assume you sleep at the same time every day until the end of your life...",
        currentLifeTime: "Your current life time is <strong>{time}</strong>.",
        age: "Age",
        years: "years",
        dailySleepTime: "Daily Sleep Time",
        hours: "hours",
        activeTime: "Active Time",
        lifeProgressRate: "Life Progress Rate",
        motivationEarly: "Life is just beginning. Believe in your potential!",
        motivationMid: "You're heading towards the halfway point of life. Now is the time for change!",
        motivationLate: "You're in the golden age of your life. Cherish every moment!"
    }
};

let currentLang = 'ko';
let lifeClockInterval;

function toggleLanguage() {
    currentLang = currentLang === 'ko' ? 'en' : 'ko';
    updateLanguage();
}

function updateLanguage() {
    document.querySelectorAll('[data-lang]').forEach(elem => {
        const key = elem.getAttribute('data-lang');
        elem.textContent = translations[currentLang][key];
    });
    document.getElementById('language-toggle').textContent = currentLang === 'ko' ? 'English' : '한국어';
    if (document.getElementById('result').style.display !== 'none') {
        updateLifeInfo(
            parseInt(document.getElementById('age').value),
            parseInt(document.getElementById('life-expectancy').value),
            document.getElementById('sleep-time').value,
            document.getElementById('wake-time').value,
            parseFloat(document.getElementById('life-clock').getAttribute('data-life-clock-time')),
            parseFloat(document.getElementById('life-clock').getAttribute('data-sleep-duration')),
            parseFloat(document.getElementById('life-clock').getAttribute('data-awake-time')),
            parseFloat(document.getElementById('life-clock').getAttribute('data-life-progress'))
        );
    }
}

document.getElementById('language-toggle').addEventListener('click', toggleLanguage);

function calculateLifeClock() {
    const age = parseInt(document.getElementById('age').value);
    const lifeExpectancy = parseInt(document.getElementById('life-expectancy').value);
    const sleepTime = document.getElementById('sleep-time').value;
    const wakeTime = document.getElementById('wake-time').value;

    if (!age || !lifeExpectancy || !sleepTime || !wakeTime) {
        alert(currentLang === 'ko' ? '모든 필드를 입력해주세요.' : 'Please fill in all fields.');
        return;
    }

    if (age >= lifeExpectancy) {
        alert(currentLang === 'ko' ? '현재 나이는 예상 수명보다 작아야 합니다.' : 'Current age must be less than life expectancy.');
        return;
    }

    const sleepDate = new Date(`2000-01-01T${sleepTime}`);
    const wakeDate = new Date(`2000-01-01T${wakeTime}`);
    
    if (wakeDate <= sleepDate) {
        wakeDate.setDate(wakeDate.getDate() + 1);
    }

    const sleepDuration = (wakeDate - sleepDate) / (1000 * 60 * 60);
    const awakeTime = 24 - sleepDuration;
    const lifeProgress = age / lifeExpectancy;

    const lifeClockTime = (awakeTime * lifeProgress + wakeDate.getHours() + wakeDate.getMinutes() / 60) % 24;

    document.getElementById('life-clock').setAttribute('data-life-clock-time', lifeClockTime);
    document.getElementById('life-clock').setAttribute('data-sleep-duration', sleepDuration);
    document.getElementById('life-clock').setAttribute('data-awake-time', awakeTime);
    document.getElementById('life-clock').setAttribute('data-life-progress', lifeProgress);

    startLifeClock(lifeClockTime);
    updateLifeInfo(age, lifeExpectancy, sleepTime, wakeTime, lifeClockTime, sleepDuration, awakeTime, lifeProgress);

    document.getElementById('result').style.display = 'block';
}

function startLifeClock(initialTime) {
    if (lifeClockInterval) {
        clearInterval(lifeClockInterval);
    }

    let currentTime = initialTime;
    
    function updateClock() {
        currentTime = (currentTime + 1/3600) % 24;
        updateLifeClock(currentTime);
    }

    updateLifeClock(currentTime);
    
    lifeClockInterval = setInterval(updateClock, 1000);
}

function updateLifeClock(time) {
    const hours = time % 12;
    const minutes = (time % 1) * 60;
    const seconds = ((time * 60) % 1) * 60;
    
    const hourDegrees = (hours / 12) * 360;
    const minuteDegrees = (minutes / 60) * 360;
    const secondDegrees = (seconds / 60) * 360;

    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');
    const ampmIndicator = document.getElementById('ampm-indicator');

    if (hourHand && minuteHand && secondHand && ampmIndicator) {
        hourHand.style.transform = `translate(-50%, -100%) rotate(${hourDegrees}deg)`;
        minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteDegrees}deg)`;
        secondHand.style.transform = `translate(-50%, -100%) rotate(${secondDegrees}deg)`;
        ampmIndicator.textContent = time >= 12 ? 'PM' : 'AM';
    } else {
        console.error("Clock elements not found");
    }
}

function updateLifeInfo(age, lifeExpectancy, sleepTime, wakeTime, lifeClockTime, sleepDuration, awakeTime, lifeProgress) {
    const info = document.getElementById('life-info');
    const hours = Math.floor(lifeClockTime);
    const minutes = Math.floor((lifeClockTime % 1) * 60);
    const ampm = hours >= 12 ? (currentLang === 'ko' ? '오후' : 'PM') : (currentLang === 'ko' ? '오전' : 'AM');
    const displayHours = hours % 12 || 12;
    const timeString = `${ampm} ${displayHours}:${minutes.toString().padStart(2, '0')}`;

    info.innerHTML = `
        <h2>${translations[currentLang].yourLifeClock}</h2>
        <p class="sleep-wake-info">${translations[currentLang].sleepWakeInfo.replace('{sleepTime}', sleepTime).replace('{wakeTime}', wakeTime)}</p>
        <p class="life-time-concept">${translations[currentLang].lifeTimeConcept}</p>
        <p class="current-life-time">${translations[currentLang].currentLifeTime.replace('{time}', timeString)}</p>
        <div class="life-stats">
            <p>${translations[currentLang].age}: <strong>${age} ${translations[currentLang].years}</strong> / ${translations[currentLang].lifeExpectancy}: <strong>${lifeExpectancy} ${translations[currentLang].years}</strong></p>
            <p>${translations[currentLang].dailySleepTime}: <strong>${sleepDuration.toFixed(1)} ${translations[currentLang].hours}</strong> / ${translations[currentLang].activeTime}: <strong>${awakeTime.toFixed(1)} ${translations[currentLang].hours}</strong></p>
            <p>${translations[currentLang].lifeProgressRate}: <strong>${(lifeProgress * 100).toFixed(1)}%</strong></p>
        </div>
        <p class="motivation-message">${getMotivationMessage(lifeProgress)}</p>
    `;
}

function getMotivationMessage(lifeProgress) {
    if (lifeProgress < 0.3) {
        return translations[currentLang].motivationEarly;
    } else if (lifeProgress < 0.6) {
        return translations[currentLang].motivationMid;
    } else {
        return translations[currentLang].motivationLate;
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('calculate').addEventListener('click', calculateLifeClock);
    updateLanguage();
});
