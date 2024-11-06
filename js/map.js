import { c } from './main.js'
import { canvas } from './main.js'

export function map(){

    class Boundary {
        static width = 40
        static height = 40
        constructor({position}) {
            this.position = position
            this.width = 40
            this.height = 40
        }

        draw() {
            c.fillStyle = 'blue'
            c.fillRect(this.position.x, this.position.y, this.width, this.height)
        }
    }


    const map = [
        ['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-'],
        ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-'],
        ['-', ' ', '-', '-', '-', ' ','-', ' ', '-', '-', '-', ' ', '-'],
        ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-'],
        ['-', ' ', ' ', ' ', '-', ' ','-', ' ', '-', ' ', '-', ' ', '-'],
        ['-', ' ', '-', ' ', ' ', ' ','-', ' ', '-', ' ', ' ', ' ', '-'],
        ['-', ' ', '-', ' ', '-', '-','-', ' ', '-', '-', '-', ' ', '-'],
        ['-', ' ', '-', ' ', '-', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-'],
        ['-', ' ', '-', ' ', '-', ' ','-', ' ', '-', '-', '-', ' ', '-'],
        ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', '-'],
        ['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-']
    ]
    const boundaries = []

    map.forEach((row, index) => {
        row.forEach((symbol, j) => {
            switch (symbol) {
                case '-':
                    boundaries.push(new Boundary({
                        position: {
                            x: Boundary.width * j + 400,
                            y: Boundary.height * index + 400
                        }
                    })
                    )
                    break
            }
        })
    })

    function animate() {
        c.clearRect(0, 0, canvas.width, canvas.height);
        boundaries.forEach(boundary => {
            boundary.draw();
        });
        requestAnimationFrame(animate);
    }
    animate()
}
