class ComparePositions {
    constructor() {
        this.accuracy = {
            left_wrist: null,
            right_wrist: null,
            left_elbow: null,
            right_elbow: null,
            left_knee: null,
            right_knee: null,
            left_ankle: null,
            right_ankle: null
        };
        this.joints = {
            left_wrist: [11, 13, 15],
            right_wrist: [12, 14, 16], 
            left_elbow: [13, 11, 23],
            right_elbow: [14, 12, 24], 
            left_knee: [24, 23, 25], 
            right_knee: [23, 24, 26], 
            left_ankle: [23, 25, 27], 
            right_ankle: [24, 26, 28]
        }
    }

    getAngle(keyPointA, keyPointB, keyPointC) {
        let ba = [
            keyPointA.x - keyPointB.x,
            keyPointA.y - keyPointB.y,
            keyPointA.z - keyPointB.z
        ];
        let bc = [
            keyPointC.x - keyPointB.x,
            keyPointC.y - keyPointB.y,
            keyPointC.z - keyPointB.z
        ];

        let dot = ba[0] * bc[0] + ba[1] * bc[1] + ba[2] * bc[2];

        console.log("dot: " + dot);

        let absBA = Math.sqrt(ba[0] ** 2 + ba[1] ** 2 + ba[2] ** 2);
        let absBC = Math.sqrt(bc[0] ** 2 + bc[1] ** 2 + bc[2] ** 2);

        return Math.acos(dot / (absBA * absBC));
    }

    next(baseFrame, userFrame) {
        console.log("hello world");
        for (let key in Object.keys(this.joints)) {
            let baseAngle = this.getAngle(
                baseFrame.keypoints3D[this.joints[key][0]], 
                baseFrame.keypoints3D[this.joints[key][1]], 
                baseFrame.keypoints3D[this.joints[key][2]]
            );
            let userAngle = this.getAngle(
                userFrame.keypoints3D[this.joints[key][0]], 
                userFrame.keypoints3D[this.joints[key][1]], 
                userFrame.keypoints3D[this.joints[key][2]]
            );
            this.accuracy[key] = baseAngle - userAngle;
        }
        return this.accuracy;
    }
}



let keypoints3D1 = [
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "nose"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_eye_inner"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_eye"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_eye_outer"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_eye_inner"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_eye"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_eye_outer"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_ear"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_ear"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "mouth_left"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "mouth_right"},
{x: 0.20, y: 0.70, z: 0.10, score: 0.99, name: "left_shoulder"},
{x: -0.22, y: 0.75, z: 0.05, score: 0.99, name: "right_shoulder"},
{x: 0.4, y: 0.55, z: 0.15, score: 0.99, name: "left_elbow"},
{x: -0.4, y: 0.7, z: 0.20, score: 0.99, name: "right_elbow"},
{x: 0.65, y: 0.30, z: 0.18, score: 0.99, name: "left_wrist"},
{x: -0.3, y: 0.65, z: 0.35, score: 0.99, name: "right_wrist"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_pinky"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_pinky"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_index"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_index"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_thumb"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_thumb"},
{x: 0.2, y: 0.05, z: 0.02, score: 0.99, name: "left_hip"},
{x: -0.13, y: -0.05, z: 0.0, score: 0.99, name: "right_hip"},
{x: 0.3, y: -0.3, z: 0.3, score: 0.99, name: "left_knee"},
{x: -0.15, y: -0.35, z: 0.2, score: 0.99, name: "right_knee"},
{x: 0.35, y: -0.6, z: 0.4, score: 0.99, name: "left_ankle"},
{x: 0.3, y: -0.64, z: 0.1, score: 0.99, name: "right_ankle"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_heel"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_heel"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_foot_index"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_foot_index"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "bodyCenter"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "forehead"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "leftThumb"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "leftHand"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "rightThumb"},
{x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "rightHand"}
];

let keypoints3D2 = [
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "nose"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_eye_inner"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_eye"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_eye_outer"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_eye_inner"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_eye"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_eye_outer"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_ear"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_ear"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "mouth_left"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "mouth_right"},
    {x: 0.18, y: 0.60, z: 0.07, score: 0.99, name: "left_shoulder"},
    {x: -0.29, y: 0.72, z: -0.02, score: 0.99, name: "right_shoulder"},
    {x: 0.35, y: 0.48, z: 0.12, score: 0.99, name: "left_elbow"},
    {x: -0.47, y: 0.64, z: 0.14, score: 0.99, name: "right_elbow"},
    {x: 0.70, y: 0.34, z: 0.25, score: 0.99, name: "left_wrist"},
    {x: -0.36, y: 0.58, z: 0.29, score: 0.99, name: "right_wrist"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_pinky"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_pinky"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_index"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_index"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_thumb"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_thumb"},
    {x: 0.15, y: -0.3, z: -0.06, score: 0.99, name: "left_hip"},
    {x: -0.22, y: -0.12, z: -0.07, score: 0.99, name: "right_hip"},
    {x: 0.21, y: -0.36, z: 0.25, score: 0.99, name: "left_knee"},
    {x: -0.11, y: -0.42, z: 0.18, score: 0.99, name: "right_knee"},
    {x: 0.27, y: -0.66, z: 0.35, score: 0.99, name: "left_ankle"},
    {x: 0.24, y: -0.70, z: 0.04, score: 0.99, name: "right_ankle"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_heel"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_heel"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "left_foot_index"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "right_foot_index"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "bodyCenter"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "forehead"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "leftThumb"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "leftHand"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "rightThumb"},
    {x: 0.65, y: 0.11, z: 0.05, score: 0.99, name: "rightHand"}
  ];

  let comp = new ComparePositions();
  comp.next(keypoints3D1, keypoints3D2);