const utils = require("../utils");

utils.read("input.txt")
	.split("\n\n")
	.run(([ available, designs ]) => [
		available.split(", "),
		designs.lines(),
	])
	.run(([ available, designs ]) => [
		available,
		designs,
		mem = new utils.Memoize(v => available.filter(a => v.startsWith(a)).map(a => v.substring(a.length))),
	])
	.run(([ available, designs, mem ]) => designs.map(d => [d]
		.while(
			t => t.length > 0 && t.every(v => v !== ''), 
			t => t.unique().flatMap(v => mem.get(v)),
		).length > 0))
	.count(true)
	.print();
