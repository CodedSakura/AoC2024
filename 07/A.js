const utils = require("../utils");

utils.read("input.txt")
	.numbers2d(/[: ]+/)
	.filter(([ test, ...values ]) => values
		.reduceRight((acc, val) => acc
			.flatMap(v => (v / val) % 1 === 0 ? [ v / val, v - val ] : v - val)
			.filter(v => v >= 1), [ test ])
		.min() === 1)
	.map(v => v.first())
	.sum()
	.print();
