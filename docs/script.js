import { ComparePositions } from "./compare.js"

const MIN_ACCURACY = 0.5;
let comparePositions = new ComparePositions(MIN_ACCURACY);


let videoCam = document.getElementById('videoCam');
let canvasCam = document.getElementById('outputCam');
let ctxCam = canvasCam.getContext('2d');
let videoInstrct = document.getElementById("videoInstrct");
let canvasInstrct = document.getElementById("outputInstrct")

let posesCam, posesVid, currentResult;

let detector, model;
const scoreThreshold = 0.6;
var count = 0;

async function createDetector() {
    model = poseDetection.SupportedModels.BlazePose;
    const detectorConfig = {
        runtime: "tfjs",
        enableSmoothing: true,
        modelType: "heavy"
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
            .catch(() => {
                console.log("Error occurred while getting the webcam stream");
            });
    }

    videoCam.onloadedmetadata = () => {
        const videoWidth = videoCam.videoWidth;
        const videoHeight = videoCam.videoHeight;

        videoCam.width = videoWidth;
        videoCam.height = videoHeight;
        canvasCam.width = videoWidth;
        canvasCam.height = videoHeight;
        
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
        posesCam = poses;
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
    const keyName = keypoint["name"];
    if (currentResult !== undefined && keyName in currentResult) {
        var red = currentResult[keyName] * 255;
        var green = 255 - red;
        ctxCam.fillStyle = "rgba(" + red + ", " + green + ", " + " 20, 0.7)";
        ctxCam.strokeStyle = "rgba(" + red + ", " + green + ", " + " 20, 0.7)";
        ctxCam.lineWidth = 5;
        
        const radius = 4;
        if (keypoint.score >= scoreThreshold) {
            const circle = new Path2D();
            circle.arc(keypoint.x, keypoint.y, radius, 0, 2 * Math.PI);
            ctxCam.fill(circle);
            ctxCam.stroke(circle);
        }
    }
    
}

function drawSkeletonCam(keypoints) {
    const color = "#fff";
    ctxCam.fillStyle = color;
    ctxCam.strokeStyle = color;
    ctxCam.lineWidth = 2;

    poseDetection.util.getAdjacentPairs(model)
        .forEach(([i, j]) => {
            const kp1 = keypoints[i];
            const kp2 = keypoints[j];
            const keyName1 = kp1["name"];
            const keyName2 = kp2["name"];
            if (currentResult !== undefined && keyName1 in currentResult && keyName2 in currentResult) {
                var red = (currentResult[keyName1] + currentResult[keyName2]) * (255 / 2);
                var green = 255 - red;
                ctxCam.fillStyle = "rgba(" + red + ", " + green + ", " + " 20, 0.7)";
                ctxCam.strokeStyle = "rgba(" + red + ", " + green + ", " + " 20, 0.7)";
                ctxCam.lineWidth = 5;
                if (kp1.score >= scoreThreshold && kp2.score >= scoreThreshold) {
                    ctxCam.beginPath();
                    ctxCam.moveTo(kp1.x, kp1.y);
                    ctxCam.lineTo(kp2.x, kp2.y);
                    ctxCam.stroke();
                }
                
                
            }            
    });
    let score = comparePositions.getScore();
    count += 1;
    if (count % 15 == 0) {
        console.log(score);
    }


}


























//-----------------------------------------------//
//--- Instructor video model and canvas stuff ---//
//-----------------------------------------------//



async function activateVideoInstrct() {

    const videoWidth = videoInstrct.videoWidth;
    const videoHeight = videoInstrct.videoHeight;

    videoInstrct.width = videoWidth;
    videoInstrct.height = videoHeight;
    canvasInstrct.width = videoWidth;
    canvasInstrct.height = videoHeight;
    videoInstrct.addEventListener("playing", predictInstrctPoses);
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
        posesVid = poses;

        if (posesVid.length > 0 && posesCam.length > 0) {
            currentResult = comparePositions.next(posesVid[0], posesCam[0]);
        }
        
    }

    window.requestAnimationFrame(predictInstrctPoses);
}

async function app() {
    //Load the model and create a detector object
    await createDetector();

    //Enable camera and activate video
    await activateVideoCam();
    await activateVideoInstrct();
}

app();





