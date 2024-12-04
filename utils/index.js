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
	map3d: { value(fn) {
		return this.map((r, z) => r.map((c, y) => c.map((v, x, a) => fn(v, x, y, z, a))));
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
	copy: { value() {
		return [ ...this ];
	} },
	diagonal: { value() {
		// https://stackoverflow.com/a/57680560
		return this.reduceRight((r, a, i, w) => {
			a.forEach((e, j) => {
				const pos = j + (w.length - i - 1)
				if(!r[pos]) r[pos] = []
				r[pos].unshift(e)
			})

			return r;
		}, []);
	} },
	combinations: { value() {
		// https://stackoverflow.com/a/59942031
		const combi = [];
		let temp = [];
		const slent = Math.pow(2, this.length);

		for (var i = 0; i < slent; i++) {
			temp = [];
			for (var j = 0; j < this.length; j++) {
				if ((i & Math.pow(2, j))) {
					temp.push(this[j]);
				}
			}
			if (temp.length > 0) {
				combi.push(temp);
			}
		}
		return combi;
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
