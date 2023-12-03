export function lerp(v0, v1, t) {
	return v0 * (1 - t) + v1 * t;
}
export function clamp(val, min, max) {
	return Math.min(Math.max(val, min), max);
}