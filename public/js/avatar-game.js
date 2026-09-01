// js/avatar-game.js
// Click the About avatar once  -> it bounces around like the old DVD logo.
// Click it again while it's loose -> the page text fades out, the avatar
//   shrinks into a ball, and it becomes a game:
//     desktop -> a DX-Ball style brick breaker with powerups, lives, score
//     mobile  -> a simple keep-it-up rally: no bricks, the ball speeds up on
//                every wall hit, and the score counts paddle hits
// Esc or the on-screen  x  leaves the game and drops the avatar back home.
// Best score is remembered for the browser session.

(function () {
    var avatar = document.querySelector('.about-avatar');
    if (!avatar) return;

    var FADE_SELECTOR = '.about-view .project-case-study, .about-view .about-links';
    var mode = 'idle'; // 'idle' | 'dvd' | 'game'
    var placeholder = null;

    function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
    function cssVar(name, fallback) {
        var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        return v || fallback;
    }
    function isMobile() { return window.innerWidth <= 640; }

    // Placeholder keeps the layout from collapsing while the avatar is loose.
    function detachAvatar() {
        var r = avatar.getBoundingClientRect();
        placeholder = document.createElement('div');
        placeholder.style.width = r.width + 'px';
        placeholder.style.height = r.height + 'px';
        placeholder.style.marginBottom = getComputedStyle(avatar).marginBottom;
        avatar.parentNode.insertBefore(placeholder, avatar);
        avatar.style.position = 'fixed';
        avatar.style.left = '0';
        avatar.style.top = '0';
        avatar.style.margin = '0';
        avatar.style.zIndex = '100000';
        avatar.style.willChange = 'transform';
        return r;
    }
    function homeAvatar() {
        if (placeholder && placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
        placeholder = null;
        avatar.style.cssText = '';
    }

    // ---------------------------------------------------------------- DVD mode
    var dvd = (function () {
        var raf = null, x = 0, y = 0, vx = 0, vy = 0, w = 0, h = 0;

        function start() {
            var r = detachAvatar();
            w = r.width; h = r.height; x = r.left; y = r.top;
            // always launch on a roughly-45° diagonal (45° ± 15°), random quadrant
            var sp = 3.4, a = Math.PI / 4 + (Math.random() - 0.5) * (Math.PI / 6);
            vx = Math.cos(a) * sp * (Math.random() < 0.5 ? -1 : 1);
            vy = Math.sin(a) * sp * (Math.random() < 0.5 ? -1 : 1);
            loop();
        }
        function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }
        function loop() {
            x += vx; y += vy;
            var mx = window.innerWidth - w, my = window.innerHeight - h;
            if (x <= 0) { x = 0; vx = Math.abs(vx); }
            else if (x >= mx) { x = mx; vx = -Math.abs(vx); }
            if (y <= 0) { y = 0; vy = Math.abs(vy); }
            else if (y >= my) { y = my; vy = -Math.abs(vy); }
            avatar.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
            raf = requestAnimationFrame(loop);
        }
        return { start: start, stop: stop };
    })();

    // ---------------------------------------------------------------- the game
    var game = (function () {
        var canvas, ctx, raf, startTimer, W, H, dpr;
        var state;          // 'entering' | 'serving' | 'playing' | 'won' | 'lost'
        var simple = false; // mobile rally mode
        var bricks, balls, paddle, powerups, bullets, particles;
        var score, best, lives, level, speed, baseSpeed, tEnter, lastFire, lastBoost, bombArmed;
        var brickStep, brickW, brickBW, brickBH, brickSprites = {};
        var zapFlash = 0, zapY = 0; // lightning-strike effect for Zap Bricks
        var themeBg = '#111', themeFg = '#eee';
        var MAX_PARTICLES = 340;
        var pointerX = null, pointerY = null;
        var pointerHeld = false, spaceHeld = false; // for lvl 3 laser hold-to-fire
        var locked = false; // pointer-lock active (mouse captured)
        var CV_URL = '/james-sparkes-cv.pdf';
        var debug = false;  // backtick toggles: number keys apply power-ups
        var DEBUG_KEYS = '1234567890-=';
        var timers = {};
        var listeners = [];

        var COLORS = ['#e5484d', '#f76808', '#ffb224', '#46a758', '#0091ff', '#8e4ec6'];
        // legend / drop pool order: good ones first, hazards last
        var PU_LIST = ['multi', 'wide', 'slow', 'laser', 'magnet', 'fire', 'zap', 'bomb', 'life', 'shrink', 'fast', 'descend'];
        var PU_BAD = { descend: 1, shrink: 1, fast: 1 };
        var PU_COLOR = {
            multi: '#0091ff', wide: '#46a758', slow: '#ffb224', laser: '#8e4ec6', magnet: '#00a8e8',
            fire: '#f76808', zap: '#12a594', bomb: '#eab308', life: '#30a46c',
            shrink: '#c2183b', fast: '#ff4d6d', descend: '#e5484d'
        };
        var PU_NAME = {
            multi: 'Split Ball', wide: 'Expand Paddle', slow: 'Slow Ball', laser: 'Laser Paddle',
            magnet: 'Grab Paddle', fire: 'Fire Ball', zap: 'Zap Bricks', bomb: 'Exploding',
            life: 'Extra Life', shrink: 'Shrink Paddle', fast: 'Fast Ball', descend: 'Falling Bricks'
        };

        function on(t, ev, fn, opts) { t.addEventListener(ev, fn, opts); listeners.push([t, ev, fn, opts]); }
        function offAll() { listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); }); listeners = []; }

        function bestKey() { return simple ? 'avatarRallyBest' : 'avatarBreakerBest'; }
        function loadBest() { try { return parseInt(sessionStorage.getItem(bestKey()) || '0', 10) || 0; } catch (e) { return 0; } }
        function saveBest(v) { try { sessionStorage.setItem(bestKey(), String(v)); } catch (e) {} }

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = window.innerWidth; H = window.innerHeight;
            canvas.width = W * dpr; canvas.height = H * dpr;
            canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (paddle) paddle.y = H - 54;
        }

        // Each layout returns a per-cell code for an r x c grid:
        //   0 = empty, 1 = normal brick, 2 = tough (2-hit) brick
        var LAYOUTS = [
            function solid(rows, cols) {
                return grid(rows, cols, function (r) { return r < 2 ? 2 : 1; });
            },
            function diamond(rows, cols) {
                var cy = (rows - 1) / 2, cx = (cols - 1) / 2;
                return grid(rows, cols, function (r, c) {
                    var d = Math.abs(r - cy) / (cy + 0.001) + Math.abs(c - cx) / (cx + 0.001);
                    if (d > 1.02) return 0;
                    return d < 0.4 ? 2 : 1;
                });
            },
            function pyramid(rows, cols) {
                return grid(rows, cols, function (r, c) {
                    var inset = Math.floor((rows - 1 - r) * (cols / 2 / rows));
                    if (c < inset || c >= cols - inset) return 0;
                    return r < 2 ? 2 : 1;
                });
            },
            function frame(rows, cols) {
                return grid(rows, cols, function (r, c) {
                    var ring = r <= 1 || r >= rows - 2 || c <= 1 || c >= cols - 2;
                    return ring ? (r < 2 ? 2 : 1) : 0;
                });
            },
            function columns(rows, cols) {
                // 2-wide vertical bands with 1-wide gaps
                return grid(rows, cols, function (r, c) { return (c % 3 === 2) ? 0 : (r < 2 ? 2 : 1); });
            },
            function arch(rows, cols) {
                // solid block with a rounded tunnel bitten out of the bottom-centre
                var cx = (cols - 1) / 2;
                return grid(rows, cols, function (r, c) {
                    var reach = 1 + (rows - 1 - r) * (cols * 0.32 / rows);
                    if (Math.abs(c - cx) < reach) return 0;
                    return r < 2 ? 2 : 1;
                });
            }
        ];
        function grid(rows, cols, fn) {
            var m = [];
            for (var r = 0; r < rows; r++) {
                m[r] = [];
                for (var c = 0; c < cols; c++) m[r][c] = fn(r, c) | 0;
            }
            return m;
        }

        function makeBricks() {
            bricks = [];
            if (simple) return;
            var pad = 4, top = 84, bh = 28;
            brickStep = bh + pad;
            var cols = clamp(Math.round((W - 24) / 46), 8, 20);
            // more rows each level, but never crowd the paddle
            var maxRows = Math.max(5, Math.floor((H * 0.6 - top) / brickStep));
            var rows = Math.min((W < 560 ? 6 : 7) + Math.min(level - 1, 5), maxRows);
            var bw = (W - 24 - pad * (cols - 1)) / cols;
            brickW = bw + pad;
            brickBW = bw; brickBH = bh; brickSprites = {}; // sprite cache, keyed per colour/hp
            var left = 12;
            var layout = LAYOUTS[(Math.random() * LAYOUTS.length) | 0];
            var m = layout(rows, cols);
            var cells = {};
            for (var r = 0; r < rows; r++) {
                for (var c = 0; c < cols; c++) {
                    var code = m[r][c];
                    if (!code) continue;
                    // higher levels harden the wall: more 2-hit, then 3-hit bricks
                    if (code === 1 && level >= 3 && Math.random() < (level - 2) * 0.16) code = 2;
                    if (code === 2 && level >= 5 && Math.random() < (level - 4) * 0.22) code = 3;
                    var ty = top + r * (bh + pad);
                    var brick = {
                        x: left + c * (bw + pad), y: ty - H - r * 12, ty: ty,
                        w: bw, h: bh, hp: code, maxhp: code, gr: r, gc: c,
                        color: COLORS[r % COLORS.length], alive: true, boom: false
                    };
                    bricks.push(brick);
                    cells[r + ',' + c] = brick;
                }
            }
            carveExplosiveVein(cells, cols);
        }

        // Every layout gets a vein of exploding bricks: one snaking path carved on
        // the left half, then mirrored to the right so it's symmetric, never a lone
        // brick. Vein cells must have a brick directly below them (never the front
        // line), and the whole vein is walled in with 2-hit bricks.
        function carveExplosiveVein(cells, cols) {
            if (bricks.length < 12) return;
            var dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
            var covered = function (b) { return !!cells[(b.gr + 1) + ',' + b.gc]; };
            var free = function (b) {
                for (var d = 0; d < 4; d++) {
                    var n = cells[(b.gr + dirs[d][0]) + ',' + (b.gc + dirs[d][1])];
                    if (n && !n.boom) return true;
                }
                return false;
            };
            var vein = null;
            for (var attempt = 0; attempt < 30 && !vein; attempt++) {
                var start = bricks[(Math.random() * bricks.length) | 0];
                // seed on the left half, with a brick below it and room to grow
                if (start.gc > (cols - 1) / 2 || !covered(start) || !free(start)) continue;
                var path = [];
                var cur = start;
                var len = 4 + (Math.random() * 4 | 0);
                for (var s = 0; s < len && cur; s++) {
                    cur.boom = true;
                    path.push(cur);
                    var opts = [];
                    for (var d = 0; d < 4; d++) {
                        var n = cells[(cur.gr + dirs[d][0]) + ',' + (cur.gc + dirs[d][1])];
                        // stay on the left half AND keep a brick below every vein cell
                        if (n && !n.boom && n.gc <= (cols - 1) / 2 && covered(n)) opts.push(n);
                    }
                    cur = opts.length ? opts[(Math.random() * opts.length) | 0] : null;
                }
                if (path.length >= 3) { vein = path; }
                else { path.forEach(function (p) { p.boom = false; }); }
            }
            if (!vein) return;

            // mirror the vein across the centre column (only where a brick exists below)
            var all = vein.slice();
            vein.forEach(function (v) {
                var mc = cols - 1 - v.gc;
                var mb = cells[v.gr + ',' + mc];
                if (mb && !mb.boom && covered(mb)) { mb.boom = true; all.push(mb); }
            });

            all.forEach(function (v) { v.hp = 1; v.maxhp = 1; });
            // armour: every non-vein neighbour (incl. diagonals) becomes a 2-hit brick
            all.forEach(function (v) {
                for (var dr = -1; dr <= 1; dr++) {
                    for (var dc = -1; dc <= 1; dc++) {
                        if (!dr && !dc) continue;
                        var n = cells[(v.gr + dr) + ',' + (v.gc + dc)];
                        if (n && !n.boom) { n.hp = 2; n.maxhp = 2; }
                    }
                }
            });
        }

        // ball spin (radians): friction on each contact kicks it, then it bleeds off
        var SPIN_GAIN = 0.016, SPIN_MAX = 0.34, SPIN_DAMP = 0.985;

        function newBall(x, y, vx, vy) {
            return {
                x: x, y: y, r: Math.max(9, Math.round(Math.min(W, H) * 0.016)),
                vx: vx, vy: vy, stuck: false, rot: Math.random() * Math.PI * 2, av: 0
            };
        }
        function spin(b, t) { b.av = clamp(b.av + SPIN_GAIN * t, -SPIN_MAX, SPIN_MAX); }
        function serve() {
            balls = [newBall(paddle.x, paddle.y - 16, 0, 0)];
            balls[0].stuck = true;
            balls[0].heldDx = 0;
            state = simple ? 'serving' : (state === 'entering' ? 'entering' : 'serving');
            if (!simple && bricksSliding()) state = 'entering';
        }
        function bricksSliding() {
            for (var i = 0; i < bricks.length; i++) if (Math.abs(bricks[i].y - bricks[i].ty) > 0.5) return true;
            return false;
        }
        // Releases every ball held on the paddle (the opening serve, or balls
        // caught by the magnet). Aim comes from where on the paddle each is held.
        // Returns true if anything was released.
        function launch() {
            var any = false;
            // a mid-play release (magnet) always fires as a punch — pace, flatter
            // angle, spark burst and the paddle jab; the opening serve stays gentle
            var hard = state === 'playing';
            balls.forEach(function (b) {
                if (!b.stuck) return;
                any = true;
                b.stuck = false;
                var off = clamp((b.heldDx || 0) / (paddle.w / 2), -1, 1);
                var ang = -Math.PI / 2 + off * (Math.PI / 3) + (off === 0 ? (Math.random() * 0.4 - 0.2) : 0);
                var sp = speed;
                if (hard) {
                    sp = Math.min(speed * 1.4, baseSpeed * 3.4);
                    ang += off * -0.12;
                    for (var pk = 0; pk < 10; pk++) {
                        var pa = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
                        particles.push({ x: b.x, y: b.y, vx: Math.cos(pa) * 3, vy: Math.sin(pa) * 3, life: 16 + Math.random() * 10, color: '#ffffff' });
                    }
                }
                b.vx = Math.cos(ang) * sp;
                b.vy = Math.sin(ang) * sp;
                b.heldDx = 0;
            });
            if (any && hard) { paddle.punchUntil = 0; paddle.yOff = -22; }
            if (any && state === 'serving') state = 'playing';
            return any;
        }
        function scaleBalls() {
            balls.forEach(function (b) {
                if (b.stuck) return;
                var m = Math.hypot(b.vx, b.vy) || 1;
                b.vx = b.vx / m * speed; b.vy = b.vy / m * speed;
            });
        }

        // ---- lifecycle
        var savedTheme = null;
        function start() {
            simple = isMobile();
            // the game reads --bg / --text; force dark for the run (without touching
            // the saved preference) since it doesn't read well in light mode
            savedTheme = document.documentElement.getAttribute('data-theme');
            if (savedTheme !== 'dark') document.documentElement.setAttribute('data-theme', 'dark');
            document.querySelectorAll(FADE_SELECTOR).forEach(function (el) { el.classList.add('breaker-fade'); });
            startTimer = setTimeout(begin, 340);
        }

        function begin() {
            startTimer = null;
            canvas = document.createElement('canvas');
            canvas.className = 'breaker-canvas';
            canvas.style.cssText = 'position:fixed;inset:0;z-index:99999;touch-action:none;cursor:none;';
            document.body.appendChild(canvas);
            ctx = canvas.getContext('2d');
            resize();

            paddle = { x: W / 2, y: H - 54, w: simple ? 96 : 112, baseW: simple ? 96 : 112, h: 12, yOff: 0, punchUntil: 0 };
            level = 1;
            baseSpeed = levelSpeed();
            best = loadBest();
            themeBg = cssVar('--bg', '#111');   // resolved once — no getComputedStyle per frame
            themeFg = cssVar('--text', '#eee');
            avatar.style.visibility = 'hidden';

            reset();

            on(window, 'mousemove', onMove);
            on(window, 'touchmove', onMove, { passive: false });
            // pointerdown (not click) so the punch registers on press — more precise timing
            on(canvas, 'pointerdown', onDown);
            on(window, 'pointerup', onUp);
            on(window, 'pointercancel', onUp);
            on(window, 'keydown', onKey);
            on(window, 'keyup', onKeyUp);
            on(window, 'resize', resize);
            on(document, 'pointerlockchange', onLock);

            loop();
        }

        function levelSpeed() {
            return Math.max(4.6, Math.min(W, H) * 0.0072) * (1 + (level - 1) * 0.05);
        }
        function reset() {
            powerups = []; bullets = []; particles = []; timers = {};
            level = 1;
            score = 0; lives = simple ? 1 : 3; baseSpeed = levelSpeed(); speed = baseSpeed;
            tEnter = 0; lastFire = 0; lastBoost = 0; bombArmed = false; zapFlash = 0;
            paddle.w = paddle.baseW;
            makeBricks();
            state = simple ? 'serving' : 'entering';
            serve();
        }
        // after a win: keep the score, bump the difficulty, deal a fresh (harder)
        // board. Power-up effects don't carry over.
        function nextBoard() {
            level++;
            timers = {}; bombArmed = false;
            baseSpeed = levelSpeed();
            applyPaddleW(); applyBallSpeed();
            powerups = []; bullets = []; balls = []; particles = []; zapFlash = 0;
            tEnter = 0;
            makeBricks();
            serve();
            state = 'entering';
        }

        function exit() {
            if (startTimer) { clearTimeout(startTimer); startTimer = null; }
            if (raf) cancelAnimationFrame(raf);
            raf = null;
            offAll();
            try { if (document.pointerLockElement) document.exitPointerLock(); } catch (e) {}
            locked = false;
            if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
            canvas = null;
            document.querySelectorAll('.breaker-fade').forEach(function (el) { el.classList.remove('breaker-fade'); });
            if (savedTheme != null && savedTheme !== 'dark') {
                document.documentElement.setAttribute('data-theme', savedTheme);
            }
            savedTheme = null;
            avatar.style.visibility = '';
            homeAvatar();
            mode = 'idle';
        }

        // ---- input
        function onLock() {
            locked = document.pointerLockElement === canvas;
        }
        function freeCursor() {
            try { if (document.pointerLockElement) document.exitPointerLock(); } catch (e) {}
            locked = false;
        }
        function onMove(e) {
            if (locked && typeof e.movementX === 'number') {
                paddle.x = clamp(paddle.x + e.movementX, paddle.w / 2, W - paddle.w / 2);
                pointerX = paddle.x; pointerY = paddle.y;
                return;
            }
            var p = e.touches && e.touches[0] ? e.touches[0] : e;
            if (p.clientX == null) return;
            if (e.cancelable && e.type.indexOf('touch') === 0) e.preventDefault();
            pointerX = p.clientX; pointerY = p.clientY;
        }
        // the shiny CV button on the win screen
        function winButton() {
            var w = Math.min(360, W - 80), h = 58;
            return { x: W / 2 - w / 2, y: H / 2 + 28, w: w, h: h };
        }
        function downloadCV() {
            try { window.open(CV_URL, '_blank', 'noopener'); } catch (e) {}
        }
        // the "quit" hint text top-right doubles as a tap target (touch has no Esc)
        function hitClose(e) {
            var p = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : e;
            return p.clientX > W - 160 && p.clientY < 32;
        }
        function onDown(e) {
            if (e.cancelable && e.pointerType === 'touch') e.preventDefault();
            if (e.clientX != null) { pointerX = e.clientX; pointerY = e.clientY; }
            if (hitClose(e)) { exit(); return; }
            if (state === 'won') {
                var b = winButton();
                if (pointerX >= b.x && pointerX <= b.x + b.w && pointerY >= b.y && pointerY <= b.y + b.h) {
                    downloadCV();
                } else {
                    nextBoard(); // keep the score, next board is a bit harder
                }
                return;
            }
            if (state === 'lost') { reset(); return; }
            // capture the mouse so the paddle keeps tracking past the screen edges
            // (best-effort — if the browser refuses, we fall back to clientX tracking)
            if (!simple && e.pointerType !== 'touch' && document.pointerLockElement !== canvas) {
                try {
                    var pl = canvas.requestPointerLock && canvas.requestPointerLock();
                    if (pl && pl.catch) pl.catch(function () {});
                } catch (err) {}
            }
            if (state === 'serving') { launch(); return; }
            if (state === 'playing') {
                pointerHeld = true;
                if (!launch()) { punch(); if (!simple && timers.laser) fire(); }
            }
        }
        function onUp() { pointerHeld = false; }
        function onKeyUp(e) { if (e.key === ' ' || e.code === 'Space') spaceHeld = false; }
        function onKey(e) {
            if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') { exit(); return; }
            if (e.key === '`') { debug = !debug; return; }
            if (debug) {
                var di = DEBUG_KEYS.indexOf(e.key);
                if (di >= 0 && di < PU_LIST.length) { applyPowerup(PU_LIST[di]); return; }
                if (e.key === 'k') { bricks.forEach(function (b) { b.alive = false; }); return; }
            }
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                if (e.repeat) return;
                if (state === 'won') nextBoard();
                else if (state === 'lost') reset();
                else if (state === 'serving') launch();
                else if (state === 'playing') {
                    spaceHeld = true;
                    if (!launch()) { punch(); if (!simple && timers.laser) fire(); }
                }
            }
        }
        function fire() {
            var now = performance.now();
            var cd = timers.laser >= 3 ? 75 : (timers.laser >= 2 ? 120 : 230);
            if (now - lastFire < cd) return;
            lastFire = now;
            bullets.push({ x: paddle.x - paddle.w / 2 + 7, y: paddle.y + paddle.yOff });
            bullets.push({ x: paddle.x + paddle.w / 2 - 7, y: paddle.y + paddle.yOff });
        }
        // Click / Space during play jabs the paddle upward. It's a timing move:
        // if the ball meets the paddle inside the jab window it leaves with extra
        // momentum (see the paddle-collision block in update()).
        function punch() {
            var now = performance.now();
            if (now - lastBoost < 170) return;
            lastBoost = now;
            paddle.punchUntil = now + 130;
            paddle.yOff = -18;
        }

        // ---- powerups
        var PU_WEIGHT = {
            multi: 3, wide: 3, slow: 3, laser: 3, magnet: 3,
            fire: 2, zap: 2, bomb: 1, // bomb clears the board — keep it rare
            life: 2, shrink: 2, fast: 2, descend: 2
        };
        function pickPowerup() {
            var haveBoom = bricks.some(function (b) { return b.alive && b.boom; });
            var w = [], total = 0;
            PU_LIST.forEach(function (t) {
                var x = PU_WEIGHT[t] || 1;
                if (t === 'laser' && timers.descend) x *= 4; // more likely while bricks fall
                if (t === 'bomb' && !haveBoom) x = 0;        // pointless once the vein is gone
                w.push(x); total += x;
            });
            var r = Math.random() * total;
            for (var i = 0; i < PU_LIST.length; i++) { r -= w[i]; if (r < 0) return PU_LIST[i]; }
            return PU_LIST[0];
        }
        function maybeDrop(x, y) {
            if (simple || Math.random() > 0.16) return;
            powerups.push({ x: x, y: y, w: 26, h: 26, vy: 2.1, type: pickPowerup() });
        }
        // timers.wide / timers.shrink hold the current multiplier — each pickup
        // stacks (wider / narrower), reset on death like every other effect.
        function applyPaddleW() {
            var mult = timers.shrink ? timers.shrink : (timers.wide ? timers.wide : 1);
            paddle.w = Math.min(paddle.baseW * mult, W * 0.62);
        }
        function applyBallSpeed() {
            speed = baseSpeed * (timers.fast ? 1.5 : (timers.slow ? 0.5 : 1));
            scaleBalls();
        }
        function zapRow() {
            var maxTy = -1;
            bricks.forEach(function (b) { if (b.alive && b.ty > maxTy) maxTy = b.ty; });
            if (maxTy < 0) return;
            zapFlash = performance.now();
            zapY = maxTy + brickBH / 2;
            bricks.forEach(function (b) {
                if (b.alive && Math.abs(b.ty - maxTy) < 2) {
                    b.alive = false; score += 30;
                    burst(b.x + b.w / 2, b.y + b.h / 2, b.color);
                }
            });
        }
        function blastFx(cx, cy) {
            for (var i = 0; i < 22; i++) {
                var a = Math.random() * Math.PI * 2, s = 2 + Math.random() * 4;
                particles.push({ x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 22 + Math.random() * 14, color: i % 2 ? '#ffb224' : '#f76808' });
            }
        }
        var PU_GOOD = ['multi', 'wide', 'slow', 'laser', 'magnet', 'fire', 'life', 'zap'];
        // Blow up bricks around a point; any exploding brick caught in it chains.
        // `seed` is an already-dead exploding brick to start the chain from.
        // A decent chain rewards the player with a scatter of good power-ups.
        function blast(cx, cy, seed) {
            var rx = brickW * 1.5, ry = brickStep * 1.6;
            var queue = seed ? [seed] : [];
            var killed = 0;
            var hitOne = function (fx, fy) {
                bricks.forEach(function (o) {
                    if (!o.alive) return;
                    if (Math.abs(o.x + o.w / 2 - fx) <= rx && Math.abs(o.y + o.h / 2 - fy) <= ry) {
                        o.alive = false; score += 40; killed++;
                        burst(o.x + o.w / 2, o.y + o.h / 2, o.color);
                        if (o.boom && !o.boomed) { o.boomed = true; queue.push(o); }
                    }
                });
            };
            if (!seed) { blastFx(cx, cy); hitOne(cx, cy); }
            var guard = 0;
            while (queue.length && guard++ < 400) {
                var b = queue.shift();
                var bx = b.x + b.w / 2, by = b.y + b.h / 2;
                blastFx(bx, by);
                hitOne(bx, by);
            }
            if (!simple && killed >= 6) {
                var loot = Math.min(3, 1 + ((killed - 6) / 12 | 0));
                for (var l = 0; l < loot; l++) {
                    var lx = clamp(cx + (l - (loot - 1) / 2) * 46, 24, W - 24);
                    powerups.push({
                        x: lx, y: cy, w: 26, h: 26, vy: 1.4,
                        type: PU_GOOD[(Math.random() * PU_GOOD.length) | 0]
                    });
                }
            }
        }
        // fireball lvl 2+ side damage: pop bricks around the one it passed through
        function fireSplash(cx, cy, rx, ry) {
            bricks.forEach(function (o) {
                if (!o.alive) return;
                if (Math.abs(o.x + o.w / 2 - cx) > rx || Math.abs(o.y + o.h / 2 - cy) > ry) return;
                var ox = o.x + o.w / 2, oy = o.y + o.h / 2;
                if (o.boom && !o.boomed) { o.boomed = true; o.alive = false; blast(ox, oy, o); }
                else { o.alive = false; score += 30; burst(ox, oy, o.color); }
            });
        }
        // Effects stay on until you lose the ball (loseBall clears `timers`).
        function applyPowerup(t) {
            if (!PU_BAD[t]) score += 100;
            if (t === 'multi') {
                var add = [];
                balls.forEach(function (b) {
                    if (balls.length + add.length >= 9) return;
                    for (var k = 0; k < 2; k++) {
                        var nb;
                        if (b.stuck) {
                            // grabbed by the magnet: split into more held balls so a
                            // release fires all of them
                            nb = newBall(b.x, b.y, 0, 0);
                            nb.stuck = true;
                            nb.heldDx = (b.heldDx || 0) + (k ? 14 : -14);
                        } else {
                            var ang = Math.atan2(b.vy, b.vx) + (k ? 0.4 : -0.4);
                            nb = newBall(b.x, b.y, Math.cos(ang) * speed, Math.sin(ang) * speed);
                        }
                        add.push(nb);
                    }
                });
                balls = balls.concat(add);
            } else if (t === 'wide') {
                timers.shrink = 0;
                timers.wide = Math.min((timers.wide || 1) + 0.4, 2.8);
                applyPaddleW();
            } else if (t === 'shrink') {
                timers.wide = 0;
                timers.shrink = Math.max((timers.shrink || 1) * 0.78, 0.4);
                applyPaddleW();
            } else if (t === 'slow') {
                timers.slow = 1; timers.fast = 0; applyBallSpeed();
            } else if (t === 'fast') {
                timers.fast = 1; timers.slow = 0; applyBallSpeed();
            } else if (t === 'life') {
                lives = Math.min(5, lives + 1);
            } else if (t === 'laser') {
                // lvl 1 tap-fire · lvl 2 rapid · lvl 3 hold for machine-gun
                timers.laser = Math.min((timers.laser || 0) + 1, 3);
            } else if (t === 'fire') {
                // lvl 1 melt-through · lvl 2 small splash · lvl 3 bigger splash
                timers.fire = Math.min((timers.fire || 0) + 1, 3);
            } else if (t === 'zap') {
                zapRow();
            } else if (t === 'bomb') {
                // set off every exploding brick on the board (each chains its vein);
                // if there are none, arm the next brick you hit instead
                var booms = bricks.filter(function (b) { return b.alive && b.boom; });
                if (booms.length) {
                    booms.forEach(function (b) {
                        if (!b.alive) return; // already taken out by an earlier chain
                        b.alive = false; b.boomed = true;
                        blast(b.x + b.w / 2, b.y + b.h / 2, b);
                    });
                } else {
                    bombArmed = true;
                }
            } else if (t === 'descend') {
                timers.descend = 1;
            } else if (t === 'magnet') {
                // lvl 1 catch-on-touch · lvl 2 gravitational pull · lvl 3 homing
                timers.magnet = Math.min((timers.magnet || 0) + 1, 3);
            }
        }
        // "descend" hazard: the whole brick field steps down on every paddle hit,
        // but halts well above the paddle so there's always room to rally.
        function descendBricks() {
            var step = brickStep, low = 0;
            bricks.forEach(function (b) {
                if (!b.alive) return;
                b.y += step; b.ty += step;
                low = Math.max(low, b.y + b.h);
            });
            if (low > paddle.y - 150) {
                timers.descend = 0;
                bricks.forEach(function (b) { b.y -= step * 2; b.ty -= step * 2; });
            }
        }

        function burst(x, y, color) {
            for (var i = 0; i < 8; i++) {
                var a = Math.random() * Math.PI * 2, s = 1 + Math.random() * 3;
                particles.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 20 + Math.random() * 12, color: color });
            }
        }

        function hitBrick(k, x, y) {
            k.hp--; score += 10;
            if (k.hp <= 0) {
                k.alive = false; score += 40; burst(x, y, k.color); maybeDrop(x, y);
                if (k.boom && !k.boomed) { k.boomed = true; blast(x, y, k); }
                else if (bombArmed) { bombArmed = false; blast(x, y); }
            }
        }

        function loseBall() {
            lives--;
            if (lives <= 0) {
                state = 'lost';
                if (score > best) best = score;
                saveBest(best);
                freeCursor();
            } else {
                // pop any powerups still in the air — they don't carry to the next ball
                powerups.forEach(function (pu) { burst(pu.x, pu.y, PU_COLOR[pu.type] || '#888'); });
                powerups = [];
                timers = {}; bombArmed = false;
                applyPaddleW(); applyBallSpeed();
                serve();
            }
        }

        // ---- update
        function update() {
            if (!locked && pointerX != null) paddle.x += (pointerX - paddle.x) * (simple ? 0.35 : 0.5);
            paddle.x = clamp(paddle.x, paddle.w / 2, W - paddle.w / 2);
            paddle.yOff += (0 - paddle.yOff) * 0.25; // jab springs back to rest

            if (state === 'entering') {
                tEnter++;
                var done = true;
                bricks.forEach(function (b) {
                    b.y += (b.ty - b.y) * 0.18;
                    if (Math.abs(b.y - b.ty) > 0.5) done = false;
                });
                if (done || tEnter > 90) { bricks.forEach(function (b) { b.y = b.ty; }); state = 'serving'; }
            }

            balls.forEach(function (b) {
                if (!b.stuck) return;
                b.heldDx = clamp(b.heldDx || 0, -paddle.w / 2 + b.r + 2, paddle.w / 2 - b.r - 2);
                b.x = paddle.x + b.heldDx;
                b.y = paddle.y + paddle.yOff - b.r - 2;
            });

            if (state === 'playing') {
                for (var i = balls.length - 1; i >= 0; i--) {
                    var b = balls[i];
                    b.x += b.vx; b.y += b.vy;

                    // shield lvl 2+: a gravity well centred on the paddle. Acceleration
                    // points straight at the paddle (so the pull always has a downward
                    // component — the ball can't hover or drift flat), and gets stronger
                    // the closer the ball is. Speed is renormalised so it curves rather
                    // than accelerates, and it fades out past a range so a far ball slips by.
                    var pTop = paddle.y + paddle.yOff;
                    if (timers.magnet >= 2 && !b.stuck && b.vy > 0 && b.y > H * 0.45 && b.y < pTop) {
                        var dx = paddle.x - b.x, dy = (pTop - b.r) - b.y;
                        var dist = Math.hypot(dx, dy) || 1;
                        var range = timers.magnet >= 3 ? 520 : 300;
                        var reach = 1 - dist / range;
                        if (reach > 0) {
                            var mag = Math.hypot(b.vx, b.vy) || speed;
                            var g = (timers.magnet >= 3 ? 26 : 9) * reach / (dist + 40);
                            b.vx += dx / dist * g;
                            b.vy += dy / dist * g;
                            var m2 = Math.hypot(b.vx, b.vy) || 1;
                            b.vx = b.vx / m2 * mag;
                            b.vy = b.vy / m2 * mag;
                            // always keep some downward progress — no stalling on the diagonal
                            var minVy = mag * 0.16;
                            if (b.vy < minVy) {
                                b.vy = minVy;
                                var sx = Math.sqrt(Math.max(0, mag * mag - minVy * minVy));
                                b.vx = b.vx < 0 ? -sx : sx;
                            }
                        }
                    }

                    // fireball: shed glowing embers that trail behind (fewer as balls multiply)
                    if (timers.fire && particles.length < MAX_PARTICLES - 20) {
                        var emN = balls.length > 3 ? 1 : 2;
                        for (var em = 0; em < emN; em++) {
                            particles.push({
                                x: b.x + (Math.random() - 0.5) * b.r,
                                y: b.y + (Math.random() - 0.5) * b.r,
                                vx: -b.vx * 0.12 + (Math.random() - 0.5) * 1.2,
                                vy: -b.vy * 0.12 + (Math.random() - 0.5) * 1.2 - 0.6,
                                life: 12 + Math.random() * 16,
                                color: ['#ffd24a', '#ffb224', '#f76808'][(Math.random() * 3) | 0],
                                glow: true
                            });
                        }
                    }

                    var wall = false;
                    if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx); wall = true; spin(b, -b.vy); }
                    else if (b.x + b.r > W) { b.x = W - b.r; b.vx = -Math.abs(b.vx); wall = true; spin(b, b.vy); }
                    if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy); wall = true; spin(b, -b.vx); }
                    if (wall && simple) {
                        speed = Math.min(speed * 1.06, baseSpeed * 4);
                        scaleBalls();
                    }

                    // paddle
                    var py = paddle.y + paddle.yOff;
                    if (b.vy > 0 && b.y + b.r >= py && b.y - b.r <= py + paddle.h + b.vy &&
                        b.x >= paddle.x - paddle.w / 2 - b.r && b.x <= paddle.x + paddle.w / 2 + b.r) {
                        b.y = py - b.r;

                        // magnet: the force field catches the ball and holds it;
                        // the player releases it later with a click / Space
                        if (timers.magnet) {
                            b.stuck = true;
                            b.av = 0;
                            b.heldDx = clamp(b.x - paddle.x, -paddle.w / 2 + b.r + 2, paddle.w / 2 - b.r - 2);
                            b.vx = 0; b.vy = 0;
                            continue;
                        }

                        var off = clamp((b.x - paddle.x) / (paddle.w / 2), -1, 1);
                        var ang = -Math.PI / 2 + off * (Math.PI / 3);
                        var sp = Math.hypot(b.vx, b.vy) || speed;
                        // timed punch: click as the ball meets the paddle for extra pace
                        if (performance.now() < paddle.punchUntil) {
                            sp = Math.min(sp * 1.4, baseSpeed * 3.4);
                            ang += off * -0.12; // flatten the outgoing angle a touch toward vertical
                            paddle.punchUntil = 0;
                            paddle.yOff = -22;
                            score += simple ? 0 : 25;
                            for (var pk = 0; pk < 10; pk++) {
                                var pa = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
                                particles.push({ x: b.x, y: py, vx: Math.cos(pa) * 3, vy: Math.sin(pa) * 3, life: 16 + Math.random() * 10, color: '#ffffff' });
                            }
                        }
                        b.vx = Math.cos(ang) * sp;
                        b.vy = Math.sin(ang) * sp;
                        spin(b, b.vx * 1.3); // paddle grabs it like a floor
                        if (timers.descend) descendBricks();
                        if (simple) { score++; if (score > best) { best = score; saveBest(best); } }
                    }

                    // bricks
                    if (!simple) {
                        for (var j = 0; j < bricks.length; j++) {
                            var k = bricks[j];
                            if (!k.alive) continue;
                            if (b.x + b.r > k.x && b.x - b.r < k.x + k.w && b.y + b.r > k.y && b.y - b.r < k.y + k.h) {
                                if (timers.fire) {
                                    // fireball: melt straight through, no bounce
                                    var kcx = k.x + k.w / 2, kcy = k.y + k.h / 2;
                                    k.hp = 1;
                                    hitBrick(k, kcx, kcy);
                                    if (timers.fire >= 2) {
                                        // lvl 2 splashes the ring, lvl 3 a bit wider
                                        var frx = brickW * (timers.fire >= 3 ? 1.35 : 0.95);
                                        var fry = brickStep * (timers.fire >= 3 ? 1.55 : 1.15);
                                        fireSplash(kcx, kcy, frx, fry);
                                    }
                                    continue;
                                }
                                var oL = b.x + b.r - k.x, oR = k.x + k.w - (b.x - b.r);
                                var oT = b.y + b.r - k.y, oB = k.y + k.h - (b.y - b.r);
                                var m = Math.min(oL, oR, oT, oB);
                                if (m === oL) { b.x = k.x - b.r; b.vx = -Math.abs(b.vx); spin(b, -b.vy * 0.6); }
                                else if (m === oR) { b.x = k.x + k.w + b.r; b.vx = Math.abs(b.vx); spin(b, b.vy * 0.6); }
                                else if (m === oT) { b.y = k.y - b.r; b.vy = -Math.abs(b.vy); spin(b, b.vx * 0.6); }
                                else { b.y = k.y + k.h + b.r; b.vy = Math.abs(b.vy); spin(b, -b.vx * 0.6); }
                                hitBrick(k, k.x + k.w / 2, k.y + k.h / 2);
                                break;
                            }
                        }
                    }

                    b.av *= SPIN_DAMP;
                    b.rot += b.av;

                    // gone once it's clearly past the paddle (stops balls loitering
                    // in the gap below it, especially with the magnet pull active)
                    if (b.y - b.r > paddle.y + paddle.h + 6) {
                        for (var pp = 0; pp < 14; pp++) {
                            var pa2 = Math.random() * Math.PI * 2, ps = 1.5 + Math.random() * 3.5;
                            particles.push({
                                x: b.x, y: b.y,
                                vx: Math.cos(pa2) * ps, vy: Math.sin(pa2) * ps + 1,
                                life: 16 + Math.random() * 14,
                                color: Math.random() < 0.5 ? '#e5484d' : '#ffffff'
                            });
                        }
                        balls.splice(i, 1);
                    }
                }

                if (balls.length === 0) loseBall();

                // lvl 3 laser: keep firing while the button / Space is held
                if (timers.laser >= 3 && !simple && (pointerHeld || spaceHeld)) fire();

                // powerups
                for (var p = powerups.length - 1; p >= 0; p--) {
                    var pu = powerups[p];
                    pu.y += pu.vy;
                    if (pu.y + pu.h / 2 >= paddle.y && pu.y - pu.h / 2 <= paddle.y + paddle.h &&
                        pu.x + pu.w / 2 >= paddle.x - paddle.w / 2 && pu.x - pu.w / 2 <= paddle.x + paddle.w / 2) {
                        applyPowerup(pu.type); powerups.splice(p, 1);
                    } else if (pu.y - pu.h > H) {
                        powerups.splice(p, 1);
                    }
                }
                // keep pickups from stacking — push overlapping ones apart on x
                for (var s1 = 0; s1 < powerups.length; s1++) {
                    for (var s2 = s1 + 1; s2 < powerups.length; s2++) {
                        var pa = powerups[s1], pb = powerups[s2];
                        if (Math.abs(pa.y - pb.y) > pa.h) continue;
                        var gap = pa.x - pb.x;
                        var need = (pa.w + pb.w) / 2 + 3;
                        var over = need - Math.abs(gap);
                        if (over > 0) {
                            var dir = gap < 0 ? -1 : 1;
                            pa.x += dir * over / 2;
                            pb.x -= dir * over / 2;
                        }
                    }
                }
                for (var s3 = 0; s3 < powerups.length; s3++) {
                    powerups[s3].x = clamp(powerups[s3].x, powerups[s3].w / 2, W - powerups[s3].w / 2);
                }

                // bullets
                for (var bi = bullets.length - 1; bi >= 0; bi--) {
                    var bu = bullets[bi];
                    bu.y -= 9;
                    var gone = bu.y < 0;
                    for (var j2 = 0; j2 < bricks.length && !gone; j2++) {
                        var kb = bricks[j2];
                        if (kb.alive && bu.x > kb.x && bu.x < kb.x + kb.w && bu.y > kb.y && bu.y < kb.y + kb.h) {
                            hitBrick(kb, kb.x + kb.w / 2, kb.y + kb.h / 2);
                            gone = true;
                        }
                    }
                    if (gone) bullets.splice(bi, 1);
                }

                if (!simple) {
                    var alive = 0;
                    for (var q = 0; q < bricks.length; q++) if (bricks[q].alive) alive++;
                    if (alive === 0) {
                        score += 400 + level * 100;
                        if (score > best) best = score;
                        saveBest(best);
                        state = 'won';
                        freeCursor();
                        balls = []; powerups = []; bullets = [];
                    }
                }
            }

            for (var pi = particles.length - 1; pi >= 0; pi--) {
                var pt = particles[pi];
                pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.15; pt.life--;
                if (pt.life <= 0) particles.splice(pi, 1);
            }
            // hard cap so a big chain explosion can't tank the framerate
            if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);
        }

        // ---- draw
        function rrect(x, y, w, h, r) {
            r = Math.min(r, w / 2, h / 2);
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
        }
        function center(color, text, y, size) {
            ctx.fillStyle = color;
            ctx.font = '700 ' + size + 'px "JetBrains Mono", ui-monospace, monospace';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(text, W / 2, y);
        }
        // pre-play key: every power-up icon with its name. Returns bottom Y.
        function drawLegend(fg, bg) {
            var cols = W < 820 ? 2 : 3;
            var rows = Math.ceil(PU_LIST.length / cols);
            var cellW = Math.min(258, (W - 56) / cols);
            var rowH = 36, chip = 27;
            var blockW = cellW * cols;
            var x0 = (W - blockW) / 2;
            var y0 = Math.max(H * 0.32, 250);
            var padX = 32, padTop = 50, padBot = 22;
            var panelH = (rows - 1) * rowH + chip + padTop + padBot;

            ctx.globalAlpha = 0.9;
            ctx.fillStyle = bg;
            rrect(x0 - padX, y0 - padTop, blockW + padX * 2, panelH, 12);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(127,127,127,0.35)';
            rrect(x0 - padX, y0 - padTop, blockW + padX * 2, panelH, 12);
            ctx.stroke();

            center(fg, 'POWER-UPS', y0 - 26, 14);
            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.font = '600 13px "JetBrains Mono", ui-monospace, monospace';
            PU_LIST.forEach(function (t, i) {
                var cx = x0 + (i % cols) * cellW;
                var cy = y0 + Math.floor(i / cols) * rowH;
                drawPuChip(t, cx + chip / 2, cy + chip / 2, chip);
                ctx.fillStyle = PU_BAD[t] ? '#e5484d' : fg;
                ctx.fillText(PU_NAME[t], cx + chip + 11, cy + chip / 2 + 1);
            });
            return y0 - padTop + panelH;
        }
        function shade(hex, amt) {
            hex = hex.replace('#', '');
            if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            var n = parseInt(hex, 16);
            return 'rgb(' + clamp((n >> 16) + amt, 0, 255) + ',' +
                clamp(((n >> 8) & 255) + amt, 0, 255) + ',' + clamp((n & 255) + amt, 0, 255) + ')';
        }

        // lucide icon path data (24x24), MIT licensed
        var ICONS = {
            life: { d: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z', fill: true },
            laser: { d: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z', fill: true },
            multi: { d: 'M8 8h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1zM4 16a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1', fill: false },
            wide: { d: 'M18 8l4 4-4 4M6 8l-4 4 4 4M2 12h20', fill: false },
            slow: { d: 'M7 6l5 5 5-5M7 13l5 5 5-5', fill: false },
            descend: { d: 'M12 5v14M19 12l-7 7-7-7', fill: false },
            magnet: { d: 'M6 4v7a6 6 0 0 0 12 0V4M6 4h4M14 4h4M6 11h4M14 11h4', fill: false },
            shrink: { d: 'M22 8l-4 4 4 4M2 8l4 4-4 4M8 12h8', fill: false },
            fast: { d: 'M7 11l5-5 5 5M7 18l5-5 5 5', fill: false },
            fire: { d: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z', fill: true },
            zap: { d: 'M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973M13 12l-3 5h4l-3 5', fill: false },
            bomb: { d: 'M20 13a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM14.35 4.65 16.3 2.7a2.41 2.41 0 0 1 3.4 0l1.6 1.6a2.4 2.4 0 0 1 0 3.4l-1.95 1.95M22 2l-1.5 1.5', fill: false }
        };
        // one power-up "chip": gradient capsule + border + icon. Used for both the
        // falling power-ups and the pre-play legend.
        function drawPuChip(t, cx, cy, s) {
            var col = PU_COLOR[t] || '#888';
            var x = cx - s / 2, y = cy - s / 2;
            var g = ctx.createLinearGradient(0, y, 0, y + s);
            g.addColorStop(0, shade(col, 42));
            g.addColorStop(1, shade(col, -34));
            ctx.fillStyle = g;
            rrect(x, y, s, s, s * 0.24); ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = shade(col, -72);
            rrect(x + 0.5, y + 0.5, s - 1, s - 1, s * 0.2); ctx.stroke();
            drawIcon(t, cx, cy, s * 0.62, '#fff');
        }
        function drawIcon(name, cx, cy, size, color) {
            var ic = ICONS[name];
            if (!ic) return;
            var s = size / 24;
            ctx.save();
            ctx.translate(cx - size / 2, cy - size / 2);
            ctx.scale(s, s);
            var p = new Path2D(ic.d);
            if (ic.fill) { ctx.fillStyle = color; ctx.fill(p); }
            else {
                ctx.strokeStyle = color;
                ctx.lineWidth = 1.9 / s;
                ctx.lineJoin = 'round'; ctx.lineCap = 'round';
                ctx.stroke(p);
            }
            ctx.restore();
        }

        // Bricks never change shape frame-to-frame, so render each look once to an
        // offscreen canvas and blit it. Cache keyed by colour + shown number + state.
        function getBrickSprite(color, num, dim) {
            var key = color + '|' + num + '|' + (dim ? 'd' : 'n');
            var s = brickSprites[key];
            if (s) return s;
            var w = brickBW, h = brickBH, d = Math.min(window.devicePixelRatio || 1, 2);
            s = document.createElement('canvas');
            s.width = Math.round(w * d);
            s.height = Math.round(h * d);
            var c = s.getContext('2d');
            c.scale(d, d);
            var g = c.createLinearGradient(0, 0, 0, h);
            g.addColorStop(0, shade(color, dim ? -4 : 58));
            g.addColorStop(0.46, shade(color, dim ? -30 : 12));
            g.addColorStop(0.54, shade(color, dim ? -46 : -10));
            g.addColorStop(1, shade(color, dim ? -66 : -40));
            c.fillStyle = g; c.fillRect(0, 0, w, h);
            var sh = c.createLinearGradient(0, 0, 0, h * 0.55);
            sh.addColorStop(0, dim ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.55)');
            sh.addColorStop(1, 'rgba(255,255,255,0)');
            c.fillStyle = sh; c.fillRect(1, 1, w - 2, h * 0.48);
            c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 1;
            c.beginPath(); c.moveTo(2, 1.4); c.lineTo(w - 2, 1.4); c.stroke();
            c.strokeStyle = shade(color, -84); c.lineWidth = 1;
            c.strokeRect(0.5, 0.5, w - 1, h - 1);
            if (num != null) {
                c.fillStyle = 'rgba(255,255,255,0.4)';
                c.font = '700 10px "JetBrains Mono", ui-monospace, monospace';
                c.textAlign = 'center'; c.textBaseline = 'middle';
                c.fillText(String(num), w / 2, h / 2 + 0.5);
            }
            brickSprites[key] = s;
            return s;
        }

        function draw() {
            var bg = themeBg, fg = themeFg;
            // Translucent backdrop so the dimmed About page still ghosts through.
            // clearRect first, so the semi-transparent fill doesn't leave trails.
            ctx.clearRect(0, 0, W, H);
            ctx.globalAlpha = 0.86;
            ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
            ctx.globalAlpha = 1;

            if (!simple) {
                var pulse = 0.5 + 0.5 * Math.sin(performance.now() / 180);
                bricks.forEach(function (b) {
                    if (!b.alive) return;
                    if (b.boom) {
                        var gx = b.x + b.w / 2, gy = b.y + b.h / 2;
                        var gr = Math.max(b.w, b.h) * (0.62 + 0.07 * pulse);
                        var glow = ctx.createRadialGradient(gx, gy, gr * 0.2, gx, gy, gr);
                        glow.addColorStop(0, 'rgba(255,196,0,' + (0.18 + 0.14 * pulse).toFixed(3) + ')');
                        glow.addColorStop(0.6, 'rgba(255,170,0,' + (0.06 + 0.06 * pulse).toFixed(3) + ')');
                        glow.addColorStop(1, 'rgba(255,170,0,0)');
                        ctx.fillStyle = glow;
                        ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill();
                        ctx.drawImage(getBrickSprite('#f5b800', null, false), b.x, b.y, b.w, b.h);
                        drawIcon('bomb', gx, gy, b.h * 0.66, 'rgba(28,16,0,0.95)');
                    } else {
                        ctx.drawImage(getBrickSprite(b.color, b.hp, b.hp < b.maxhp), b.x, b.y, b.w, b.h);
                    }
                });
            }

            ctx.globalCompositeOperation = 'lighter';
            particles.forEach(function (p) {
                var af = Math.max(0, p.life / 32);
                if (p.glow) {
                    ctx.globalAlpha = 0.85 * af;
                    ctx.fillStyle = p.color;
                    ctx.beginPath(); ctx.arc(p.x, p.y, 2 + 3.5 * af, 0, Math.PI * 2); ctx.fill();
                }
            });
            ctx.globalCompositeOperation = 'source-over';
            particles.forEach(function (p) {
                if (p.glow) return;
                ctx.globalAlpha = Math.max(0, p.life / 32);
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
            });
            ctx.globalAlpha = 1;

            // Zap Bricks: a lightning strike + screen flash on the cleared row
            if (zapFlash) {
                var zt = performance.now() - zapFlash;
                if (zt > 440) { zapFlash = 0; }
                else {
                    var za = 1 - zt / 440;
                    ctx.globalAlpha = 0.45 * za * za;
                    ctx.fillStyle = '#dff2ff';
                    ctx.fillRect(0, 0, W, H);
                    ctx.globalAlpha = 1;
                    ctx.save();
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.strokeStyle = 'rgba(190,240,255,' + (0.9 * za).toFixed(3) + ')';
                    ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                    for (var zb = 0; zb < 4; zb++) {
                        var zx = (zb + 0.5) / 4 * W + (Math.random() - 0.5) * 70;
                        ctx.beginPath();
                        ctx.moveTo(zx, 0);
                        for (var zs = 1; zs <= 8; zs++) {
                            ctx.lineTo(zx + (Math.random() - 0.5) * 44, zapY * zs / 8);
                        }
                        ctx.stroke();
                    }
                    ctx.restore();
                }
            }

            powerups.forEach(function (pu) { drawPuChip(pu.type, pu.x, pu.y, pu.w); });

            ctx.fillStyle = fg;
            bullets.forEach(function (bu) { ctx.fillRect(bu.x - 1.5, bu.y - 10, 3, 12); });

            var pw = paddle.w, px = paddle.x - pw / 2, py = paddle.y + paddle.yOff, ph = paddle.h;
            var gunX = [px + 7, px + pw - 7];

            // magnet force field: a crackling electric dome — bigger and brighter per shield level
            if (timers.magnet) {
                var mlv = timers.magnet;
                var fx = paddle.x, fy = py + ph / 2, frad = pw / 2 + 8 + (mlv - 1) * 7, ft = performance.now();
                var fpulse = 0.6 + 0.4 * Math.sin(ft / 140);
                var mboost = 1 + (mlv - 1) * 0.5; // 1 · 1.5 · 2
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                var aura = ctx.createRadialGradient(fx, fy, frad * 0.55, fx, fy, frad + 14);
                aura.addColorStop(0, 'rgba(0,180,255,0)');
                aura.addColorStop(0.72, 'rgba(0,190,255,' + (0.13 * mboost * fpulse).toFixed(3) + ')');
                aura.addColorStop(1, 'rgba(0,190,255,0)');
                ctx.fillStyle = aura;
                ctx.beginPath(); ctx.arc(fx, fy, frad + 14, Math.PI, Math.PI * 2); ctx.fill();

                // dome: stacked additive strokes for a soft glow (cheaper than shadowBlur)
                ctx.lineCap = 'round';
                var domeA = Math.min(1, (0.32 + 0.26 * fpulse) * mboost);
                [[9, 0.16], [5, 0.3], [2, 0.8]].forEach(function (layer) {
                    ctx.strokeStyle = 'rgba(150,238,255,' + (domeA * layer[1]).toFixed(3) + ')';
                    ctx.lineWidth = layer[0];
                    ctx.beginPath(); ctx.arc(fx, fy, frad, Math.PI, Math.PI * 2); ctx.stroke();
                });

                ctx.strokeStyle = 'rgba(210,248,255,' + Math.min(1, 0.7 + mlv * 0.1).toFixed(2) + ')';
                ctx.lineWidth = 1.3;
                var boltSpan = 5 * 0.14;
                for (var kb = 0; kb < 2 + mlv; kb++) {
                    // keep the whole zig-zag inside the top half of the dome
                    var a0 = Math.PI + (ft / 380 + kb * (Math.PI / 3)) % (Math.PI - boltSpan);
                    ctx.beginPath();
                    for (var sg = 0; sg <= 5; sg++) {
                        var aa = a0 + sg * 0.14;
                        var edge = Math.min(aa - Math.PI, Math.PI * 2 - aa) / boltSpan; // 0 at ends
                        var rr = frad + (Math.random() - 0.5) * 6 * Math.min(1, edge * 3);
                        var xx = fx + Math.cos(aa) * rr, yy = fy + Math.sin(aa) * rr;
                        sg ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy);
                    }
                    ctx.stroke();
                }
                ctx.restore();
            }

            // laser gun barrels — drawn BEHIND the paddle so their bases are hidden
            if (timers.laser) {
                gunX.forEach(function (gx) {
                    var gw = 7, gh = 12;
                    ctx.fillStyle = '#555';
                    ctx.fillRect(gx - gw / 2, py - gh, gw, gh + 6);
                    var gg = ctx.createLinearGradient(gx - gw / 2, 0, gx + gw / 2, 0);
                    gg.addColorStop(0, 'rgba(255,255,255,0.35)');
                    gg.addColorStop(0.5, 'rgba(255,255,255,0)');
                    gg.addColorStop(1, 'rgba(0,0,0,0.4)');
                    ctx.fillStyle = gg;
                    ctx.fillRect(gx - gw / 2, py - gh, gw, gh + 6);
                    ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = 1;
                    ctx.strokeRect(gx - gw / 2 + 0.5, py - gh + 0.5, gw - 1, gh + 5);
                });
            }

            // paddle body: flat colour + gloss/shadow gradient + border
            ctx.fillStyle = performance.now() < paddle.punchUntil ? '#ffb224'
                : timers.magnet ? '#00a8e8' : (timers.laser ? '#9c5cd4' : fg);
            rrect(px, py, pw, ph, ph / 2); ctx.fill();
            var pg = ctx.createLinearGradient(0, py, 0, py + ph);
            pg.addColorStop(0, 'rgba(255,255,255,0.45)');
            pg.addColorStop(0.5, 'rgba(255,255,255,0)');
            pg.addColorStop(1, 'rgba(0,0,0,0.28)');
            ctx.fillStyle = pg;
            rrect(px, py, pw, ph, ph / 2); ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(0,0,0,0.35)';
            rrect(px + 0.75, py + 0.75, pw - 1.5, ph - 1.5, ph / 2); ctx.stroke();

            // muzzle flashes — on top of everything
            if (timers.laser) {
                var flashT = performance.now() - lastFire;
                if (flashT < 110) {
                    var fade = 1 - flashT / 110;
                    gunX.forEach(function (gx) {
                        var my = py - 13, mr = 5 + 7 * fade;
                        var mg = ctx.createRadialGradient(gx, my, 0, gx, my, mr);
                        mg.addColorStop(0, 'rgba(255,246,214,' + (0.95 * fade).toFixed(3) + ')');
                        mg.addColorStop(0.4, 'rgba(255,180,60,' + (0.7 * fade).toFixed(3) + ')');
                        mg.addColorStop(1, 'rgba(255,120,20,0)');
                        ctx.fillStyle = mg;
                        ctx.beginPath(); ctx.arc(gx, my, mr, 0, Math.PI * 2); ctx.fill();
                    });
                }
            }

            balls.forEach(function (b) {
                if (timers.fire) {
                    var fgr = b.r * (2.1 + (timers.fire - 1) * 0.5);
                    var fg2 = ctx.createRadialGradient(b.x, b.y, b.r * 0.5, b.x, b.y, fgr);
                    fg2.addColorStop(0, 'rgba(247,104,8,' + (0.5 + timers.fire * 0.08).toFixed(2) + ')');
                    fg2.addColorStop(1, 'rgba(247,104,8,0)');
                    ctx.fillStyle = fg2;
                    ctx.beginPath(); ctx.arc(b.x, b.y, fgr, 0, Math.PI * 2); ctx.fill();
                }
                ctx.save();
                ctx.translate(b.x, b.y);
                ctx.beginPath(); ctx.arc(0, 0, b.r, 0, Math.PI * 2); ctx.clip();
                ctx.rotate(b.rot || 0);
                ctx.drawImage(avatar, -b.r, -b.r, b.r * 2, b.r * 2);
                ctx.restore();
                ctx.lineWidth = timers.fire ? 1.5 : 1;
                ctx.strokeStyle = timers.fire ? '#f76808' : 'rgba(127,127,127,0.55)';
                ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke();
            });

            // HUD
            ctx.fillStyle = fg;
            ctx.font = '600 13px "JetBrains Mono", ui-monospace, monospace';
            ctx.textBaseline = 'top';
            ctx.textAlign = 'left';
            ctx.fillText('SCORE ' + score, 16, 16);
            ctx.textAlign = 'center';
            ctx.fillText('BEST ' + Math.max(best, score), W / 2, 16);

            // controls hint, top-right
            ctx.textAlign = 'right';
            ctx.font = '600 11px "JetBrains Mono", ui-monospace, monospace';
            ctx.globalAlpha = 0.7;
            ctx.fillText(simple ? 'TAP TO QUIT' : 'ESC TO RELEASE MOUSE  ·  Q TO QUIT', W - 16, 17);
            ctx.globalAlpha = 1;
            ctx.font = '600 13px "JetBrains Mono", ui-monospace, monospace';

            if (!simple) {
                for (var i = 0; i < lives; i++) {
                    drawIcon('life', 23 + i * 18, 43, 14, '#e5484d');
                }
            }

            if ((state === 'serving' || state === 'entering') && !simple) {
                drawLegend(fg, bg);
                if (state === 'serving') {
                    // floats just above the paddle/ball and tracks it so it can't be missed
                    var lines = ['Q TO QUIT', 'ESC TO RELEASE MOUSE', 'CLICK TO SERVE'];
                    ctx.font = '600 14px "JetBrains Mono", ui-monospace, monospace';
                    var maxw = 0;
                    lines.forEach(function (t) { maxw = Math.max(maxw, ctx.measureText(t).width); });
                    var lh = 21, boxW = maxw + 28, boxH = lines.length * lh + 14;
                    var tx = clamp(paddle.x, boxW / 2 + 6, W - boxW / 2 - 6);
                    var boxTop = paddle.y + paddle.yOff - 26 - boxH;
                    ctx.globalAlpha = 0.85; ctx.fillStyle = bg;
                    rrect(tx - boxW / 2, boxTop, boxW, boxH, 8); ctx.fill();
                    ctx.globalAlpha = 1;
                    ctx.strokeStyle = 'rgba(127,127,127,0.3)'; ctx.lineWidth = 1;
                    rrect(tx - boxW / 2, boxTop, boxW, boxH, 8); ctx.stroke();
                    ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    lines.forEach(function (t, i) {
                        ctx.globalAlpha = t === 'CLICK TO SERVE' ? 1 : 0.65;
                        ctx.fillText(t, tx, boxTop + 12 + i * lh + lh / 2);
                    });
                    ctx.globalAlpha = 1;
                }
            } else if (state === 'serving') {
                center(fg, 'TAP TO SERVE', H / 2 + 70, 14);
                center(fg, 'KEEP IT UP — IT SPEEDS UP EACH BOUNCE', H / 2 + 94, 14);
            }

            var wantCursor = 'none';
            if (state === 'won' || state === 'lost') {
                wantCursor = 'default';
                ctx.globalAlpha = 0.78; ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
                center(fg, state === 'won' ? 'YOU WIN' : 'GAME OVER', H / 2 - 60, 32);
                center(fg, 'SCORE ' + score + '    BEST ' + Math.max(best, score), H / 2 - 22, 14);
            }

            if (state === 'won' && !simple) {
                var b = winButton();
                var hover = pointerX != null && pointerX >= b.x && pointerX <= b.x + b.w &&
                    pointerY >= b.y && pointerY <= b.y + b.h;
                wantCursor = hover ? 'pointer' : 'default';

                center(fg, 'THE PRIZE:', b.y - 22, 12);

                ctx.save();
                // base + glow
                ctx.shadowColor = 'rgba(245,184,0,' + (hover ? 0.85 : 0.5) + ')';
                ctx.shadowBlur = hover ? 34 : 20;
                var base = ctx.createLinearGradient(0, b.y, 0, b.y + b.h);
                base.addColorStop(0, '#ffd54a');
                base.addColorStop(0.5, '#f5b300');
                base.addColorStop(1, '#d98e00');
                ctx.fillStyle = base;
                rrect(b.x, b.y, b.w, b.h, 12); ctx.fill();
                ctx.shadowBlur = 0;

                // shimmer clipped to the button
                rrect(b.x, b.y, b.w, b.h, 12); ctx.clip();
                var st = (performance.now() % 1900) / 1900;
                var sx = b.x - b.w * 0.6 + st * (b.w * 2.2);
                var sg = ctx.createLinearGradient(sx - b.w * 0.35, 0, sx + b.w * 0.35, 0);
                sg.addColorStop(0, 'rgba(255,255,255,0)');
                sg.addColorStop(0.5, 'rgba(255,255,255,0.6)');
                sg.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = sg;
                ctx.fillRect(b.x, b.y, b.w, b.h);
                if (hover) {
                    var mg = ctx.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, 110);
                    mg.addColorStop(0, 'rgba(255,255,255,0.55)');
                    mg.addColorStop(1, 'rgba(255,255,255,0)');
                    ctx.fillStyle = mg;
                    ctx.fillRect(b.x, b.y, b.w, b.h);
                }
                // inner highlight / lower shade
                var gl = ctx.createLinearGradient(0, b.y, 0, b.y + b.h);
                gl.addColorStop(0, 'rgba(255,255,255,0.5)');
                gl.addColorStop(0.5, 'rgba(255,255,255,0)');
                gl.addColorStop(1, 'rgba(0,0,0,0.22)');
                ctx.fillStyle = gl;
                ctx.fillRect(b.x, b.y, b.w, b.h);
                ctx.restore();

                ctx.lineWidth = 1.5;
                ctx.strokeStyle = 'rgba(255,255,255,0.45)';
                rrect(b.x + 0.75, b.y + 0.75, b.w - 1.5, b.h - 1.5, 11); ctx.stroke();

                ctx.fillStyle = '#3a2200';
                ctx.font = '700 16px "JetBrains Mono", ui-monospace, monospace';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText('DOWNLOAD MY CV (PDF)', b.x + b.w / 2, b.y + b.h / 2 + 1);

                center(fg, 'or click anywhere for the next board  ·  Q to leave', b.y + b.h + 24, 11);
            } else if (state === 'lost') {
                center(fg, (simple ? 'TAP' : 'CLICK') + ' TO PLAY AGAIN' + (simple ? '' : '  ·  Q TO LEAVE'), H / 2 + 20, 12);
            }

            if (debug) drawDebug(fg);

            if (canvas && canvas.style.cursor !== wantCursor) canvas.style.cursor = wantCursor;
        }

        function drawDebug(fg) {
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.font = '600 10px "JetBrains Mono", ui-monospace, monospace';
            var x = 16, y = H - 20 - PU_LIST.length * 13;
            ctx.fillStyle = fg;
            ctx.globalAlpha = 0.85;
            ctx.fillText('DEBUG (` toggles · k clears bricks)', x, y);
            PU_LIST.forEach(function (t, i) {
                ctx.fillText(DEBUG_KEYS[i] + '  ' + PU_NAME[t], x, y + 14 + i * 13);
            });
            ctx.globalAlpha = 1;
        }

        function loop() {
            update();
            draw();
            raf = requestAnimationFrame(loop);
        }

        return { start: start, exit: exit };
    })();

    // ---------------------------------------------------------------- wiring
    avatar.addEventListener('click', function (e) {
        e.preventDefault();
        if (mode === 'idle') {
            mode = 'dvd';
            dvd.start();
        } else if (mode === 'dvd') {
            dvd.stop();
            mode = 'game';
            game.start();
        }
    });

    window.addEventListener('keydown', function (e) {
        if (mode === 'dvd' && e.key === 'Escape') {
            dvd.stop();
            homeAvatar();
            mode = 'idle';
        }
    });
})();
