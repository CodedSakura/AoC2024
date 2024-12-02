const utils = require("../utils");

utils.read("input.txt")
	.numbers2d()
	.map(v => [
		v,
		...v.map((_, i, w) => w.flatMap((v, k) => k == i ? [] : v)),
	])
	.map2d(v => v.flatMap((w, i) => i == 0 ? [] : w - v[i-1]))
	.map3d((w, _x, _y, _z, v) => Math.sign(w) === Math.sign(v.first()) && 
		Math.abs(w) >= 1 && Math.abs(w) <= 3)
	.filter(w => w.some(v => v.every(z => z)))
	.length
	.print();
