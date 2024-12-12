const util = require('util');

class _Dir {
	#dir;
	constructor(dir) {
		this.#dir = dir;
	}

	equals(that) {
		return this.#dir === that.#dir;
	}

	isCardinal() {
		return this.equals(Dir.N) || 
			this.equals(Dir.E) || 
			this.equals(Dir.S) || 
			this.equals(Dir.W);
	}

	isHorizontal() {
		return this.equals(Dir.E) || this.equals(Dir.W);
	}
	isVertical() {
		return this.equals(Dir.N) || this.equals(Dir.S);
	}

	makePos(n) {
		if (this.equals(Dir.N)) {
			return new Pos(0, -n);
		}
		if (this.equals(Dir.S)) {
			return new Pos(0, +n);
		}
		if (this.equals(Dir.E)) {
			return new Pos(+n, 0);
		}
		if (this.equals(Dir.W)) {
			return new Pos(-n, 0);
		}
		if (this.equals(Dir.NE)) {
			return new Pos(+n, -n);
		}
		if (this.equals(Dir.NW)) {
			return new Pos(-n, -n);
		}
		if (this.equals(Dir.SE)) {
			return new Pos(+n, +n);
		}
		if (this.equals(Dir.SW)) {
			return new Pos(-n, +n);
		}
	}

	cw45() {
		return this.clockwise45();
	}
	clockwise45() {
		if (this.equals(Dir.N)) {
			return Dir.NE;
		}
		if (this.equals(Dir.NE)) {
			return Dir.E;
		}
		if (this.equals(Dir.E)) {
			return Dir.SE;
		}
		if (this.equals(Dir.SE)) {
			return Dir.S;
		}
		if (this.equals(Dir.S)) {
			return Dir.SW;
		}
		if (this.equals(Dir.SW)) {
			return Dir.W;
		}
		if (this.equals(Dir.W)) {
			return Dir.NW;
		}
		if (this.equals(Dir.NW)) {
			return Dir.N;
		}
	}

	cw90() {
		return this.clockwise90();
	}
	clockwise90() {
		return this.clockwise45().clockwise45();
	}

	ccw45() {
		return this.counterclockwise45();
	}
	counterclockwise45() {
		if (this.equals(Dir.N)) {
			return Dir.NW;
		}
		if (this.equals(Dir.NW)) {
			return Dir.W;
		}
		if (this.equals(Dir.W)) {
			return Dir.SW;
		}
		if (this.equals(Dir.SW)) {
			return Dir.S;
		}
		if (this.equals(Dir.S)) {
			return Dir.SE;
		}
		if (this.equals(Dir.SE)) {
			return Dir.E;
		}
		if (this.equals(Dir.E)) {
			return Dir.NE;
		}
		if (this.equals(Dir.NE)) {
			return Dir.N;
		}
	}

	ccw90() {
		return this.counterclockwise90();
	}
	counterclockwise90() {
		return this.counterclockwise45().counterclockwise45();
	}

	flip() {
		if (this.equals(Dir.N)) {
			return Dir.S;
		}
		if (this.equals(Dir.S)) {
			return Dir.N;
		}
		if (this.equals(Dir.E)) {
			return Dir.W;
		}
		if (this.equals(Dir.W)) {
			return Dir.E;
		}
		if (this.equals(Dir.NW)) {
			return Dir.SE;
		}
		if (this.equals(Dir.SW)) {
			return Dir.NE;
		}
		if (this.equals(Dir.SE)) {
			return Dir.NW;
		}
		if (this.equals(Dir.NE)) {
			return Dir.SW;
		}
	}


	toString() {
		return `Dir[${Symbol.keyFor(this.#dir)}]`;
	}

	[util.inspect.custom]() {
		return this.toString();
	}
}

const Dir = {
	N:  new _Dir(Symbol.for("N")),
	NE: new _Dir(Symbol.for("NE")),
	E:  new _Dir(Symbol.for("E")),
	SE: new _Dir(Symbol.for("SE")),
	S:  new _Dir(Symbol.for("S")),
	SW: new _Dir(Symbol.for("SW")),
	W:  new _Dir(Symbol.for("W")),
	NW: new _Dir(Symbol.for("NW")),
};

class Pos {
	static #instances = new Map();

	#x; #y;
	#r;

	constructor(x, y, r) {
		if (x instanceof Pos) {
			this.#x = x.x ?? 0;
			this.#y = x.y ?? 0;
			this.#r = y ?? undefined;
		} else if (Array.isArray(x)) {
			this.#x = x[0] ?? 0;
			this.#y = x[1] ?? 0;
			this.#r = y ?? undefined;
		} else {
			this.#x = x ?? 0;
			this.#y = y ?? 0;
			this.#r = r ?? undefined;
		}

		const key = this.toString();
		if (Pos.#instances.has(key)) {
			return Pos.#instances.get(key);
		}
		Pos.#instances.set(key, this);

		Object.freeze(this);
	}

