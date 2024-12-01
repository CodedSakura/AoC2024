const { readFileSync } = require("fs");

const data = readFileSync("input.txt", "utf-8");

console.log(data
	.trim()
	.split("\n")
	.map(v => v.split(/\s+/).map(w => Number(w)))
	.reduce((acc, row) => row.map((_, i) => [ ...(acc[i] ?? []), row[i] ]), [])
	.flatMap((_, i, a) => i == 0 ? [a] : [])
	.map(([s, l]) => s.map(v => l.filter(w => w === v).length * v))[0]
	.reduce((acc, val) => acc + val)
);
