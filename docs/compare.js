class ComparePositions {
    constructor(minScore) {
        this.minScore = minScore;
        this.joints = {
            left_wrist: {A: 11, B: 13, C: 15},
            right_wrist:{A: 12, B: 14, C: 16}, 
            left_elbow: {A: 13, B: 11, C: 23},
            right_elbow:{A: 14, B: 12, C: 24},
            left_knee: {A: 24, B: 23, C: 25}, 
            right_knee: {A: 23, B: 24, C: 26}, 
            left_ankle: {A: 23, B: 25, C: 27}, 
            right_ankle: {A: 24, B: 26, C: 28}
        }
        this.additionalJoints = {
            left_elbow: {A: 12, B: 11, C: 13},
            right_elbow:{A: 11, B: 12, C: 14},
            left_knee: {A: 11, B: 23, C: 25}, 
            right_knee: {A: 12, B: 24, C: 26}, 
            left_shoulder: {A: 11, B: 23, C: 25}, 
            right_shoulder: {A: 12, B: 24, C: 26}
        }
        this.angleDiff = {
            left_wrist: 0,
            right_wrist: 0,
            left_elbow: 0,
            right_elbow: 0,
            left_knee: 0,
            right_knee: 0,
            left_ankle: 0,
            right_ankle: 0,
            left_shoulder: 0,
            right_shoulder: 0
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

    //adds left and right shoulder, changes elbows+knees
    additionalPoints(baseFrame, userFrame){
        for (let key in this.additionalJoints) {
            let points = this.getPoints(baseFrame, userFrame, key);
            for (let point in points) {
                if (point.score < this.minScore) {
                    return this.angleDiff;
                }
            }
            let baseAngle = this.getAngle(points[0], points[1], points[2]);
            let userAngle = this.getAngle(points[0], points[1], points[2]);
            if (key == "left_shoulder" || key == "right_shoulder"){
                this.angleDiff[key] = baseAngle - userAngle;
            }
            else{
                this.angleDiff[key] /= 2;
                this.angleDiff[key] += (baseAngle - userAngle)/2;
            }
        }
        return this.angleDiff;
    }

    next(baseFrame, userFrame) {
        for (let key in this.joints) {
            let points = this.getPoints(baseFrame, userFrame, key);
            for (let point in points) {
                //NOT SURE ABT THIS
                if (point.score < this.minScore) {
                    return this.angleDiff;
                }
            }
            let baseAngle = this.getAngle(points[0], points[1], points[2]);
            let userAngle = this.getAngle(points[0], points[1], points[2]);
            this.angleDiff[key] = baseAngle - userAngle;
        }
        return this.angleDiff;
    }
}