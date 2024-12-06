const { readFileSync } = require("fs");

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
	mapWrap: { value(fn) {
		return [ this ].map(fn)[0];
	} },
	findRow: { value(fn) {
		return this.find((row, y) => row.some((v, x, a) => fn(v, x, y, a)));
	} },
	findRowIndex: { value(fn) {
		return this.findIndex((row, y) => row.some((v, x, a) => fn(v, x, y, a)));
	} },
	findIndex2d: { value(fn) {
		return [ this.findRowIndex(fn), this.findRow(fn).findIndex(fn) ];
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
	countOverlaps2d: { value(target, nullWildcard = true) {
		const eq = (a, b) => nullWildcard ? a === null || b === null || a === b : a === b;

		let count = 0;

		for (let y = 0; y < this.length - target.length + 1; y++) {
			const row = this[y];
			
			colFor:
			for (let x = 0; x < row.length - target[0].length + 1; x++) {
				if (!eq(row[x], target[0][0])) {
					continue colFor;
				}

				for (let ty = 0; ty < target.length; ty++) {
					const tRow = target[ty];
					for (let tx = 0; tx < tRow.length; tx++) {
						// console.log("overlap", `${x} ${y}`, target, "check", `${tx} ${ty}`, `(${this[y+ty][x+tx]} ?= ${target[ty][tx]})`)
						if (!eq(this[y+ty][x+tx], target[ty][tx])) {
							continue colFor;
						}
					}
				}

				// console.log("overlap", `${x} ${y}`, target)
				count++;
			}
		}

		return count;
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
};
