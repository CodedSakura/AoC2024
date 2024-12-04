const utils = require("../utils");

utils.read("test.txt")
	.chars2d()
	.wrap()
	.map(g => [
		g,
		[
			[ "M", null, null ],
			[ null, "A", null ],
			[ null, null, "S" ],
		],
	])
	.map(([g, x]) => [
		g,
		[
			x,
			x.map(r => r.copy().reverse()),
			x.transpose().reverse(),
			x.map(r => r.copy().reverse()).reverse(),
		],
	])
	.map(([g, x]) => [
		g, 
		x.combinations()
			.filter(v => v.length === 2 && v[0][0][0] != v[1][0][0] && v[0][0][2] != v[1][0][2])
			.map(([a, b]) => [
				[ a[0][0] ?? b[0][0], null, a[0][2] ?? b[0][2] ],
				[ null, "A", null ],
				[ a[2][0] ?? b[2][0], null, a[2][2] ?? b[2][2] ],
			]),
	])
	.first()
	.print()
	.second()
	.print();
