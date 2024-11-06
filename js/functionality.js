export function functionality(){

    const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');

    canvas.width = innerWidth;
    canvas.height = innerHeight;
    
    class Player {
        constructor({position, velocity}) {
            this.position = position;
            this.velocity = velocity;
            this.radius = 20;
            this.radians = 0.75;
            this.openRate = 0.02;
            this.orientation = 'right';
        }
        
        draw() {
            let startAngle, endAngle;

            switch (this.orientation) {
                case 'right':
                    startAngle = this.radians;
                    endAngle = Math.PI * 2 - this.radians;
                    break;
                case 'left':
                    startAngle = Math.PI + this.radians;
                    endAngle = Math.PI - this.radians;
                    break;
                case 'up':
                    startAngle = Math.PI * 1.5 + this.radians;
                    endAngle = Math.PI * 1.5 - this.radians;
                    break;
                case 'down':
                    startAngle = Math.PI * 0.5 + this.radians;
                    endAngle = Math.PI * 0.5 - this.radians;
                    break;
            }

            c.beginPath();
            c.arc(this.position.x, this.position.y, this.radius, startAngle, endAngle);
            c.lineTo(this.position.x, this.position.y);
            c.fillStyle = 'lightblue';
            c.fill();
            c.closePath();
        }

        update() {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
    
            if (this.radians < 0 || this.radians > 0.75) this.openRate = -this.openRate;
            this.radians += this.openRate;
    
            this.draw();
        }
    }

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
        c.clearRect(0, 0, canvas.width, canvas.height);
        requestAnimationFrame(animate);
        player.update();
    }
    animate()

    addEventListener('keydown', ({key}) => {
        switch (key) {
            case 'w':
                player.velocity.y = -1;
                player.velocity.x = 0;
                player.orientation = 'up';
                break
            case 'a':
                player.velocity.x = -1;
                player.velocity.y = 0;
                player.orientation = 'left';
                break
            case 's':
                player.velocity.y = 1;
                player.velocity.x = 0;
                player.orientation = 'down';
                break
            case 'd':
                player.velocity.x = 1;
                player.velocity.y = 0;
                player.orientation = 'right'
                break
        }
    })
}