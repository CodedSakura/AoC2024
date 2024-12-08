const { readFileSync } = require("fs");
const pos = require("./pos.js");

Object.defineProperties(Array.prototype, {
	count: { value(query) {
		return this.filter(v => v === query).length;
	} },
	sum: { value() {
		return this.reduce((acc, val) => acc + val, 0);
	} },
	product: { value() {
		return this.reduce((acc, val) => acc * val, 1);
	} },
	transpose: { value() {
		return this[0].map((_, i) => this.map(r => r[i]));
	} },
	sortAsc: { value() {
		return this.sort((a, b) => a - b);
	} },
	map2d: { value(fn) {
		return this.map((r, y) => r.map((v, x, a) => fn(v, x, y, a)));
	} },
	map3d: { value(fn) {
		return this.map((r, z) => r.map((c, y) => c.map((v, x, a) => fn(v, x, y, z, a))));
	} },
	findRow: { value(fn) {
		return this.find((row, y) => row.some((v, x, a) => fn(v, x, y, a)));
	} },
	findRowIndex: { value(fn) {
		return this.findIndex((row, y) => row.some((v, x, a) => fn(v, x, y, a)));
	} },
	findIndex2d: { value(fn) {
		return [ this.findRow(fn).findIndex(fn), this.findRowIndex(fn) ];
	} },
	wrap: { value() {
		return [ this ];
	} },
	first: { 
		get() {
			return this[0];
		},
		set(v) {
			this[0] = v;
		},
	},
	second: { 
		get() {
			return this[1];
		},
		set(v) {
			this[1] = v;
		},
	},
	last: { 
		get() {
			return this[this.length - 1];
		},
		set(v) {
			this[this.length - 1] = v;
		},
	},
	min: { value() {
		return this.reduce((min, val) => min > val ? val : min, +Infinity);
	} },
	max: { value() {
		return this.reduce((max, val) => max < val ? val : max, -Infinity);
	} },
	get2d: { value(x, y) {
		[ x, y ] = Array.isArray(x) ? x : 
			x instanceof pos.Pos ? [ x.x, x.y ] :
			[ x, y ];
		return (this[y] ?? [])[x];
	} },
	get3d: { value(x, y, z) {
		[ x, y, z ] = Array.isArray(x) ? x : [ x, y, z ];
		return ((this[z] ?? [])[y] ?? [])[x];
	} },
	set2d: { value(x, y, val) {
		[ [ x, y ], val ] = Array.isArray(x) ? [ x, val ] : 
			x instanceof pos.Pos ? [ [ x.x, x.y ], val ] :
			[ [ x, y ], val ];
		this[y][x] = val;
		return this;
	} },
	set3d: { value(x, y, z, val) {
		[ [ x, y, z ], val ] = Array.isArray(x) ? [ x, y ] : 
			[ [ x, y, z ], val ];
		this[z][y][x] = val;
		return this;
	} },
	size2d: { value() {
		return [ this[0].length, this.length ];
	} },
	flatIndex2d: { value(size) {
		return Array.isArray(size) ? 
			this[1] * size[0] + this[0] : 
			this[1] * size.width + this[0];
	} },
	copy: { value() {
		return [ ...this ];
	} },
	inBounds: { value(bounds) {
		return this.every((c, i) => Array.isArray(bounds[i]) ? 
			bounds[i][0] <= c && c <= bounds[i][1] :
			0 <= c && c < bounds[i]);
	} },
	add: { value(...arrs) {
		return this.map((v, i) => v + arrs.map(a => a[i] ?? 0).sum());
	} },
	unique: { value() {
		return Array.from(new Set(this));
	} },
	equals: { value(that) {
		// https://stackoverflow.com/a/16436975
		if (this === that) return true;
		if (that === null || !Array.isArray(that)) return false;
		if (this.length !== that.length) return false;
		return this.every((v, i) => Array.isArray(v) ? v.equals(that[i]) : that[i] === v);
	} },
	toPos: { value(rot) {
		return new pos.Pos(this, rot);
	} }
});

Object.defineProperties(String.prototype, {
	lines: { value() {
		return this.split("\n");
	} },
	numbers: { value(separator = /\s+/) {
		return this.split(separator).map(Number);
	} },
	numbers2d: { value(separator = /\s+/) {
		return this.lines().map(v => v.numbers(separator));
	} },
	findAll: { value(expr) {
		return Array.from(this.matchAll(expr));
	} },
	chars2d: { value() {
		return this.lines().map(v => v.split(""));
	} },
	count: { value(text) {
		return this.split(text).length - 1;
	} },
});

Object.defineProperties(Number.prototype, {
	unflatIndex2d: { value(size) {
		return Array.isArray(size) ? 
			(x = this % size[0], [ x, (this - x) / size[0] ]) :
			(x = this % size.width, [ x, (this - x) / size.width ]);
	} },
});

Object.defineProperties(Object.prototype, {
	print: { value(label) {
		if (typeof label === "function") {
			console.log(label(this));
			return this;
		}

		let p = this;
		if (this instanceof Number || this instanceof String) {
			p = this.toString();
		}

		if (label) {
			console.log(label, p);
		} else {
			console.log(p);
		}
		return this;
	} },
	run: { value(fn) {
		return fn(this);
	} },
	while: { value(condition, fn) {
		let data = this;
		while (condition(data)) {
			data = fn(data);
		}
		return data;
	} },
});

module.exports = {
	read: (name) => readFileSync(name, "utf-8").trim(),
	...pos,
};
