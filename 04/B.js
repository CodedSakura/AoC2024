const utils = require("../utils");

utils.read("input.txt")
	.chars2d()
	.run(g => [
		g,
		[
			[ "M", null, "S" ],
			[ null, "A", null ],
			[ "M", null, "S" ],
		],
		[
			[ "M", null, "M" ],
			[ null, "A", null ],
			[ "S", null, "S" ],
		],
		[
			[ "S", null, "S" ],
			[ null, "A", null ],
			[ "M", null, "M" ],
		],
		[
			[ "S", null, "M" ],
			[ null, "A", null ],
			[ "S", null, "M" ],
		],
	])
	.run(([g, ...x]) => x.map(w => g.countOverlaps2d(w)))
	.sum()
	.print();

// 1854 - too low -- wasn't taking the last col/row in consideration (and the test had it empty)
