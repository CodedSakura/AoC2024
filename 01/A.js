const { readFileSync } = require("fs");

const data = readFileSync("input.txt", "utf-8");

console.log(data
	.trim()
	.split("\n")
	.map(v => v.split(/\s+/).map(w => Number(w)))
	.reduce((acc, row) => row.map((_, i) => [ ...(acc[i] ?? []), row[i] ]), [])
	.map(v => v.sort((a, b) => a - b))
	.reduce((acc, row) => row.map((_, i) => [ ...(acc[i] ?? []), row[i] ]), [])
	.map(([a, b]) => Math.abs(a - b))
	.reduce((acc, val) => acc + val)
);
