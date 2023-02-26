let videoCam = document.getElementById('videoCam');
let canvasCam = document.getElementById('outputCam');
let ctxCam = canvasCam.getContext('2d');
let videoInstrct = document.getElementById("videoInstrct");
let canvasInstrct = document.getElementById("outputInstrct")
let ctxInstrct = canvasInstrct.getContext('2d');

let detector, model;
const scoreThreshold = 0.6;

async function createDetector() {
    model = poseDetection.SupportedModels.BlazePose;
    const detectorConfig = {
        runtime: "tfjs",
        enableSmoothing: true,
        modelType: "full"
    };
    detector = await poseDetection.createDetector(model, detectorConfig);
}

async function activateVideoCam() {
    if(navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({'video': {
            width: '640',
            height: '480'
        }}).then(stream => {
                videoCam.srcObject = stream;
            })
            .catch(e => {
                console.log("Error occurred while getting the video stream");
            });
    }

    videoCam.onloadedmetadata = () => {
        const videoWidth = videoCam.videoWidth;
        const videoHeight = videoCam.videoHeight;

        videoCam.width = videoWidth;
        videoCam.height = videoHeight;
        canvasCam.width = videoWidth;
        canvasCam.height = videoHeight;
        
        // Because the image from camera is mirrored, need to flip horizontally.
        ctxCam.translate(videoWidth, 0);
        ctxCam.scale(-1, 1);
    };

    videoCam.addEventListener("loadeddata", predictCamPoses);
}

async function predictCamPoses() {
    let poses = null;
    
    if (detector != null) {
        try {
            poses = await detector.estimatePoses(videoCam, {
                flipHorizontal: false 
            });
        } catch (error) {
            detector.dispose();
            detector = null;
            alert(error);
        }
    }

    ctxCam.drawImage(videoCam, 0, 0, videoCam.videoWidth, videoCam.videoHeight);

    if (poses && poses.length > 0) {
        for (const pose of poses) {
            if (pose.keypoints != null) {
                drawKeypointsCam(pose.keypoints);
                drawSkeletonCam(pose.keypoints);
            }
        }
    }

    window.requestAnimationFrame(predictCamPoses);
}

function drawKeypointsCam(keypoints) {
    ctxCam.fillStyle = 'Green';
    ctxCam.strokeStyle = 'White';
    ctxCam.lineWidth = 2;
    for(let i=0; i<keypoints.length; i++) {
        drawKeypointCam(keypoints[i]);
    }
}

function drawKeypointCam(keypoint) {
    const radius = 4;
    if (keypoint.score >= scoreThreshold) {
      const circle = new Path2D();
      circle.arc(keypoint.x, keypoint.y, radius, 0, 2 * Math.PI);
      ctxCam.fill(circle);
      ctxCam.stroke(circle);
    }
}

/* function drawKeypointsColor(keypoints) {
    const keypointInd = poseDetection.util.getKeypointIndexBySide(model);
    ctxCam.strokeStyle = 'White';
    ctxCam.lineWidth = 2;
    ctxCam.fillStyle = 'Red';
    for (const i of keypointInd.middle) {
        drawKeypointCam(keypoints[i]);
    }
    ctxCam.fillStyle = 'Green';
    for (const i of keypointInd.left) {
        drawKeypointCam(keypoints[i]);
    }
    ctxCam.fillStyle = 'Orange';
    for (const i of keypointInd.right) {
        drawKeypointCam(keypoints[i]);
    }
} */ 

function drawSkeletonCam(keypoints) {
    const color = "#fff";
    ctxCam.fillStyle = color;
    ctxCam.strokeStyle = color;
    ctxCam.lineWidth = 2;

    poseDetection.util.getAdjacentPairs(model)
        .forEach(([i, j]) => {
            const kp1 = keypoints[i];
            const kp2 = keypoints[j];
            if (kp1.score >= scoreThreshold && kp2.score >= scoreThreshold) {
                ctxCam.beginPath();
                ctxCam.moveTo(kp1.x, kp1.y);
                ctxCam.lineTo(kp2.x, kp2.y);
                ctxCam.stroke();
            }
    });
}






