class ScoreBoard {
    addScore(fileName, score) {
        let scoreBoard = localStorage.getItem('scoreBoard');
        if (scoreBoard == undefined) {
            scoreBoard = [];
        }
        scoreBoard.unshift([fileName, score]);
        while(scoreBoard > 10) {
            scoreBoard.pop();
        }
        localStorage.setItem('scoreBoard', scoreBoard);
    }

    getScore() {
        let scoreBoard = localStorage.getItem('scoreBoard');
    }
}