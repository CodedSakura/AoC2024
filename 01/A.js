const utils = require("../utils");

utils.read("input.txt")
	.numbers2d()
	.transpose()
	.map(v => v.sortAsc())
	.transpose()
	.map(([a, b]) => Math.abs(a - b))
	.sum()
	.print();
