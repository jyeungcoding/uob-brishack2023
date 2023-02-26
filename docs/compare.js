class ComparePositions {
    constructor() {
        this.joints = {
            left_wrist: {A: 11, B: 13, C: 15, acc: null},
            right_wrist:{A: 12, B: 14, C: 16, acc: null}, 
            left_elbow: {A: 13, B: 11, C: 23, acc: null},
            right_elbow:{A: 14, B: 12, C: 24, acc: null},
            left_knee: {A: 24, B: 23, C: 25, acc: null}, 
            right_knee: {A: 23, B: 24, C: 26, acc: null}, 
            left_ankle: {A: 23, B: 25, C: 27, acc: null}, 
            right_ankle: {A: 24, B: 26, C: 28, acc: null}
        }
        this.jointsKeys = Object.keys(this.joints);
    }

    getAngle(pointA, pointB, pointC) {
        let BA = [
            pointA.x - pointB.x,
            pointA.y - pointB.y,
            pointA.z - pointB.z
        ];
        let BC = [
            pointC.x - pointB.x,
            pointC.y - pointB.y,
            pointC.z - pointB.z
        ];

        let dot = BA[0] * BC[0] + BA[1] * BC[1] + BA[2] * BC[2];
        let absBA = Math.sqrt(BA[0] ** 2 + BA[1] ** 2 + BA[2] ** 2);
        let absBC = Math.sqrt(BA[0] ** 2 + BA[1] ** 2 + BA[2] ** 2);
        return Math.acos(dot / (absBA * absBC));
    }

    next(baseFrame, userFrame) {
        for (let key in this.jointsKeys) {
            let baseAngle = this.getAngle(
                baseFrame.keypoints3D[this.joints[key].A], 
                baseFrame.keypoints3D[this.joints[key].B], 
                baseFrame.keypoints3D[this.joints[key].C]
            );
            let userAngle = this.getAngle(
                userFrame.keypoints3D[this.joints[key].A], 
                userFrame.keypoints3D[this.joints[key].B], 
                userFrame.keypoints3D[this.joints[key].C]
            );
            this.joints[key].acc = baseAngle - userAngle;
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