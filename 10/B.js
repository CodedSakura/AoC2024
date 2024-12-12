const utils = require("../utils");
const { Pos } = utils;

utils.read("input.txt")
	.chars2d()
	.map2d(Number)
	.run(map => ({
		map,
		trailheads: map
			.map2d((v, x, y) => v === 0 ? new Pos(x, y) : null)
			.flat()
			.filter(v => v),
	}))
	.run(({ map, trailheads }) => ({
		map,
		scores: trailheads.map(start => [start]
			.while(
				p => p.some(v => map.get2d(v) != 9),
				p => p.flatMap(v => (
						c = map.get2d(v),
						v.neighbors4(false).filter(n => map.get2d(n) > c)
					))
			).length
		)
	}))
	// <debug note="print map">
	// .run(v => (v.map.map(r => r.map(c => isNaN(c) ? '.' : c.toString(10)).join('')).join("\n").print(), v))
	// </debug>
	.scores
	.sum()
	.print();
