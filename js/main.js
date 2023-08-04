let ctx, w, h;
let field, size = 24; // pixels
let dim;

function update(dt) {
    dt *= 3;

    for (let i = 1; i < dim - 1; i++) {
        for (let j = 1; j < dim - 1; j++) {
            let ax = 0, ay = 0;
            let dot = field[i][j];
            for (let di = -1; di <= 1; di++) {
                for (let dj = -1; dj <= 1; dj++) {
                    if (di != 0 || dj != 0) {
                        ax += (field[i + di][j + dj].fx - dot.fx) / Math.hypot(di, dj);
                        ay += (field[i + di][j + dj].fy - dot.fy) / Math.hypot(di, dj);
                    }
                }
            }
            let k = 0.1;
            dot.vx += (ax - k * dot.fx) * dt;
            dot.vy += (ay - k * dot.fy) * dt;
        }
    }

    for (let i = 1; i < dim - 1; i++) {
        for (let j = 1; j < dim - 1; j++) {
            let dot = field[i][j];
            dot.fx += dot.vx * dt;
            dot.fy += dot.vy * dt;

            dot.col = 0;
            for (let di = -1; di <= 1; di++) {
                for (let dj = -1; dj <= 1; dj++) {
                    const dx = field[i + di][j + dj].x + field[i + di][j + dj].fx - (dot.x + dot.fx);
                    const dy = field[i + di][j + dj].y + field[i + di][j + dj].fy - (dot.y + dot.fy);
                    dot.col += Math.hypot(dx, dy) / 8;
                }
            }
        }
    }
}

function render() {
    ctx.fillStyle = "black";
    ctx.fillRect(-w / 2, -h / 2, w, h);

    ctx.strokeStyle = "#333";
    ctx.fillStyle = "#333";
    field.forEach(row => {
        row.forEach(dot => {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 2, 0, 2 * Math.PI);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(dot.x + dot.fx, dot.y + dot.fy);
            ctx.stroke();
        });
    });

    ctx.fillStyle = "white";
    field.forEach(row => {
        row.forEach(dot => {
            const h = -300 + 6 * dot.col;
            ctx.fillStyle = `hsl(${h}deg, 50%, 50%)`;
            ctx.beginPath();
            ctx.arc(dot.x + dot.fx, dot.y + dot.fy, 2, 0, 2 * Math.PI);
            ctx.fill();
        });
    });

}

function setup() {
    field = [];
    dim = 2 * Math.ceil(Math.max(w, h) / 2 / size) + 1;
    let halfSize = ((dim - 1) / 2) * size;

    for (let y = -halfSize; y <= halfSize; y += size) {
        let row = [];
        for (let x = -halfSize; x <= halfSize; x += size) {
            let radius = size * Math.cos((x / 2 - y / 3) / size * Math.PI / 3);
            let angle = Math.atan2(y, x);
            let dot = {
                x : x,
                y : y,
                fx : radius * Math.cos(angle),
                fy : radius * Math.sin(angle),
                vx : 0,
                vy : 0,
                col : 0
            };
            row.push(dot);
        }
        field.push(row);
    }
    ctx.translate(w / 2, h / 2);
}

function mainloop() {
    update(1 / 30);
    render();
    window.requestAnimationFrame(mainloop);
}

window.onload = function() {
    let canvas = document.querySelector('canvas');
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");

    setup();
    mainloop();
}