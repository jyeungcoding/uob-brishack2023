/*const model = poseDetection.SupportedModels.BlazePose;
const detectorConfig = {
  runtime: 'tfjs',
  enableSmoothing: true,
  modelType: 'full'
};
detector = await poseDetection.createDetector(model, detectorConfig);

const estimationConfig = {flipHorizontal: true};
const timestamp = performance.now();
const poses = await detector.estimatePoses(image, estimationConfig, timestamp);*/



const video = document.getElementById('videoCam');
const enableWebcamButton = document.getElementById('webcamButton');
var webCamOn = false;

function getUserMediaSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function startWebcamEventListener() {
    if (getUserMediaSupported()) {
        enableWebcamButton.addEventListener('click', enableCam);
    } 
    else {
        console.warn('getUserMedia() is not supported by your browser');
    }
}

function startCam(constraints) {
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        if ("srcObject" in video) {
            video.srcObject = stream;
        } else {
            video.src = window.URL.createObjectURL(vidStream);
        }
    });
    video.onloadedmetadata = function(e) {
        video.play();
    };
    enableWebcamButton.innerHTML = "Stop webcam";
}

function stopCam(constraints) {
    const mediaStream = video.srcObject;
    const tracks = mediaStream.getTracks();
    tracks.forEach(track => track.stop());
    enableWebcamButton.innerHTML = "Start webcam";
}

function enableCam(event) {
    const constraints = {
        audio: false,
        video: true
    };
    if (webCamOn == false) {
        startCam(constraints);
        webCamOn = true;
    }
    else{
        stopCam(constraints);
        webCamOn = false;
    }
}

function setCamWrapperRed() {
    const camWrapper = document.getElementById("camWrapper");
    camWrapper.classList.add("set_red");
}

function setCamWrapperGreen() {
    const camWrapper = document.getElementById("camWrapper");
    camWrapper.classList.add("set_green");
}

startWebcamEventListener();




