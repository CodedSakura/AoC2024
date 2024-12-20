const utils = require("../utils");

utils.read("input.txt")
	.split("\n\n")
	.run(([ available, designs ]) => [
		available.split(", "),
		designs.lines(),
	])
	.run(([ available, designs, mem ]) => designs.map(d => [{ d, c: 1 }]
		.while(
			t => t.length > 0 && t.some(v => v.d !== ''), 
			t => t.flatMap(v => v.d === '' ? 
					v : 
					available.filter(a => v.d.startsWith(a)).map(a => ({ d: v.d.substring(a.length), c: v.c })))
				.run(v => (
					u = v.map(w => w.d).unique(),
					u.map(w => ({ d: w, c: v.filter(x => x.d === w).map(x => x.c).sum() }))
				)),
		)).flat().map(v => v.c))
	.sum()
	.print();
