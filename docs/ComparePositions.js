// this.additionalJoints = {
//     left_shoulder: {A: 12, B: 11, C: 13},
//     right_shoulder: {A: 11, B: 12, C: 14},
//     left_hip: {A: 24, B: 23, C: 25}, 
//     right_hip: {A: 23, B: 24, C: 26},
// }

export class ComparePositions {
    constructor(minScore) {
        this.score = 50;
        this.minScore = minScore;
        this.joints = {
            left_elbow: {A: 11, B: 13, C: 15},
            right_elbow: {A: 12, B: 14, C: 16}, 
            left_shoulder: {A: 13, B: 11, C: 23},
            right_shoulder: {A: 14, B: 12, C: 24},
            left_hip: {A: 11, B: 23, C: 25}, 
            right_hip: {A: 12, B: 24, C: 26},
            left_knee: {A: 23, B: 25, C: 27}, 
            right_knee: {A: 24, B: 26, C: 28}
        }

        this.angleDiff = {
            left_wrist: 0.5, 
            right_wrist: 0.5, 
            left_elbow: 0.5,
            right_elbow: 0.5,
            left_shoulder: 0.5,
            right_shoulder: 0.5,
            left_hip: 0.5,
            right_hip: 0.5,
            left_knee: 0.5,
            right_knee: 0.5,
            left_ankle: 0.5, 
            right_ankle: 0.5 
        }
    }
    
    getScore() {
        this.calculateScore();
        return this.score;
    }

    resetScore() {
        this.score = 50;
    }

    calculateScore () {
        let sum = 0;
        for (let key in this.angleDiff) {
            if (key != 'left_wrist' && key != 'right_wrist' 
                    && key != 'left_ankle' && key != 'right_ankle') {
                sum += this.angleDiff[key];
            }
        }
        let scoreChange = (sum / 8) - 0.6;
        this.score -= scoreChange;
        if (this.score > 100) {
            this.score = 100;
        } else if (this.score < 0) {
            this.score = 0;
        }
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

        let dot = BA.reduce((sum, BAval, i) => {return sum + BAval * BC[i]}, 0);
        let absBA = Math.sqrt(BA[0] ** 2 + BA[1] ** 2 + BA[2] ** 2);
        let absBC = Math.sqrt(BC[0] ** 2 + BC[1] ** 2 + BC[2] ** 2);
        return Math.acos(dot / (absBA * absBC));
    }

    getPoints(baseFrame, userFrame, key) {
        let base = ['A', 'B', 'C'].map(
            (char) => {
                return baseFrame.keypoints3D[this.joints[key][char]];
            }
        );
        let user = ['A', 'B', 'C'].map(
            (char) => {
                return userFrame.keypoints3D[this.joints[key][char]];
            }
        );
        return base.concat(user);
    }

    validPoints(points) {
        for (let point in points) {
            if (point.score < this.minScore) {
                return false;
            }
        }
        return true;
    }

    armCorrection(key, points, userAngle) {
        if ((key == 'left_elbow' || key == 'right_elbow') 
                && ((points[1].y < points[2].y && points[4].y > points[5].y) 
                || (points[2].y > points[2].y && points[4].y < points[5].y))) {
            return 2 * Math.PI - userAngle;
        }
        return userAngle;
    }

    normalise(key) {
        this.angleDiff[key] = Math.abs(2 * this.angleDiff[key] / Math.PI);
        if (this.angleDiff[key] > 1) {
            this.angleDiff[key] = 1;
        }
    }

    copyExtremities() {
        this.angleDiff.left_wrist = this.angleDiff.left_elbow;
        this.angleDiff.right_wrist = this.angleDiff.right_elbow;
        this.angleDiff.left_ankle = this.angleDiff.left_knee;
        this.angleDiff.right_ankle = this.angleDiff.right_knee;
    }

    next(baseFrame, userFrame) {
        for (let key in this.joints) {
            // points is an array with [A1, B1, C1, A2, B2, C2]
            let points = this.getPoints(baseFrame, userFrame, key);
            if (this.validPoints(points)) {
                let baseAngle = this.getAngle(points[0], points[1], points[2]);
                let userAngle = this.getAngle(points[3], points[4], points[5]);
                userAngle = this.armCorrection(key, points, userAngle);
                this.angleDiff[key] = baseAngle - userAngle;
                this.normalise(key);
            } else {
                this.angleDiff[key] = 0.5;
            }
        }
        this.copyExtremities();
        return this.angleDiff;
    }
}