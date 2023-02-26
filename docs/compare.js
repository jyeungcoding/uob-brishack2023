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

let comp = new ComparePositions();
comp.next(null, null)
let object1 = {x: 0.5, y: 0.75, z: 1};
let object2 = {x: -1, y: 0.5, z: 0.25};
let object3 = {x: 1, y: 1, z: 1};

console.log("angle: " + comp.getAngle(object1, object2, object3) * 360 / (2 * Math.PI));