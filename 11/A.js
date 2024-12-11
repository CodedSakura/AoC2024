const utils = require("../utils");

utils.read("input.txt")
	.numbers()
	.run(data => (
		i = 25,
		data.while(() => i-- > 0, stones => stones
			.flatMap(s => 
				s === 0 ? 1 :
				(n = Math.floor(Math.log10(s))+1) % 2 === 0 ? 
					[ (s - (a = s % (m = 10**(n/2)))) / m, a ] : 
					s * 2024))))
	.length
	.print();
