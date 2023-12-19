class TicTacToeGame {
    constructor() {
        this.hitCounter = 0;
        this.gameIsEnd = false;
        this.winSnd = new Audio("sound/win.mp3");
        this.loseSnd = new Audio("sound/lose.mp3");
        this.clickedOneMoreTime = false;
        this.currentPlayerSymbol = "X"; // Oyun X sembolüyle başlasın
        this.initializeGame();
    }

    initializeGame() {
        // Oyun alanındaki hücrelere tıklandığında gerçekleşecek olayları tanımla
        $("#game-table td").click((event) => {
            this.handlePlayerMove(event);
        }).on('mouseup', () => {
            this.playComputer();
        });
    }

    handlePlayerMove(event) {
        const cell = $(event.target);
        const text = cell.text();

        if (text.length === 0 && !this.gameIsEnd) {
            const row = cell.attr("row");
            const column = cell.attr("column");

            if (!this.gameIsEnd) {
                this.placeSymbol(this.currentPlayerSymbol, cell, row, column);
                this.hitCounter++;
                const isGameOver = this.checkGameStatus(this.currentPlayerSymbol);
                
                if (isGameOver) {
                    this.endGame(this.currentPlayerSymbol);
                    return false;
                }

                this.currentPlayerSymbol = (this.currentPlayerSymbol === "X") ? "O" : "X"; // Sırayı diğer oyuncuya geçir
                if (this.currentPlayerSymbol === "O") {
                    this.playComputer();
                }
            }
        } else {
            this.clickedOneMoreTime = true;
            this.playComputer();
        }
    }

    placeSymbol(symbol, cell, row, column) {
        cell.text(symbol);
        cell.css("font-weight", "bold");
        const playerType = (symbol === "X") ? "You" : "Computer";
        $("#game-steps").append("<b>" + (this.hitCounter + 1) + ". </b>" + playerType + " put the " + symbol + " to " + row + ". row , " + column + ". column" + "<br>");
    }

    playComputer() {
        if (!this.gameIsEnd && this.currentPlayerSymbol === "O" && !this.clickedOneMoreTime) {
            let first, second;
            do {
                first = Math.floor((Math.random() * 3) + 1);
                second = Math.floor((Math.random() * 3) + 1);
            } while ($("#"+first+"x"+second).text() !== "");

            const cell = $("#" + first+"x"+second);
            this.placeSymbol("O", cell, first, second);
            this.hitCounter++;
            const isGameOver = this.checkGameStatus("O");
            
            if (isGameOver) {
                this.endGame("O");
                return;
            }

            this.currentPlayerSymbol = "X"; // Sırayı diğer oyuncuya geçir
            this.clickedOneMoreTime = false;
        }
    }

    checkGameStatus(symbol) {
        const winningCombinations = [
            ["1x1", "1x2", "1x3"], ["2x1", "2x2", "2x3"], ["3x1", "3x2", "3x3"], // Rows
            ["1x1", "2x1", "3x1"], ["1x2", "2x2", "3x2"], ["1x3", "2x3", "3x3"], // Columns
            ["1x1", "2x2", "3x3"], ["1x3", "2x2", "3x1"] // Diagonals
        ];

        for (const combination of winningCombinations) {
            const [cell1, cell2, cell3] = combination;
            if ($("#"+cell1).text() === symbol && $("#"+cell2).text() === symbol && $("#"+cell3).text() === symbol) {
                $(`#${cell1}`).css("background-color", "red");
                $(`#${cell2}`).css("background-color", "red");
                $(`#${cell3}`).css("background-color", "red");
                return true;
            }
        }
        return false;
    }

    endGame(winner) {
        this.gameIsEnd = true;
        if (winner === "X") {
            this.winSnd.play();
            $("#game-steps").append("<br><mytext><strong>GAME IS OVER</strong>.<strong style='color:red;'> YOU WIN !</strong></mytext>");
        } else if (winner === "O") {
            this.loseSnd.play();
            $("#game-steps").append("<br><mytext><strong>GAME IS OVER</strong>.<strong style='color:red;'> COMPUTER WIN !</strong></mytext>");
        } else {
            $("#game-steps").append("<br><mytext><strong>GAME IS OVER</strong>.<strong style='color:red;'> IT'S A DRAW !</strong></mytext>");
        }
    }
}

// Oyunun başlatılması
$(document).ready(() => {
    const game = new TicTacToeGame();
});
