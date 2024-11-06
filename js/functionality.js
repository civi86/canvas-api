import { c } from './main.js'

export function functionality(){
<<<<<<< Updated upstream
    const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');

    canvas.width = innerWidth;
    canvas.height = innerHeight;
    
    class Player {
        constructor({position, velocity}) {
            this.position = position
            this.velocity = velocity
            this.radius = 20
            this.radians = 0.75
            this.openRate = 0.02
=======
    
    class Player {
        constructor({position, velocity}) {
            this.position = position;
            this.velocity = velocity;
            this.radius = 30;
            this.radians = 0.75;
            this.openRate = 0.02;
            this.orientation = 0;
>>>>>>> Stashed changes
        }

        draw() {
<<<<<<< Updated upstream
            c.beginPath()
            c.arc(this.position.x, this.position.y, this.radius, this.radians,
                Math.PI * 2 - this.radians)
            c.lineTo(this.position.x, this.position.y)
            c.fillStyle = 'yellow'
            c.fill()
            c.closePath()
=======
            let startAngle, endAngle;

            switch (this.orientation) {
                case 0:
                    startAngle = this.radians;
                    endAngle = Math.PI * 2 - this.radians;
                    break;
                case 1:
                    startAngle = Math.PI + this.radians;
                    endAngle = Math.PI - this.radians;
                    break;
                case 2:
                    startAngle = Math.PI * 1.5 + this.radians;
                    endAngle = Math.PI * 1.5 - this.radians;
                    break;
                case 3:
                    startAngle = Math.PI * 0.5 + this.radians;
                    endAngle = Math.PI * 0.5 - this.radians;
                    break;
            }
            c.beginPath();
            c.arc(this.position.x, this.position.y, this.radius, startAngle, endAngle);
            c.lineTo(this.position.x, this.position.y);
            c.fillStyle = 'white';
            c.fill();
            c.closePath();
>>>>>>> Stashed changes
        }

        update() {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y

            if (this.radians < 0 || this.radians > .75) this.openRate = -this.openRate
            this.radians += this.openRate
        }
    }

    class Pellet {
        constructor({position}) {
            this.position = position;
            this.radius = 5;
        }
        
        draw() {
           
            c.beginPath();
            c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
            c.fillStyle = 'white';
            c.fill();
            c.closePath();
        }
    }

    const pellets = []

    const player = new Player({
        position: {
            x:400,
            y:400
        },
        velocity: {
            x:0,
            y:0
        }

    })
    function animate() {
<<<<<<< Updated upstream
        c.clearRect(0, 0, canvas.width, canvas.height);
        requestAnimationFrame(animate)
=======
        c.clearRect(player.position.x-30, player.position.y-30, 60, 60);
        requestAnimationFrame(animate);
>>>>>>> Stashed changes
        player.update();

        if (player.velocity.x > 0) player.orientation = 0
        else if (player.velocity.y < 0) player.orientation = 2
        else if (player.velocity.x < 0) player.orientation = 1
        else if (player.velocity.y > 0) player.orientation = 3
    }
    animate()

    addEventListener('keydown', ({key}) => {
        switch (key) {
            case 'w':
<<<<<<< Updated upstream
                player.velocity.y = -1
                player.velocity.x = 0
                break
            case 'a':
                player.velocity.x = -1
                player.velocity.y = 0
                break
            case 's':
                player.velocity.y = 1
                player.velocity.x = 0
                break
            case 'd':
                player.velocity.x = 1
                player.velocity.y = 0
=======
                player.velocity.y = -1;
                player.velocity.x = 0;
                break
            case 'a':
                player.velocity.x = -1;
                player.velocity.y = 0;
                break
            case 's':
                player.velocity.y = 1;
                player.velocity.x = 0;
                break
            case 'd':
                player.velocity.x = 1;
                player.velocity.y = 0;
>>>>>>> Stashed changes
                break
        }
    })
}