export class ScoreBoard {
    static addScore(pathName, score) {
        let scoreBoard = this.getScoreBoard();
        scoreBoard.unshift(String(score));
        scoreBoard.unshift(ScoreBoard.getFileName(pathName));
        while(scoreBoard.length > 20) {
            scoreBoard.pop();
            scoreBoard.pop();
        }
        for (let i = 0; i < 20; i += 2) {
            if (scoreBoard[i] != null && scoreBoard[i].length != 0 && scoreBoard[i + 1] != null) {
                localStorage.setItem('fileName' + i / 2, scoreBoard[i]);
                localStorage.setItem('score' + i / 2, scoreBoard[i + 1]);
            }
        }
    }

    static getFileName(pathName) {
        let index = pathName.lastIndexOf('/');
        if (index == -1) {
            return pathName;
        } else {
            return pathName.substring(++index);
        }
    }

    static getScoreBoard() {
        let scoreBoard = [];
        for (let i = 0; i < 10; i++) {
            let fileName = localStorage.getItem('fileName' + i);
            let score = localStorage.getItem('score' + i);
            if (fileName != null && score != null) {
                scoreBoard.push(fileName);
                scoreBoard.push(score);
            }
        }
        return scoreBoard;
    }

    static scoresAlert() {
        let scoreBoard = this.getScoreBoard();
        let string = "LATEST SCORES\n";
        for (let i = 0; i < 20; i += 2) {
            if (scoreBoard[i] != null && scoreBoard[i + 1] != null) {
                string += (((i / 2) + 1) + '. ' + scoreBoard[i] + ' -> ');
                string += (scoreBoard[i + 1] + '\n');
            }
        }
        alert(string);
    }

    static clearScores() {
        localStorage.clear();
    }
}