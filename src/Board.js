const DEFAULT_BOARD_SIZE = 7;
/*
 * the board contains 7 rows and 7 columns organized as below:
 * y
 * 6
 * 5
 * 4
 * 3
 * 2
 * 1
 * 0 1 2 3 4 5 6 x
 */

function create2DArray(rows) {
    return Array.from({ length: rows }, () => []);
}

class Board {
    constructor() {
        this.array = create2DArray(this.size());
    }

    size() {
        return DEFAULT_BOARD_SIZE;
    }

    add(card) {
        this.array[card.y][card.x] = card;
    }

    get(y, x) {
        return this.array[y][x];
    }

    toString() {
        let res = '';
        for (let y = this.size() - 1; y >= 0; y--) {
            res += `line: ${y}\n`;
            for (let x = 0; x < this.size(); x++) {
                res += this.get(y, x) && this.get(y, x).toString();
                res += '\n';
            }
        }
        return res;
    }
}

module.exports = { Board };
