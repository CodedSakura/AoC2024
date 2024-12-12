const utils = require("../utils");
const { Pos } = utils;

utils.read("input.txt")
	.chars2d()
	.run(text => text.map2d((v, x, y) => v === 'X' ? new Pos(x, y) : null)
		.flat()
		.filter(v => v) // all positions of 'X'
		.flatMap(p => p.neighbors8()
			.filter(n => text.get2d(n) === 'M')
			.map(n => new Pos(p, new Pos(p).directionOf(n)))) // all positions of 'X' and directions to 'M'
		.filter(p => text.get2d(p.move(2)) === 'A' && text.get2d(p.move(3)) === 'S'),
	)
	.length
	.print();
