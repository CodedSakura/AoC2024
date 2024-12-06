const utils = require("../utils");

utils.read("input.txt")
	.split("\n\n")
	.map(v => v.numbers2d(/\||,/))
	.wrap()
	.map(([ rules, updates ]) => [ 
		rules.reduce((map, [ k, v ]) => {
			if (map.has(k)) map.get(k).push(v);
			else map.set(k, [v]);
			return map;
		}, new Map()), 
		updates,
	])
	.map(([ rules, updates ]) => [ 
		rules, 
		updates
			.filter(update => !update
				.every((k, i) => update
					.slice(0, i)
					.every(v => !(rules.get(k) ?? []).includes(v)))),
	])
	.map(([ rules, updates ]) => updates
		.map(update => update
			.sort((a, b) => (rules.get(a) ?? []).includes(b) ? -1 : 1)))
	.first()
	.map(v => v[(v.length - 1) / 2])
	.sum()
	.print();
