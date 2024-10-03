"use strict";

const timeDisplay = document.getElementById("time-string");
const toggleButton = document.getElementById("toggle-format");
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
toggleButton.addEventListener("click", () => {
  is24HourFormat = !is24HourFormat;
  getClock(); // 클릭 시 바로 업데이트
});

getClock();
setInterval(getClock, 1000);

// timer 부분
const thirtySeconds = document.getElementById("thirtySeconds");
const oneMinutes = document.getElementById("oneMinutes");
const fiveMinutes = document.getElementById("fiveMinutes");
const tenMinutes = document.getElementById("tenMinutes");
const thirtyMinutes = document.getElementById("thirtyMinutes");
const oneHour = document.getElementById("oneHour");

const timerHour = document.querySelector(
  '.time-inputs input[placeholder="시"]'
);
const timerMinutes = document.querySelector(
  '.time-inputs input[placeholder="분"]'
);
const timerSeconds = document.querySelector(
  '.time-inputs input[placeholder="초"]'
);

const timerStart = document.querySelector(".timer-controls #start");
const timerReset = document.querySelector(".timer-controls #reset");

thirtySeconds.onclick = function () {
  let currentSeconds = parseInt(timerSeconds.value) || 0;
  let currentMinutes = parseInt(timerMinutes.value) || 0;
  let currentHours = parseInt(timerHour.value) || 0;

  currentSeconds += 30;

  if (currentSeconds >= 60) {
    currentMinutes += Math.floor(currentSeconds / 60);
    currentSeconds = currentSeconds % 60;
    timerSeconds.value = currentSeconds;
    timerMinutes.value = currentMinutes;
  } else {
    timerSeconds.value = currentSeconds;
  }

  if (currentMinutes >= 60) {
    currentHours += Math.floor(currentMinutes / 60);
    currentMinutes = currentMinutes % 60;
    timerSeconds.value = currentSeconds;
    timerMinutes.value = currentMinutes;
    timerHour.value = currentHours;
  } else {
    timerSeconds.value = currentSeconds;
    timerMinutes.value = currentMinutes;
  }
};

oneMinutes.onclick = function () {
  let currentSeconds = parseInt(timerSeconds.value) || 0;
  let currentMinutes = parseInt(timerMinutes.value) || 0;
  let currentHours = parseInt(timerHour.value) || 0;

  currentMinutes += 1;

  if (currentMinutes >= 60) {
    currentHours += Math.floor(currentMinutes / 60);
    currentMinutes = currentMinutes % 60;
    timerHour.value = currentHours;
    timerSeconds.value = currentSeconds;
    timerMinutes.value = currentMinutes;
  } else {
    timerSeconds.value = currentSeconds;
    timerMinutes.value = currentMinutes;
  }
};

fiveMinutes.onclick = function () {
  let currentSeconds = parseInt(timerSeconds.value) || 0;
  let currentMinutes = parseInt(timerMinutes.value) || 0;
  let currentHours = parseInt(timerHour.value) || 0;

  currentMinutes += 5;

  if (currentMinutes >= 60) {
    currentHours += Math.floor(currentMinutes / 60);
    currentMinutes = currentMinutes % 60;
    timerHour.value = currentHours;
    timerSeconds.value = currentSeconds;
    timerMinutes.value = currentMinutes;
  } else {
    timerSeconds.value = currentSeconds;
    timerMinutes.value = currentMinutes;
  }
};

tenMinutes.onclick = function () {
  let currentSeconds = parseInt(timerSeconds.value) || 0;
  let currentMinutes = parseInt(timerMinutes.value) || 0;
  let currentHours = parseInt(timerHour.value) || 0;

  currentMinutes += 10;

  if (currentMinutes >= 60) {
    currentHours += Math.floor(currentMinutes / 60);
    currentMinutes = currentMinutes % 60;
    timerHour.value = currentHours;
    timerSeconds.value = currentSeconds;
    timerMinutes.value = currentMinutes;
  } else {
    timerSeconds.value = currentSeconds;
    timerMinutes.value = currentMinutes;
  }
};

thirtyMinutes.onclick = function () {
  let currentSeconds = parseInt(timerSeconds.value) || 0;
  let currentMinutes = parseInt(timerMinutes.value) || 0;
  let currentHours = parseInt(timerHour.value) || 0;

  currentMinutes += 30;

  if (currentMinutes >= 60) {
    currentHours += Math.floor(currentMinutes / 60);
    currentMinutes = currentMinutes % 60;
    timerHour.value = currentHours;
    timerSeconds.value = currentSeconds;
    timerMinutes.value = currentMinutes;
  } else {
    timerSeconds.value = currentSeconds;
    timerMinutes.value = currentMinutes;
  }
};

oneHour.onclick = function () {
  let currentSeconds = parseInt(timerSeconds.value) || 0;
  let currentMinutes = parseInt(timerMinutes.value) || 0;
  let currentHours = parseInt(timerHour.value) || 0;

  currentHours += 1;

  timerSeconds.value = currentSeconds;
  timerMinutes.value = currentMinutes;
  timerHour.value = currentHours;
};

timerReset.onclick = function () {
  timerHour.value = "시";
  timerMinutes.value = "분";
  timerSeconds.value = "초";
};

// stopwatch 부분
let minutes = 0;
let seconds = 0;
let tenMills = 0;

const stopwatchMinutes = document.getElementById("minutes");
const stopwatchSeconds = document.getElementById("seconds");
const stopwatchTenMills = document.getElementById("tenMills");

const stopwatchStart = document.querySelector(".stopwatch-controls #start");
const stopwatchStop = document.querySelector(".stopwatch-controls #stop");
const stopwatchReset = document.querySelector(".stopwatch-controls #reset");

let intervalId;

stopwatchStart.onclick = function () {
  clearInterval(intervalId);
  intervalId = setInterval(operateTimer, 10);
};

stopwatchStop.onclick = function () {
  clearInterval(intervalId);
};

stopwatchReset.onclick = function () {
  clearInterval(intervalId);
  tenMills = 0;
  seconds = 0;
  minutes = 0;
  stopwatchTenMills.textContent = "00";
  stopwatchSeconds.textContent = "00";
  stopwatchMinutes.textContent = "00";
};

// 10ms 마다 시간에 대한 숫자가 증가
function operateTimer() {
  tenMills++;
  stopwatchTenMills.textContent = tenMills > 9 ? tenMills : "0" + tenMills;
  if (tenMills > 99) {
    seconds++;
    stopwatchSeconds.textContent = seconds > 9 ? seconds : "0" + seconds;
    tenMills = 0;
    stopwatchTenMills.textContent = "00";
  }

  if (seconds > 59) {
    minutes++;
    stopwatchMinutes.textContent = minutes > 9 ? minutes : "0" + minutes;
    seconds = 0;
    stopwatchSeconds.textContent = "00";
  }
}
