import { c } from './main.js'

export function functionality(){
    
    class Player {
        constructor({position, velocity}) {
            this.position = position;
            this.velocity = velocity;
            this.radius = 30;
            this.radians = 0.75;
            this.openRate = 0.02;
            this.orientation = 0;
        }

        draw() {
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
        c.clearRect(player.position.x-30, player.position.y-30, 60, 60);
        requestAnimationFrame(animate);
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
                break
        }
    })
}