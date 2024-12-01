const { readFileSync } = require("fs");

Object.defineProperties(Array.prototype, {
	count: { value(query) {
		return this.filter(v => v === query).length;
	} },
	sum: { value() {
		return this.reduce((acc, val) => acc + val, 0);
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
	mapWrap: { value(fn) {
		return [ this ].map(fn)[0];
	} },
	wrap: { value() {
		return [ this ];
	} },
	first: { value() {
		return this[0];
	} },
	second: { value() {
		return this[1];
	} },
	last: { value() {
		return this[this.length - 1];
	} },
});

Object.defineProperties(String.prototype, {
	lines: { value() {
		return this.split("\n");
	} },
	numbers: { value() {
		return this.split(/\s+/).map(Number);
	} },
	numbers2d: { value() {
		return this.lines().map(v => v.numbers());
	} },
});

Object.defineProperties(Object.prototype, {
	print: { value(label) {
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
});

module.exports = {
	read: (name) => readFileSync(name, "utf-8").trim(),
};
