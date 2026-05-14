const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");
const scoreText = document.getElementById("score");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const startBtn = document.getElementById("startBtn");
const startScreen =
    document.getElementById("startScreen");
const gameOverScreen =
    document.getElementById("gameOverScreen");
const finalScore =
    document.getElementById("finalScore");
const backgroundSound = new Audio("sounds/background.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");

backgroundSound.loop = true;
backgroundSound.volume = 0.4;

gameOverSound.volume = 0.8;    

let enemySpeed = 5;

let spawnRate = 600;

let score = 0;
let gameRunning = false;
let playerX = gameArea.clientWidth / 2 - 30;

// player start position
function movePlayer() {
    player.style.left = playerX + "px";
}

movePlayer();

// keyboard movement
document.addEventListener("keydown", function(event) {
    if (!gameRunning) return;

    if (event.key === "ArrowLeft") {
        playerX -= 30;
    }

    if (event.key === "ArrowRight") {
        playerX += 30;
    }

    // left boundary
    if (playerX < 0) {
        playerX = 0;
    }

    // right boundary
    if (playerX > gameArea.clientWidth - player.clientWidth) {
        playerX = gameArea.clientWidth - player.clientWidth;
    }

    movePlayer();
});

// create falling enemy
function createEnemy() {
    if (!gameRunning) return;

    const enemy = document.createElement("div");
    enemy.classList.add("enemy");

    const enemyTypes = [
        { className: "enemy-normal", size: 50, speed: enemySpeed },
        { className: "enemy-fast", size: 40, speed: enemySpeed + 3 },
        { className: "enemy-big", size: 80, speed: enemySpeed - 1 }
    ];

    const randomType =
        enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

    enemy.classList.add(randomType.className);

    enemy.style.left =
        Math.random() * (gameArea.clientWidth - randomType.size) + "px";

    gameArea.appendChild(enemy);

    let enemyY = 0;

    const fall = setInterval(() => {
        if (!gameRunning) {
            clearInterval(fall);
            enemy.remove();
            return;
        }

        enemyY += randomType.speed;
        enemy.style.top = enemyY + "px";

        const playerRect = player.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();

        if (
            playerRect.left < enemyRect.right &&
            playerRect.right > enemyRect.left &&
            playerRect.top < enemyRect.bottom &&
            playerRect.bottom > enemyRect.top
        ) {
            clearInterval(fall);

          const enemyX = enemy.offsetLeft;
          const enemyYPosition = enemy.offsetTop;

          createExplosion(enemyX, enemyYPosition);

          enemy.remove();

        setTimeout(() => {
        gameOver();
        }, 400);

return;
        }

        if (enemyY > gameArea.clientHeight) {
            clearInterval(fall);
            enemy.remove();

            score++;
            scoreText.innerText = score;

            if (score % 5 === 0) {
                enemySpeed += 1;
            }
        }
    }, 20);
}

function createExplosion(x, y) {

    for (let i = 0; i < 20; i++) {

        const particle = document.createElement("div");

        particle.classList.add("particle");

        particle.style.left = x + "px";
        particle.style.top = y + "px";

        const randomX = (Math.random() - 0.5) * 200;
        const randomY = (Math.random() - 0.5) * 200;

        particle.style.setProperty("--x", randomX + "px");
        particle.style.setProperty("--y", randomY + "px");

        gameArea.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 600);
    }
}

// game over
function gameOver() {

    gameRunning = false;

    clearInterval(enemySpawner);

    backgroundSound.pause();
    gameOverSound.currentTime = 0;
    gameOverSound.play();

    finalScore.innerText = score;

    gameOverScreen.classList.remove("hidden");
}

leftBtn.addEventListener("click", () => {

    playerX -= 30;

    if (playerX < 0) {
        playerX = 0;
    }

    movePlayer();
});

rightBtn.addEventListener("click", () => {

    playerX += 30;

    if (playerX > gameArea.clientWidth - player.clientWidth) {

        playerX =
            gameArea.clientWidth - player.clientWidth;
    }

    movePlayer();
});

let enemySpawner;

function startGame() {

    score = 0;

    scoreText.innerText = score;

    gameRunning = true;

    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");

    backgroundSound.currentTime = 0;
    backgroundSound.play();

    enemySpawner =
    setInterval(createEnemy, spawnRate);
}

startBtn.addEventListener("click", startGame);

function restartGame() {

    location.reload();
}