// New code for the instruction video below!!!


async function activateVideoInstrct() {
    canvasInstrct.height = videoInstrct.height;
    canvasInstrct.width = videoInstrct.width;
    videoInstrct.addEventListener("playing", makeHidden);
    videoInstrct.addEventListener("playing", predictInstrctPoses);
}

function makeHidden() {
    videoInstrct.classList.remove("videoInstrctVis");
    videoInstrct.classList.add("videoInstrctHid");
    canvasInstrct.classList.remove("canvasHid");
    canvasInstrct.classList.add("canvasVis");
}

async function predictInstrctPoses() {
    let poses = null;

    if (detector != null) {
        try {
            poses = await detector.estimatePoses(videoInstrct, {
                flipHorizontal: false
            });
        } catch (error) {
            detector.dispose();
            detector = null;
            alert(error);
        }
    }

    ctxInstrct.drawImage(videoInstrct, 0, 0, videoInstrct.videoWidth, videoInstrct.videoHeight);

    if (poses && poses.length > 0) {
        for (const pose of poses) {
            if (pose.keypoints != null) {
                drawKeypointsInstrct(pose.keypoints);
                drawSkeletonInstrct(pose.keypoints);
            }
        }
    }


    window.requestAnimationFrame(predictInstrctPoses);
}


function drawKeypointsInstrct(keypoints) {
    ctxInstrct.fillStyle = 'Green';
    ctxInstrct.strokeStyle = 'White';
    ctxInstrct.lineWidth = 2;
    for(let i=0; i<keypoints.length; i++) {
        drawKeypointInstrct(keypoints[i]);
    }
}

function drawKeypointInstrct(keypoint) {
    const radius = 4;
    if (keypoint.score >= scoreThreshold) {
        const circle = new Path2D();
        circle.arc(keypoint.x, keypoint.y, radius, 0, 2 * Math.PI);
        ctxInstrct.fill(circle);
        ctxInstrct.stroke(circle);
    }
}

/* function drawKeypointsColor(keypoints) {
    const keypointInd = poseDetection.util.getKeypointIndexBySide(model);
    ctxCam.strokeStyle = 'White';
    ctxCam.lineWidth = 2;
    ctxCam.fillStyle = 'Red';
    for (const i of keypointInd.middle) {
        drawKeypointCam(keypoints[i]);
    }
    ctxCam.fillStyle = 'Green';
    for (const i of keypointInd.left) {
        drawKeypointCam(keypoints[i]);
    }
    ctxCam.fillStyle = 'Orange';
    for (const i of keypointInd.right) {
        drawKeypointCam(keypoints[i]);
    }
} */

function drawSkeletonInstrct(keypoints) {
    const color = "#fff";
    ctxInstrct.fillStyle = color;
    ctxInstrct.strokeStyle = color;
    ctxInstrct.lineWidth = 2;

    poseDetection.util.getAdjacentPairs(model)
        .forEach(([i, j]) => {
            const kp1 = keypoints[i];
            const kp2 = keypoints[j];
            if (kp1.score >= scoreThreshold && kp2.score >= scoreThreshold) {
                ctxInstrct.beginPath();
                ctxInstrct.moveTo(kp1.x, kp1.y);
                ctxInstrct.lineTo(kp2.x, kp2.y);
                ctxInstrct.stroke();
            }
        });
}












async function app() {
    //Load the model and create a detector object
    await createDetector();

    //Enable camera and activate video
    await activateVideoCam();
    await activateVideoInstrct();
};

app();








/*
const estimationConfig = {flipHorizontal: true};
const timestamp = performance.now();
const poses = await detector.estimatePoses(image, estimationConfig, timestamp);





async function createDetector() {
    const model = poseDetection.SupportedModels.BlazePose;
    const detectorConfig = {
      runtime: 'tfjs',
      enableSmoothing: true,
      modelType: 'full'
    };
    detector = await poseDetection.createDetector(model, detectorConfig);
}




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

*/
