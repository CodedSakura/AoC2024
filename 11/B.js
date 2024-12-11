const utils = require("../utils");

utils.read("input.txt")
	.numbers()
	.run(data => (
		i = 75,
		data = new Map(data.unique().map(v => [v, data.count(v)])),
		data.while(() => i-- > 0, stones => (
			newStones = new Map(),
			stones.entries()
				.collect()
				.flatMap(([ s, c ]) => 
					s === 0 ? [[ 1, c ]] :
					(n = Math.floor(Math.log10(s))+1) % 2 === 0 ? 
						[ [ (s - (a = s % (m = 10**(n/2)))) / m, c ], [ a, c ] ] : 
						[[ s * 2024, c ]])
				.forEach(([ s, c ]) => newStones.set(s, (newStones.get(s) ?? 0) + c)),
			newStones
		))))
	.values()
	.collect()
	.sum()
	.print();
