window.addEventListener('load', () => {

    const canvas = document.querySelector('canvas');
    canvas.width = 1140;
    canvas.height = 980;
    const c = canvas.getContext('2d');
    const music = document.getElementById('music');
    const wakawaka = document.getElementById('wakawaka');
    const coin = document.getElementById('coin');

    let scoreText = document.getElementById('score');

    const map = [
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', 'a', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
        ['-', ' ', '-', '-', '-', ' ', '-', ' ', '-', ' ', '-', ' ', '-', '-', '-', ' ', '-'],
        ['-', ' ', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', '-', ' ', '-'],
        ['-', ' ', ' ', ' ', '-', ' ', '-', '-', '-', ' ', ' ', ' ', '-', ' ', '-', ' ', '-'],
        ['-', '-', '-', ' ', '-', ' ', '-', '-', '-', ' ', '-', '-', '-', ' ', ' ', ' ', '-'],
        ['-', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', '-', ' ', '-', '-', '-'],
        ['-', ' ', '-', ' ', '-', ' ', '-', '-', '-', '-', '-', ' ', '-', ' ', '-', ' ', '-'],
        ['-', ' ', '-', ' ', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-', ' ', '-'],
        ['-', ' ', ' ', ' ', '-', ' ', '-', '-', ' ', '-', ' ', '-', '-', ' ', '-', ' ', '-'],
        ['-', ' ', '-', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
        ['-', ' ', '-', '-', '-', '-', ' ', '-', ' ', '-', ' ', '-', '-', '-', '-', ' ', '-'],
        ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
    ];

    const boundaries = [];
    const pellets = [];

    let score = 0;

    let pecIndex = 0;

    class Pellet {
        static width = 40;
        static height = 40;
        constructor({position}) {
            this.position = position;
            this.width = 40;
            this.height = 40;
            this.image = new Image();
            this.image.src = './img/coins.png';
            this.imageWidth = 20;
            this.imageHeight = 20;
        }

        draw() {
            c.drawImage(
                this.image,
                this.position.x + (this.width - this.imageWidth) / 2,
                this.position.y + (this.height - this.imageHeight) / 2,
                this.imageWidth,
                this.imageHeight
            );
        }
    }

    class Boundary {
        static width = 40;
        static height = 40;
        constructor({position}) {
            this.position = position;
            this.width = 40;
            this.height = 40;
            this.image = new Image();
            this.image.src = './img/wall_L_down_left.png';
            this.imageWidth = 40;
            this.imageHeight = 40;
        }

        draw() {
            c.drawImage(
                this.image,
                this.position.x + (this.width - this.imageWidth) / 2,
                this.position.y + (this.height - this.imageHeight) / 2,
                this.imageWidth,
                this.imageHeight
            );
        }
    }

    class Player {
        constructor({position, velocity}) {
            this.position = position;
            this.velocity = velocity;
            this.radius = 8;
            this.radians = 0.75;
            this.openRate = 0.02;
            this.orientation = 0;
            this.image = new Image();
            this.image.src = './img/pecboy_0.png';
            this.imageWidth = 40;
            this.imageHeight = 40;
        }

        draw() {
            c.save();
            c.translate(this.position.x, this.position.y);
    
            switch (this.orientation) {
                case 0: break;
                case 1: c.rotate(Math.PI); 
                break;
                case 2: c.rotate(-Math.PI / 2);
                break;
                case 3: c.rotate(Math.PI / 2); 
                break;
            }
    
            c.drawImage(
                this.image,
                -this.imageWidth / 2,
                -this.imageHeight / 2,
                this.imageWidth,
                this.imageHeight
            );
    
            c.restore();
        }
        
        update() {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            if (pecIndex > 2) {
                pecIndex = 0;
            }
            this.image.src = `./img/pecboy_${pecIndex}.png`
        }
    }

    class Ghost {
        constructor({position, velocity}) {
            this.position = position;
            this.velocity = velocity;
            this.radius = 19.999;
            this.cooldown = 1;
            this.image = new Image();
            this.image.src = './img/ghost_red.png';
            this.imageWidth = 40;
            this.imageHeight = 40;
        }

        draw() {
            c.drawImage(
                this.image,
                this.position.x - this.imageWidth / 2,
                this.position.y - this.imageHeight / 2,
                this.imageWidth,
                this.imageHeight
            );
        }

        update() {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }

    map.forEach((row, index) => {
        row.forEach((symbol, j) => {
            if (symbol === '-') {
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j + 420,
                        y: Boundary.height * index + 420
                    }
                }));
            }
            if (symbol === ' ') {
                pellets.push(new Pellet({
                    position: {
                        x: Pellet.width * j + 420,
                        y: Pellet.height * index + 420
                    }
                }));
            }
        });
    });

    const player = new Player({
        position: { x:480, y:480 },
        velocity: { x:0, y:0 }
    });

    const ghost = new Ghost({
        position: { x:640, y:620 },
        velocity: { x:1, y:0 }
    });

    const ghost2 = new Ghost({
       position: { x:840, y:840 },
        velocity: { x:0, y:1 }
    });
    const ghost3 = new Ghost({
        position: { x:1040, y:620 },
        velocity: { x:1, y:0 }
    });
    const ghost4 = new Ghost({
        position: { x:480, y:680 },
        velocity: { x:0, y:1 }
    });

    function randomizeGhostDirection(ghost) {
        if (Math.random() < 0.001) {
            ghost.velocity.x = Math.random() < 0.5 ? 1 : -1;
            ghost.velocity.y = Math.random() < 0.5 ? 1 : -1;
        }
    }

    function detectCollisionsWithBoundaries(entity) {
        for (const boundary of boundaries) {
            if (
                entity.position.y - entity.radius + entity.velocity.y <= boundary.position.y + boundary.height &&
                entity.position.y + entity.radius + entity.velocity.y >= boundary.position.y &&
                entity.position.x + entity.radius + entity.velocity.x >= boundary.position.x &&
                entity.position.x - entity.radius + entity.velocity.x <= boundary.position.x + boundary.width
            ) {
                entity.velocity.x = 0;
                entity.velocity.y = 0;
            }
        }
        return
    }
    
    let newGame = false;

    function playerCollisionWithGhost() {
        if (player.position.x - (player.position.x + ghost.position.x) / 2 < 10 && player.position.x - (player.position.x + ghost.position.x) / 2 > -20) {
            if (player.position.y - (player.position.y + ghost.position.y) / 2 < 10 && player.position.y - (player.position.y + ghost.position.y) / 2 > -20) {
                player.velocity.x = 0;
                player.velocity.y = 0;
                newGame = true;
                wakawaka.pause();
            }
        }
        if (player.position.x - (player.position.x + ghost2.position.x) / 2 < 10 && player.position.x - (player.position.x + ghost2.position.x) / 2 > -20) {
            if (player.position.y - (player.position.y + ghost2.position.y) / 2 < 10 && player.position.y - (player.position.y + ghost2.position.y) / 2 > -20) {
                player.velocity.x = 0;
                player.velocity.y = 0;
                newGame = true;
                wakawaka.pause();
            }
        }
        if (player.position.x - (player.position.x + ghost3.position.x) / 2 < 10 && player.position.x - (player.position.x + ghost3.position.x) / 2 > -20) {
            if (player.position.y - (player.position.y + ghost3.position.y) / 2 < 10 && player.position.y - (player.position.y + ghost3.position.y) / 2 > -20) {
                player.velocity.x = 0;
                player.velocity.y = 0;
                newGame = true;
                wakawaka.pause();
            }
        }
        if (player.position.x - (player.position.x + ghost4.position.x) / 2 < 10 && player.position.x - (player.position.x + ghost4.position.x) / 2 > -20) {
            if (player.position.y - (player.position.y + ghost4.position.y) / 2 < 10 && player.position.y - (player.position.y + ghost4.position.y) / 2 > -20) {
                player.velocity.x = 0;
                player.velocity.y = 0;
                newGame = true;
                wakawaka.pause();
            }
        }
    }

    function detectGhostCollisionsWithBoundaries(entity) {
        for (const boundary of boundaries) {
            if (
                entity.position.y - entity.radius + entity.velocity.y <= boundary.position.y + boundary.height &&
                entity.position.y + entity.radius + entity.velocity.y >= boundary.position.y &&
                entity.position.x + entity.radius + entity.velocity.x >= boundary.position.x &&
                entity.position.x - entity.radius + entity.velocity.x <= boundary.position.x + boundary.width
            ) {
                if (entity.velocity.y === 1) {
                    entity.velocity.y = 0;
                    entity.velocity.x = 0;
                    setTimeout(function() { entity.velocity.x = Math.random() < 0.5 ? -1 : 1; }, 10);
                } else if (entity.velocity.y === -1) {
                    entity.velocity.y = 0;
                    entity.velocity.x = 0;
                    setTimeout(function() { entity.velocity.x = Math.random() < 0.5 ? -1 : 1; }, 10);
                } else if (entity.velocity.x === -1) {
                    entity.velocity.x = 0;
                    entity.velocity.y = 0;
                    setTimeout(function() { entity.velocity.y = Math.random() < 0.5 ? -1 : 1; }, 10);
                } else if (entity.velocity.x === 1) {
                    entity.velocity.x = 0;
                    entity.velocity.y = 0;
                    setTimeout(function() { entity.velocity.y = Math.random() < 0.5 ? -1 : 1; }, 10);

                }
                break;
            }
        }
    }

    function detectCollisionsWithPellets(entity) {
        for (let i = 0; i < pellets.length; i++) {
            const pellet = pellets[i];
            if (
                entity.position.y - entity.radius + entity.velocity.y <= pellet.position.y + pellet.height &&
                entity.position.y + entity.radius + entity.velocity.y >= pellet.position.y &&
                entity.position.x + entity.radius + entity.velocity.x >= pellet.position.x &&
                entity.position.x - entity.radius + entity.velocity.x <= pellet.position.x + pellet.width
            ) {
                coin.play();
                coin.volume = 0.1;
                pellets.splice(i, 1);
                score++;
                scoreText.innerHTML = `Score: ${score}`;
            }
        }
    }

    let animationID;

    function resetGame() {

        cancelAnimationFrame(animationID);
    
        score = 0;
        scoreText.innerHTML = `Score: ${score}`;

        pellets.length = 0;
        boundaries.length = 0;

        map.forEach((row, index) => {
            row.forEach((symbol, j) => {
                if (symbol === '-') {
                    boundaries.push(new Boundary({
                        position: {
                            x: Boundary.width * j + 420,
                            y: Boundary.height * index + 420
                        }
                    }));
                }
                if (symbol === ' ') {
                    pellets.push(new Pellet({
                        position: {
                            x: Pellet.width * j + 420,
                            y: Pellet.height * index + 420
                        }
                    }));
                }
            });
        });
    
        player.position = { x: 480, y: 480 };
        player.velocity = { x: 0, y: 0 };
        ghost.position = { x: 640, y: 620 };
        ghost.velocity = { x: 1, y: 0 };
        ghost2.position = { x: 840, y: 840 };
        ghost2.velocity = { x: 0, y: 1 };
        ghost3.position = { x: 1040, y: 620 };
        ghost3.velocity = { x: 1, y: 0 };
        ghost4.position = { x: 480, y: 680 };
        ghost4.velocity = { x: 0, y: 1 };
    
        newGame = false;
    
        animate();
    }

    let w = false;
    let a = false;
    let s = false;
    let d = false;

    function startMusic() {
        music.play();
        music.volume = 0.005;
        music.loop = true;
    }

    function playWakawaka() {
        if (!wakawaka.paused) 
            return;

        wakawaka.play();
        wakawaka.volume = 0.005;
        wakawaka.loop = true;
    }
    
    addEventListener('keydown', ({key}) => {
       switch (key) {
            case 'w':
                w = true;
                playWakawaka();
                startMusic();
                break;

            case 'a':
                a = true;
                playWakawaka();
                startMusic();
                break;
    
            case 's':
                s = true;
                playWakawaka();
                startMusic();
                break;
    
            case 'd':
                d = true;
                playWakawaka();
                startMusic();
                break;
            }
        }
    );

    addEventListener('keyup', ({key}) => {
        switch (key) {
             case 'w':
                 w = false;
                 break;
 
             case 'a':
                 a = false;
                 break;
     
             case 's':
                 s = false;
                 break;
     
             case 'd':
                 d = false;
                 break;
             }
         }
     );

    setInterval(() => pecIndex++, 100);

    function animate() {
        c.clearRect(0, 0, canvas.width, canvas.height);

        if (w) {
            player.velocity.y = -1;
            player.velocity.x = 0;
            player.orientation = 2;
        } 
        else if (a) {
            player.velocity.x = -1;
            player.velocity.y = 0;
            player.orientation = 1;
        }
        else if (s) {
            player.velocity.y = 1;
            player.velocity.x = 0;
            player.orientation = 3;
        }
        else if (d) {
            player.velocity.x = 1;
            player.velocity.y = 0;
            player.orientation = 0;
        } else {
            player.velocity.x = 0;
            player.velocity.y = 0;
        }
        
        boundaries.forEach(boundary => boundary.draw());
        pellets.forEach(pellet => pellet.draw());
        detectCollisionsWithBoundaries(player);
        detectGhostCollisionsWithBoundaries(ghost);
        detectGhostCollisionsWithBoundaries(ghost2);
        detectGhostCollisionsWithBoundaries(ghost3);
        detectGhostCollisionsWithBoundaries(ghost4);
        detectCollisionsWithPellets(player);
        playerCollisionWithGhost();

        player.update();
        ghost.update();
        ghost2.update();
        ghost3.update();
        ghost4.update();

        randomizeGhostDirection(ghost);
        randomizeGhostDirection(ghost2);
        randomizeGhostDirection(ghost3);
        randomizeGhostDirection(ghost4);


        animationID = requestAnimationFrame(animate);
        
        if (newGame) {
            resetGame();
        }
        if (score === 113) {
            resetGame();
        }
    }
    animate();
});
