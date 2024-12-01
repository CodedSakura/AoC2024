const utils = require("../utils");

utils.read("input.txt")
	.numbers2d()
	.transpose()
	.mapWrap(([s, l]) => s.map(v => l.count(v) * v))
	.sum()
	.print();
