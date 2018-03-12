c = b.getContext('2d');
MAX = 96 * 60;
img = new Image();
img.src = 'sprites.png';
img.onload = function update() {

    requestAnimationFrame(update);

    // init
    if (!window.time) {
        time = 0;
        frame = 0;
        timeNextFrame = 0;
        vines = [{
            x: 0,
            y: 0,
            a: 0,
            ai: 0,
            w: 8,
            p: [],
            l: MAX
        }]
        // noteIndex =0;
        // noteFreq = [155,195,261,155,233,155,195,207,195,207,195,207,195,207,195,261,155,233,155,233,261,155,233,155,233,155,233,261,155,195,261,195,207];
        // str = '';
        // s = !a.src;
    }

    //time update
    currentTime = performance.now() / 1000;
    while (time < currentTime) {
        while (time < timeNextFrame) {
            time += 1 / 16384;
        }
        frame++;
        timeNextFrame += 1 / 60;

        // update visual
        vines = vines.filter(v => v.l--);
        vines.forEach(v => {
            dx = Math.cos(v.a) * v.w / 2;
            dy = Math.sin(v.a) * v.w / 2;
            v.x += dx;
            v.y += dy;
            v.a += v.ai / v.w / 2;
            v.p.splice(0, v.p.length - v.l);
            v.p.splice(0, v.p.length - 60 * 5);
            v.p.push({
                x: v.x,
                y: v.y,
                dx: dx,
                dy: dy
            });
            if (frame % 30 == 0) {
                v.ai = Math.random() - .5;
            }
            if (v.w > 1 && Math.random() < v.l / 16384 / 2) {
                vines.push({
                    x: v.x,
                    y: v.y,
                    a: v.a,
                    ai: v.ai,
                    w: v.w / 2,
                    p: [],
                    l: Math.min(v.l, 0 | v.w * 32 * (1 + Math.random()))
                });
            }
        })
    }

    // if (s) {
    //     //render audio
    //     a.src
    // }


    // render visual
    H = b.height = 512;
    W = b.width = 0 | H * innerWidth / innerHeight;
    c.translate(W / 2, H / 2)
    c.shadowBlur = 24;
    vines.forEach(v => {
        c.shadowColor =
            c.strokeStyle = 'hsl(' + (v.a * 60 | 0) + ',100%,' + (60 + v.w * 5) + '%)';
        if (v.w == 8) {
            c.rotate(v.a);
            c.drawImage(img, frame * 4 & 112, 0, 16, 24, -5, 0, -16, -24)
            c.rotate(-v.a);
            c.translate(-v.x, -v.y);
        }
        c.beginPath();
        l = v.p.length - 1;
        for (i = l; p = v.p[i]; i--) {
            c.lineTo(p.x, p.y);
        }
        //c.strokeText([W, H, frame], 0, 0);
        c.stroke();

    })
}