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

    let score = 0;

    class Pellet {
        static width = 40;
        static height = 40;
        constructor({position}) {
            this.position = position;
            this.width = 40;
            this.height = 40;
        }

        draw() {
            c.fillStyle = 'purple';
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    class Boundary {
        static width = 40;
        static height = 40;
        constructor({position}) {
            this.position = position;
            this.width = 40;
            this.height = 40;
        }

        draw() {
            c.fillStyle = 'blue';
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    class Player {
        constructor({position, velocity}) {
            this.position = position;
            this.velocity = velocity;
            this.radius = 15;
            this.radians = 0.75;
            this.openRate = 0.02;
            this.orientation = 0;
        }

        draw() {
            let startAngle, endAngle;
            switch (this.orientation) {
                case 0: startAngle = this.radians; endAngle = Math.PI * 2 - this.radians; break;
                case 1: startAngle = Math.PI + this.radians; endAngle = Math.PI - this.radians; break;
                case 2: startAngle = Math.PI * 1.5 + this.radians; endAngle = Math.PI * 1.5 - this.radians; break;
                case 3: startAngle = Math.PI * 0.5 + this.radians; endAngle = Math.PI * 0.5 - this.radians; break;
            }
            c.beginPath();
            c.arc(this.position.x, this.position.y, this.radius, startAngle, endAngle);
            c.lineTo(this.position.x, this.position.y);
            c.fillStyle = 'yellow';
            c.fill();
            c.closePath();
        }

        update() {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            if (this.radians < 0 || this.radians > 0.75) this.openRate = -this.openRate;
            this.radians += this.openRate;
        }
    }

    class Ghost {
        constructor({position, velocity}) {
            this.position = position;
            this.velocity = velocity;
            this.radius = 19;
            this.cooldown = 1;
        }

        draw() {
            c.beginPath();
            c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
            c.fillStyle = 'red';
            c.fill();
            c.closePath();
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
                    entity.velocity.x = Math.random() < 0.5 ? -1 : 1;
                } else if (entity.velocity.y === -1) {
                    entity.velocity.y = 0;
                    entity.velocity.x = Math.random() < 0.5 ? -1 : 1;
                } else if (entity.velocity.x === -1) {
                    entity.velocity.x = 0;
                    entity.velocity.y = Math.random() < 0.5 ? -1 : 1;
                } else if (entity.velocity.x === 1) {
                    entity.velocity.x = 0;
                    entity.velocity.y = Math.random() < 0.5 ? -1 : 1;
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
    

    // Event listener for player movement
    addEventListener('keydown', ({key}) => {
        switch (key) {
            case 'w': 
                player.velocity.y = -1; 
                player.velocity.x = 0; 
                player.orientation = 2; 
                break;
    
            case 'a': 
                player.velocity.x = -1; 
                player.velocity.y = 0; 
                player.orientation = 1;
                break;
                
            case 's': 
                player.velocity.y = 1; 
                player.velocity.x = 0; 
                player.orientation = 3; 
                break;

            case 'd': 
                player.velocity.x = 1; 
                player.velocity.y = 0; 
                player.orientation = 0; 
                break;
        }
    });

    function animate() {
        c.clearRect(0, 0, canvas.width, canvas.height);

        boundaries.forEach(boundary => boundary.draw());
        pellets.forEach(pellet => pellet.draw());

        detectCollisionsWithBoundaries(player);
        detectGhostCollisionsWithBoundaries(ghost);
        detectGhostCollisionsWithBoundaries(ghost2);
        detectGhostCollisionsWithBoundaries(ghost3);
        detectCollisionsWithPellets(player);

        player.update();
        ghost.update();
        ghost2.update();
        ghost3.update();

        randomizeGhostDirection(ghost);
        randomizeGhostDirection(ghost2);
        randomizeGhostDirection(ghost3);


        requestAnimationFrame(animate);
    }

    animate();
}
