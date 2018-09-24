const DEFAULT_BOARD_SIZE = 7;
const pathCardInsertionPosition = [
    { x: 1, y: -1 },
    { x: 3, y: -1 },
    { x: 5, y: -1 },
    { x: 7, y: 1 },
    { x: 7, y: 3 },
    { x: 7, y: 5 },
    { x: 5, y: 7 },
    { x: 3, y: 7 },
    { x: 1, y: 7 },
    { x: -1, y: 5 },
    { x: -1, y: 3 },
    { x: -1, y: 1 },
];

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

function create2DArray(size) {
    return Array.from({ length: size }, () => Array.from({ length: size }));
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

    insertPathCard(pathCard) {
        const { x, y } = pathCard;
        if (
            pathCardInsertionPosition.some(
                position => position.x == x && position.y == y
            )
        ) {
            if (x < 0) {
                const row = this.array[y];
                const extractedPathCard = row.pop();
                extractedPathCard.x = DEFAULT_BOARD_SIZE;
                row.unshift(pathCard);
                return extractedPathCard;
            } else if (x >= DEFAULT_BOARD_SIZE) {
                const row = this.array[y];
                const extractedPathCard = row.shift();
                extractedPathCard.x = -1;
                row.push(pathCard);
                return extractedPathCard;
            } else if (y < 0) {
                const column = this.array.map((value, index) => value[x]);

                const extractedPathCard = column.pop();
                extractedPathCard.y = DEFAULT_BOARD_SIZE;
                column.unshift(pathCard);
                this.array.forEach((row, index) => {
                    row[x] = column[index];
                });
                return extractedPathCard;
            } else if (y >= DEFAULT_BOARD_SIZE) {
                const column = this.array.map((value, index) => value[x]);
                const extractedPathCard = column.shift();
                extractedPathCard.y = -1;
                column.push(pathCard);
                this.array.forEach((row, index) => {
                    row[x] = column[index];
                });
                return extractedPathCard;
            }
        }
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

module.exports = { Board, pathCardInsertionPosition, DEFAULT_BOARD_SIZE };
