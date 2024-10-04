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

let totalSeconds = 0;
let interval;

const timerStart = document.querySelector(".timer-controls #start");
const timerReset = document.querySelector(".timer-controls #reset");

timerStart.onclick = function () {
  let timerHoursInput = parseInt(timerHour.value) || 0;
  let timerMinutesInput = parseInt(timerMinutes.value) || 0;
  let timerSecondsInput = parseInt(timerSeconds.value) || 0;

  clearInterval(interval);
  totalSeconds =
    timerHoursInput * 3600 + timerMinutesInput * 60 + timerSecondsInput;

  interval = setInterval(function () {
    totalSeconds--;
    if (totalSeconds <= 0) {
      clearInterval(interval);
    }

    let displayHours = Math.floor(totalSeconds / 3600);
    let displayMinutes = Math.floor((totalSeconds % 3600) / 60);
    let displaySeconds = totalSeconds % 60;

    timerHour.value = displayHours;
    timerMinutes.value = displayMinutes;
    timerSeconds.value = displaySeconds;
  }, 1000);
};

timerReset.onclick = function () {
    clearInterval(interval);
    timerHour.value = "시";
    timerMinutes.value = "분";
    timerSeconds.value = "초";
    totalSeconds = 0;
  };

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

// 알람 부분
let alarmList = [];
let alarmInterval = null;

// 알람 등록
document.getElementById('set-alarm').addEventListener('click', function() {
  const inputTime = document.getElementById('alarm-time').value;
  if(!inputTime){
    alert('알람 시간을 설정하세요')
    return
  }
  alarmList.push(inputTime)
  updateAlarmList()
  
  if(alarmInterval){
    clearInterval(alarmInterval)
  }

  // 알람 체크 시작
  alarmInterval = setInterval(checkAlarms, 1000);
});

// 알람 수정
document.getElementById('modify-alarm').addEventListener('click', function() {
  const selectedIndex = getSelectedAlarmIndex();

  if (selectedIndex === -1) {
    alert('수정할 알람을 선택하세요.');
    return;
  }
  
  const newTime = document.getElementById('alarm-time').value;
  if (!newTime) {
    alert('새로운 알람 시간을 설정하세요.');
    return;
  }
  
  alarmList[selectedIndex] = newTime;
  updateAlarmList();
});

// 알람 목록 업데이트
function updateAlarmList() {
  const tbody = document.querySelector('#alarm-list tbody');
  tbody.innerHTML = '';

  alarmList.forEach((time,index) => {
    const row = document.createElement('tr');

    const checkboxCell = document.createElement('td');
    const checkbox = document.createElement('input');

    checkbox.type = 'checkbox';
    checkbox.name = 'selected-alarm';
    checkbox.value = index;
    checkboxCell.appendChild(checkbox);

    const timeCell = document.createElement('td');
    timeCell.textContent = time;
    
    row.appendChild(checkboxCell);
    row.appendChild(timeCell);
    
    tbody.appendChild(row);
  });
}

// 선택된 알람의 인덱스 가져오기
function getSelectedAlarmIndex() {
  const selectedChecked = document.querySelector('input[name="selected-alarm"]:checked');
  return selectedChecked ? parseInt(selectedChecked.value) : -1;
}