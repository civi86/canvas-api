const canvas = document.querySelector('canvas');
canvas.width = 1080;
canvas.height = 1080;
const c = canvas.getContext('2d');
let scoreText = document.getElementById('score');

window.addEventListener('load', () => {
    functionality();
});

function functionality(){

    const map = [
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
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
    const previousDirection = [];

    let pecIndex = 0;

    let score = 0;

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
            this.radius = 19.99;
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
            this.radius = 19.99;
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
                        x: Boundary.width * j + 400,
                        y: Boundary.height * index + 400
                    }
                }));
            }
            if (symbol === ' ') {
                pellets.push(new Pellet({
                    position: {
                        x: Pellet.width * j + 400,
                        y: Pellet.height * index + 400
                    }
                }));
            }
        });
    });

    const player = new Player({
        position: { x:500, y:460 },
        velocity: { x:0, y:0 }
    });

    const ghost = new Ghost({
        position: { x:620, y:600 },
        velocity: { x:0, y:1 }
    });

    const ghost2 = new Ghost({
        position: { x:820, y:800 },
        velocity: { x:0, y:1 }
    });
    const ghost3 = new Ghost({
        position: { x:940, y:620 },
        velocity: { x:1, y:0 }
    });
    const ghost4 = new Ghost({
        position: { x:460, y:680 },
        velocity: { x:0, y:1 }
    });

    function randomizeGhostDirection(ghost) {
        if (Math.random() < 0.005) {
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

    function playerCollisionWithGhost() {
        if (player.position.x === ghost.position.x) {
            if (player.position.y === ghost.position.y) {
                console.log("hävisit");
            }
        }
        if (player.position.x === ghost2.position.x) {
            if (player.position.y === ghost2.position.y) {
                console.log("hävisit");
            }
        }
        if (player.position.x === ghost3.position.x) {
            if (player.position.y === ghost3.position.y) {
                console.log("hävisit");
            }
        }
        if (player.position.x === ghost4.position.x) {
            if (player.position.y === ghost4.position.y) {
                console.log("hävisit");
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
                pellets.splice(i, 1);
                score++;
                scoreText.innerHTML = `Score: ${score}`;
            }
        }
    }
    
    addEventListener('keydown', ({key}) => {
        switch (key) {
            case 'w': 
                player.velocity.y = -1; 
                player.velocity.x = 0; 
                player.orientation = 2; 
                previousDirection.push('w');
                break;
    
            case 'a': 
                player.velocity.x = -1; 
                player.velocity.y = 0; 
                player.orientation = 1;
                previousDirection.push('a');
                break;
                
            case 's': 
                player.velocity.y = 1; 
                player.velocity.x = 0; 
                player.orientation = 3;
                previousDirection.push('s');
                break;

            case 'd': 
                player.velocity.x = 1; 
                player.velocity.y = 0; 
                player.orientation = 0;
                previousDirection.push('d');
                break;
        }
    });

    setInterval(() => pecIndex++, 100);

    function animate() {
        c.clearRect(0, 0, canvas.width, canvas.height);

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


        requestAnimationFrame(animate);
    }

    animate();
}
