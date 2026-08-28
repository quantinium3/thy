// oneko.js: https://github.com/adryd325/oneko.js

(function oneko() {
	const isReducedMotion =
		window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
		window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

	if (isReducedMotion) return;

	const nekoEl = document.createElement('div');

	let nekoPosX = 64;
	let nekoPosY = 64;

	let mousePosX = 16;
	let mousePosY = 16;

	let frameCount = 0;
	let idleTime = 0;
	let idleAnimation = null;
	let idleAnimationFrame = 0;

	let grabbing = false;
	let grabStop = true;
	let dragged = false;
	let nudge = false;
	let nudgeFrame = 0;
	let kuroNeko = false;

	const nekoSpeed = 10;
	const spriteSets = {
		idle: [[-3, -3]],
		alert: [[-7, -3]],
		scratchSelf: [
			[-5, 0],
			[-6, 0],
			[-7, 0]
		],
		scratchWallN: [
			[0, 0],
			[0, -1]
		],
		scratchWallS: [
			[-7, -1],
			[-6, -2]
		],
		scratchWallE: [
			[-2, -2],
			[-2, -3]
		],
		scratchWallW: [
			[-4, 0],
			[-4, -1]
		],
		tired: [[-3, -2]],
		sleeping: [
			[-2, 0],
			[-2, -1]
		],
		N: [
			[-1, -2],
			[-1, -3]
		],
		NE: [
			[0, -2],
			[0, -3]
		],
		E: [
			[-3, 0],
			[-3, -1]
		],
		SE: [
			[-5, -1],
			[-5, -2]
		],
		S: [
			[-6, -3],
			[-7, -2]
		],
		SW: [
			[-5, -3],
			[-6, -1]
		],
		W: [
			[-4, -2],
			[-4, -3]
		],
		NW: [
			[-1, 0],
			[-1, -1]
		]
	};

	const SKIN_KEY = 'oneko-skin';
	const DEFAULT_SKIN = 'classic';
	let classicFile = './oneko.gif';
	let skinBase = '/oneko/skins';

	function skinUrl(id) {
		return id === DEFAULT_SKIN ? classicFile : `${skinBase}/${id}.png`;
	}

	function readSkin() {
		try {
			return localStorage.getItem(SKIN_KEY) || DEFAULT_SKIN;
		} catch {
			return DEFAULT_SKIN;
		}
	}

	const KURO_KEY = 'oneko-kuro';

	function readKuro() {
		try {
			return localStorage.getItem(KURO_KEY) === 'true';
		} catch {
			return false;
		}
	}

	function applyKuro(on) {
		kuroNeko = on;
		nekoEl.style.filter = on ? 'invert(100%)' : '';
	}

	function applySkin(id) {
		nekoEl.style.display = id === 'none' ? 'none' : '';
		if (id !== 'none') {
			nekoEl.style.backgroundImage = `url(${skinUrl(id)})`;
		}
	}

	function init() {
		nekoEl.id = 'oneko';
		nekoEl.ariaHidden = true;
		nekoEl.style.width = '32px';
		nekoEl.style.height = '32px';
		nekoEl.style.position = 'fixed';
		nekoEl.style.pointerEvents = 'auto';
		nekoEl.style.imageRendering = 'pixelated';
		nekoEl.style.left = `${nekoPosX - 16}px`;
		nekoEl.style.top = `${nekoPosY - 16}px`;
		nekoEl.style.zIndex = Number.MAX_VALUE;

		const curScript = document.currentScript;
		if (curScript) {
			if (curScript.dataset.cat) classicFile = curScript.dataset.cat;
			if (curScript.dataset.skins) skinBase = curScript.dataset.skins;
		}
		applySkin(readSkin());
		applyKuro(readKuro());

		window.oneko = {
			getSkin: readSkin,
			setSkin(id) {
				try {
					localStorage.setItem(SKIN_KEY, id);
				} catch {
					/* private mode, skin just won't persist */
				}
				applySkin(id);
			},
			getKuro: readKuro,
			setKuro(on) {
				try {
					localStorage.setItem(KURO_KEY, String(on));
				} catch {
					/* private mode, kuroneko just won't persist */
				}
				applyKuro(on);
			}
		};

		document.body.appendChild(nekoEl);

		window.dispatchEvent(new CustomEvent('oneko:ready'));

		document.addEventListener('mousemove', function(event) {
			mousePosX = event.clientX;
			mousePosY = event.clientY;
		});

		nekoEl.addEventListener('mousedown', function(event) {
			if (event.button !== 0) return;
			event.preventDefault();

			grabbing = true;
			dragged = false;
			const wasSleeping = idleAnimation === 'sleeping';
			let startX = event.clientX;
			let startY = event.clientY;
			let startNekoX = nekoPosX;
			let startNekoY = nekoPosY;
			let grabTimer;

			function onDragMove(event) {
				const deltaX = event.clientX - startX;
				const deltaY = event.clientY - startY;
				const absDeltaX = Math.abs(deltaX);
				const absDeltaY = Math.abs(deltaY);

				if (absDeltaX > 3 || absDeltaY > 3) dragged = true;

				// Scratch against the direction she's being pulled.
				if (absDeltaX > absDeltaY && absDeltaX > 10) {
					setSprite(deltaX > 0 ? 'scratchWallW' : 'scratchWallE', frameCount);
				} else if (absDeltaY > absDeltaX && absDeltaY > 10) {
					setSprite(deltaY > 0 ? 'scratchWallN' : 'scratchWallS', frameCount);
				}

				// Re-anchor the drag origin once she settles, so a long drag stays responsive.
				if (grabStop || absDeltaX > 10 || absDeltaY > 10) {
					grabStop = false;
					clearTimeout(grabTimer);
					grabTimer = setTimeout(function() {
						grabStop = true;
						startX = event.clientX;
						startY = event.clientY;
						startNekoX = nekoPosX;
						startNekoY = nekoPosY;
					}, 150);
				}

				nekoPosX = Math.min(Math.max(16, startNekoX + deltaX), window.innerWidth - 16);
				nekoPosY = Math.min(Math.max(16, startNekoY + deltaY), window.innerHeight - 16);
				nekoEl.style.left = `${nekoPosX - 16}px`;
				nekoEl.style.top = `${nekoPosY - 16}px`;
			}

			function onDragEnd() {
				grabbing = false;
				clearTimeout(grabTimer);
				grabStop = true;
				// Woken up mid-nap: show the awake face for a beat before she can doze off again.
				if (wasSleeping && dragged) {
					nudge = true;
					nudgeFrame = 0;
				}
				resetIdleAnimation();
				window.removeEventListener('mousemove', onDragMove);
				window.removeEventListener('mouseup', onDragEnd);
			}

			window.addEventListener('mousemove', onDragMove);
			window.addEventListener('mouseup', onDragEnd);
		});

		nekoEl.addEventListener('contextmenu', function(event) {
			event.preventDefault();
			window.oneko.setKuro(!kuroNeko);
		});

		window.requestAnimationFrame(onAnimationFrame);
	}

	let lastFrameTimestamp;

	function onAnimationFrame(timestamp) {
		if (!nekoEl.isConnected) {
			return;
		}
		if (!lastFrameTimestamp) {
			lastFrameTimestamp = timestamp;
		}
		if (timestamp - lastFrameTimestamp > 100) {
			lastFrameTimestamp = timestamp;
			frame();
		}
		window.requestAnimationFrame(onAnimationFrame);
	}

	function setSprite(name, frame) {
		const sprite = spriteSets[name][frame % spriteSets[name].length];
		nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
	}

	function resetIdleAnimation() {
		idleAnimation = null;
		idleAnimationFrame = 0;
	}

	function idle() {
		idleTime += 1;

		if (nudge) {
			setSprite('idle', 0);
			nudgeFrame += 1;
			if (nudgeFrame > 8) {
				nudge = false;
				nudgeFrame = 0;
			}
			return;
		}

		if (idleTime > 10 && Math.floor(Math.random() * 200) == 0 && idleAnimation == null) {
			let avalibleIdleAnimations = ['sleeping', 'scratchSelf'];
			if (nekoPosX < 32) {
				avalibleIdleAnimations.push('scratchWallW');
			}
			if (nekoPosY < 32) {
				avalibleIdleAnimations.push('scratchWallN');
			}
			if (nekoPosX > window.innerWidth - 32) {
				avalibleIdleAnimations.push('scratchWallE');
			}
			if (nekoPosY > window.innerHeight - 32) {
				avalibleIdleAnimations.push('scratchWallS');
			}
			idleAnimation =
				avalibleIdleAnimations[Math.floor(Math.random() * avalibleIdleAnimations.length)];
		}

		switch (idleAnimation) {
			case 'sleeping':
				if (idleAnimationFrame < 8) {
					setSprite('tired', 0);
					break;
				}
				setSprite('sleeping', Math.floor(idleAnimationFrame / 4));
				if (idleAnimationFrame > 192) {
					resetIdleAnimation();
				}
				break;
			case 'scratchWallN':
			case 'scratchWallS':
			case 'scratchWallE':
			case 'scratchWallW':
			case 'scratchSelf':
				setSprite(idleAnimation, idleAnimationFrame);
				if (idleAnimationFrame > 9) {
					resetIdleAnimation();
				}
				break;
			default:
				setSprite('idle', 0);
				return;
		}
		idleAnimationFrame += 1;
	}

	function explodeHearts() {
		const parent = nekoEl.parentElement;
		const rect = nekoEl.getBoundingClientRect();
		const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const centerX = rect.left + rect.width / 2 + scrollLeft;
		const centerY = rect.top + rect.height / 2 + scrollTop;

		for (let i = 0; i < 10; i++) {
			const heart = document.createElement('div');
			heart.className = 'heart';
			heart.textContent = '❤';
			const offsetX = (Math.random() - 0.5) * 50;
			const offsetY = (Math.random() - 0.5) * 50;
			heart.style.left = `${centerX + offsetX - 16}px`;
			heart.style.top = `${centerY + offsetY - 16}px`;
			heart.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
			parent.appendChild(heart);

			setTimeout(() => {
				parent.removeChild(heart);
			}, 1000);
		}
	}

	const style = document.createElement('style');
	style.innerHTML = `
          @keyframes heartBurst {
              0% { transform: scale(0); opacity: 1; }
              100% { transform: scale(1); opacity: 0; }
          }
          .heart {
              position: absolute;
              font-size: 2em;
              animation: heartBurst 1s ease-out;
              animation-fill-mode: forwards;
              color: #ab9df2;
          }
      `;

	document.head.appendChild(style);
	nekoEl.addEventListener('click', function() {
		if (dragged) {
			dragged = false;
			return;
		}
		explodeHearts();
	});

	function frame() {
		frameCount += 1;

		if (grabbing) {
			if (grabStop) setSprite('alert', 0);
			return;
		}

		const diffX = nekoPosX - mousePosX;
		const diffY = nekoPosY - mousePosY;
		const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

		if (distance < nekoSpeed || distance < 48) {
			idle();
			return;
		}

		idleAnimation = null;
		idleAnimationFrame = 0;

		if (idleTime > 1) {
			setSprite('alert', 0);
			idleTime = Math.min(idleTime, 7);
			idleTime -= 1;
			return;
		}

		let direction;
		direction = diffY / distance > 0.5 ? 'N' : '';
		direction += diffY / distance < -0.5 ? 'S' : '';
		direction += diffX / distance > 0.5 ? 'W' : '';
		direction += diffX / distance < -0.5 ? 'E' : '';
		setSprite(direction, frameCount);

		nekoPosX -= (diffX / distance) * nekoSpeed;
		nekoPosY -= (diffY / distance) * nekoSpeed;

		nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
		nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

		nekoEl.style.left = `${nekoPosX - 16}px`;
		nekoEl.style.top = `${nekoPosY - 16}px`;
	}

	init();
})();
