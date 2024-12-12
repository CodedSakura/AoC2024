const utils = require("../utils");
const { Pos } = utils;

utils.read("input.txt")
	.chars2d()
	.run(text => text.map2d((v, x, y) => v === 'A' ? new Pos(x, y) : null)
		.flat()
		.filter(v => v) // all positions of 'A'
		.flatMap(p => p.neighbors8()
			.filter(n => !n.rot.isCardinal() && text.get2d(n) === 'M')
			.map(n => new Pos(p, new Pos(p).directionOf(n)))) // all positions of 'A' and directions to 'M'
		.filter(p => text.get2d(p.move(-1)) === 'S'      // _'S'_, 'A', -> 'M' (\)
				&& text.get2d(p.cw90().move(+1)) === 'M' // 'M', 'A', ? (/)
				&& text.get2d(p.cw90().move(-1)) === 'S' // 'M', 'A', 'S' (/)
			),
	)
	.length
	.print();

