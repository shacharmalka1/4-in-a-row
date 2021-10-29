class Event {
  constructor() {
    this.listeners = [];
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  trigger(params) {
    this.listeners.forEach((listener) => {
      listener(params);
    });
  }
}

class TicTacToe {
  constructor() {
    this.board = Array(49).fill();
    this.currentPlayer = "cadetblue";
    this.finished = false;
    this.updateCellEvent = new Event();
    this.victoryEvent = new Event();
    this.drawEvent = new Event();
  }

  play(move) {
    if (this.finished || move < 0 || move > 48 || this.board[move]) {
      return false;
    }

    for (let i = 0; i < this.board.length; i++) {
      if (!this.board[move] && move < 42 && !this.board[move + 7]) {
        move += 7;
      } else break;
    }

    this.board[move] = this.currentPlayer;
    this.updateCellEvent.trigger({ move, player: this.currentPlayer });

    this.finished = this.victory() || this.draw();

    if (!this.finished) {
      this.switchPlayer();
    }

    return true;
  }

  victory() {
    const lines = [
      [0, 1, 2, 3],
      [1, 2, 3, 4],
      [2, 3, 4, 5],
      [3, 4, 5, 6], //rows
      [7, 8, 9, 10],
      [8, 9, 10, 11],
      [9, 10, 11, 12],
      [10, 11, 12, 13],
      [14, 15, 16, 17],
      [15, 16, 17, 18],
      [16, 17, 18, 19],
      [17, 18, 19, 20],
      [21, 22, 23, 24],
      [22, 23, 24, 25],
      [26, 25, 24, 23],
      [24, 25, 26, 27],
      [28, 29, 30, 31],
      [29, 30, 31, 32],
      [30, 31, 32, 33],
      [31, 32, 33, 34],
      [35, 36, 37, 38],
      [36, 37, 38, 39],
      [40, 39, 38, 37],
      [38, 39, 40, 41],
      [42, 43, 44, 45],
      [43, 44, 45, 46],
      [44, 45, 46, 47],
      [45, 46, 47, 48],

      [0, 7, 14, 21],
      [7, 14, 21, 28],
      [14, 21, 28, 35],
      [42, 35, 28, 21], //columns
      [1, 8, 15, 22],
      [8, 15, 22, 29],
      [15, 22, 29, 36],
      [22, 29, 36, 43],
      [2, 9, 16, 23],
      [9, 16, 23, 30],
      [16, 23, 30, 37],
      [23, 30, 37, 44],
      [3, 10, 17, 24],
      [10, 17, 24, 31],
      [17, 24, 31, 38],
      [24, 31, 38, 45],
      [4, 11, 18, 25],
      [11, 18, 25, 32],
      [18, 25, 32, 39],
      [25, 32, 39, 46],
      [5, 12, 19, 26],
      [12, 19, 26, 33],
      [19, 26, 33, 40],
      [26, 33, 40, 47],
      [6, 13, 20, 27],
      [13, 20, 27, 34],
      [20, 27, 34, 41],
      [27, 34, 41, 48],

      [0, 8, 16, 24],
      [4, 10, 16, 22],
      [8, 16, 24, 32],
      [14, 22, 30, 38], //crosses
      [7, 15, 23, 31],
      [6, 12, 18, 24],
      [5, 11, 17, 23],
      [1, 9, 17, 25],
      [2, 10, 18, 26],
      [9, 7, 25, 33],
      [13, 19, 25, 31],
      [11, 7, 23, 29],
      [12, 18, 24, 30],
      [21, 15, 9, 3],
      [20, 26, 32, 38],
      [27, 19, 11, 3],
      [28, 22, 16, 10],
      [34, 26, 18, 10],
      [35, 29, 23, 17],
      [36, 30, 24, 18],
      [37, 31, 25, 19],
      [39, 31, 23, 15],
      [40, 32, 24, 16],
      [41, 33, 25, 17],
      [42, 36, 30, 24],
      [43, 37, 31, 25],
      [44, 38, 32, 26],
      [45, 39, 33, 27],
      [45, 37, 29, 21],
      [46, 38, 30, 22],
      [47, 39, 31, 23],
      [48, 40, 32, 24],
    ];

    const victory = lines.some(
      (l) =>
        this.board[l[0]] &&
        this.board[l[0]] === this.board[l[1]] &&
        this.board[l[1]] === this.board[l[2]] &&
        this.board[l[2]] === this.board[l[3]]
    );

    if (victory) {
      this.victoryEvent.trigger(this.currentPlayer);
    }

    return victory;
  }

  draw() {
    const draw = this.board.every((i) => i);

    if (draw) {
      this.drawEvent.trigger();
    }

    return draw;
  }

  switchPlayer() {
    this.currentPlayer =
      this.currentPlayer === "cadetblue" ? "pink" : "cadetblue";
  }
}

class View {
  constructor() {
    this.playEvent = new Event();
  }

  render() {
    const board = document.createElement("div");
    board.className = "board";

    this.cells = Array(49)
      .fill()
      .map((_, i) => {
        const cell = document.createElement("div");
        cell.className = "cell";

        cell.addEventListener("click", () => {
          this.playEvent.trigger(i);
        });

        board.append(cell);

        return cell;
      });

    this.message = document.createElement("div");
    this.message.className = "message";

    //   document.body.appendChild(board);
    show.append(board);
    document.body.append(this.message);
  }

  updateCell(data) {
    this.cells[data.move].style.background = data.player;
  }

  victory(winner) {
    coolalert(`${winner} wins!`);
  }

  draw() {
    coolalert("It's a draw!");
  }
}

class Controller {
  constructor() {
    this.model = new TicTacToe();
    this.view = new View();

    this.view.playEvent.addListener((move) => {
      this.model.play(move);
    });

    this.model.updateCellEvent.addListener((data) => {
      this.view.updateCell(data);
    });
    this.model.victoryEvent.addListener((winner) => {
      this.view.victory(winner);
    });
    this.model.drawEvent.addListener(() => {
      this.view.draw();
    });
  }

  run() {
    this.view.render();
  }
}
const app = new Controller();

app.run();

const coolalert = (textVal) => {
  Swal.fire({
    title: textVal,
    width: 600,
    padding: "3em",
  });
};
