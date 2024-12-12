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
		sides: plots.collect()
			.flatMap(p => p.neighbors4().filter(n => !plots.has(n.pos)))
			.run(edges => new Set(edges))
			.run(edges => (
				sides = [],
				edges.while(
					e => e.size > 0,
					e => (
						[ edge ] = e.values(),
						e.delete(edge),
						side = [ edge ],
						[ edge ].while(
							s => s.length > 0,
							s => s.flatMap(v => v.neighbors4(false))
								.unique()
								.filter(n => e.has(n))
								.map(n => (
									side.push(n),
									e.delete(n),
									n
								))
						),
						sides.push(side),
						e
					)
				),
				sides.length
			))
	}))
	.map(({ area, sides }) => area * sides)
	.sum()
	.print();
