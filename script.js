document.getElementById('calculate').addEventListener('click', calculateLifeClock);
let lifeClockInterval;

function calculateLifeClock() {
    const age = parseInt(document.getElementById('age').value);
    const lifeExpectancy = parseInt(document.getElementById('life-expectancy').value);
    const sleepTime = document.getElementById('sleep-time').value;
    const wakeTime = document.getElementById('wake-time').value;

    if (!age || !lifeExpectancy || !sleepTime || !wakeTime) {
        alert('모든 필드를 입력해주세요.');
        return;
    }

    if (age >= lifeExpectancy) {
        alert('현재 나이는 예상 수명보다 작아야 합니다.');
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
        currentTime = (currentTime + 1/3600) % 24; // 1초씩 증가
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
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 || 12;

    info.innerHTML = `
        <h2>당신의 인생 시계</h2>
        <p class="sleep-wake-info">어제 <strong>${sleepTime}</strong>에 잠들고, 오늘 <strong>${wakeTime}</strong>에 일어나셨군요.</p>
        <p class="life-time-concept">만약 오늘 일어난 시간을 태어난 순간이라고 생각하고,<br>
        매일 같은 시간에 잠들며 그때를 생의 마지막이라고 본다면...</p>
        <p class="current-life-time">지금 당신의 인생 시간은 <strong>${ampm} ${displayHours}시 ${minutes}분</strong>입니다.</p>
        <div class="life-stats">
            <p>나이: <strong>${age}세</strong> / 예상 수명: <strong>${lifeExpectancy}세</strong></p>
            <p>일일 수면 시간: <strong>${sleepDuration.toFixed(1)}시간</strong> / 활동 시간: <strong>${awakeTime.toFixed(1)}시간</strong></p>
            <p>인생 진행률: <strong>${(lifeProgress * 100).toFixed(1)}%</strong></p>
        </div>
        <p class="motivation-message">${getMotivationMessage(lifeProgress)}</p>
    `;
}

function getMotivationMessage(lifeProgress) {
    if (lifeProgress < 0.3) {
        return "인생은 아직 시작에 불과합니다. 당신의 잠재력을 믿으세요!";
    } else if (lifeProgress < 0.6) {
        return "인생의 절반을 향해 가고 있습니다. 지금이 변화의 기회입니다!";
    } else {
        return "인생의 황금기입니다. 매 순간을 소중히 여기세요!";
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('calculate').addEventListener('click', calculateLifeClock);
});