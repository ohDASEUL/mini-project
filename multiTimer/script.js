"use strict";

const timeDisplay = document.getElementById('time-string');
const toggleButton = document.getElementById('toggle-format');
let is24HourFormat = true; // 기본값은 24시간제

function getClock() {
    const date = new Date();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    let period = "";

    if (!is24HourFormat) {
        period = hours >= 12 ? "오후" : "오전";
        hours = hours % 12;
        hours = hours ? hours : 12; // 0시를 12시로 표시
    }

    hours = String(hours).padStart(2, "0");

    if (is24HourFormat) {
        timeDisplay.innerText = `현재시간은 ${hours}시 ${minutes}분 ${seconds}초 `;
    } else {
        timeDisplay.innerText = `현재시간은 ${period} ${hours}시 ${minutes}분 ${seconds}초 `;
    }
}

// 12시간제 버튼 클릭 시 동작
toggleButton.addEventListener('click', () => {
    is24HourFormat = !is24HourFormat;
    getClock(); // 클릭 시 바로 업데이트
});

getClock();
setInterval(getClock, 1000);


let minutes = 0
let seconds = 0
let tenMills = 0

const stopwatchMinutes = document.getElementById('minutes');
const stopwatchSeconds = document.getElementById('seconds');
const stopwatchTenMills = document.getElementById('tenMills');

const stopwatchStart = document.querySelector('.stopwatch-controls #start');
const stopwatchStop = document.querySelector('.stopwatch-controls #stop');
const stopwatchReset = document.querySelector('.stopwatch-controls #reset');

stopwatchStart.onclick = function () {
    setInterval(operateTimer, 10)
}

// 10ms 마다 시간에 대한 숫자가 증가
function operateTimer() {
    tenMills++;
    stopwatchTenMills.textContent = tenMills
    if(tenMills > 99){
        seconds++
        stopwatchSeconds.textContent = seconds
        tenMills = 0
        stopwatchTenMills.textContent = "00"
    }
}

