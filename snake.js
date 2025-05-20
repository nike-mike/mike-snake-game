 const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreDisplay = document.getElementById("score");

    let snake = [
        { x: 150, y: 150 },
        { x: 140, y: 150 },
        { x: 130, y: 150 },
        { x: 120, y: 150 },
        { x: 110, y: 150 },
    ];
    let dx = 10;
    let dy = 0;
    let changingDirection = false;
    let foodX;
    let foodY;
    let score = 0;

    document.addEventListener("keydown", changeDirection);

    main();
    createFood();

    function main() {
        if (didGameEnd()) return;

        setTimeout(function onTick() {
            changingDirection = false;
            clearCanvas();
            drawFood();
            moveSnake();
            drawSnake();
            main();
        }, 100);
    }

    function clearCanvas() {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnakePart(part) {
        ctx.fillStyle = 'lightgreen';
        ctx.strokeStyle = 'darkgreen';
        ctx.fillRect(part.x, part.y, 10, 10);
        ctx.strokeRect(part.x, part.y, 10, 10);
    }

    function drawSnake() {
        snake.forEach(drawSnakePart);
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
        if (didEatFood) {
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
            createFood();
        } else {
            snake.pop();
        }
    }

    function changeDirection(event) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

        if (changingDirection) return;
        changingDirection = true;

        const keyPressed = event.keyCode;
        const goingUp = dy === -10;
        const goingDown = dy === 10;
        const goingRight = dx === 10;
        const goingLeft = dx === -10;

        if (keyPressed === LEFT_KEY && !goingRight) {
            dx = -10;
            dy = 0;
        }
        if (keyPressed === UP_KEY && !goingDown) {
            dx = 0;
            dy = -10;
        }
        if (keyPressed === RIGHT_KEY && !goingLeft) {
            dx = 10;
            dy = 0;
        }
        if (keyPressed === DOWN_KEY && !goingUp) {
            dx = 0;
            dy = 10;
        }
    }

    function randomTen(min, max) {
        return Math.round((Math.random() * (max - min) + min) / 10) * 10;
    }

    function createFood() {
        foodX = randomTen(0, canvas.width - 10);
        foodY = randomTen(0, canvas.height - 10);
        snake.forEach(function isFoodOnSnake(part) {
            if (part.x === foodX && part.y === foodY) {
                createFood();
            }
        });
    }

    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'darkred';
        ctx.fillRect(foodX, foodY, 10, 10);
        ctx.strokeRect(foodX, foodY, 10, 10);
    }

    function didGameEnd() {
        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                alert("Game Over!");
                return true;
            }
        }

        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x >= canvas.width;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y >= canvas.height;

        if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
            alert("Game Over!");
            return true;
        }

        return false;
    }