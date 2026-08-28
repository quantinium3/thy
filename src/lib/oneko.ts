export type OnekoSkin = {
	id: string;
	label: string;
};

export const onekoSkins: OnekoSkin[] = [
	{ id: 'classic', label: 'neko' },
	{ id: 'tora', label: 'tora' },
	{ id: 'calico', label: 'calico' },
	{ id: 'black', label: 'black' },
	{ id: 'gray', label: 'gray' },
	{ id: 'silver', label: 'silver' },
	{ id: 'silversky', label: 'silversky' },
	{ id: 'mike', label: 'mike' },
	{ id: 'maria', label: 'maria' },
	{ id: 'esmeralda', label: 'esmeralda' },
	{ id: 'jess', label: 'jess' },
	{ id: 'kina', label: 'kina' },
	{ id: 'lucy', label: 'lucy' },
	{ id: 'maia', label: 'maia' },
	{ id: 'ace', label: 'ace' },
	{ id: 'snuupy', label: 'snuupy' },
	{ id: 'spirit', label: 'spirit' },
	{ id: 'valentine', label: 'valentine' },
	{ id: 'ghost', label: 'ghost' },
	{ id: 'bunny', label: 'bunny' },
	{ id: 'fox', label: 'fox' },
	{ id: 'eevee', label: 'eevee' }
];

/** Sheets are an 8x4 grid of 32x32 tiles. */
const TILE = 32;
const SHEET_COLS = 8;
const SHEET_ROWS = 4;

type Frame = readonly [number, number];

/** The sprite sets with more than one frame, so a swatch has something to animate to. */
const ANIMATED_POSES: Record<string, readonly [Frame, Frame]> = {
	scratchSelf: [
		[-5, 0],
		[-6, 0]
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

const POSE_NAMES = Object.keys(ANIMATED_POSES);
let unusedPoses: string[] = [];

/**
 * A random two-frame pose, cycling through every pose before any repeats — so each
 * time the picker opens the swatches strike a different one.
 */
export function nextSwatchPose(): readonly [Frame, Frame] {
	if (unusedPoses.length === 0) unusedPoses = [...POSE_NAMES];
	const [name] = unusedPoses.splice(Math.floor(Math.random() * unusedPoses.length), 1);
	return ANIMATED_POSES[name];
}

/**
 * Inline styles for one picker swatch: the sheet cropped to `pose` frame 1, with frame 2
 * exposed as custom properties so CSS can swap to it on hover.
 */
export function onekoSwatchStyle(id: string, pose: readonly [Frame, Frame], scale = 1.5): string {
	const tile = TILE * scale;
	const [rest, active] = pose;
	return [
		`background-image: url(${onekoSkinUrl(id)})`,
		`background-size: ${SHEET_COLS * tile}px ${SHEET_ROWS * tile}px`,
		`--rest-x: ${rest[0] * tile}px`,
		`--rest-y: ${rest[1] * tile}px`,
		`--active-x: ${active[0] * tile}px`,
		`--active-y: ${active[1] * tile}px`
	].join('; ');
}

export function onekoSkinUrl(id: string): string {
	return id === 'classic' ? '/oneko/oneko.gif' : `/oneko/skins/${id}.png`;
}

declare global {
	interface Window {
		oneko?: {
			getSkin(): string;
			setSkin(id: string): void;
			getKuro(): boolean;
			setKuro(on: boolean): void;
		};
	}
}
