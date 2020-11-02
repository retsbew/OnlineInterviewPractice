let curQuestion = null;
let chosenVideo = null;
let prepInterval = null;
let answerInterval = null;
const constraints = {
    video: true,
}

document.addEventListener('DOMContentLoaded', function() {
    populateChooser();
    document.querySelector('#video-options').addEventListener('change', changeVideoOption);
    document.querySelector('#start-pre2').addEventListener('click', startPre2);
    document.querySelector('#start-recording').addEventListener('click', startRecording);
    document.querySelector('#begin-answering').addEventListener('click', beginAnswering);
    document.querySelector('#done-answering').addEventListener('click', doneAnswering);
    document.querySelector('#another-question').addEventListener('click',anotherQuestion);

});

function hideAll() {
    document.querySelectorAll(".section").forEach(section => {
        section.style.display = "none";
    });
}

// Populate chooser with question options
function populateChooser() {
    const container = document.querySelector('#chooser');
    for (let i = 0; i < QUESTIONS.length; i++) {
        const elt = document.createElement('div');
        elt.innerHTML = `Interview Question ${i+1}`;
        elt.dataset.question = i;
        elt.addEventListener('click', launchQuestion);
        container.append(elt);
    }
    container.style.display = "block";
}

function populateVideoOptions() {
    const select = document.querySelector('#video-options');
    select.innerHTML = '';
    navigator.mediaDevices.enumerateDevices()
     .then((devicesInfo) => {
         for (let i = 0; i < devicesInfo.length; i++) {
             const deviceInfo = devicesInfo[i];
             if (deviceInfo.kind == 'videoinput') {
                 const option = document.createElement('option');
                 option.value = deviceInfo.deviceId;
                 option.text = deviceInfo.label;
                 select.appendChild(option);
                 if (chosenVideo == option.value) {
                     select.value = chosenVideo;
                 }
             }
         }
     });
}

function changeVideoOption() {
    const select = document.querySelector('#video-options');
    chosenVideo = select.value;
    constraints.video = {deviceId: {exact: select.value}};
    const video = document.querySelector('#pre video');
    navigator.mediaDevices.getUserMedia(constraints)
     .then((stream) => {
         video.srcObject = stream;
     });
}

function launchQuestion(e) {
    const questionId = parseInt(e.target.dataset.question);
    curQuestion = questionId;
    const video = document.querySelector('#pre video');
    navigator.mediaDevices.getUserMedia(constraints)
     .then((stream) => {
         video.srcObject = stream;
     }).then(populateVideoOptions);
    document.querySelector('#chooser').style.display = 'none';
    document.querySelector('#pre').style.display = 'block';
}

function startPre2() {
    document.querySelector('#pre').style.display = 'none';
    document.querySelector('#pre2').style.display = 'block';
}

function startRecording() {
    document.querySelector('#label-text').innerHTML = 'Prep Time';
    document.querySelector('#question-number').innerHTML = curQuestion + 1;
    document.querySelector('#question-content').innerHTML = QUESTIONS[curQuestion];
    document.querySelector('#pre2').style.display = 'none';
    document.querySelector('#recording').style.display = 'block';
    document.querySelector('#countdown').style.display = 'none';
    document.querySelector('#video').style.display = 'block';
    document.querySelector('#done-answering').style.display = 'none';
    document.querySelector('#begin-answering').style.display = 'block';
    document.querySelector('#prep-time-left').innerHTML = `0:30`;
    document.querySelector('#prep-time-meter').style.width = '150px';

    const video = document.querySelector('#video');
    navigator.mediaDevices.getUserMedia(constraints)
     .then((stream) => {
         video.srcObject = stream;
     });


    let timeRemaining = 30;
    prepInterval = setInterval(function() {
        timeRemaining--;

        document.querySelector('#prep-time-meter').style.width = `${Math.round(150 * (timeRemaining / 30))}px`;
        if (timeRemaining < 10)
            document.querySelector('#prep-time-left').innerHTML = `0:0${timeRemaining}`;
        else
            document.querySelector('#prep-time-left').innerHTML = `0:${timeRemaining}`;

        if (timeRemaining == 0) {
            clearInterval(prepInterval);
            beginAnswering();
        }
    }, 1000);
}

function beginAnswering() {
    clearInterval(prepInterval);
    document.querySelector('#label-text').innerHTML = 'Response Time';
    document.querySelector('#begin-answering').style.display = 'none';
    document.querySelector('#done-answering').style.display = 'block';
    document.querySelector('#prep-time-left').innerHTML = `3:00`;
    document.querySelector('#prep-time-meter').style.width = '150px';
    document.querySelector('#video').style.display = 'none';
    document.querySelector('#countdown').style.display = 'block';
    document.querySelector('#countdown').innerHTML = '3';
    let timeRemaining = 183;
    answerInterval = setInterval(function() {
        timeRemaining--;

        if (timeRemaining > 180) {
            document.querySelector('#countdown').innerHTML = timeRemaining - 180;
            return;
        }

        if (timeRemaining == 180) {
            document.querySelector('#countdown').style.display = 'none';
            document.querySelector('#video').style.display = 'block';
        }

        document.querySelector('#prep-time-meter').style.width = `${Math.round(150 * (timeRemaining / 180))}px`;
        let minutes = Math.floor(timeRemaining / 60);
        let seconds = timeRemaining % 60;
        if (seconds < 10)
            document.querySelector('#prep-time-left').innerHTML = `${minutes}:0${seconds}`;
        else
            document.querySelector('#prep-time-left').innerHTML = `${minutes}:${seconds}`;

        if (timeRemaining == 0) {
            clearInterval(answerInterval);
            doneAnswering();
        }
    }, 1000);
}

function doneAnswering() {
    clearInterval(answerInterval);
    document.querySelector('#recording').style.display = 'none';
    document.querySelector('#done').style.display = 'block';
}

function anotherQuestion() {
    hideAll();
    document.querySelector('#chooser').style.display = 'block';
}
