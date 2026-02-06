import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Pong3DBackground = () => {
    const canvasRef = useRef(null);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const c = canvasRef.current;
        if (!c || isHome) return;

        const ctx = c.getContext('2d');
        let w = c.width = window.innerWidth;
        let h = c.height = window.innerHeight;

        const opts = {
            rotVel: .01,
            color: 'rgba(0,200,0,.4)',
            gameColor: 'rgba(0,255,0,.8)',
            textColor: 'rgba(0,200,0,.4)',
            depth: 250,
            focalLength: 250,
            vanishPoint: {
                x: w / 2,
                y: h / 2
            },
            zoom: 1,
            showDots: false,

            // game
            playerSpeed: .01,
            ballSpeed: .004,
            respawnTime: 60,
            startX: -40,
            startY: -40,
            addedX: 80,
            addedY: 80,
            startZ: 0
        };

        let points = [], lines = [];
        let tick = 0, rot = 0, cos = 1, sin = 0;

        const pong = {
            paddle: { width: .03, height: .2 },
            player: { x: .05, y: .4 },
            computer: { x: .9, y: .4 },
            ball: {
                x: .475, y: .475,
                width: .05, height: .05,
                vx: opts.ballSpeed, vy: opts.ballSpeed,
                respawnTime: opts.respawnTime
            },
            controls: { up: false, down: false },
            points: [],
            lines: []
        };

        function Point(x, y, z, index) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.index = index;
            this.sx = 0;
            this.sy = 0;
        }

        Point.prototype.setScreen = function () {
            let x = this.x, y = this.y, z = this.z;
            let x1 = x;
            x = x * cos - z * sin;
            z = z * cos + x1 * sin;
            z += opts.depth;
            const scale = opts.focalLength / z;
            this.sx = x * scale;
            this.sy = y * scale;
        };

        function Line(points) {
            this.points = points;
        }

        Line.prototype.draw = function () {
            ctx.moveTo(this.points[0].sx, this.points[0].sy);
            this.points.map(point => ctx.lineTo(point.sx, point.sy));
        };

        const pointData = [
            -1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0,
            -1.3, -1.3, 0, -1.3, 1.3, 0, 1.3, 1.3, 0, 1.3, -1.3, 0,
            -.8, -.8, 1.5, -.8, .8, 1.5, .8, .8, 1.5, .8, -.8, 1.5,
            .6, 1.15, .5, -.6, 1.15, .5, -.6, .98, 1, .6, .98, 1,
            .6, 1.7, .5, -.6, 1.7, .5, -.6, 1.7, 1, .6, 1.7, 1,
            1.8, 1.7, -.1, -1.8, 1.7, -.1, -1.8, 1.7, 1.8, 1.8, 1.7, 1.8,
            1.8, 1.9, -.1, -1.8, 1.9, -.1, -1.8, 1.9, 1.8, 1.8, 1.9, 1.8,
            2, 1.6, -0.8, 2, 1.7, -2.3, -2, 1.7, -2.3, -2, 1.6, -0.8,
            2, 1.9, -0.8, 2, 1.9, -2.3, -2, 1.9, -2.3, -2, 1.9, -0.8,
            0.5, 1.612, -1, 0.5, 1.688, -2.1, -1.8, 1.688, -2.1, -1.8, 1.612, -1,
            1.8, 1.612, -1, 1.8, 1.688, -2.1, 0.9, 1.688, -2.1, 0.9, 1.612, -1,
            2.2, -1.2, 2.7, 2.2, -1.2, 0.3, 3.5, -1.2, 0.3, 3.5, -1.2, 2.7,
            2.2, 1.9, 2.7, 2.2, 1.9, 0.3, 3.5, 1.9, 0.3, 3.5, 1.9, 2.7,
            2.5, -0.8, .3, 3.2, -0.8, .3, 2.5, -0.5, .3, 3.2, -0.5, .3,
            2.5, -0.2, .3, 3.2, -0.2, .3, 3.2, 0.3, .3, 2.5, 0.3, .3,
            2.5, 0.6, .3, 3.2, 0.6, .3, 2.8, 0.9, .3, 3.2, 0.9, .3,
            3.2, 1.2, .3, 2.8, 1.2, .3
        ];

        const lineData = [
            [0, 1, 2, 3, 0], [4, 5, 6, 7, 11, 8, 4, 7], [11, 10, 9, 8], [6, 10], [9, 5],
            [12, 15, 14, 13, 12, 16, 19, 15], [19, 18, 14], [18, 17, 13], [17, 16],
            [22, 21, 25, 26, 22, 23, 20, 21], [25, 24, 27, 26], [24, 20], [27, 23],
            [31, 30, 29, 28, 31, 35, 34, 33, 32, 35], [34, 30], [33, 29], [32, 28],
            [40, 41, 42, 43, 40], [36, 37, 38, 39, 36],
            [44, 45, 46, 47, 44, 48, 49, 50, 51, 48], [51, 47], [50, 46], [49, 45],
            [52, 53], [54, 55], [56, 57, 58, 59, 56], [60, 61], [62, 63, 64, 65, 62]
        ];

        function init() {
            points = [];
            lines = [];
            pong.points = [];
            pong.lines = [];

            for (let i = 0; i < pointData.length; i += 3) {
                let x = pointData[i] * 40;
                let y = pointData[i + 1] * 40;
                let z = pointData[i + 2] * 40;
                points.push(new Point(x, y, z, i / 3));
            }

            for (let i = 0; i < lineData.length; ++i) {
                lines.push(new Line(lineData[i].map(index => points[index])));
            }

            for (let i = 0; i < 4 * 3; ++i) pong.points.push(new Point(0, 0, 0, 0));

            for (let i = 0; i < 3; ++i) {
                pong.lines.push(new Line([
                    pong.points[i * 4], pong.points[i * 4 + 1],
                    pong.points[i * 4 + 2], pong.points[i * 4 + 3],
                    pong.points[i * 4]
                ]));
            }
        }

        function pongTransform(index, x, y) {
            const point = pong.points[index];
            point.x = opts.startX + x * opts.addedX;
            point.y = opts.startY + y * opts.addedY;
            point.z = opts.startZ;
        }

        function resetPongBall(direction) {
            pong.ball.respawnTime = opts.respawnTime;
            pong.ball.x = .5 - pong.ball.width / 2;
            pong.ball.y = .5 - pong.ball.height / 2;
            pong.ball.vx = opts.ballSpeed * direction;
            pong.ball.vy = opts.ballSpeed * (Math.random() < .5 ? 1 : -1);
        }

        function collidePaddle(b) {
            let proportion = (pong.ball.y - b) / (pong.paddle.height + pong.ball.height);
            pong.ball.vx *= -1.05;
            pong.ball.vy += (proportion - .5) * opts.ballSpeed;
        }

        function updatePong() {
            if (pong.ball.respawnTime === 0) {
                let preva1 = pong.ball.x;
                pong.ball.x += pong.ball.vx;
                pong.ball.y += pong.ball.vy;

                let a1 = pong.ball.x, A1 = a1 + pong.ball.width;
                let b1 = pong.ball.y, B1 = b1 + pong.ball.height;

                if (pong.controls.up) {
                    pong.player.y -= opts.playerSpeed;
                    if (pong.player.y < 0) pong.player.y = 0;
                } else if (pong.controls.down) {
                    pong.player.y += opts.playerSpeed;
                    if (pong.player.y + pong.paddle.height > 1) pong.player.y = 1 - pong.paddle.height;
                }

                let b2 = pong.player.y, A2 = pong.player.x + pong.paddle.width, B2 = b2 + pong.paddle.height;

                if (pong.computer.y > b1) pong.computer.y -= opts.playerSpeed;
                else if (pong.computer.y + pong.paddle.height < B1) pong.computer.y += opts.playerSpeed;

                if (pong.computer.y < 0) pong.computer.y = 0;
                else if (pong.computer.y + pong.paddle.height > 1) pong.computer.y = 1 - pong.paddle.height;

                let a3 = pong.computer.x, b3 = pong.computer.y, B3 = b3 + pong.paddle.height;

                if (pong.ball.vx < 0) {
                    if (preva1 > A2 && a1 < A2 && (B1 > b2 && b1 < B2)) collidePaddle(b2);
                    else if (a1 < 0) resetPongBall(1);
                } else {
                    if (preva1 + pong.ball.width < a3 && A1 > a3 && (B1 > b3 && b1 < B3)) collidePaddle(b3);
                    else if (A1 > 1) resetPongBall(-1);
                }

                if (b1 < 0 || B1 > 1) pong.ball.vy *= -1;
            } else --pong.ball.respawnTime;

            let a = pong.player.x, b = pong.player.y, A = a + pong.paddle.width, B = b + pong.paddle.height;
            pongTransform(0, a, b); pongTransform(1, A, b); pongTransform(2, A, B); pongTransform(3, a, B);

            a = pong.computer.x, b = pong.computer.y, A = a + pong.paddle.width, B = b + pong.paddle.height;
            pongTransform(4, a, b); pongTransform(5, A, b); pongTransform(6, A, B); pongTransform(7, a, B);

            a = pong.ball.x, b = pong.ball.y, A = a + pong.ball.width, B = b + pong.ball.height;
            pongTransform(8, a, b); pongTransform(9, A, b); pongTransform(10, A, B); pongTransform(11, a, B);
        }

        let animationId;
        function anim() {
            animationId = window.requestAnimationFrame(anim);
            ++tick;
            rot += opts.rotVel;
            cos = Math.cos(rot);
            sin = Math.sin(rot);

            ctx.fillStyle = 'rgba(8, 9, 15, 1)'; // Dark background
            ctx.fillRect(0, 0, w, h);

            ctx.translate(opts.vanishPoint.x, opts.vanishPoint.y);
            ctx.scale(opts.zoom, opts.zoom);
            ctx.lineCap = 'square';
            ctx.miterLimit = 2;

            ctx.strokeStyle = opts.color;
            ctx.beginPath();
            points.map(point => point.setScreen());
            lines.map(line => line.draw());
            ctx.stroke();

            updatePong();

            ctx.strokeStyle = opts.gameColor;
            ctx.beginPath();
            pong.points.map(point => point.setScreen());
            pong.lines.map(line => line.draw());
            ctx.stroke();

            ctx.scale(1 / opts.zoom, 1 / opts.zoom);
            ctx.translate(-opts.vanishPoint.x, -opts.vanishPoint.y);
        }

        init();
        anim();

        const handleResize = () => {
            w = c.width = window.innerWidth;
            h = c.height = window.innerHeight;
            opts.vanishPoint.x = w / 2;
            opts.vanishPoint.y = h / 2;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, [isHome]); // Re-run effect when route changes between home and other pages

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                opacity: isHome ? 0 : 0.2,
                visibility: isHome ? 'hidden' : 'visible',
                pointerEvents: 'none'
            }}
        />
    );
};

export default Pong3DBackground;
