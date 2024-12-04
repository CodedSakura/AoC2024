const utils = require("../utils");

utils.read("input.txt")
	.chars2d()
	.wrap()
	.map(g => [
		g,
		g.map(r => r.copy().reverse()),
		g.transpose(),
		g.transpose().map(r => r.copy().reverse()),
		g.diagonal(),
		g.diagonal().map(r => r.copy().reverse()),
		g.transpose().reverse().diagonal(),
		g.transpose().reverse().diagonal().map(r => r.copy().reverse()),
	])
	.first()
	.map2d(v => v.join(""))
	.flat()
	.map(v => v.count("XMAS"))
	.sum()
	.print();