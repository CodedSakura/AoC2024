const utils = require("../utils");

utils.read("input.txt")
	.findAll(/mul\((\d+),(\d+)\)/g)
	.map(v => [v[1], v[2]].map(Number))
	.map(([a, b]) => a * b)
	.sum()
	.print();
