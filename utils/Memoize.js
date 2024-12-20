module.exports = class {
	#fn = () => null;
	#map = new Map();

	constructor(fn) {
		this.#fn = fn;
	}

	get(k) {
		if (this.#map.has(k)) {
			return this.#map.get(k);
		}
		this.#map.set(k, this.#fn(k));
		return this.get(k);
	}
};
