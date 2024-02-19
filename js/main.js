class Dot {
    constructor(x, y, fx, fy, vx, vy, col) {
        this.x = x;
        this.y = y;
        this.fx = fx;
        this.fy = fy;
        this.vx = vx;
        this.vy = vy;
        this.col = col;
    }
}

class Simulation {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.w = canvas.width = window.innerWidth;
        this.h = canvas.height = window.innerHeight;
        this.field = [];
        this.size = 24;
        this.dim = 0;
        this.setup();
        this.mainloop();
    }

    update(dt) {
        dt *= 3;

        for (let i = 1; i < this.dim - 1; ++i) {
            for (let j = 1; j < this.dim - 1; ++j) {
                let ax = 0, ay = 0;
                let dot = this.field[i][j];
                for (let di = -1; di <= 1; ++di) {
                    for (let dj = -1; dj <= 1; ++dj) {
                        if (di != 0 || dj != 0) {
                            ax += (this.field[i + di][j + dj].fx - dot.fx) / Math.hypot(di, dj);
                            ay += (this.field[i + di][j + dj].fy - dot.fy) / Math.hypot(di, dj);
                        }
                    }
                }
                let k = 0.1;
                dot.vx += (ax - k * dot.fx) * dt;
                dot.vy += (ay - k * dot.fy) * dt;
            }
        }

        for (let i = 1; i < this.dim - 1; ++i) {
            for (let j = 1; j < this.dim - 1; ++j) {
                let dot = this.field[i][j];
                dot.fx += dot.vx * dt;
                dot.fy += dot.vy * dt;

                dot.col = 0;
                for (let di = -1; di <= 1; ++di) {
                    for (let dj = -1; dj <= 1; ++dj) {
                        const dx = this.field[i + di][j + dj].x + this.field[i + di][j + dj].fx - (dot.x + dot.fx);
                        const dy = this.field[i + di][j + dj].y + this.field[i + di][j + dj].fy - (dot.y + dot.fy);
                        dot.col += Math.hypot(dx, dy) / 8;
                    }
                }
            }
        }
    }

    render() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);

        this.ctx.strokeStyle = "#333";
        this.ctx.fillStyle = "#333";
        this.field.forEach(row => {
            row.forEach(dot => {
                this.ctx.beginPath();
                this.ctx.arc(dot.x, dot.y, 2, 0, 2 * Math.PI);
                this.ctx.fill();

                this.ctx.beginPath();
                this.ctx.moveTo(dot.x, dot.y);
                this.ctx.lineTo(dot.x + dot.fx, dot.y + dot.fy);
                this.ctx.stroke();
            });
        });

        this.ctx.fillStyle = "white";
        this.field.forEach(row => {
            row.forEach(dot => {
                const h = -300 + 6 * dot.col;
                this.ctx.fillStyle = `hsl(${h}deg, 50%, 50%)`;
                this.ctx.beginPath();
                this.ctx.arc(dot.x + dot.fx, dot.y + dot.fy, 2, 0, 2 * Math.PI);
                this.ctx.fill();
            });
        });
    }

    setup() {
        this.field = [];
        this.dim = 2 * Math.ceil(Math.max(this.w, this.h) / 2 / this.size) + 1;
        let halfSize = ((this.dim - 1) / 2) * this.size;

        for (let y = -halfSize; y <= halfSize; y += this.size) {
            let row = [];
            for (let x = -halfSize; x <= halfSize; x += this.size) {
                let radius = this.size * Math.cos((x / 2 - y / 3) / this.size * Math.PI / 3);
                let angle = Math.atan2(y, x);
                let dot = new Dot(x, y, radius * Math.cos(angle), radius * Math.sin(angle), 0, 0, 0);
                row.push(dot);
            }
            this.field.push(row);
        }
        this.ctx.translate(this.w / 2, this.h / 2);
    }

    mainloop() {
        this.update(1 / 30);
        this.render();
        window.requestAnimationFrame(() => this.mainloop());
    }
}

window.onload = function () {
    let canvas = document.querySelector("canvas");
    new Simulation(canvas);
}