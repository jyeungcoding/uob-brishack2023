class ScoreBoard {
    addScore(fileName, score) {
        let scoreBoard = this.getScoreBoard();
        scoreBoard.unshift(String(score));
        scoreBoard.unshift(fileName);
        while(scoreBoard.length > 20) {
            scoreBoard.pop();
            scoreBoard.pop();
        }
        for (let i = 0; i < 20; i += 2) {
            if (scoreBoard[i] != null && scoreBoard[i + 1] != null) {
                localStorage.setItem('fileName' + i / 2, scoreBoard[i]);
                localStorage.setItem('score' + i / 2, scoreBoard[i + 1]);
            }
        }
    }

    getScoreBoard() {
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
}