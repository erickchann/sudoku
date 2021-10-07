class Game {
    constructor() {
        this.end = false;

        this.board = [];

        this.directions = [
            [0, 1],  // Bottom
            [0, -1], // Top
            [1, 0],  // Right
            [-1, 0], // Left
        ];

        this.generation = 0;

        this.row = 3;
        this.col = 3;
        
        this.init();
    }

    /**
     * Function to init the game (generate board, generate solved board, etc.)
     */
    init() {
        this.initBoard();
        this.generateSolvedBoard();
        this.initToDocument();
        this.listener();
    }

    /**
     * Function to generate initial board
     */
    initBoard() {
        this.board = [];

        for (let i = 0; i < 9; i++) {
            this.board.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
    }

    /**
     * Function to generate solved board
     */
    generateSolvedBoard() {
        this.board.forEach((row, y) => {
            row.forEach((col, x) => {
                const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

                let rand = this.getRandomNumber(nums);

                let boxCoord = {
                    y: (y >= 0 && y <= 2) ? 0 : (y >= 3 && y <= 5) ? 1 : 2,
                    x: (x >= 0 && x <= 2) ? 0 : (x >= 3 && x <= 5) ? 1 : 2
                };

                while (!this.isValidInBox(rand.num, boxCoord, x, y) && nums.length > 0) {
                    nums.splice(rand.index, 1);
                    rand = this.getRandomNumber(nums);

                    if (nums.length < 1) {
                        rand.num = 0;
                    }
                }

                this.board[y][x] = rand.num;
            });
        });

        // Call this function until board is valid
        while (!this.isValidBoard()) {
            this.initBoard();
            this.generateSolvedBoard();
        }
    }

    /**
     * Function to check generated board is valid or not 
     * 
     * @returns boolean
     */
    isValidBoard() {
        let valid = true;

        this.board.forEach(row => {
            row.forEach(col => {
                if (col == 0) valid = false;
            });          
        });

        return valid;
    }

    /**
     * Function
     * 
     * @param {*} value 
     * @returns integer
     */
    getRandomNumber(value) {
        // All valid nums
        const nums = value;
        const index = ~~(Math.random() * nums.length);

        return { num: nums[index], index: index };
    }

    isValidInBox(rand, coord, realX, realY) {
        let valid = true;
        let nums = [];

        let x = coord.x * this.col;
        let y = coord.y * this.row;
        let maxX = x + 2;
        let maxY = y + 2;

        // Store all nums in box to nums array
        for (let tempY = y; tempY <= maxY; tempY++) {
            for (let tempX = x; tempX <= maxX; tempX++) {
                nums.push(this.board[tempY][tempX]);
            } 
        }
        
        // Check if the rand is not in nums array
        nums.forEach(num => {
            if (num == rand) valid = false;
        });

        // Check if then rand is valid in board or not
        if (!this.isValidInBoard(rand, realX, realY)) valid = false;

        return valid;
    }

    isValidInBoard(rand, x, y) {
        let valid = true;
        let nums = [];

        // Store all nums in board that vertically and horizontally in this coordinate
        this.directions.forEach(direction => {
            let [dirX, dirY] = direction;

            let tempX = x + dirX;
            let tempY = y + dirY;

            while (this.inBoard(tempX, tempY)) {
                nums.push(this.board[tempY][tempX]);

                tempX += dirX;
                tempY += dirY;
            }
        });
        
        // Check if the rand is not in nums array
        nums.forEach(num => {
            if (num == rand) valid = false;
        });
        
        return valid;
    }

    inBoard(x, y) {
        return x >= 0 && y >= 0 && x < 9 && y < 9;
    }

    initToDocument() {
        let totalClue = ~~(Math.random() * 3) + 2; 

        boxes.forEach((box, i) => {
            const y = ~~(i / 3);
            const x = i - (y * 3);
            
            const boxArr = this.getBoxArray(x, y);
            const fields = box.children;

            boxArr.forEach((val, idx) => {
                fields[idx].setAttribute('data-answer', val);
            });

            for (let i = 0; i < totalClue; i++) {
                let idx = ~~(Math.random() * 9);

                fields[idx].innerHTML = boxArr[idx];
                fields[idx].classList.add('active');
            }
        });
    }

    getBoxArray(x, y) {
        let nums = [];

        x = x * this.col;
        y = y * this.row;
        let maxX = x + 2;
        let maxY = y + 2;

        // Store all nums in box to nums array
        for (let tempY = y; tempY <= maxY; tempY++) {
            for (let tempX = x; tempX <= maxX; tempX++) {
                nums.push(this.board[tempY][tempX]);
            } 
        }

        return nums;
    }

    listener() {
        const fields = document.querySelectorAll('.field');

        fields.forEach(field => {
            if (!field.classList.contains('active')) {
                field.addEventListener('click', () => {
                    let value = parseInt(field.innerHTML) || 0;
    
                    if (value + 1 > 9) value = 0;
    
                    value++;
    
                    field.innerHTML = value;

                    if (this.checkWin()) {
                        this.end = true;

                        const timeEl = document.querySelector('.time-played');

                        let minute = formatTime(~~(time / 60));
                        let second = formatTime(~~(time - (minute * 60)));

                        timeEl.innerHTML = `${minute}:${second}`

                        endModal.style.display = 'flex';
                    }
                });
            }
        });
    }

    checkWin() {
        let win = true;

        let fields = document.querySelectorAll('.field');

        fields.forEach(field => {
            let expected = field.getAttribute('data-answer');
            let equal = field.innerHTML;

            if (expected != equal) win = false;
        });

        return win;
    }
}