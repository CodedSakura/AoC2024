const utils = require("../utils");

utils.read("input.txt")
	.numbers2d(/[: ]+/)
	.filter(([ test, ...values ]) => values
		.reduceRight((acc, val) => acc
			.flatMap(v => [
				...(ord = 10 ** Math.ceil(Math.log10(val+1)),
					v % ord === val ? [ (v - val) / ord ] : []),
				...((v / val) % 1 === 0 ? [ v / val ] : []),
				v - val,
			])
			.filter(v => v >= 1), [ test ])
		.min() === 1)
	// .print()
	.map(v => v.first())
	.sum()
	.print();