	get pos() {
		return new Pos(this.x, this.y);
	}

	get rot() {
		return this.#r;
	}
	set rot(r) {
		return new Pos(this.pos, r);
	}

	/// does not add rotation if provided Pos
	add(x, y) {
		if (x instanceof Pos) {
			return new Pos(this.x + x.x, this.y + x.y, this.rot);
		}
		return new Pos(this.x + x, this.y + y, this.rot);
	}

	sub(x, y) {
		if (x instanceof Pos) {
			return new Pos(this.x - x.x, this.y - x.y, this.rot);
		}
		return new Pos(this.x - x, this.y - y, this.rot);
	}

	move(n = 1) {
		if (this.rot === undefined) {
			throw new Error("Cannot move without set rotation");
		}
		return this.add(this.rot.makePos(n));
	}

	get x() {
		return this.#x;
	}
	set x(x) {
		return new PosRot(this.x + x, this.y, this.rot);
	}

	get y() {
		return this.#y;
	}
	set y(y) {
		return new PosRot(this.x, this.y + y, this.rot);
	}

	neighbors4(setDir = true) {
		return [
			new Pos(this.x,     this.y - 1, setDir ? Dir.N : this.rot),
			new Pos(this.x - 1, this.y    , setDir ? Dir.W : this.rot),
			new Pos(this.x + 1, this.y    , setDir ? Dir.E : this.rot),
			new Pos(this.x,     this.y + 1, setDir ? Dir.S : this.rot),
		];
	}

	neighbors8(setDir = true) {
		return [
			new Pos(this.x - 1, this.y - 1, setDir ? Dir.NW : this.rot),
			new Pos(this.x,     this.y - 1, setDir ? Dir.N  : this.rot),
			new Pos(this.x + 1, this.y - 1, setDir ? Dir.NE : this.rot),
			new Pos(this.x - 1, this.y    , setDir ? Dir.W  : this.rot),
			new Pos(this.x + 1, this.y    , setDir ? Dir.E  : this.rot),
			new Pos(this.x - 1, this.y + 1, setDir ? Dir.SW : this.rot),
			new Pos(this.x,     this.y + 1, setDir ? Dir.S  : this.rot),
			new Pos(this.x + 1, this.y + 1, setDir ? Dir.SE : this.rot),
		];
	}

	cw() {
		return this.clockwise90();
	}
	cw90() {
		return this.clockwise90();
	}
	cw45() {
		return this.clockwise45();
	}
	clockwise90() {
		if (this.rot === undefined) {
			throw new Error("Cannot rotate without set rotation");
		}
		return new Pos(this.pos, this.rot.clockwise90());
	}
	clockwise45() {
		if (this.rot === undefined) {
			throw new Error("Cannot rotate without set rotation");
		}
		return new Pos(this.pos, this.rot.clockwise45());
	}
	ccw() {
		return this.counterclockwise90();
	}
	ccw90() {
		return this.counterclockwise90();
	}
	ccw45() {
		return this.counterclockwise45();
	}
	counterclockwise90() {
		if (this.rot === undefined) {
			throw new Error("Cannot rotate without set rotation");
		}
		return new PosRot(this.pos, this.rot.counterclockwise90());
	}
	counterclockwise45() {
		if (this.rot === undefined) {
			throw new Error("Cannot rotate without set rotation");
		}
		return new PosRot(this.pos, this.rot.counterclockwise45());
	}

	flip() {
		if (this.rot === undefined) {
			throw new Error("Cannot rotate without set rotation");
		}
		return new PosRot(this.pos, this.rot.flip());
	}

	inBounds(bounds) {
		return [ this.x, this.y ].every((c, i) => Array.isArray(bounds[i]) ? 
			bounds[i][0] <= c && c <= bounds[i][1] :
			0 <= c && c < bounds[i]);
	}

	/**
	 * @input that - Other Pos object
	 * @returns Dir (N, NE, E, SE, S, SW, W, NW) or null if same position
	 */
	directionOf(that) {
		if (this.pos === (that.pos ?? that)) {
			return null;
		}
		if (this.x === that.x) {
			if (this.y > that.y) {
				return Dir.N;
			}
			return Dir.S;
		}

		if (this.y === that.y) {
			if (this.x > that.x) {
				return Dir.W;
			}
			return Dir.E;
		}

		if (this.x > that.x) {
			if (this.y > that.y) {
				return Dir.NW;
			}
			return Dir.SW;
		}

		if (this.y > that.y) {
			return Dir.NE;
		}
		return Dir.SE;
	}

	toString() {
		if (this.rot === undefined) {
			return `Pos[${this.x};${this.y}]`;
		}
		return `Pos[${this.x};${this.y};${this.rot}]`;
	}

	[util.inspect.custom]() {
		return this.toString();
	}
}

module.exports = {
	Pos,
	Dir,
};
