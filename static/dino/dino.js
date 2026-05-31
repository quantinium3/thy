(function (global) {
	const CONFIG = {
		settings: {
			bgSpeed: 8,
			birdSpeed: 7.2,
			birdSpawnRate: 240,
			birdWingsRate: 15,
			cactiSpawnRate: 50,
			cloudSpawnRate: 200,
			cloudSpeed: 2,
			dinoGravity: 0.5,
			dinoGroundOffset: 4,
			dinoLegsRate: 6,
			dinoLift: 10,
			scoreIncreaseRate: 6
		},
		sprites: {
			birdUp: { h: 52, w: 84, x: 708, y: 31 },
			birdDown: { h: 60, w: 84, x: 708, y: 85 },
			cactus: { h: 92, w: 46, x: 70, y: 31 },
			cactusDouble: { h: 66, w: 64, x: 118, y: 31 },
			cactusDoubleB: { h: 92, w: 80, x: 184, y: 31 },
			cactusTriple: { h: 66, w: 82, x: 266, y: 31 },
			cloud: { h: 28, w: 92, x: 794, y: 31 },
			dino: { h: 86, w: 80, x: 350, y: 31 },
			dinoDuckLeftLeg: { h: 52, w: 110, x: 596, y: 31 },
			dinoDuckRightLeg: { h: 52, w: 110, x: 596, y: 85 },
			dinoLeftLeg: { h: 86, w: 80, x: 432, y: 31 },
			dinoRightLeg: { h: 86, w: 80, x: 514, y: 31 },
			ground: { h: 28, w: 2400, x: 0, y: 2 },
			replayIcon: { h: 60, w: 68, x: 0, y: 31 }
		}
	};

	function randInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function randBoolean() {
		return Boolean(randInteger(0, 1));
	}

	function randItem(arr) {
		return arr[randInteger(0, arr.length - 1)];
	}

	function createSoundSystem(assetPath) {
		const AudioCtx = global.AudioContext || global['webkitAudioContext'];
		if (!AudioCtx) return { playSound: () => {} };

		const audioContext = new AudioCtx();
		const soundNames = ['game-over', 'jump', 'level-up'];
		const soundBuffers = {};
		let loaded = false;

		Promise.all(
			soundNames.map(async (name) => {
				soundBuffers[name] = await loadBuffer(`${assetPath}/${name}.mp3`);
			})
		)
			.then(() => {
				loaded = true;
			})
			.catch(() => {});

		function loadBuffer(filepath) {
			return new Promise((resolve, reject) => {
				const req = new XMLHttpRequest();
				req.open('GET', filepath);
				req.responseType = 'arraybuffer';
				req.onload = () => audioContext.decodeAudioData(req.response, resolve);
				req.onerror = reject;
				req.send();
			});
		}

		function playBuffer(buffer) {
			const source = audioContext.createBufferSource();
			source.buffer = buffer;
			source.connect(audioContext.destination);
			source.start();
		}

		return {
			playSound(name) {
				if (loaded) {
					audioContext.resume();
					playBuffer(soundBuffers[name]);
				}
			}
		};
	}

	const alphaCache = new Map();

	function getSpriteAlphaMap(image, name) {
		if (alphaCache.has(name)) return alphaCache.get(name);

		const sprite = CONFIG.sprites[name];
		const lines = [];
		const initIVal = image.width * sprite.y * 4;

		for (let i = initIVal; i < initIVal + sprite.h * image.width * 4; i += image.width * 8) {
			const line = [];
			const initJVal = i + sprite.x * 4;
			for (let j = initJVal; j < initJVal + sprite.w * 4; j += 8) {
				line.push(image.pixels[j + 3] === 0 ? 0 : 1);
			}
			lines.push(line);
		}

		alphaCache.set(name, lines);
		return lines;
	}

	class Actor {
		constructor(spriteImage) {
			this._sprite = null;
			this.height = 0;
			this.width = 0;
			this.x = 0;
			this.y = 0;

			if (spriteImage) {
				this.spriteImage = spriteImage;
				this.alphaMap = [];
			}
		}

		set sprite(name) {
			this._sprite = name;
			this.height = CONFIG.sprites[name].h / 2;
			this.width = CONFIG.sprites[name].w / 2;
			if (this.spriteImage) {
				this.alphaMap = getSpriteAlphaMap(this.spriteImage, name);
			}
		}

		get sprite() {
			return this._sprite;
		}
		get rightX() {
			return this.width + this.x;
		}
		get bottomY() {
			return this.height + this.y;
		}

		hits(actors) {
			return actors.some((actor) => {
				if (!actor) return false;
				if (this.x >= actor.rightX || actor.x >= this.rightX) return false;
				if (this.y >= actor.bottomY || actor.y >= this.bottomY) return false;

				if (this.alphaMap && actor.alphaMap) {
					const startY = Math.round(Math.max(this.y, actor.y));
					const endY = Math.round(Math.min(this.bottomY, actor.bottomY));
					const startX = Math.round(Math.max(this.x, actor.x));
					const endX = Math.round(Math.min(this.rightX, actor.rightX));
					const thisY = Math.round(this.y);
					const actorY = Math.round(actor.y);
					const thisX = Math.round(this.x);
					const actorX = Math.round(actor.x);

					for (let y = startY; y < endY; y++) {
						for (let x = startX; x < endX; x++) {
							if (this.alphaMap[y - thisY][x - thisX] === 0) continue;
							if (actor.alphaMap[y - actorY][x - actorX] === 0) continue;
							return true;
						}
					}
					return false;
				}

				return true;
			});
		}
	}

	class Dino extends Actor {
		constructor(spriteImage) {
			super(spriteImage);
			this.isDucking = false;
			this.legFrames = 0;
			this.legShowing = 'Left';
			this.sprite = `dino${this.legShowing}Leg`;
			this.vVelocity = null;
			this.baseY = 0;
			this.relativeY = 0;
		}

		get y() {
			return this.baseY - this.height + this.relativeY;
		}
		set y(value) {
			this.baseY = value;
		}

		reset() {
			this.isDucking = false;
			this.legFrames = 0;
			this.legShowing = 'Left';
			this.sprite = `dino${this.legShowing}Leg`;
			this.vVelocity = null;
			this.relativeY = 0;
		}

		jump() {
			if (this.relativeY === 0) {
				this.vVelocity = -CONFIG.settings.dinoLift;
				return true;
			}
			return false;
		}

		duck(value) {
			this.isDucking = Boolean(value);
		}

		nextFrame() {
			if (this.vVelocity !== null) {
				this.vVelocity += CONFIG.settings.dinoGravity;
				this.relativeY += this.vVelocity;
			}
			if (this.relativeY > 0) {
				this.vVelocity = null;
				this.relativeY = 0;
			}
			this.determineSprite();
		}

		determineSprite() {
			if (this.relativeY < 0) {
				this.sprite = 'dino';
			} else {
				if (this.legFrames >= CONFIG.settings.dinoLegsRate) {
					this.legShowing = this.legShowing === 'Left' ? 'Right' : 'Left';
					this.legFrames = 0;
				}
				this.sprite = this.isDucking
					? `dinoDuck${this.legShowing}Leg`
					: `dino${this.legShowing}Leg`;
				this.legFrames++;
			}
		}
	}

	class Bird extends Actor {
		static maxBirdHeight = Math.max(CONFIG.sprites.birdUp.h, CONFIG.sprites.birdDown.h) / 2;
		static wingSpriteYShift = 6;

		constructor(spriteImage) {
			super(spriteImage);
			this.wingFrames = 0;
			this.wingDirection = 'Up';
			this.sprite = `bird${this.wingDirection}`;
		}

		nextFrame() {
			this.x -= CONFIG.settings.birdSpeed;
			this.determineSprite();
		}

		determineSprite() {
			const oldHeight = this.height;
			if (this.wingFrames >= CONFIG.settings.birdWingsRate) {
				this.wingDirection = this.wingDirection === 'Up' ? 'Down' : 'Up';
				this.wingFrames = 0;
			}
			this.sprite = `bird${this.wingDirection}`;
			this.wingFrames++;
			if (this.height !== oldHeight) {
				let adj = Bird.wingSpriteYShift;
				if (this.wingDirection === 'Up') adj *= -1;
				this.y += adj;
			}
		}
	}

	const CACTUS_VARIANTS = ['cactus', 'cactusDouble', 'cactusDoubleB', 'cactusTriple'];

	class Cactus extends Actor {
		constructor(spriteImage) {
			super(spriteImage);
			this.sprite = randItem(CACTUS_VARIANTS);
		}
		nextFrame() {
			this.x -= CONFIG.settings.bgSpeed;
		}
	}

	class Cloud extends Actor {
		constructor() {
			super();
			this.sprite = 'cloud';
			this.speedMod = randInteger(6, 14) / 10;
		}
		nextFrame() {
			this.x -= CONFIG.settings.cloudSpeed * this.speedMod;
		}
	}

	function loadP5(cb) {
		if (global.p5) return cb();
		const s = document.createElement('script');
		s.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/p5.min.js';
		s.onload = cb;
		document.head.appendChild(s);
	}

	function createGame(container, assetPath, fontPath) {
		const cfg = JSON.parse(JSON.stringify(CONFIG));
		const SETTINGS_BACKUP = { ...cfg.settings };
		const sounds = createSoundSystem(assetPath);

		alphaCache.clear();

		new global.p5((p5) => {
			const STATE = {
				birds: [],
				cacti: [],
				clouds: [],
				dino: null,
				gameOver: false,
				groundX: 0,
				groundY: 0,
				isRunning: false,
				level: 0,
				score: 0,
				highScore: parseInt(localStorage.getItem('dino-high-score') || '0', 10)
			};

			let PressStartFont, spriteImage;

			function paintSprite(spriteName, ...coords) {
				const { h, w, x, y } = cfg.sprites[spriteName];
				p5.image.apply(p5, [spriteImage, ...coords, w / 2, h / 2, x, y, w, h]);
			}

			function resetGame() {
				STATE.dino.reset();
				Object.assign(STATE, {
					birds: [],
					cacti: [],
					gameOver: false,
					isRunning: true,
					level: 0,
					score: 0
				});
				Object.assign(cfg.settings, SETTINGS_BACKUP);
				p5.loop();
			}

			function endGame() {
				const iconSprite = cfg.sprites.replayIcon;
				const padding = 15;

				p5.fill(isDark() ? '#a1a1aa' : '#535353');
				p5.textAlign(p5.CENTER);
				p5.textFont(PressStartFont);
				p5.textSize(12);
				p5.text('G A M E  O V E R', p5.width / 2, p5.height / 2 - p5.textSize() / 2 - padding);
				paintSprite(
					'replayIcon',
					p5.width / 2 - iconSprite.w / 4,
					p5.height / 2 - iconSprite.h / 4 + padding
				);

				STATE.isRunning = false;
				p5.noLoop();
			}

			function increaseDifficulty() {
				const { settings } = cfg;
				const { bgSpeed, cactiSpawnRate, dinoLegsRate } = settings;
				const { level } = STATE;

				if (level > 4 && level < 8) {
					settings.bgSpeed++;
					settings.birdSpeed = settings.bgSpeed * 0.8;
				} else if (level > 7) {
					settings.bgSpeed = Math.ceil(bgSpeed * 1.1);
					settings.birdSpeed = settings.bgSpeed * 0.9;
					settings.cactiSpawnRate = Math.floor(cactiSpawnRate * 0.98);
					if (level % 2 === 0 && dinoLegsRate > 3) settings.dinoLegsRate--;
				}
			}

			function updateScore() {
				if (p5.frameCount % cfg.settings.scoreIncreaseRate === 0) {
					const oldLevel = STATE.level;
					STATE.score++;
					STATE.level = Math.floor(STATE.score / 100);
					if (STATE.level !== oldLevel) {
						sounds.playSound('level-up');
						increaseDifficulty();
					}
				}
			}

			function progressInstances(instances) {
				for (let i = instances.length - 1; i >= 0; i--) {
					const inst = instances[i];
					inst.nextFrame();
					if (inst.rightX <= 0) instances.splice(i, 1);
				}
			}

			function paintInstances(instances) {
				for (const inst of instances) paintSprite(inst.sprite, inst.x, inst.y);
			}

			function drawGround() {
				const { bgSpeed } = cfg.settings;
				const groundImgWidth = cfg.sprites.ground.w / 2;

				paintSprite('ground', STATE.groundX, STATE.groundY);
				STATE.groundX -= bgSpeed;

				if (STATE.groundX <= -groundImgWidth + p5.width) {
					paintSprite('ground', STATE.groundX + groundImgWidth, STATE.groundY);
					if (STATE.groundX <= -groundImgWidth) STATE.groundX = -bgSpeed;
				}
			}

			function drawClouds() {
				progressInstances(STATE.clouds);
				if (p5.frameCount % cfg.settings.cloudSpawnRate === 0) {
					const c = new Cloud();
					c.x = p5.width;
					c.y = randInteger(20, 80);
					STATE.clouds.push(c);
				}
				paintInstances(STATE.clouds);
			}

			function drawDino() {
				STATE.dino.nextFrame();
				paintSprite(STATE.dino.sprite, STATE.dino.x, STATE.dino.y);
			}

			function drawCacti() {
				progressInstances(STATE.cacti);
				if (p5.frameCount % cfg.settings.cactiSpawnRate === 0) {
					if (!STATE.birds.length && randBoolean()) {
						const c = new Cactus(spriteImage);
						c.x = p5.width;
						c.y = p5.height - c.height - 2;
						STATE.cacti.push(c);
					}
				}
				paintInstances(STATE.cacti);
			}

			function drawScore() {
				const col = isDark() ? '#a1a1aa' : '#535353';
				const dimCol = isDark() ? '#52525b' : '#aaaaaa';
				p5.textFont(PressStartFont);
				p5.textSize(12);
				p5.textAlign(p5.RIGHT);

				const current = (STATE.score + '').padStart(5, '0');
				const hi = (STATE.highScore + '').padStart(5, '0');
				const gap = 16;

				p5.fill(col);
				p5.text(current, p5.width, p5.textSize());

				p5.fill(col);
				p5.text(hi, p5.width - p5.textWidth(current) - gap, p5.textSize());

				p5.fill(dimCol);
				p5.text('HI', p5.width - p5.textWidth(current) - gap - p5.textWidth(hi) - 8, p5.textSize());
			}

			function drawBirds() {
				progressInstances(STATE.birds);
				if (p5.frameCount % cfg.settings.birdSpawnRate === 0 && randBoolean()) {
					const b = new Bird(spriteImage);
					b.x = p5.width;
					b.y =
						p5.height -
						Bird.maxBirdHeight -
						Bird.wingSpriteYShift -
						5 -
						cfg.sprites.dinoDuckLeftLeg.h / 2 -
						cfg.settings.dinoGroundOffset;
					STATE.birds.push(b);
				}
				paintInstances(STATE.birds);
			}

			p5.preload = () => {
				PressStartFont = p5.loadFont(fontPath);
				spriteImage = p5.loadImage(`${assetPath}/sprite.png`);
			};

			p5.setup = () => {
				const canvas = p5.createCanvas(container.offsetWidth, 150);
				spriteImage.loadPixels();

				const dino = new Dino(spriteImage);
				dino.x = 25;
				dino.baseY = p5.height - cfg.settings.dinoGroundOffset;
				STATE.dino = dino;
				STATE.groundY = p5.height - cfg.sprites.ground.h / 2;
				p5.noLoop();

				canvas.mouseClicked(() => {
					if (STATE.gameOver) resetGame();
				});
			};

			p5.windowResized = () => {
				p5.resizeCanvas(container.offsetWidth, 150);
				STATE.groundY = p5.height - cfg.sprites.ground.h / 2;
				if (STATE.dino) {
					STATE.dino.baseY = p5.height - cfg.settings.dinoGroundOffset;
				}
			};

			function isDark() {
				return document.documentElement.classList.contains('dark');
			}

			function withInvert(fn) {
				if (isDark()) p5.drawingContext.filter = 'invert(1)';
				fn();
				p5.drawingContext.filter = 'none';
			}

			p5.draw = () => {
				p5.background(isDark() ? '#1A1A1A' : '#FFFFFF');
				drawGround();
				drawClouds();
				withInvert(drawDino);
				withInvert(drawCacti);
				drawScore();

				if (STATE.level > 3) withInvert(drawBirds);

				if (STATE.dino.hits([STATE.cacti[0], STATE.birds[0]])) {
					sounds.playSound('game-over');
					STATE.gameOver = true;
					if (STATE.score > STATE.highScore) {
						STATE.highScore = STATE.score;
						localStorage.setItem('dino-high-score', STATE.highScore);
					}
				}

				if (STATE.gameOver) endGame();
				else updateScore();
			};

			p5.keyPressed = () => {
				if (p5.key === ' ' || p5.keyCode === p5.UP_ARROW) {
					if (STATE.isRunning) {
						if (STATE.dino.jump()) sounds.playSound('jump');
					} else {
						resetGame();
						STATE.dino.jump();
					}
				} else if (p5.keyCode === p5.DOWN_ARROW && STATE.isRunning) {
					STATE.dino.duck(true);
				}
			};

			p5.keyReleased = () => {
				if (p5.keyCode === p5.DOWN_ARROW) STATE.dino.duck(false);
			};

			let touchStartY = 0;

			container.addEventListener('touchstart', (e) => {
				e.preventDefault();
				touchStartY = e.touches[0].clientY;
				if (STATE.isRunning) {
					if (STATE.dino.jump()) sounds.playSound('jump');
				} else {
					resetGame();
					STATE.dino.jump();
				}
			}, { passive: false });

			container.addEventListener('touchmove', (e) => {
				e.preventDefault();
				if (!STATE.isRunning) return;
				if (e.touches[0].clientY - touchStartY > 30) STATE.dino.duck(true);
			}, { passive: false });

			container.addEventListener('touchend', (e) => {
				e.preventDefault();
				STATE.dino.duck(false);
			}, { passive: false });
		}, container);
	}

	const DinoGame = {
		init(target, options = {}) {
			const container = typeof target === 'string' ? document.getElementById(target) : target;
			if (!container) {
				console.error('[DinoGame] container not found:', target);
				return;
			}
			const assetPath = (options.assetPath || '/dino').replace(/\/$/, '');
			const fontPath = options.fontPath || '/Menlo-Regular.ttf';
			loadP5(() => createGame(container, assetPath, fontPath));
		}
	};

	global.DinoGame = DinoGame;

	function autoInit() {
		document.querySelectorAll('[data-dino-game]').forEach((el) =>
			DinoGame.init(el, {
				assetPath: el.dataset.assetPath,
				fontPath: el.dataset.fontPath
			})
		);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', autoInit);
	} else {
		autoInit();
	}
})(window);
