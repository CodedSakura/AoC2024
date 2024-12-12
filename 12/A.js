const utils = require("../utils");
const { Pos } = utils;

utils.read("input.txt")
	.chars2d()
	.map2d((v, x, y) => [ new Pos(x, y), v ])
	.flat()
	.run(a => new Map(a))
	.run(map => [ map, [] ])
	.while(
		([ map ]) => map.size > 0,
		([ map, regions ]) => (
			[ [ plot, plant ] ] = map.entries(),
			newRegion = new Set([ plot ]),
			map.delete(plot),
			[plot].while(
				plots => plots.some(p => p.neighbors4(false).some(n => map.get(n) === plant)),
				plots => plots.flatMap(p => p.neighbors4(false))
						.unique()
						.filter(n => map.get(n) === plant)
						.map(n => (
							newRegion.add(n),
							map.delete(n),
							n
						)),
			),
			regions.push({ plots: newRegion, plant }),
			[ map, regions ]
		)
	)
	.second
	.map(({ plots }) => ({
		area: plots.size,
		perimeter: plots.collect().map(p => p.neighbors4(false).filter(n => !plots.has(n)).length).sum(),
	}))
	.map(({ area, perimeter }) => area * perimeter)
	.sum()
	.print();
