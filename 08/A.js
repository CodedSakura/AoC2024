const utils = require("../utils");
const { Pos } = utils;

utils.read("input.txt")
	.chars2d()
	.run(data => [
		data,
		data.flat().unique().filter(v => v !== '.'),
	])
	.run(([ data, frequencies ]) => [
		frequencies
			.map(f => data.flatMap((row, y) => row.includes(f) ? [ [ y, row ] ] : [])
				.flatMap(([ y, row ]) => row.flatMap((v, x) => v === f ? new Pos(x, y) : []))),
		data.size2d(),
	])
	.run(([ antennas, bounds ]) => antennas
		.map(a => a.flatMap((p1, i) => a.slice(i + 1).map(p2 => [ p1, p2 ]))) // pairs
		.flatMap(a => a.flatMap(([ p1, p2 ]) => [ p1.add(p1.sub(p2)), p2.add(p2.sub(p1)) ]))
		.filter(p => p.inBounds(bounds))
		.unique()
	)
	.length
	.print();
