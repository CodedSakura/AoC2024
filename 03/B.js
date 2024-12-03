const utils = require("../utils");

utils.read("input.txt")
	.findAll(/mul\((\d+),(\d+)\)|do(?:n't)?\(\)/g)
	.map((v) => [...v])
	.filter((doMul = true, ([v]) => {
		if (v === "do()") doMul = true;
		else if (v === "don't()") doMul = false;
		else return doMul;
		return false;
	}))
	.map(([,a,b]) => [a, b].map(Number))
	.map(([a, b]) => a * b)
	.sum()
	.print();
