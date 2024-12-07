const utils = require("../utils");

utils.read("input.txt")
	.numbers2d()
	.map(v => v.flatMap((w, i) => i == 0 ? [] : w - v[i-1]))
	.map(v => v.every(w => Math.sign(w) === Math.sign(v.first) && 
		Math.abs(w) >= 1 && Math.abs(w) <= 3))
	.filter(v => v)
	.length
	.print();
