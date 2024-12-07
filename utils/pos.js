const util = require('util');

class Pos {
	static #instances = new Map();

	#x = undefined;
	#y = undefined;

	constructor(x = 0, y = 0) {
		if (Array.isArray(x)) {
			this.#x = x[0] ?? 0;
			this.#y = x[1] ?? 0;
		} else {
			this.#x = x;
			this.#y = y;
		}

		const key = this.toString();
		if (Pos.#instances.has(key)) {
			return Pos.#instances.get(key);
		}
		Pos.#instances.set(key, this);

		Object.freeze(this);
	}

	neigbors4() {
		return [
			new Pos(this.x,     this.y - 1),
			new Pos(this.x - 1, this.y    ),
			new Pos(this.x + 1, this.y    ),
			new Pos(this.x,     this.y + 1),
		];
	}
	neigbors8() {
		return [
			new Pos(this.x - 1, this.y - 1),
			new Pos(this.x,     this.y - 1),
			new Pos(this.x + 1, this.y - 1),
			new Pos(this.x - 1, this.y    ),
			new Pos(this.x + 1, this.y    ),
			new Pos(this.x - 1, this.y + 1),
			new Pos(this.x,     this.y + 1),
			new Pos(this.x + 1, this.y + 1),
		];
	}

	add(x, y) {
		return new Pos(this.x + x, this.y + y);
	}

	get x() {
		return this.#x;
	}
	set x(x) {
		return new Pos(this.x + x, this.y);
	}

	get y() {
		return this.#y;
	}
	set y(y) {
		return new Pos(this.x, this.y + y);
	}

	inBounds(bounds) {
		return [ this.x, this.y ].every((c, i) => Array.isArray(bounds[i]) ? 
			bounds[i][0] <= c && c <= bounds[i][1] :
			0 <= c && c < bounds[i]);
	}

	toString() {
		return `Pos[${this.x};${this.y}]`;
	}

	[util.inspect.custom]() {
		return this.toString();
	}
}

class PosRot {
	static N = Symbol.for("N");
	static S = Symbol.for("S");
	static E = Symbol.for("E");
	static W = Symbol.for("W");
	static Up = PosRot.N;
	static Down = PosRot.S;
	static Right = PosRot.E;
	static Left = PosRot.W;

	static #instances = new Map();

	#p = undefined;
	#r = undefined;

	constructor(x, y, r) {
		if (x instanceof Pos) {
			this.#p = x ?? new Pos();
			this.#r = y ?? PosRot.N;
		} else if (Array.isArray(x)) {
			this.#p = new Pos(x ?? []);
			this.#r = y ?? PosRot.N;
		} else {
			this.#p = new Pos(x ?? 0, y ?? 0);
			this.#r = r ?? PosRot.N;
		}

		const key = this.toString();
		if (PosRot.#instances.has(key)) {
			return PosRot.#instances.get(key);
		}
		PosRot.#instances.set(key, this);

		Object.freeze(this);
	}

	get pos() {
		return this.#p;
	}
	set pos(p) {
		return new PosRot(p, this.rot);
	}

	get rot() {
		return this.#r;
	}
	set rot(r) {
		return new PosRot(this.pos, r);
	}

	/// does not add rotation if provided PosRot
	add(x, y) {
		if (x instanceof Pos || x instanceof PosRot) {
			return new PosRot(this.x + x.x, this.y + x.y, this.rot);
		}
		return new PosRot(this.x + x, this.y + y, this.rot);
	}

	move(n = 1) {
		if (this.#r === PosRot.N) {
			return this.add(0, -n);
		}
		if (this.#r === PosRot.S) {
			return this.add(0, +n);
		}
		if (this.#r === PosRot.E) {
			return this.add(+n, 0);
		}
		if (this.#r === PosRot.W) {
			return this.add(-n, 0);
		}
	}

	get x() {
		return this.pos.x;
	}
	set x(x) {
		return new PosRot(this.x + x, this.y, this.rot);
	}

	get y() {
		return this.pos.y;
	}
	set y(y) {
		return new PosRot(this.x, this.y + y, this.rot);
	}

	cw() {
		return this.clockwise();
	}
	clockwise() {
		if (this.#r === PosRot.N) {
			return new PosRot(this.#p, PosRot.E);
		}
		if (this.#r === PosRot.E) {
			return new PosRot(this.#p, PosRot.S);
		}
		if (this.#r === PosRot.S) {
			return new PosRot(this.#p, PosRot.W);
		}
		if (this.#r === PosRot.W) {
			return new PosRot(this.#p, PosRot.N);
		}
	}
	ccw() {
		return this.counterclockwise();
	}
	counterclockwise() {
		if (this.#r === PosRot.N) {
			return new PosRot(this.#p, PosRot.W);
		}
		if (this.#r === PosRot.E) {
			return new PosRot(this.#p, PosRot.N);
		}
		if (this.#r === PosRot.S) {
			return new PosRot(this.#p, PosRot.E);
		}
		if (this.#r === PosRot.W) {
			return new PosRot(this.#p, PosRot.S);
		}
	}
	flip() {
		if (this.#r === PosRot.N) {
			return new PosRot(this.#p, PosRot.S);
		}
		if (this.#r === PosRot.S) {
			return new PosRot(this.#p, PosRot.N);
		}
		if (this.#r === PosRot.E) {
			return new PosRot(this.#p, PosRot.W);
		}
		if (this.#r === PosRot.W) {
			return new PosRot(this.#p, PosRot.E);
		}
	}

	inBounds(bounds) {
		return this.pos.inBounds(bounds);
	}

	toString() {
		return `PosRot[${this.#p.x};${this.#p.y};${Symbol.keyFor(this.#r)}]`;
	}

	[util.inspect.custom]() {
		return this.toString();
	}
}

module.exports = {
	Pos,
	PosRot,
};
